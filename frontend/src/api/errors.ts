import type { ErrorCode, ErrorResponse } from "./types";

export class ApiError extends Error {
  status: number;
  errorCode: ErrorCode;
  details?: Record<string, unknown> | null;

  constructor(status: number, response: ErrorResponse) {
    super(response.message);
    this.name = "ApiError";
    this.status = status;
    this.errorCode = response.errorCode;
    this.details = response.details;
  }
}

export const errorMessages: Record<ErrorCode, string> = {
  validation_error: "Проверьте заполнение формы.",
  invalid_phone: "Телефон должен быть в формате +79991234567.",
  invalid_code: "Код неверный или устарел.",
  rate_limited: "Слишком много попыток. Повторите позже.",
  unauthorized: "Нужно войти по номеру телефона.",
  forbidden: "Нет доступа к этой записи.",
  not_found: "Данные не найдены или уже недоступны.",
  no_seats: "Свободных мест уже не хватает.",
  stale_slot_data: "Данные слота изменились. Обновите экран и подтвердите заново.",
  participant_limit_exceeded: "Количество участников превышает доступные места.",
  validation_conflict: "Итоговая сумма или состав записи изменились.",
  slot_cancelled_or_unavailable: "Запись на этот класс недоступна.",
  rebooking_forbidden: "Повторная запись на отменённый студией слот запрещена.",
  cancellation_window_closed: "Отмена доступна не позднее чем за 24 часа до класса.",
  booking_not_editable: "Эту бронь больше нельзя изменить.",
  already_exists: "Вы уже записаны на этот класс. Можно добавить участников к существующей записи.",
  temporary_unavailable: "Сервис временно недоступен. Попробуйте ещё раз."
};

export function getUserErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return errorMessages[error.errorCode] ?? error.message;
  if (error instanceof Error) return error.message;
  return "Произошла неизвестная ошибка.";
}
