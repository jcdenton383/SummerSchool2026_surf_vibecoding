import type { Money, ParticipantInput, ScheduleSlot } from "@/api/types";

export function calculateBookingTotal(slot: ScheduleSlot, participants: ParticipantInput[]): Money {
  const rentalCount = participants.filter((participant) => participant.equipmentOption === "rental").length;
  return {
    amount: slot.seatPrice.amount * participants.length + slot.rentalPricePerParticipant.amount * rentalCount,
    currency: slot.seatPrice.currency
  };
}

export function formatMoney(money: Money): string {
  return `${money.amount.toLocaleString("ru-RU")} ${money.currency}`;
}
