# TASK-20260705-mock-backend-implementation — Реализация mock-backend

## Статус

`in_progress`

## Тип

`stack`

## Связь с ТЗ и требованиями

- `api/openapi.yaml` — реализуемые endpoint-ы, схемы ответов и errorCode.
- `mock_backend/ARCHITECTURE.md` — слои backend, PostgreSQL, транзакции, запреты.
- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — порядок реализации и критерии готовности.
- `TZ_application/03-business-logic.md` — правила авторизации, расписания, бронирования, отмены и оценки.
- `TZ_application/04-api-contract-map.md` — связь экранов и API.
- `TZ_application/05-data-and-access.md` — сущности, доступы и инварианты.

## Цель

Создать рабочий демонстрационный mock-backend для клиентского MVP "Шеф-стол": HTTP API по OpenAPI, PostgreSQL-схему, seed-данные, Docker Compose, README и базовые проверки.

## Не входит в задачу

- Production-бэкенд.
- Реальная онлайн-оплата и платёжные таблицы.
- Админка, интерфейс шефа и управление расписанием через API.
- Таблица `studios`, объект `StudioInfo`, endpoint `/studio-info`, хранение адреса студии в БД.
- Production SMS/push, OAuth, RBAC, refresh-token flow.

## Изменённые артефакты

- `mock_backend/go.mod` — создан Go-модуль mock-backend.
- `mock_backend/cmd/server/main.go` — создана точка входа HTTP-сервера.
- `mock_backend/internal/config/config.go` — добавлена конфигурация через env.
- `mock_backend/internal/domain/domain.go` — добавлены доменные типы, статусы, errorCode и бизнес-правила.
- `mock_backend/internal/domain/domain_test.go` — добавлены unit-тесты доменных правил.
- `mock_backend/internal/service/service.go` — добавлена сервисная бизнес-логика auth, slots, bookings, cancel, notifications, reviews.
- `mock_backend/internal/http/router.go` — добавлены HTTP routes и единый формат JSON-ошибок.
- `mock_backend/internal/storage/postgres/store.go` — добавлена PostgreSQL-реализация хранилища и транзакционные операции.
- `mock_backend/migrations/001_init_schema.up.sql` — создана PostgreSQL-схема MVP.
- `mock_backend/migrations/001_init_schema.down.sql` — добавлен откат схемы.
- `mock_backend/migrations/002_seed_demo_data.up.sql` — добавлены seed-данные демонстрационных сценариев.
- `mock_backend/migrations/002_seed_demo_data.down.sql` — добавлен откат seed-данных.
- `mock_backend/Dockerfile` — добавлена контейнерная сборка.
- `mock_backend/docker-compose.yml` — добавлен запуск PostgreSQL и mock-backend.
- `mock_backend/.env.example` — добавлен пример env-переменных.
- `mock_backend/README.md` — добавлено описание запуска и demo-сценариев.

## Журнал работы

### 2026-07-05 23:00 — реализация

#### Промпт пользователя

> на основе информации об архитектуре и чеклиста, а также ТЗ, приступи к реализации бэкенда проекта. веди отдельный лог разработки. по окончании выведи, что было реализовано, а что не удалось

#### Краткие действия Codex

- Сверил архитектуру, чеклист, OpenAPI и бизнес-логику.
- Зафиксировал отдельный лог разработки backend.
- Обнаружил ограничение среды: команда `go` недоступна локально, поэтому проверку сборки нужно выполнять через Docker или на машине с установленным Go.

#### Изменённые артефакты

- `logs/TASK-20260705-mock-backend-implementation.md` — создан лог разработки backend.

#### Связь с ТЗ

- `api/openapi.yaml` — выбран набор endpoint-ов для реализации без расширения MVP.
- `mock_backend/ARCHITECTURE.md` — подтверждены архитектурные запреты и слои.

#### Тесты и проверки

- `go version`
- Результат: `go` не установлен в текущей среде.

#### Следующие шаги

- Создать структуру Go-сервиса, миграции, seed, Docker Compose и README.

### 2026-07-05 23:15 — реализация

#### Промпт пользователя

> на основе информации об архитектуре и чеклиста, а также ТЗ, приступи к реализации бэкенда проекта. веди отдельный лог разработки. по окончании выведи, что было реализовано, а что не удалось

#### Краткие действия Codex

- Создал Go-структуру backend по архитектуре `mock_backend/ARCHITECTURE.md`.
- Реализовал HTTP-маршруты по `api/openapi.yaml`.
- Добавил доменные типы, сервисную валидацию участников, суммы, статусов, отмены за 24 часа и оценки шефа.
- Добавил PostgreSQL-хранилище с транзакциями для операций, меняющих места и состав брони.
- Добавил SQL-миграции и seed-данные без сущности студии.
- Добавил Dockerfile, Docker Compose, `.env.example`, README и unit-тесты доменных правил.

#### Изменённые артефакты

- `mock_backend/go.mod` — создан Go-модуль.
- `mock_backend/cmd/server/main.go` — создана точка входа сервера.
- `mock_backend/internal/config/config.go` — создана конфигурация env.
- `mock_backend/internal/domain/domain.go` — добавлены доменные модели и правила.
- `mock_backend/internal/domain/domain_test.go` — добавлены unit-тесты.
- `mock_backend/internal/service/service.go` — добавлена сервисная логика.
- `mock_backend/internal/http/router.go` — добавлен HTTP API.
- `mock_backend/internal/storage/postgres/store.go` — добавлено PostgreSQL-хранилище.
- `mock_backend/migrations/001_init_schema.up.sql` — создана схема БД.
- `mock_backend/migrations/001_init_schema.down.sql` — создан откат схемы.
- `mock_backend/migrations/002_seed_demo_data.up.sql` — созданы seed-данные.
- `mock_backend/migrations/002_seed_demo_data.down.sql` — создан откат seed.
- `mock_backend/Dockerfile` — создан Dockerfile.
- `mock_backend/docker-compose.yml` — создан Compose-файл.
- `mock_backend/.env.example` — создан пример env.
- `mock_backend/README.md` — создано описание запуска.

#### Связь с ТЗ

- `api/openapi.yaml` — реализованы клиентские endpoint-ы Auth, Schedule, Legal, Bookings, Notifications, Reviews.
- `TZ_application/03-business-logic.md` — реализованы правила расписания на 7 дней, суммы, аллергий, мест, отмены за 24 часа и оценки completed-брони.
- `mock_backend/ARCHITECTURE.md` — соблюдены слои HTTP -> service -> storage/postgres и транзакции на изменениях мест.

#### Тесты и проверки

- `docker compose config`
- Результат: Compose-конфигурация валидна.
- `go test ./...`
- Результат: не выполнено, `go` не установлен в текущей среде.
- `docker compose build mock-backend`
- Результат: не выполнено, Docker daemon недоступен: `open //./pipe/docker_engine: The system cannot find the file specified`.
- `rg -n "studio-info|StudioInfo|create table studios|studios" mock_backend\migrations mock_backend\internal`
- Результат: запрещённые сущности в коде и миграциях не найдены.
- `rg -n "auth/phone-code|auth/verify-code|/me|/legal/terms|/slots|/bookings|notifications/my|chef-reviews|health" mock_backend\internal\http\router.go mock_backend\README.md`
- Результат: основные endpoint-ы найдены.

#### Следующие шаги

- На машине с Go 1.22+ выполнить `go mod tidy`, `go test ./...`, `go build ./cmd/server`.
- При доступном Docker daemon выполнить `docker compose up --build` и проверить happy path API.
- После успешной сборки можно перевести задачу в `resolved`.

## Итоговое решение

Не заполнено: задача не переведена в `resolved`, потому что сборка и тесты backend не подтверждены в текущей среде.

## Оставшиеся риски

- Локальная среда без установленного Go не позволяет выполнить `go test` и `go build` напрямую.
- Docker daemon недоступен, поэтому контейнерная сборка и запуск `docker compose up --build` не проверены.
