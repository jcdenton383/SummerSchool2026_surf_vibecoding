export const queryKeys = {
  me: ["me"] as const,
  terms: ["terms"] as const,
  slots: (from?: string, to?: string) => ["slots", from ?? null, to ?? null] as const,
  slot: (slotId: string) => ["slot", slotId] as const,
  bookings: (relation?: string) => ["bookings", relation ?? "all"] as const,
  booking: (bookingId: string) => ["booking", bookingId] as const,
  notifications: ["notifications"] as const
};
