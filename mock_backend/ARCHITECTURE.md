# Архитектура mock-backend

## Назначение

Документ фиксирует архитектуру демонстрационного mock-backend для MVP мобильного приложения "Шеф-стол".

Mock-backend нужен для проверки клиентского приложения, API-контракта, бизнес-ограничений бронирования, PostgreSQL-схемы и воспроизводимой передачи проекта. Это не production-бэкенд и не замена существующего black-box бэкенда.

## Архитектурное решение

Mock-backend строится как модульный HTTP-сервис на Go с PostgreSQL.

Основные принципы:

- API реализуется по `api/openapi.yaml`.
- Бизнес-правила берутся из `TZ_application/03-business-logic.md`.
- Сущности и связи опираются на `design/ER-model-and-entity-models.md`.
- Изменения бизнес-состояния подтверждаются только после успешной операции сервиса и БД.
- Клиентские ошибки возвращаются в формате `ErrorResponse` из OpenAPI.
- Реальные платежи, production auth, админка и реальные SMS/push не реализуются.

## Границы ответственности

### Входит

- HTTP API для клиентского приложения.
- PostgreSQL-схема для доменных сущностей MVP.
- Миграции схемы и seed-данных.
- Демонстрационная bearer-auth имитация.
- Сервисная бизнес-валидация бронирования, отмены, участников, отзывов и ошибок.
- Docker Compose для запуска mock-backend и PostgreSQL.

### Не входит

- Production-бэкенд.
- Реальная онлайн-оплата.
- Админка и интерфейс шефа.
- Управление расписанием через API.
- Production SMS/push.
- RBAC, OAuth, refresh-token flow.
- Таблица `studios`, объект `StudioInfo`, endpoint `/studio-info` и seed-запись студии.

Адрес и название на баннере являются статическим UI/UX-контентом макета и не входят в mock-backend.

## Слои

```text
HTTP handlers
    -> service layer
        -> storage interfaces
            -> PostgreSQL implementation
```

### `cmd/server`

Точка входа приложения.

Отвечает за:

- чтение конфигурации;
- создание пула PostgreSQL;
- сборку зависимостей;
- настройку роутера;
- запуск HTTP-сервера;
- graceful shutdown, если будет добавлен в реализации.

### `internal/config`

Конфигурация из переменных окружения.

Минимальные параметры:

- `APP_PORT`;
- `DATABASE_URL`;
- `DEMO_AUTH_CODE`;
- `DEMO_TOKEN`.

### `internal/domain`

Доменные типы и константы.

Содержит:

- статусы слотов, броней, участников и оплат;
- типы ошибок;
- структуры, близкие к OpenAPI-схемам;
- доменные правила, которые не зависят от HTTP и PostgreSQL.

В этом слое не должно быть SQL, HTTP-запросов и знаний о transport-формате.

### `internal/http`

HTTP-слой.

Состав:

- `handlers` — endpoint-ы OpenAPI;
- `middleware` — bearer-auth, request id/logging при необходимости;
- `response` — единый JSON-формат успешных ответов и ошибок.

HTTP-слой отвечает только за:

- парсинг запроса;
- базовую transport-валидацию;
- вызов service layer;
- маппинг результата в HTTP status и JSON.

Бизнес-решения не должны жить в handler-ах.

### `internal/service`

Сервисная бизнес-логика.

Отвечает за:

- авторизацию demo-клиента;
- загрузку расписания;
- создание брони;
- добавление участников;
- отмену брони и участников;
- получение броней клиента;
- получение уведомлений;
- создание оценки шефа;
- расчёт суммы;
- проверку правила 24 часов;
- маппинг доменных отказов в typed errors.

Критичные операции с местами выполняются через транзакции storage layer.

### `internal/storage`

Интерфейсы хранилища.

Нужны, чтобы сервисный слой не зависел напрямую от PostgreSQL-деталей.

Примеры интерфейсов:

- `ClientRepository`;
- `SlotRepository`;
- `BookingRepository`;
- `NotificationRepository`;
- `ReviewRepository`;
- `TermsRepository`;
- `TxManager`.

### `internal/storage/postgres`

PostgreSQL-реализация хранилища.

Отвечает за:

- SQL-запросы;
- транзакции;
- блокировки строк при изменении мест;
- преобразование SQL-ошибок в ошибки storage/service уровня;
- чтение seed-данных.

## PostgreSQL-модель

Таблицы MVP:

- `clients`;
- `class_programs`;
- `chefs`;
- `schedule_slots`;
- `bookings`;
- `booking_participants`;
- `chef_reviews`;
- `notifications`;
- `legal_terms`.

Не создавать:

- `studios`;
- таблицы реальных платежей;
- таблицы админов, ролей владельца и шефа.

Деньги хранить без `float`: `amount_minor integer` или `numeric(12,2)`.

## Транзакции

Транзакции обязательны для операций, которые меняют места или состав брони:

- `POST /bookings`;
- `POST /bookings/{bookingId}/participants`;
- `POST /bookings/{bookingId}/cancel`;
- `POST /bookings/{bookingId}/participants/{participantId}/cancel`.

Правило:

1. Начать транзакцию.
2. Перечитать слот и/или бронь с блокировкой.
3. Проверить статус, доступность и права.
4. Изменить бронь, участников и `available_seats`.
5. Обновить статус слота при заполнении.
6. Зафиксировать транзакцию.
7. Вернуть обновлённую `Booking` или `BookingMutationResponse`.

При ошибке транзакция откатывается, а API возвращает typed error.

## API-модули

### Auth

Endpoint-ы:

- `POST /auth/phone-code`;
- `POST /auth/verify-code`;
- `GET /me`.

Особенности:

- используется demo-код из `DEMO_AUTH_CODE`;
- access token сверяется с `DEMO_TOKEN`;
- новый demo-клиент может создаваться при первом входе.

### Schedule

Endpoint-ы:

- `GET /slots`;
- `GET /slots/{slotId}`.

Правила:

- без `from/to` возвращаются ближайшие 7 дней;
- с `from/to` применяется фильтр по датам;
- маркетинговые фильтры не добавляются;
- `full` и `cancelled_by_studio` возвращаются для визуального отличия;
- `cancellationReason` возвращается, если есть.

### Legal

Endpoint:

- `GET /legal/terms`.

Содержимое берётся из `legal_terms` или согласованной seed-записи.

### Bookings

Endpoint-ы:

- `POST /bookings`;
- `GET /bookings/my`;
- `GET /bookings/{bookingId}`;
- `POST /bookings/{bookingId}/participants`;
- `POST /bookings/{bookingId}/cancel`;
- `POST /bookings/{bookingId}/participants/{participantId}/cancel`.

Основные правила:

- клиент работает только со своими бронями;
- бронь создаётся только на доступный слот;
- участники должны иметь имя, статус аллергии и выбор инвентаря;
- `allergyComment` обязателен при `has_allergy`;
- сумма сверяется с `expectedTotalAmount`;
- отмена доступна не позднее чем за 24 часа;
- физическое удаление броней и участников не используется.

### Notifications

Endpoint:

- `GET /notifications/my`.

Mock-backend не отправляет реальные SMS/push. Уведомления читаются как демонстрационные записи из БД.

### Reviews

Endpoint:

- `POST /chef-reviews`.

Правила:

- отзыв доступен только по своей завершённой брони;
- `rating` обязателен от 1 до 5;
- `comment` необязателен;
- повторная оценка одной брони запрещена.

## Ошибки

Все клиентские ошибки возвращаются как `ErrorResponse`.

Обязательные errorCode:

- `validation_error`;
- `invalid_phone`;
- `invalid_code`;
- `rate_limited`;
- `unauthorized`;
- `forbidden`;
- `not_found`;
- `no_seats`;
- `stale_slot_data`;
- `participant_limit_exceeded`;
- `validation_conflict`;
- `slot_cancelled_or_unavailable`;
- `rebooking_forbidden`;
- `cancellation_window_closed`;
- `booking_not_editable`;
- `already_exists`;
- `temporary_unavailable`.

HTTP-слой не должен придумывать новые бизнес-ошибки без обновления `api/openapi.yaml`.

## Миграции и seed

Минимальный набор:

- `001_init_schema.up.sql`;
- `001_init_schema.down.sql`;
- `002_seed_demo_data.up.sql`;
- `002_seed_demo_data.down.sql`.

Seed должен покрывать:

- доступный слот на ближайшие 7 дней;
- слот с малым количеством мест;
- `full`;
- `cancelled_by_studio` с причиной;
- `cancelled_by_studio` без причины;
- `completed`;
- слот вне ближайших 7 дней;
- demo-клиента;
- активную, групповую, отменённую и завершённую брони;
- бронь `completed` без оценки и с уже оставленной оценкой;
- уведомления `class_reminder` и `studio_cancelled_class`;
- legal terms.

Seed не должен создавать студию, адрес студии или `/studio-info`.

## Тестирование

### Unit tests

Покрыть:

- расчёт суммы;
- валидацию участников;
- обязательность `allergyComment`;
- правило 24 часов;
- статусы брони;
- запрет повторной оценки.

### Integration tests

Покрыть:

- успешную авторизацию;
- расписание на ближайшие 7 дней;
- фильтр по датам;
- создание брони;
- отказ при нехватке мест;
- отказ при отменённом слоте;
- добавление участников;
- отмену брони;
- отмену участника;
- запрет отмены после окна 24 часов;
- создание оценки;
- повторную оценку.

### Contract checks

Проверить:

- endpoint-ы реализации против `api/openapi.yaml`;
- обязательные поля `ScheduleSlot`, `Booking`, `BookingParticipant`, `ChefReview`;
- коды ответов `200`, `201`, `400`, `401`, `403`, `404`, `409`, `410`, `429`, `503`.

## Docker Compose

Состав:

- `postgres`;
- `mock-backend`.

Требования:

- PostgreSQL имеет healthcheck;
- mock-backend получает `DATABASE_URL`;
- миграции применяются при запуске или отдельной командой;
- порт API проброшен наружу;
- `.env.example` содержит минимальные переменные.

## Архитектурные запреты

- Не добавлять административные endpoint-ы.
- Не добавлять endpoint для административной отмены студией, если его нет в OpenAPI.
- Не добавлять реальные платежи, платёжные таблицы, эквайринг и возвраты.
- Не создавать `studios`, `StudioInfo`, `/studio-info`.
- Не хранить адрес студии в БД или seed-данных.
- Не переносить всю бизнес-логику в SQL-ограничения.
- Не считать локальный или серверный черновик подтверждённой бронью до успешного ответа API.

## Связанные документы

- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — порядок реализации.
- `api/openapi.yaml` — API-контракт.
- `TZ_application/03-business-logic.md` — бизнес-логика.
- `TZ_application/04-api-contract-map.md` — карта API.
- `TZ_application/05-data-and-access.md` — данные и доступ.
- `design/ER-model-and-entity-models.md` — ER-модель.
- `TZ_application/06-acceptance-checklist.md` — приёмка.
