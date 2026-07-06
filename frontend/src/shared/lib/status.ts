import type { Booking, BookingStatus, SlotStatus } from "@/api/types";
import { canCancelUntil } from "./date";

export const slotStatusLabels: Record<SlotStatus, string> = {
  available: "Доступен",
  full: "Мест нет",
  cancelled_by_studio: "Отменён студией",
  completed: "Завершён"
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  confirmed: "Подтверждена",
  offline_payment_pending: "Оплата вне приложения",
  cancelled_by_client: "Отменена клиентом",
  cancelled_by_studio: "Отменена студией",
  completed: "Завершена"
};

export function canBookSlot(status: SlotStatus): boolean {
  return status === "available";
}

export function canEditBooking(booking: Booking): boolean {
  return ["confirmed", "offline_payment_pending"].includes(booking.status) && booking.slot.status === "available";
}

export function canCancelBooking(booking: Booking): boolean {
  return canEditBooking(booking) && canCancelUntil(booking.cancellableUntil);
}

export function canReviewBooking(booking: Booking): boolean {
  return booking.status === "completed" && booking.reviewAvailable === true && !booking.review;
}
