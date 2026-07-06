package domain

import (
	"errors"
	"strings"
	"time"
)

const (
	CurrencyRUB = "RUB"

	SlotAvailable         = "available"
	SlotFull              = "full"
	SlotCancelledByStudio = "cancelled_by_studio"
	SlotCompleted         = "completed"

	BookingConfirmed          = "confirmed"
	BookingOfflinePending     = "offline_payment_pending"
	BookingCancelledByClient  = "cancelled_by_client"
	BookingCancelledByStudio  = "cancelled_by_studio"
	BookingCompleted          = "completed"
	ParticipantActive         = "active"
	ParticipantCancelledUser  = "cancelled_by_client"
	ParticipantCancelledStudio = "cancelled_by_studio"

	PaymentPendingOffline = "pending_offline"
	PaymentNotRequired    = "not_required"
	PaymentRefundPending  = "refund_pending"

	MethodOffline           = "offline"
	MethodOnlinePlaceholder = "online_placeholder"
	PaymentChoiceSelected   = "selected"
	PaymentChoicePlaceholder = "placeholder_shown"

	AllergyNone = "none"
	AllergyHas  = "has_allergy"

	EquipmentOwn    = "own"
	EquipmentRental = "rental"
)

const (
	ErrValidation                 = "validation_error"
	ErrInvalidPhone               = "invalid_phone"
	ErrInvalidCode                = "invalid_code"
	ErrRateLimited                = "rate_limited"
	ErrUnauthorized               = "unauthorized"
	ErrForbidden                  = "forbidden"
	ErrNotFound                   = "not_found"
	ErrNoSeats                    = "no_seats"
	ErrStaleSlotData              = "stale_slot_data"
	ErrParticipantLimitExceeded   = "participant_limit_exceeded"
	ErrValidationConflict         = "validation_conflict"
	ErrSlotCancelledOrUnavailable = "slot_cancelled_or_unavailable"
	ErrRebookingForbidden         = "rebooking_forbidden"
	ErrCancellationWindowClosed   = "cancellation_window_closed"
	ErrBookingNotEditable         = "booking_not_editable"
	ErrAlreadyExists              = "already_exists"
	ErrTemporaryUnavailable       = "temporary_unavailable"
)

type AppError struct {
	Code    string         `json:"errorCode"`
	Message string         `json:"message"`
	Details map[string]any `json:"details,omitempty"`
}

func (e *AppError) Error() string { return e.Code + ": " + e.Message }

func NewError(code, message string) *AppError {
	return &AppError{Code: code, Message: message}
}

func ErrorCode(err error) string {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.Code
	}
	return ErrTemporaryUnavailable
}

type Money struct {
	Amount   int    `json:"amount"`
	Currency string `json:"currency"`
}

type Client struct {
	ID         string  `json:"id"`
	Phone      string  `json:"phone"`
	Name       *string `json:"name,omitempty"`
	AuthStatus string  `json:"authStatus"`
}

type ClassProgram struct {
	ID                     string  `json:"id"`
	Title                  string  `json:"title"`
	Direction              string  `json:"direction"`
	Difficulty             string  `json:"difficulty"`
	Menu                   string  `json:"menu"`
	DefaultDurationMinutes int     `json:"defaultDurationMinutes"`
	RequiredEquipment      *string `json:"requiredEquipment,omitempty"`
	DishImageURL           *string `json:"dishImageUrl,omitempty"`
}

type Chef struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Rating      float64 `json:"rating"`
	RatingCount int     `json:"ratingCount"`
}

type ScheduleSlot struct {
	ID                            string       `json:"id"`
	Program                       ClassProgram `json:"program"`
	Chef                          Chef         `json:"chef"`
	StartsAt                      time.Time    `json:"startsAt"`
	DurationMinutes               int          `json:"durationMinutes"`
	Capacity                      int          `json:"capacity"`
	AvailableSeats                int          `json:"availableSeats"`
	SeatPrice                     Money        `json:"seatPrice"`
	RequiredEquipmentInfo         *string      `json:"requiredEquipmentInfo,omitempty"`
	RentalEquipmentInfo           *string      `json:"rentalEquipmentInfo,omitempty"`
	RentalPricePerParticipant     Money        `json:"rentalPricePerParticipant"`
	Status                        string       `json:"status"`
	CancellationReason            *string      `json:"cancellationReason,omitempty"`
}

type PaymentChoice struct {
	Method string `json:"method"`
	Status string `json:"status"`
	Amount Money  `json:"amount"`
}

type BookingParticipant struct {
	ID                  string  `json:"id"`
	BookingID           string  `json:"bookingId"`
	Name                string  `json:"name"`
	IsPrimary           bool    `json:"isPrimary"`
	Status              string  `json:"status"`
	AllergyStatus       string  `json:"allergyStatus"`
	AllergyComment      *string `json:"allergyComment,omitempty"`
	EquipmentOption     string  `json:"equipmentOption"`
	RentalPriceSnapshot Money   `json:"rentalPriceSnapshot"`
}

type ChefReview struct {
	ID        string    `json:"id"`
	BookingID string    `json:"bookingId"`
	ClientID  string    `json:"clientId"`
	ChefID    string    `json:"chefId"`
	Rating    int       `json:"rating"`
	Comment   *string   `json:"comment,omitempty"`
	CreatedAt time.Time `json:"createdAt"`
}

type Booking struct {
	ID                 string               `json:"id"`
	ClientID           string               `json:"clientId"`
	Slot               ScheduleSlot         `json:"slot"`
	Status             string               `json:"status"`
	ParticipantCount   int                  `json:"participantCount"`
	Participants       []BookingParticipant `json:"participants"`
	TotalAmount        Money                `json:"totalAmount"`
	PaymentStatus      string               `json:"paymentStatus"`
	PaymentChoice      PaymentChoice        `json:"paymentChoice"`
	CreatedAt          time.Time            `json:"createdAt"`
	UpdatedAt          time.Time            `json:"updatedAt"`
	CancellableUntil    time.Time            `json:"cancellableUntil"`
	CancellationReason  *string              `json:"cancellationReason,omitempty"`
	Review             *ChefReview          `json:"review,omitempty"`
	ReviewAvailable    bool                 `json:"reviewAvailable"`
}

type ParticipantInput struct {
	Name            string  `json:"name"`
	AllergyStatus   string  `json:"allergyStatus"`
	AllergyComment  *string `json:"allergyComment"`
	EquipmentOption string  `json:"equipmentOption"`
}

type Notification struct {
	ID        string     `json:"id"`
	ClientID  string     `json:"clientId"`
	BookingID *string    `json:"bookingId,omitempty"`
	SlotID    *string    `json:"slotId,omitempty"`
	Type      string     `json:"type"`
	Channel   string     `json:"channel"`
	Status    string     `json:"status"`
	PlannedAt time.Time  `json:"plannedAt"`
	SentAt    *time.Time `json:"sentAt,omitempty"`
	Message   *string    `json:"message,omitempty"`
}

type TermsDocument struct {
	Version            string    `json:"version"`
	UpdatedAt          time.Time `json:"updatedAt"`
	CancellationPolicy string    `json:"cancellationPolicy"`
	PersonalDataPolicy string    `json:"personalDataPolicy"`
	Terms              *string   `json:"terms,omitempty"`
}

func ValidatePhone(phone string) bool {
	if len(phone) < 8 || len(phone) > 16 || !strings.HasPrefix(phone, "+") {
		return false
	}
	for _, r := range phone[1:] {
		if r < '0' || r > '9' {
			return false
		}
	}
	return true
}

func ValidateParticipants(items []ParticipantInput) error {
	if len(items) == 0 {
		return NewError(ErrValidation, "participants are required")
	}
	for i, p := range items {
		if strings.TrimSpace(p.Name) == "" {
			return withField("participant name is required", i)
		}
		if p.AllergyStatus != AllergyNone && p.AllergyStatus != AllergyHas {
			return withField("invalid allergyStatus", i)
		}
		if p.AllergyStatus == AllergyHas && strings.TrimSpace(value(p.AllergyComment)) == "" {
			return withField("allergyComment is required when allergyStatus is has_allergy", i)
		}
		if p.EquipmentOption != EquipmentOwn && p.EquipmentOption != EquipmentRental {
			return withField("invalid equipmentOption", i)
		}
	}
	return nil
}

func CalculateTotal(slot ScheduleSlot, items []ParticipantInput) Money {
	total := slot.SeatPrice.Amount * len(items)
	for _, p := range items {
		if p.EquipmentOption == EquipmentRental {
			total += slot.RentalPricePerParticipant.Amount
		}
	}
	return Money{Amount: total, Currency: CurrencyRUB}
}

func CanCancel(now, startsAt time.Time) bool {
	return !now.After(startsAt.Add(-24 * time.Hour))
}

func IsEditableBooking(status string) bool {
	return status == BookingConfirmed || status == BookingOfflinePending
}

func value(v *string) string {
	if v == nil {
		return ""
	}
	return *v
}

func withField(message string, index int) *AppError {
	return &AppError{
		Code:    ErrValidation,
		Message: message,
		Details: map[string]any{"participantIndex": index},
	}
}
