# Карта API-контракта

Источник: `api/openapi.yaml`, OpenAPI 3.0.3, `Chef Table Mobile API`.

## 1. Эндпоинты по сценариям

| Сценарий | Метод и путь | operationId | Авторизация | Используется на экранах |
|---|---|---|---|---|
| Запрос кода | `POST /auth/phone-code` | `requestPhoneCode` | Нет | SCR-001, SCR-002 |
| Проверка кода | `POST /auth/verify-code` | `verifyPhoneCode` | Нет | SCR-002 |
| Текущий клиент | `GET /me` | `getCurrentClient` | Да | SCR-010 |
| Условия и политика | `GET /legal/terms` | `getTerms` | Нет | SCR-001, SCR-005, SCR-007, SCR-016 |
| Список слотов | `GET /slots` | `listSlots` | Нет | SCR-003, SCR-004 |
| Детали слота | `GET /slots/{slotId}` | `getSlot` | Нет | SCR-005, SCR-006, SCR-007 |
| Создание брони | `POST /bookings` | `createBooking` | Да | SCR-007, SCR-008 |
| Мои брони | `GET /bookings/my` | `listMyBookings` | Да | SCR-010 |
| Детали брони | `GET /bookings/{bookingId}` | `getBooking` | Да | SCR-011, SCR-014 |
| Добавить участников | `POST /bookings/{bookingId}/participants` | `addBookingParticipants` | Да | SCR-012, SCR-007 |
| Отменить бронь | `POST /bookings/{bookingId}/cancel` | `cancelBooking` | Да | SCR-013 |
| Отменить участника | `POST /bookings/{bookingId}/participants/{participantId}/cancel` | `cancelBookingParticipant` | Да | SCR-013 |
| Мои уведомления | `GET /notifications/my` | `listMyNotifications` | Да | SCR-014, push/SMS сценарии |
| Оценка шефа | `POST /chef-reviews` | `createChefReview` | Да | SCR-015 |

## 2. Запросы создания и изменения

### `POST /bookings`

Назначение: создать одиночную или групповую бронь.

Тело:

| Поле | Тип | Обязательность | Правило |
|---|---|---|---|
| `slotId` | string | Да | Идентификатор слота. |
| `clientName` | string | Да | Имя основного клиента. |
| `participants` | array | Да | Не менее 1 участника. |
| `paymentMethod` | enum | Да | `offline` или `online_placeholder`; фактически бронь в MVP подтверждается через оффлайн-сценарий. |
| `expectedTotalAmount` | Money | Да | Предварительная сумма клиента для сверки. |

Участник:

| Поле | Тип | Обязательность | Правило |
|---|---|---|---|
| `name` | string | Да | Не пустое. |
| `allergyStatus` | enum | Да | `none` или `has_allergy`. |
| `allergyComment` | string/null | Условно | Обязательно при `has_allergy`. |
| `equipmentOption` | enum | Да | `own` или `rental`. |

Ответы:
- `201` - бронь создана;
- `400` - ошибка валидации;
- `401` - требуется вход;
- `409` - конфликт слота, устаревшие данные или недостаточно мест;
- `410` - слот больше недоступен;
- `503` - временная недоступность.

### `POST /bookings/{bookingId}/participants`

Назначение: добавить участников в существующую предстоящую бронь.

Тело:
- `participants` - новые участники;
- `expectedTotalAmount` - ожидаемая сумма после изменения.

Ответ `200` возвращает:
- `booking` - обновлённая бронь;
- `slot` - актуальная доступность слота.

### Отмена

| Метод | Назначение | Успешный ответ |
|---|---|---|
| `POST /bookings/{bookingId}/cancel` | Отмена всей брони. | `BookingMutationResponse` |
| `POST /bookings/{bookingId}/participants/{participantId}/cancel` | Отмена отдельного участника. | `BookingMutationResponse` |

Правила:
- отмена доступна не позднее чем за 24 часа;
- при отказе API приложение не меняет локально статус на отменённый;
- после успеха UI использует данные ответа.

## 3. Основные схемы данных

### ScheduleSlot

| Поле | Назначение |
|---|---|
| `id` | Идентификатор слота. |
| `program` | Программа класса. |
| `chef` | Шеф и рейтинг. |
| `startsAt` | Дата и время начала. |
| `durationMinutes` | Длительность. |
| `capacity` | Вместимость. |
| `availableSeats` | Свободные места. |
| `seatPrice` | Стоимость места. |
| `requiredEquipmentInfo` | Требования к инвентарю для слота. |
| `rentalEquipmentInfo` | Описание проката. |
| `rentalPricePerParticipant` | Цена проката на участника. |
| `status` | Статус слота. |
| `cancellationReason` | Причина отмены студией, если есть. |

### Booking

| Поле | Назначение |
|---|---|
| `id` | Идентификатор брони. |
| `clientId` | Владелец брони. |
| `slot` | Слот с актуальными деталями. |
| `status` | Клиентский статус брони. |
| `participantCount` | Количество участников. |
| `participants` | Участники. |
| `totalAmount` | Итоговая сумма. |
| `paymentStatus` | Статус оплаты. |
| `paymentChoice` | Выбранный способ оплаты. |
| `cancellableUntil` | Время, до которого отмена разрешена. |
| `review` | Отзыв, если уже оставлен. |
| `reviewAvailable` | Доступность оценки. |

## 4. Словари

| Схема | Значения |
|---|---|
| `SlotStatus` | `available`, `full`, `cancelled_by_studio`, `completed` |
| `BookingStatus` | `confirmed`, `offline_payment_pending`, `cancelled_by_client`, `cancelled_by_studio`, `completed` |
| `PaymentStatus` | `not_required`, `pending_offline`, `paid_offline`, `refunded`, `refund_pending` |
| `PaymentChoice.method` | `offline`, `online_placeholder` |
| `PaymentChoice.status` | `selected`, `placeholder_shown`, `fallback_to_offline` |
| `ParticipantStatus` | `active`, `cancelled_by_client`, `cancelled_by_studio` |
| `AllergyStatus` | `none`, `has_allergy` |
| `EquipmentOption` | `own`, `rental` |
| `NotificationType` | `class_reminder`, `studio_cancelled_class` |

## 5. Ошибки и реакции UI

| errorCode | Где возникает | UI-реакция |
|---|---|---|
| `validation_error` | Формы, бронирование, отзыв | Показать ошибку валидации. |
| `invalid_phone` | SCR-001 | Показать ошибку телефона. |
| `invalid_code` | SCR-002 | Показать ошибку кода. |
| `rate_limited` | SCR-001/SCR-002 | Показать ожидание перед повтором. |
| `unauthorized` | Защищённые запросы | Перевести в авторизацию. |
| `forbidden` | Чужая бронь/запрещённое действие | Показать запрет доступа. |
| `not_found` | Слот/бронь не найдены | Показать недоступность сущности. |
| `no_seats` | Создание/добавление участников | Обновить слот и показать нехватку мест. |
| `stale_slot_data` | Создание/добавление участников | Обновить данные и попросить подтвердить заново. |
| `participant_limit_exceeded` | Участники | Показать превышение доступных мест. |
| `validation_conflict` | Сумма/состояние формы | Показать необходимость обновить данные. |
| `slot_cancelled_or_unavailable` | Слот | Показать отмену/недоступность. |
| `rebooking_forbidden` | Отменённый студией слот | Запретить повторную запись. |
| `cancellation_window_closed` | Отмена | Показать правило 24 часов. |
| `booking_not_editable` | Добавление/отмена | Показать, что бронь нельзя изменить. |
| `already_exists` | Отзыв | Показать, что оценка уже отправлена. |
| `temporary_unavailable` | Любой запрос | Показать временную ошибку и retry. |

## 6. Требования к клиентской интеграции

1. Все защищённые запросы отправлять с `Authorization: Bearer {token}`.
2. При `401` очищать невалидную сессию и открывать SCR-001/SCR-002.
3. Не кэшировать подтверждённые статусы как источник истины дольше текущего UI-сценария.
4. После мутаций использовать данные ответа, а не локально рассчитанное состояние.
5. При конфликте мест повторно запросить `GET /slots/{slotId}` или использовать `slot` из ответа мутации.
6. Адрес единственной студии не входит в API-контракт: это статический UI/UX-контент макета, не endpoint, не схема данных и не поле ответов.
