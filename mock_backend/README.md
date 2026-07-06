# Mock-backend "Шеф-стол"

Демонстрационный backend для учебного MVP клиентского приложения. Он реализует клиентский API из `../api/openapi.yaml`, хранит данные в PostgreSQL и не является production-бэкендом.

## Что входит

- Auth mock: `POST /auth/phone-code`, `POST /auth/verify-code`, `GET /me`.
- Расписание: `GET /slots`, `GET /slots/{slotId}`.
- Legal: `GET /legal/terms`.
- Брони: создание, список, детали, добавление участников, отмена брони и участника.
- Уведомления: `GET /notifications/my`.
- Оценка шефа: `POST /chef-reviews`.
- PostgreSQL-схема и seed-данные для демонстрационных сценариев.

## Что намеренно не реализовано

- Реальная онлайн-оплата, эквайринг, возвраты и платёжные таблицы.
- Админка, интерфейс шефа, управление расписанием через API.
- `/studio-info`, `StudioInfo`, таблица `studios` и хранение адреса студии в БД.
- Production SMS/push, OAuth, RBAC, refresh-token flow.

## Запуск через Docker Compose

```bash
docker compose up --build
```

API будет доступен на `http://localhost:8080`.

Проверка:

```bash
curl http://localhost:8080/health
```

Если нужно заново применить миграции и seed на чистую БД:

```bash
docker compose down -v
docker compose up --build
```

## Demo-auth

1. Запросить код:

```bash
curl -X POST http://localhost:8080/auth/phone-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"+79991234567"}'
```

2. Подтвердить код:

```bash
curl -X POST http://localhost:8080/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"phone":"+79991234567","code":"1234"}'
```

3. Защищённые запросы выполнять с заголовком:

```text
Authorization: Bearer demo-token
```

## Demo-сценарии seed

- Доступный слот на ближайшие 7 дней.
- Слот с одним свободным местом.
- Заполненный слот.
- Слот, отменённый студией с причиной.
- Слот, отменённый студией без причины.
- Завершённый слот.
- Слот вне ближайших 7 дней для проверки фильтра.
- Активные, групповые, отменённые и завершённые брони.
- Завершённая бронь без оценки и завершённая бронь с уже оставленной оценкой.
- Уведомления `class_reminder` и `studio_cancelled_class`.

## Локальная разработка без Docker

Нужен Go 1.22+ и PostgreSQL.

```bash
go mod download
go test ./...
go run ./cmd/server
```

Перед запуском примените SQL из `migrations/001_init_schema.up.sql` и `migrations/002_seed_demo_data.up.sql`.
