export type Money = { amount: number; currency: string };
export type SlotStatus = "available" | "full" | "cancelled_by_studio" | "completed";
export type BookingStatus =
  | "confirmed"
  | "offline_payment_pending"
  | "cancelled_by_client"
  | "cancelled_by_studio"
  | "completed";
export type PaymentStatus = "not_required" | "pending_offline" | "paid_offline" | "refunded" | "refund_pending";
export type AllergyStatus = "none" | "has_allergy";
export type EquipmentOption = "own" | "rental";
export type ParticipantStatus = "active" | "cancelled_by_client" | "cancelled_by_studio";
export type NotificationType = "class_reminder" | "studio_cancelled_class";
export type ErrorCode =
  | "validation_error"
  | "invalid_phone"
  | "invalid_code"
  | "rate_limited"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "no_seats"
  | "stale_slot_data"
  | "participant_limit_exceeded"
  | "validation_conflict"
  | "slot_cancelled_or_unavailable"
  | "rebooking_forbidden"
  | "cancellation_window_closed"
  | "booking_not_editable"
  | "already_exists"
  | "temporary_unavailable";

export type ErrorResponse = { errorCode: ErrorCode; message: string; details?: Record<string, unknown> | null };
export type Client = { id: string; phone: string; name?: string | null; authStatus: "authenticated" };
export type AuthSession = { accessToken: string; tokenType: "Bearer"; expiresInSeconds: number; client: Client };
export type PhoneCodeResponse = { requestId: string; retryAfterSeconds: number };
export type TermsDocument = {
  version: string;
  updatedAt: string;
  cancellationPolicy: string;
  personalDataPolicy: string;
  terms?: string;
};
export type ClassProgram = {
  id: string;
  title: string;
  direction: string;
  difficulty: string;
  menu: string;
  defaultDurationMinutes: number;
  requiredEquipment?: string | null;
  dishImageUrl?: string | null;
};
export type Chef = { id: string; name: string; rating: number; ratingCount: number };
export type ScheduleSlot = {
  id: string;
  program: ClassProgram;
  chef: Chef;
  startsAt: string;
  durationMinutes: number;
  capacity: number;
  availableSeats: number;
  seatPrice: Money;
  requiredEquipmentInfo?: string | null;
  rentalEquipmentInfo?: string | null;
  rentalPricePerParticipant: Money;
  status: SlotStatus;
  cancellationReason?: string | null;
};
export type SlotListResponse = { defaultRangeApplied?: boolean; items: ScheduleSlot[] };
export type PaymentChoice = {
  method: "offline" | "online_placeholder";
  status: "selected" | "placeholder_shown" | "fallback_to_offline";
  amount: Money;
};
export type BookingParticipant = {
  id: string;
  bookingId: string;
  name: string;
  isPrimary: boolean;
  status: ParticipantStatus;
  allergyStatus: AllergyStatus;
  allergyComment?: string | null;
  equipmentOption: EquipmentOption;
  rentalPriceSnapshot: Money;
};
export type ChefReview = {
  id: string;
  bookingId: string;
  clientId: string;
  chefId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
};
export type Booking = {
  id: string;
  clientId: string;
  slot: ScheduleSlot;
  status: BookingStatus;
  participantCount: number;
  participants: BookingParticipant[];
  totalAmount: Money;
  paymentStatus: PaymentStatus;
  paymentChoice: PaymentChoice;
  createdAt: string;
  updatedAt: string;
  cancellableUntil: string;
  cancellationReason?: string | null;
  review?: ChefReview | null;
  reviewAvailable?: boolean;
};
export type ParticipantInput = {
  name: string;
  allergyStatus: AllergyStatus;
  allergyComment?: string | null;
  equipmentOption: EquipmentOption;
};
export type CreateBookingRequest = {
  slotId: string;
  clientName: string;
  participants: ParticipantInput[];
  paymentMethod: "offline" | "online_placeholder";
  expectedTotalAmount: Money;
};
export type AddParticipantsRequest = { participants: ParticipantInput[]; expectedTotalAmount: Money };
export type BookingMutationResponse = { booking: Booking; slot: ScheduleSlot };
export type Notification = {
  id: string;
  clientId: string;
  bookingId?: string | null;
  slotId?: string | null;
  type: NotificationType;
  channel: "push" | "sms";
  status: "planned" | "sent" | "failed";
  plannedAt: string;
  sentAt?: string | null;
  message?: string | null;
};
export type NotificationListResponse = { items: Notification[] };
export type CreateChefReviewRequest = { bookingId: string; rating: number; comment?: string | null };
