import { env } from "@/shared/config/env";
import { ApiError } from "./errors";
import type {
  AddParticipantsRequest,
  AuthSession,
  Booking,
  BookingMutationResponse,
  ChefReview,
  Client,
  CreateBookingRequest,
  CreateChefReviewRequest,
  ErrorResponse,
  NotificationListResponse,
  PhoneCodeResponse,
  ScheduleSlot,
  SlotListResponse,
  TermsDocument
} from "./types";

type TokenGetter = () => string | null | undefined;
let getAccessToken: TokenGetter = () => undefined;
let onUnauthorized: (() => void) | undefined;

export function configureApi(options: { getAccessToken: TokenGetter; onUnauthorized?: () => void }) {
  getAccessToken = options.getAccessToken;
  onUnauthorized = options.onUnauthorized;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ErrorResponse | null;
    const error = new ApiError(response.status, payload ?? { errorCode: "temporary_unavailable", message: "HTTP error" });
    if (error.status === 401) onUnauthorized?.();
    throw error;
  }
  return (await response.json()) as T;
}

function body(payload: unknown): RequestInit {
  return { method: "POST", body: JSON.stringify(payload) };
}

function normalizeList<T extends { items: unknown[] | null | undefined }>(response: T): T & { items: NonNullable<T["items"]> } {
  return { ...response, items: (response.items ?? []) as NonNullable<T["items"]> };
}

const httpApi = {
  requestPhoneCode: (phone: string) => request<PhoneCodeResponse>("/auth/phone-code", body({ phone })),
  verifyPhoneCode: (phone: string, code: string) => request<AuthSession>("/auth/verify-code", body({ phone, code })),
  getCurrentClient: () => request<Client>("/me"),
  getTerms: () => request<TermsDocument>("/legal/terms"),
  listSlots: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const query = params.toString();
    return request<SlotListResponse>(`/slots${query ? `?${query}` : ""}`).then(normalizeList);
  },
  getSlot: (slotId: string) => request<ScheduleSlot>(`/slots/${slotId}`),
  createBooking: (payload: CreateBookingRequest) => request<Booking>("/bookings", body(payload)),
  listMyBookings: () => request<{ items: Booking[] | null }>("/bookings/my").then(normalizeList),
  getBooking: (bookingId: string) => request<Booking>(`/bookings/${bookingId}`),
  addBookingParticipants: (bookingId: string, payload: AddParticipantsRequest) =>
    request<BookingMutationResponse>(`/bookings/${bookingId}/participants`, body(payload)),
  cancelBooking: (bookingId: string) => request<BookingMutationResponse>(`/bookings/${bookingId}/cancel`, body({})),
  cancelBookingParticipant: (bookingId: string, participantId: string) =>
    request<BookingMutationResponse>(`/bookings/${bookingId}/participants/${participantId}/cancel`, body({})),
  listMyNotifications: () => request<NotificationListResponse>("/notifications/my").then(normalizeList),
  createChefReview: (payload: CreateChefReviewRequest) => request<ChefReview>("/chef-reviews", body(payload))
};

export const api = httpApi;
