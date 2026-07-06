package service

import (
	"context"
	"strings"
	"time"

	"chef-table/mock-backend/internal/config"
	"chef-table/mock-backend/internal/domain"
)

type Store interface {
	EnsureClient(ctx context.Context, phone string) (domain.Client, error)
	GetClientByID(ctx context.Context, id string) (domain.Client, error)
	GetTerms(ctx context.Context) (domain.TermsDocument, error)
	ListSlots(ctx context.Context, from, to *time.Time) ([]domain.ScheduleSlot, error)
	GetSlot(ctx context.Context, id string) (domain.ScheduleSlot, error)
	CreateBooking(ctx context.Context, clientID, clientName, slotID, paymentMethod string, participants []domain.ParticipantInput, total domain.Money) (domain.Booking, error)
	ListBookings(ctx context.Context, clientID, status, relation string) ([]domain.Booking, error)
	GetBooking(ctx context.Context, clientID, bookingID string) (domain.Booking, error)
	AddParticipants(ctx context.Context, clientID, bookingID string, participants []domain.ParticipantInput, total domain.Money) (domain.Booking, domain.ScheduleSlot, error)
	CancelBooking(ctx context.Context, clientID, bookingID string) (domain.Booking, domain.ScheduleSlot, error)
	CancelParticipant(ctx context.Context, clientID, bookingID, participantID string) (domain.Booking, domain.ScheduleSlot, error)
	ListNotifications(ctx context.Context, clientID, kind string) ([]domain.Notification, error)
	CreateReview(ctx context.Context, clientID, bookingID string, rating int, comment *string) (domain.ChefReview, error)
}

type Service struct {
	store Store
	cfg   config.Config
	now   func() time.Time
}

func New(store Store, cfg config.Config) *Service {
	return &Service{store: store, cfg: cfg, now: time.Now}
}

func (s *Service) RequestPhoneCode(ctx context.Context, phone string) (map[string]any, error) {
	if !domain.ValidatePhone(phone) {
		return nil, domain.NewError(domain.ErrInvalidPhone, "phone must be in E.164 format")
	}
	return map[string]any{"requestId": "demo-request", "retryAfterSeconds": 30}, nil
}

func (s *Service) VerifyCode(ctx context.Context, phone, code string) (map[string]any, error) {
	if !domain.ValidatePhone(phone) {
		return nil, domain.NewError(domain.ErrInvalidPhone, "phone must be in E.164 format")
	}
	if code != s.cfg.DemoAuthCode {
		return nil, domain.NewError(domain.ErrInvalidCode, "invalid verification code")
	}
	client, err := s.store.EnsureClient(ctx, phone)
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"accessToken":      s.accessToken(client.ID),
		"tokenType":        "Bearer",
		"expiresInSeconds": 86400,
		"client":           client,
	}, nil
}

func (s *Service) CurrentClient(ctx context.Context, token string) (domain.Client, error) {
	clientID, ok := s.clientIDFromToken(token)
	if !ok {
		return domain.Client{}, domain.NewError(domain.ErrUnauthorized, "bearer token is invalid")
	}
	return s.store.GetClientByID(ctx, clientID)
}

func (s *Service) Authorized(token string) bool {
	_, ok := s.clientIDFromToken(token)
	return ok
}

func (s *Service) accessToken(clientID string) string {
	return s.cfg.DemoToken + ":" + clientID
}

func (s *Service) clientIDFromToken(token string) (string, bool) {
	prefix := s.cfg.DemoToken + ":"
	if !strings.HasPrefix(token, prefix) {
		return "", false
	}
	clientID := strings.TrimPrefix(token, prefix)
	return clientID, clientID != ""
}

func (s *Service) Terms(ctx context.Context) (domain.TermsDocument, error) {
	return s.store.GetTerms(ctx)
}

func (s *Service) Slots(ctx context.Context, from, to *time.Time) (map[string]any, error) {
	defaultApplied := from == nil && to == nil
	if defaultApplied {
		start := s.now().Truncate(24 * time.Hour)
		end := start.AddDate(0, 0, 7)
		from = &start
		to = &end
	}
	if from != nil && to != nil && to.Before(*from) {
		return nil, domain.NewError(domain.ErrValidation, "to must be greater than or equal to from")
	}
	items, err := s.store.ListSlots(ctx, from, to)
	if err != nil {
		return nil, err
	}
	return map[string]any{"defaultRangeApplied": defaultApplied, "items": items}, nil
}

func (s *Service) Slot(ctx context.Context, id string) (domain.ScheduleSlot, error) {
	return s.store.GetSlot(ctx, id)
}

func (s *Service) CreateBooking(ctx context.Context, client domain.Client, clientName, slotID, paymentMethod string, participants []domain.ParticipantInput, expected domain.Money) (domain.Booking, error) {
	if clientName == "" || slotID == "" {
		return domain.Booking{}, domain.NewError(domain.ErrValidation, "clientName and slotId are required")
	}
	if paymentMethod != domain.MethodOffline && paymentMethod != domain.MethodOnlinePlaceholder {
		return domain.Booking{}, domain.NewError(domain.ErrValidation, "paymentMethod must be offline or online_placeholder")
	}
	if err := domain.ValidateParticipants(participants); err != nil {
		return domain.Booking{}, err
	}
	slot, err := s.store.GetSlot(ctx, slotID)
	if err != nil {
		return domain.Booking{}, err
	}
	if slot.Status != domain.SlotAvailable {
		return domain.Booking{}, domain.NewError(domain.ErrSlotCancelledOrUnavailable, "slot is not available")
	}
	if len(participants) > slot.AvailableSeats {
		return domain.Booking{}, domain.NewError(domain.ErrNoSeats, "not enough seats")
	}
	total := domain.CalculateTotal(slot, participants)
	if expected.Currency != domain.CurrencyRUB || expected.Amount != total.Amount {
		return domain.Booking{}, domain.NewError(domain.ErrValidationConflict, "expectedTotalAmount does not match backend calculation")
	}
	return s.store.CreateBooking(ctx, client.ID, clientName, slotID, paymentMethod, participants, total)
}

func (s *Service) MyBookings(ctx context.Context, client domain.Client, status, relation string) ([]domain.Booking, error) {
	return s.store.ListBookings(ctx, client.ID, status, relation)
}

func (s *Service) Booking(ctx context.Context, client domain.Client, bookingID string) (domain.Booking, error) {
	return s.store.GetBooking(ctx, client.ID, bookingID)
}

func (s *Service) AddParticipants(ctx context.Context, client domain.Client, bookingID string, participants []domain.ParticipantInput, expected domain.Money) (domain.Booking, domain.ScheduleSlot, error) {
	if err := domain.ValidateParticipants(participants); err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	booking, err := s.store.GetBooking(ctx, client.ID, bookingID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if !domain.IsEditableBooking(booking.Status) || booking.Slot.Status != domain.SlotAvailable {
		return domain.Booking{}, domain.ScheduleSlot{}, domain.NewError(domain.ErrBookingNotEditable, "booking is not editable")
	}
	if len(participants) > booking.Slot.AvailableSeats {
		return domain.Booking{}, domain.ScheduleSlot{}, domain.NewError(domain.ErrNoSeats, "not enough seats")
	}
	newInputs := participantsFromBooking(booking.Participants)
	newInputs = append(newInputs, participants...)
	total := domain.CalculateTotal(booking.Slot, newInputs)
	if expected.Currency != domain.CurrencyRUB || expected.Amount != total.Amount {
		return domain.Booking{}, domain.ScheduleSlot{}, domain.NewError(domain.ErrValidationConflict, "expectedTotalAmount does not match backend calculation")
	}
	return s.store.AddParticipants(ctx, client.ID, bookingID, participants, total)
}

func (s *Service) CancelBooking(ctx context.Context, client domain.Client, bookingID string) (domain.Booking, domain.ScheduleSlot, error) {
	booking, err := s.store.GetBooking(ctx, client.ID, bookingID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if !domain.IsEditableBooking(booking.Status) {
		return domain.Booking{}, domain.ScheduleSlot{}, domain.NewError(domain.ErrBookingNotEditable, "booking is not editable")
	}
	if !domain.CanCancel(s.now(), booking.Slot.StartsAt) {
		return domain.Booking{}, domain.ScheduleSlot{}, domain.NewError(domain.ErrCancellationWindowClosed, "booking can be cancelled not later than 24 hours before class")
	}
	return s.store.CancelBooking(ctx, client.ID, bookingID)
}

func (s *Service) CancelParticipant(ctx context.Context, client domain.Client, bookingID, participantID string) (domain.Booking, domain.ScheduleSlot, error) {
	booking, err := s.store.GetBooking(ctx, client.ID, bookingID)
	if err != nil {
		return domain.Booking{}, domain.ScheduleSlot{}, err
	}
	if !domain.IsEditableBooking(booking.Status) {
		return domain.Booking{}, domain.ScheduleSlot{}, domain.NewError(domain.ErrBookingNotEditable, "booking is not editable")
	}
	if !domain.CanCancel(s.now(), booking.Slot.StartsAt) {
		return domain.Booking{}, domain.ScheduleSlot{}, domain.NewError(domain.ErrCancellationWindowClosed, "participant can be cancelled not later than 24 hours before class")
	}
	return s.store.CancelParticipant(ctx, client.ID, bookingID, participantID)
}

func (s *Service) Notifications(ctx context.Context, client domain.Client, kind string) ([]domain.Notification, error) {
	return s.store.ListNotifications(ctx, client.ID, kind)
}

func (s *Service) CreateReview(ctx context.Context, client domain.Client, bookingID string, rating int, comment *string) (domain.ChefReview, error) {
	if rating < 1 || rating > 5 {
		return domain.ChefReview{}, domain.NewError(domain.ErrValidation, "rating must be between 1 and 5")
	}
	return s.store.CreateReview(ctx, client.ID, bookingID, rating, comment)
}

func participantsFromBooking(items []domain.BookingParticipant) []domain.ParticipantInput {
	out := make([]domain.ParticipantInput, 0, len(items))
	for _, item := range items {
		if item.Status != domain.ParticipantActive {
			continue
		}
		out = append(out, domain.ParticipantInput{
			Name:            item.Name,
			AllergyStatus:   item.AllergyStatus,
			AllergyComment:  item.AllergyComment,
			EquipmentOption: item.EquipmentOption,
		})
	}
	return out
}
