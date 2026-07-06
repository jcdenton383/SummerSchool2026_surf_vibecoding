package domain

import (
	"testing"
	"time"
)

func TestValidatePhone(t *testing.T) {
	if !ValidatePhone("+79991234567") {
		t.Fatal("expected valid E.164 phone")
	}
	if ValidatePhone("89991234567") {
		t.Fatal("expected invalid phone without plus")
	}
}

func TestValidateParticipantsRequiresAllergyComment(t *testing.T) {
	err := ValidateParticipants([]ParticipantInput{{
		Name:            "Анна",
		AllergyStatus:   AllergyHas,
		EquipmentOption: EquipmentOwn,
	}})
	if err == nil || ErrorCode(err) != ErrValidation {
		t.Fatalf("expected validation error, got %v", err)
	}
}

func TestCalculateTotal(t *testing.T) {
	comment := "Орехи"
	slot := ScheduleSlot{
		SeatPrice:                 Money{Amount: 3500, Currency: CurrencyRUB},
		RentalPricePerParticipant: Money{Amount: 400, Currency: CurrencyRUB},
	}
	total := CalculateTotal(slot, []ParticipantInput{
		{Name: "Анна", AllergyStatus: AllergyNone, EquipmentOption: EquipmentOwn},
		{Name: "Павел", AllergyStatus: AllergyHas, AllergyComment: &comment, EquipmentOption: EquipmentRental},
	})
	if total.Amount != 7400 {
		t.Fatalf("expected 7400, got %d", total.Amount)
	}
}

func TestCanCancel(t *testing.T) {
	now := time.Date(2026, 7, 5, 12, 0, 0, 0, time.UTC)
	if !CanCancel(now, now.Add(25*time.Hour)) {
		t.Fatal("expected cancellation to be allowed before 24h window")
	}
	if CanCancel(now, now.Add(23*time.Hour)) {
		t.Fatal("expected cancellation to be blocked inside 24h window")
	}
}

func TestEditableBookingStatuses(t *testing.T) {
	if !IsEditableBooking(BookingConfirmed) || !IsEditableBooking(BookingOfflinePending) {
		t.Fatal("confirmed and offline pending bookings must be editable")
	}
	if IsEditableBooking(BookingCompleted) || IsEditableBooking(BookingCancelledByClient) {
		t.Fatal("completed and cancelled bookings must not be editable")
	}
}
