package postgres

import (
	"context"
	"errors"
	"net/http"
	"time"

	"chef-table/mock-backend/internal/domain"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Store struct {
	pool *pgxpool.Pool
}

func New(ctx context.Context, databaseURL string) (*Store, error) {
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, err
	}
	return &Store{pool: pool}, nil
}

func (s *Store) Close() {
	s.pool.Close()
}

func (s *Store) Ping(r *http.Request) error {
	return s.pool.Ping(r.Context())
}

func (s *Store) EnsureClient(ctx context.Context, phone string) (domain.Client, error) {
	row := s.pool.QueryRow(ctx, `
		insert into clients (phone, auth_status)
		values ($1, 'authenticated')
		on conflict (phone) do update set auth_status = 'authenticated', updated_at = now()
		returning id::text, phone, name, auth_status`, phone)
	return scanClient(row)
}

func (s *Store) GetClientByID(ctx context.Context, id string) (domain.Client, error) {
	row := s.pool.QueryRow(ctx, `select id::text, phone, name, auth_status from clients where id = $1`, id)
	return scanClient(row)
}

func (s *Store) GetTerms(ctx context.Context) (domain.TermsDocument, error) {
	var doc domain.TermsDocument
	row := s.pool.QueryRow(ctx, `
		select version, updated_at, cancellation_policy, personal_data_policy, terms
		from legal_terms
		order by updated_at desc
		limit 1`)
	if err := row.Scan(&doc.Version, &doc.UpdatedAt, &doc.CancellationPolicy, &doc.PersonalDataPolicy, &doc.Terms); err != nil {
		return doc, mapErr(err)
	}
	return doc, nil
}

func (s *Store) ListSlots(ctx context.Context, from, to *time.Time) ([]domain.ScheduleSlot, error) {
	rows, err := s.pool.Query(ctx, `
		select `+slotColumns()+`
		from schedule_slots ss
		join class_programs cp on cp.id = ss.program_id
		join chefs ch on ch.id = ss.chef_id
		where ($1::timestamptz is null or ss.starts_at >= $1)
		  and ($2::timestamptz is null or ss.starts_at < $2 + interval '1 day')
		order by ss.starts_at`, from, to)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := make([]domain.ScheduleSlot, 0)
	for rows.Next() {
		slot, err := scanSlot(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, slot)
	}
	return items, rows.Err()
}

func (s *Store) GetSlot(ctx context.Context, id string) (domain.ScheduleSlot, error) {
	row := s.pool.QueryRow(ctx, `
		select `+slotColumns()+`
		from schedule_slots ss
		join class_programs cp on cp.id = ss.program_id
		join chefs ch on ch.id = ss.chef_id
		where ss.id = $1`, id)
	slot, err := scanSlot(row)
	return slot, mapErr(err)
}

func (s *Store) CreateBooking(ctx context.Context, clientID, clientName, slotID, paymentMethod string, participants []domain.ParticipantInput, total domain.Money) (domain.Booking, error) {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return domain.Booking{}, err
	}
	defer rollback(ctx, tx)

	slot, err := s.getSlotForUpdate(ctx, tx, slotID)
	if err != nil {
		return domain.Booking{}, err
	}
	if slot.Status != domain.SlotAvailable {
		return domain.Booking{}, domain.NewError(domain.ErrSlotCancelledOrUnavailable, "slot is not available")
	}
	if len(participants) > slot.AvailableSeats {
		return domain.Booking{}, domain.NewError(domain.ErrNoSeats, "not enough seats")
	}
	var existingBookingID string
	err = tx.QueryRow(ctx, `
		select id::text
		from bookings
		where client_id = $1
		  and slot_id = $2
		  and status in ('confirmed', 'offline_payment_pending')
		limit 1`, clientID, slotID).Scan(&existingBookingID)
	if err == nil {
		return domain.Booking{}, domain.NewError(domain.ErrAlreadyExists, "client already has active booking for this slot")
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return domain.Booking{}, err
	}

	status := domain.BookingConfirmed
	paymentStatus := domain.PaymentPendingOffline
	choiceStatus := domain.PaymentChoiceSelected
	if paymentMethod == domain.MethodOnlinePlaceholder {
		status = domain.BookingOfflinePending
		choiceStatus = domain.PaymentChoicePlaceholder
	}

	var bookingID string
	err = tx.QueryRow(ctx, `
		insert into bookings (client_id, slot_id, status, participant_count, total_amount, payment_status, payment_method, payment_choice_status, cancellable_until)
		values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		returning id::text`,
		clientID, slotID, status, len(participants), total.Amount, paymentStatus, paymentMethod, choiceStatus, slot.StartsAt.Add(-24*time.Hour),
	).Scan(&bookingID)
	if err != nil {
		return domain.Booking{}, err
	}
	if _, err := tx.Exec(ctx, `update clients set name = coalesce(nullif($2, ''), name), updated_at = now() where id = $1`, clientID, clientName); err != nil {
		return domain.Booking{}, err
	}
	if err := insertParticipants(ctx, tx, bookingID, participants, slot.RentalPricePerParticipant.Amount); err != nil {
		return domain.Booking{}, err
	}
	if err := updateSlotSeats(ctx, tx, slotID, -len(participants)); err != nil {
		return domain.Booking{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return domain.Booking{}, err
	}
	return s.GetBooking(ctx, clientID, bookingID)
}

func (s *Store) ListBookings(ctx context.Context, clientID, status, relation string) ([]domain.Booking, error) {
	rows, err := s.pool.Query(ctx, `
		select id::text
		from bookings
		where client_id = $1
		  and ($2 = '' or status = $2)
		  and (
		    $3 = '' or $3 = 'all'
		    or ($3 = 'upcoming' and status in ('confirmed', 'offline_payment_pending'))
		    or ($3 = 'completed' and status = 'completed')
		    or ($3 = 'cancelled' and status in ('cancelled_by_client', 'cancelled_by_studio'))
		  )
		order by created_at desc`, clientID, status, relation)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	out := make([]domain.Booking, 0)
	for _, id := range ids {
		item, err := s.GetBooking(ctx, clientID, id)
		if err != nil {
			return nil, err
		}
		out = append(out, item)
	}
	return out, rows.Err()
}

func (s *Store) GetBooking(ctx context.Context, clientID, bookingID string) (domain.Booking, error) {
	var b domain.Booking
	var slotID string
	err := s.pool.QueryRow(ctx, `
		select id::text, client_id::text, slot_id::text, status, participant_count, total_amount,
		       payment_status, payment_method, payment_choice_status, created_at, updated_at, cancellable_until, cancellation_reason
		from bookings
		where id = $1 and client_id = $2`, bookingID, clientID).
		Scan(&b.ID, &b.ClientID, &slotID, &b.Status, &b.ParticipantCount, &b.TotalAmount.Amount,
			&b.PaymentStatus, &b.PaymentChoice.Method, &b.PaymentChoice.Status, &b.CreatedAt, &b.UpdatedAt, &b.CancellableUntil, &b.CancellationReason)
	if err != nil {
		return b, mapErr(err)
	}
	b.TotalAmount.Currency = domain.CurrencyRUB
	b.PaymentChoice.Amount = b.TotalAmount
	b.Slot, err = s.GetSlot(ctx, slotID)
	if err != nil {
		return b, err
	}
	b.Participants, err = s.bookingParticipants(ctx, bookingID)
	if err != nil {
		return b, err
	}
	review, err := s.bookingReview(ctx, bookingID)
	if err == nil {
		b.Review = &review
	}
	b.ReviewAvailable = b.Status == domain.BookingCompleted && b.Review == nil
	return b, nil
}

func (s *Store) AddParticipants(ctx context.Context, clientID, bookingID string, participants []domain.ParticipantInput, total domain.Money) (domain.Booking, domain.ScheduleSlot, error) {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	defer rollback(ctx, tx)

	slotID, err := s.lockBooking(ctx, tx, clientID, bookingID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	slot, err := s.getSlotForUpdate(ctx, tx, slotID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if slot.Status != domain.SlotAvailable || len(participants) > slot.AvailableSeats {
		return domain.Booking{}, domain.ScheduleSlot{}, domain.NewError(domain.ErrNoSeats, "not enough seats")
	}
	if err := insertParticipants(ctx, tx, bookingID, participants, slot.RentalPricePerParticipant.Amount); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if _, err := tx.Exec(ctx, `update bookings set participant_count = participant_count + $2, total_amount = $3, updated_at = now() where id = $1`, bookingID, len(participants), total.Amount); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if err := updateSlotSeats(ctx, tx, slotID, -len(participants)); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	booking, err := s.GetBooking(ctx, clientID, bookingID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	return booking, booking.Slot, nil
}

func (s *Store) CancelBooking(ctx context.Context, clientID, bookingID string) (domain.Booking, domain.ScheduleSlot, error) {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	defer rollback(ctx, tx)

	slotID, err := s.lockBooking(ctx, tx, clientID, bookingID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	var active int
	if err := tx.QueryRow(ctx, `select count(*) from booking_participants where booking_id = $1 and status = 'active'`, bookingID).Scan(&active); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if _, err := tx.Exec(ctx, `update bookings set status = 'cancelled_by_client', payment_status = 'refund_pending', participant_count = 0, updated_at = now() where id = $1`, bookingID); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if _, err := tx.Exec(ctx, `update booking_participants set status = 'cancelled_by_client' where booking_id = $1 and status = 'active'`, bookingID); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if err := updateSlotSeats(ctx, tx, slotID, active); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	booking, err := s.GetBooking(ctx, clientID, bookingID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	return booking, booking.Slot, nil
}

func (s *Store) CancelParticipant(ctx context.Context, clientID, bookingID, participantID string) (domain.Booking, domain.ScheduleSlot, error) {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	defer rollback(ctx, tx)

	slotID, err := s.lockBooking(ctx, tx, clientID, bookingID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	var cancelledRental int
	err = tx.QueryRow(ctx, `
		update booking_participants
		set status = 'cancelled_by_client'
		where id = $1 and booking_id = $2 and status = 'active'
		returning rental_price_snapshot`, participantID, bookingID).Scan(&cancelledRental)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return domain.Booking{}, domain.ScheduleSlot{}, domain.NewError(domain.ErrNotFound, "participant not found")
		}
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if _, err := tx.Exec(ctx, `update bookings set participant_count = greatest(participant_count - 1, 0), total_amount = greatest(total_amount - (select seat_price_amount from schedule_slots where id = $2) - $3, 0), updated_at = now() where id = $1`, bookingID, slotID, cancelledRental); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if _, err := tx.Exec(ctx, `update bookings set status = 'cancelled_by_client' where id = $1 and participant_count = 0`, bookingID); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if err := updateSlotSeats(ctx, tx, slotID, 1); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if err := tx.Commit(ctx); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	booking, err := s.GetBooking(ctx, clientID, bookingID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	return booking, booking.Slot, nil
}

func (s *Store) ListNotifications(ctx context.Context, clientID, kind string) ([]domain.Notification, error) {
	rows, err := s.pool.Query(ctx, `
		select id::text, client_id::text, booking_id::text, slot_id::text, type, channel, status, planned_at, sent_at, message
		from notifications
		where client_id = $1 and ($2 = '' or type = $2)
		order by planned_at desc`, clientID, kind)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := make([]domain.Notification, 0)
	for rows.Next() {
		var n domain.Notification
		if err := rows.Scan(&n.ID, &n.ClientID, &n.BookingID, &n.SlotID, &n.Type, &n.Channel, &n.Status, &n.PlannedAt, &n.SentAt, &n.Message); err != nil {
			return nil, err
		}
		out = append(out, n)
	}
	return out, rows.Err()
}

func (s *Store) CreateReview(ctx context.Context, clientID, bookingID string, rating int, comment *string) (domain.ChefReview, error) {
	booking, err := s.GetBooking(ctx, clientID, bookingID)
	if err != nil {
		return domain.ChefReview{}, err
	}
	if booking.Status != domain.BookingCompleted {
		return domain.ChefReview{}, domain.NewError(domain.ErrBookingNotEditable, "review is available only for completed booking")
	}
	var review domain.ChefReview
	err = s.pool.QueryRow(ctx, `
		insert into chef_reviews (booking_id, client_id, chef_id, rating, comment)
		values ($1, $2, $3, $4, $5)
		returning id::text, booking_id::text, client_id::text, chef_id::text, rating, comment, created_at`,
		bookingID, clientID, booking.Slot.Chef.ID, rating, comment).
		Scan(&review.ID, &review.BookingID, &review.ClientID, &review.ChefID, &review.Rating, &review.Comment, &review.CreatedAt)
	if err != nil {
		if isUniqueViolation(err) {
			return domain.ChefReview{}, domain.NewError(domain.ErrAlreadyExists, "review already exists")
		}
		return domain.ChefReview{}, err
	}
	return review, nil
}

func (s *Store) getSlotForUpdate(ctx context.Context, tx pgx.Tx, id string) (domain.ScheduleSlot, error) {
	row := tx.QueryRow(ctx, `
		select `+slotColumns()+`
		from schedule_slots ss
		join class_programs cp on cp.id = ss.program_id
		join chefs ch on ch.id = ss.chef_id
		where ss.id = $1
		for update of ss`, id)
	slot, err := scanSlot(row)
	return slot, mapErr(err)
}

func (s *Store) lockBooking(ctx context.Context, tx pgx.Tx, clientID, bookingID string) (string, error) {
	var slotID, status string
	err := tx.QueryRow(ctx, `select slot_id::text, status from bookings where id = $1 and client_id = $2 for update`, bookingID, clientID).Scan(&slotID, &status)
	if err != nil {
		return "", mapErr(err)
	}
	if !domain.IsEditableBooking(status) {
		return "", domain.NewError(domain.ErrBookingNotEditable, "booking is not editable")
	}
	return slotID, nil
}

func (s *Store) bookingParticipants(ctx context.Context, bookingID string) ([]domain.BookingParticipant, error) {
	rows, err := s.pool.Query(ctx, `
		select id::text, booking_id::text, name, is_primary, status, allergy_status, allergy_comment, equipment_option, rental_price_snapshot
		from booking_participants
		where booking_id = $1
		order by created_at`, bookingID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []domain.BookingParticipant
	for rows.Next() {
		var p domain.BookingParticipant
		if err := rows.Scan(&p.ID, &p.BookingID, &p.Name, &p.IsPrimary, &p.Status, &p.AllergyStatus, &p.AllergyComment, &p.EquipmentOption, &p.RentalPriceSnapshot.Amount); err != nil {
			return nil, err
		}
		p.RentalPriceSnapshot.Currency = domain.CurrencyRUB
		out = append(out, p)
	}
	return out, rows.Err()
}

func (s *Store) bookingReview(ctx context.Context, bookingID string) (domain.ChefReview, error) {
	var r domain.ChefReview
	err := s.pool.QueryRow(ctx, `
		select id::text, booking_id::text, client_id::text, chef_id::text, rating, comment, created_at
		from chef_reviews
		where booking_id = $1`, bookingID).
		Scan(&r.ID, &r.BookingID, &r.ClientID, &r.ChefID, &r.Rating, &r.Comment, &r.CreatedAt)
	return r, err
}

func insertParticipants(ctx context.Context, tx pgx.Tx, bookingID string, participants []domain.ParticipantInput, rentalPrice int) error {
	for i, p := range participants {
		isPrimary := i == 0
		snapshot := 0
		if p.EquipmentOption == domain.EquipmentRental {
			snapshot = rentalPrice
		}
		_, err := tx.Exec(ctx, `
			insert into booking_participants (booking_id, name, is_primary, status, allergy_status, allergy_comment, equipment_option, rental_price_snapshot)
			values ($1, $2, $3, 'active', $4, $5, $6, $7)`,
			bookingID, p.Name, isPrimary, p.AllergyStatus, p.AllergyComment, p.EquipmentOption, snapshot)
		if err != nil {
			return err
		}
	}
	return nil
}

func updateSlotSeats(ctx context.Context, tx pgx.Tx, slotID string, delta int) error {
	_, err := tx.Exec(ctx, `
		update schedule_slots
		set available_seats = available_seats + $2,
		    status = case
		      when available_seats + $2 = 0 and status = 'available' then 'full'
		      when available_seats + $2 > 0 and status = 'full' then 'available'
		      else status
		    end,
		    updated_at = now()
		where id = $1`, slotID, delta)
	return err
}

func scanClient(row pgx.Row) (domain.Client, error) {
	var c domain.Client
	err := row.Scan(&c.ID, &c.Phone, &c.Name, &c.AuthStatus)
	return c, mapErr(err)
}

type scanner interface {
	Scan(dest ...any) error
}

func scanSlot(row scanner) (domain.ScheduleSlot, error) {
	var s domain.ScheduleSlot
	err := row.Scan(
		&s.ID, &s.StartsAt, &s.DurationMinutes, &s.Capacity, &s.AvailableSeats, &s.SeatPrice.Amount,
		&s.RequiredEquipmentInfo, &s.RentalEquipmentInfo, &s.RentalPricePerParticipant.Amount, &s.Status, &s.CancellationReason,
		&s.Program.ID, &s.Program.Title, &s.Program.Direction, &s.Program.Difficulty, &s.Program.Menu, &s.Program.DefaultDurationMinutes, &s.Program.RequiredEquipment, &s.Program.DishImageURL,
		&s.Chef.ID, &s.Chef.Name, &s.Chef.Rating, &s.Chef.RatingCount,
	)
	s.SeatPrice.Currency = domain.CurrencyRUB
	s.RentalPricePerParticipant.Currency = domain.CurrencyRUB
	return s, err
}

func slotColumns() string {
	return `
		ss.id::text, ss.starts_at, ss.duration_minutes, ss.capacity, ss.available_seats, ss.seat_price_amount,
		ss.required_equipment_info, ss.rental_equipment_info, ss.rental_price_per_participant_amount, ss.status, ss.cancellation_reason,
		cp.id::text, cp.title, cp.direction, cp.difficulty, cp.menu, cp.default_duration_minutes, cp.required_equipment, cp.dish_image_url,
		ch.id::text, ch.name, ch.rating, ch.rating_count`
}

func rollback(ctx context.Context, tx pgx.Tx) {
	_ = tx.Rollback(ctx)
}

func mapErr(err error) error {
	if err == nil {
		return nil
	}
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.NewError(domain.ErrNotFound, "resource not found")
	}
	return err
}

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == "23505"
}
