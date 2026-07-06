import { describe, expect, it } from "vitest";
import type { Booking, ScheduleSlot } from "../src/api/types";
import { calculateBookingTotal } from "../src/shared/lib/money";
import { canBookSlot, canCancelBooking, canEditBooking, canReviewBooking } from "../src/shared/lib/status";
import { validateParticipantsForSlot } from "../src/shared/validation/booking";

const slot: ScheduleSlot = {
  id: "slot-test",
  program: {
    id: "program-test",
    title: "Тестовый класс",
    direction: "Тест",
    difficulty: "легко",
    menu: "Меню",
    defaultDurationMinutes: 120
  },
  chef: { id: "chef-test", name: "Шеф", rating: 5, ratingCount: 1 },
  startsAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  durationMinutes: 120,
  capacity: 4,
  availableSeats: 2,
  seatPrice: { amount: 3000, currency: "RUB" },
  rentalPricePerParticipant: { amount: 500, currency: "RUB" },
  status: "available"
};

const booking: Booking = {
  id: "booking-test",
  clientId: "client-test",
  slot,
  status: "offline_payment_pending",
  participantCount: 1,
  participants: [],
  totalAmount: { amount: 3000, currency: "RUB" },
  paymentStatus: "pending_offline",
  paymentChoice: { method: "offline", status: "selected", amount: { amount: 3000, currency: "RUB" } },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  cancellableUntil: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
  reviewAvailable: false
};

describe("business rules", () => {
  it("calculates seat and rental total", () => {
    expect(
      calculateBookingTotal(slot, [
        { name: "Анна", allergyStatus: "none", equipmentOption: "own" },
        { name: "Илья", allergyStatus: "none", equipmentOption: "rental" }
      ])
    ).toEqual({ amount: 6500, currency: "RUB" });
  });

  it("requires allergy comment when allergy exists", () => {
    expect(validateParticipantsForSlot(slot, [{ name: "Анна", allergyStatus: "has_allergy", equipmentOption: "own" }])).toContain(
      "аллерг"
    );
  });

  it("blocks participants above available seats", () => {
    expect(
      validateParticipantsForSlot(slot, [
        { name: "1", allergyStatus: "none", equipmentOption: "own" },
        { name: "2", allergyStatus: "none", equipmentOption: "own" },
        { name: "3", allergyStatus: "none", equipmentOption: "own" }
      ])
    ).toContain("превышает");
  });

  it("blocks unavailable slot booking", () => {
    expect(canBookSlot("available")).toBe(true);
    expect(canBookSlot("full")).toBe(false);
    expect(canBookSlot("cancelled_by_studio")).toBe(false);
  });

  it("checks booking actions by status", () => {
    expect(canEditBooking(booking)).toBe(true);
    expect(canCancelBooking(booking)).toBe(true);
    expect(canReviewBooking({ ...booking, status: "completed", reviewAvailable: true })).toBe(true);
    expect(canReviewBooking(booking)).toBe(false);
  });
});
