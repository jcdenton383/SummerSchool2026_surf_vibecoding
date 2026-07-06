package http

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"chef-table/mock-backend/internal/domain"
	"chef-table/mock-backend/internal/service"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type HealthStore interface {
	Ping(r *http.Request) error
}

type Handler struct {
	svc    *service.Service
	health HealthStore
}

func NewRouter(svc *service.Service, health HealthStore) http.Handler {
	h := &Handler{svc: svc, health: health}
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)

	r.Get("/health", h.healthcheck)
	r.Post("/auth/phone-code", h.phoneCode)
	r.Post("/auth/verify-code", h.verifyCode)
	r.Get("/legal/terms", h.terms)
	r.Get("/slots", h.slots)
	r.Get("/slots/{slotId}", h.slot)

	r.Group(func(protected chi.Router) {
		protected.Use(h.auth)
		protected.Get("/me", h.me)
		protected.Post("/bookings", h.createBooking)
		protected.Get("/bookings/my", h.myBookings)
		protected.Get("/bookings/{bookingId}", h.booking)
		protected.Post("/bookings/{bookingId}/participants", h.addParticipants)
		protected.Post("/bookings/{bookingId}/cancel", h.cancelBooking)
		protected.Post("/bookings/{bookingId}/participants/{participantId}/cancel", h.cancelParticipant)
		protected.Get("/notifications/my", h.notifications)
		protected.Post("/chef-reviews", h.createReview)
	})

	return r
}

func (h *Handler) healthcheck(w http.ResponseWriter, r *http.Request) {
	if err := h.health.Ping(r); err != nil {
		writeError(w, domain.NewError(domain.ErrTemporaryUnavailable, "database is unavailable"))
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) phoneCode(w http.ResponseWriter, r *http.Request) {
	var req struct{ Phone string `json:"phone"` }
	if !decode(w, r, &req) {
		return
	}
	result, err := h.svc.RequestPhoneCode(r.Context(), req.Phone)
	writeResult(w, http.StatusAccepted, result, err)
}

func (h *Handler) verifyCode(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Phone string `json:"phone"`
		Code  string `json:"code"`
	}
	if !decode(w, r, &req) {
		return
	}
	result, err := h.svc.VerifyCode(r.Context(), req.Phone, req.Code)
	writeResult(w, http.StatusOK, result, err)
}

func (h *Handler) me(w http.ResponseWriter, r *http.Request) {
	client := r.Context().Value(clientKey{}).(domain.Client)
	writeJSON(w, http.StatusOK, client)
}

func (h *Handler) terms(w http.ResponseWriter, r *http.Request) {
	result, err := h.svc.Terms(r.Context())
	writeResult(w, http.StatusOK, result, err)
}

func (h *Handler) slots(w http.ResponseWriter, r *http.Request) {
	from, err := parseDatePtr(r.URL.Query().Get("from"))
	if err != nil {
		writeError(w, domain.NewError(domain.ErrValidation, "invalid from date"))
		return
	}
	to, err := parseDatePtr(r.URL.Query().Get("to"))
	if err != nil {
		writeError(w, domain.NewError(domain.ErrValidation, "invalid to date"))
		return
	}
	result, err := h.svc.Slots(r.Context(), from, to)
	writeResult(w, http.StatusOK, result, err)
}

func (h *Handler) slot(w http.ResponseWriter, r *http.Request) {
	result, err := h.svc.Slot(r.Context(), chi.URLParam(r, "slotId"))
	writeResult(w, http.StatusOK, result, err)
}

func (h *Handler) createBooking(w http.ResponseWriter, r *http.Request) {
	client := r.Context().Value(clientKey{}).(domain.Client)
	var req struct {
		SlotID              string                    `json:"slotId"`
		ClientName          string                    `json:"clientName"`
		Participants        []domain.ParticipantInput `json:"participants"`
		PaymentMethod       string                    `json:"paymentMethod"`
		ExpectedTotalAmount domain.Money              `json:"expectedTotalAmount"`
	}
	if !decode(w, r, &req) {
		return
	}
	result, err := h.svc.CreateBooking(r.Context(), client, req.ClientName, req.SlotID, req.PaymentMethod, req.Participants, req.ExpectedTotalAmount)
	if err == nil {
		w.Header().Set("Location", "/bookings/"+result.ID)
	}
	writeResult(w, http.StatusCreated, result, err)
}

func (h *Handler) myBookings(w http.ResponseWriter, r *http.Request) {
	client := r.Context().Value(clientKey{}).(domain.Client)
	result, err := h.svc.MyBookings(r.Context(), client, r.URL.Query().Get("status"), r.URL.Query().Get("relation"))
	writeResult(w, http.StatusOK, map[string]any{"items": result}, err)
}

func (h *Handler) booking(w http.ResponseWriter, r *http.Request) {
	client := r.Context().Value(clientKey{}).(domain.Client)
	result, err := h.svc.Booking(r.Context(), client, chi.URLParam(r, "bookingId"))
	writeResult(w, http.StatusOK, result, err)
}

func (h *Handler) addParticipants(w http.ResponseWriter, r *http.Request) {
	client := r.Context().Value(clientKey{}).(domain.Client)
	var req struct {
		Participants        []domain.ParticipantInput `json:"participants"`
		ExpectedTotalAmount domain.Money              `json:"expectedTotalAmount"`
	}
	if !decode(w, r, &req) {
		return
	}
	booking, slot, err := h.svc.AddParticipants(r.Context(), client, chi.URLParam(r, "bookingId"), req.Participants, req.ExpectedTotalAmount)
	writeResult(w, http.StatusOK, map[string]any{"booking": booking, "slot": slot}, err)
}

func (h *Handler) cancelBooking(w http.ResponseWriter, r *http.Request) {
	client := r.Context().Value(clientKey{}).(domain.Client)
	booking, slot, err := h.svc.CancelBooking(r.Context(), client, chi.URLParam(r, "bookingId"))
	writeResult(w, http.StatusOK, map[string]any{"booking": booking, "slot": slot}, err)
}

func (h *Handler) cancelParticipant(w http.ResponseWriter, r *http.Request) {
	client := r.Context().Value(clientKey{}).(domain.Client)
	booking, slot, err := h.svc.CancelParticipant(r.Context(), client, chi.URLParam(r, "bookingId"), chi.URLParam(r, "participantId"))
	writeResult(w, http.StatusOK, map[string]any{"booking": booking, "slot": slot}, err)
}

func (h *Handler) notifications(w http.ResponseWriter, r *http.Request) {
	client := r.Context().Value(clientKey{}).(domain.Client)
	result, err := h.svc.Notifications(r.Context(), client, r.URL.Query().Get("type"))
	writeResult(w, http.StatusOK, map[string]any{"items": result}, err)
}

func (h *Handler) createReview(w http.ResponseWriter, r *http.Request) {
	client := r.Context().Value(clientKey{}).(domain.Client)
	var req struct {
		BookingID string  `json:"bookingId"`
		Rating    int     `json:"rating"`
		Comment   *string `json:"comment"`
	}
	if !decode(w, r, &req) {
		return
	}
	result, err := h.svc.CreateReview(r.Context(), client, req.BookingID, req.Rating, req.Comment)
	writeResult(w, http.StatusCreated, result, err)
}

func writeResult(w http.ResponseWriter, status int, value any, err error) {
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSON(w, status, value)
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func writeError(w http.ResponseWriter, err error) {
	var appErr *domain.AppError
	if !errors.As(err, &appErr) {
		appErr = domain.NewError(domain.ErrTemporaryUnavailable, "temporary unavailable")
	}
	status := statusFor(appErr.Code)
	writeJSON(w, status, appErr)
}

func statusFor(code string) int {
	switch code {
	case domain.ErrUnauthorized, domain.ErrInvalidCode:
		return http.StatusUnauthorized
	case domain.ErrForbidden:
		return http.StatusForbidden
	case domain.ErrNotFound:
		return http.StatusNotFound
	case domain.ErrNoSeats, domain.ErrStaleSlotData, domain.ErrParticipantLimitExceeded, domain.ErrValidationConflict, domain.ErrCancellationWindowClosed, domain.ErrBookingNotEditable, domain.ErrAlreadyExists:
		return http.StatusConflict
	case domain.ErrSlotCancelledOrUnavailable, domain.ErrRebookingForbidden:
		return http.StatusGone
	case domain.ErrRateLimited:
		return http.StatusTooManyRequests
	case domain.ErrTemporaryUnavailable:
		return http.StatusServiceUnavailable
	default:
		return http.StatusBadRequest
	}
}

func decode(w http.ResponseWriter, r *http.Request, target any) bool {
	if err := json.NewDecoder(r.Body).Decode(target); err != nil {
		writeError(w, domain.NewError(domain.ErrValidation, "invalid json body"))
		return false
	}
	return true
}

func parseDatePtr(raw string) (*time.Time, error) {
	if raw == "" {
		return nil, nil
	}
	parsed, err := time.Parse("2006-01-02", raw)
	if err != nil {
		return nil, err
	}
	return &parsed, nil
}

type clientKey struct{}

func (h *Handler) auth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		token := strings.TrimPrefix(header, "Bearer ")
		if header == "" || token == header || !h.svc.Authorized(token) {
			writeError(w, domain.NewError(domain.ErrUnauthorized, "bearer token is required"))
			return
		}
		client, err := h.svc.CurrentClient(r.Context(), token)
		if err != nil {
			writeError(w, err)
			return
		}
		ctx := contextWithClient(r, client)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func contextWithClient(r *http.Request, client domain.Client) context.Context {
	return context.WithValue(r.Context(), clientKey{}, client)
}
