# TASK-20260705-mock-backend-db-scope — Уточнение скоупа mock-backend и БД

## Статус

`resolved`

## Тип

`docs`

## Связь с ТЗ и требованиями

- `TZ_application/07-technology-stack.md` — технологический стек, моковый режим, mock-backend, PostgreSQL, миграции, Docker Compose.
- `TZ_application/08-feature-list.md` — технические фичи mock-backend, миграции БД, seed-данные и Docker Compose.
- `api/openapi.yaml` — контракт endpoint-ов для mock-backend.
- `design/ER-model-and-entity-models.md` — доменные сущности для схемы БД.

## Цель

Зафиксировать, что в решаемые задачи входит создание демонстрационного mock-backend, PostgreSQL-БД, миграций и заполнения моковыми данными.

## Не входит в задачу

- Production-бэкенд.
- Реальные платежи.
- Админка.
- Production SMS/push.
- Полноценные требования безопасности.

## Изменённые артефакты

- `TZ_application/07-technology-stack.md` — добавлены Go, chi, PostgreSQL, golang-migrate, Docker Compose и структура mock-backend.
- `TZ_application/08-feature-list.md` — добавлены технические фичи mock-backend, миграций, seed-данных и Docker Compose.
- `logs/TASK-20260705-mock-backend-db-scope.md` — создан задачный лог.
- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — создан пошаговый план-чеклист реализации mock-backend.
- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — добавлен итеративный план реализации с критериями выхода; запрет по студии в seed-разделе заменён на ограничение.
- `mock_backend/ARCHITECTURE.md` — создан отдельный архитектурный документ mock-backend.

## Журнал работы

### 2026-07-05 22:12 — документация

#### Промпт пользователя

> одобряю. в решаемые задачи также будет входить создание бд и заполнение ее мокап-данными.

#### Краткие действия Codex

- Зафиксировал расширение технического скоупа: mock-backend, PostgreSQL, миграции, seed-данные.
- Уточнил, что это демонстрационный слой, а не production-бэкенд.

#### Изменённые артефакты

- `TZ_application/07-technology-stack.md` — обновлён стек и моковый режим.
- `TZ_application/08-feature-list.md` — добавлены технические mock/backend/database фичи.
- `logs/TASK-20260705-mock-backend-db-scope.md` — создан лог задачи.

#### Связь с ТЗ

- `api/openapi.yaml` — mock-backend должен реализовать endpoint-ы контракта.
- `design/ER-model-and-entity-models.md` — PostgreSQL-схема должна опираться на доменную модель.
- `TZ_application/03-business-logic.md` — mock-backend должен имитировать ключевые бизнес-ограничения.

#### Тесты и проверки

- не запускались
- Изменялась документация, код и миграции ещё не создавались.

#### Следующие шаги

- Спроектировать PostgreSQL-миграцию и seed-данные.
- Создать структуру `mock-backend/`.
- Реализовать endpoint-ы по `api/openapi.yaml`.

### 2026-07-05 22:17 — документация

#### Промпт пользователя

> спроектируй пошаговый план-чеклист реализации мокап-бэкенда. обрати внимания на ограничения, имеющиеся в ТЗ. полученный артефакт сохрани в новой папке, mock_backend.

#### Краткие действия Codex

- Создал папку `mock_backend`.
- Подготовил пошаговый чеклист реализации mock-backend с учётом ограничений ТЗ, OpenAPI, доменной модели, PostgreSQL, seed-данных, Docker Compose и тестов.

#### Изменённые артефакты

- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — новый артефакт с планом реализации.
- `logs/TASK-20260705-mock-backend-db-scope.md` — обновлён задачный лог.

#### Связь с ТЗ

- `TZ_application/03-business-logic.md` — ограничения бронирования, отмены, ошибок API и оценки шефа.
- `TZ_application/04-api-contract-map.md` — endpoint-ы и схемы данных.
- `TZ_application/05-data-and-access.md` — сущности, права доступа и инварианты.
- `api/openapi.yaml` — контракт mock-backend.

#### Тесты и проверки

- Проверка файла через `rg` по ключевым ограничениям.
- Результат: ключевые ограничения и этапы реализации найдены в созданном артефакте.

#### Следующие шаги

- Перейти к проектированию SQL-миграции и seed-данных.

### 2026-07-05 22:50 — документация

#### Промпт пользователя

> одобряю. проверь implementation_checklist на наличие плана итеративной реализации в виде чеклиста, при отсутствии - спроектируй

#### Краткие действия Codex

- Проверил `mock_backend/IMPLEMENTATION_CHECKLIST.md`.
- Определил, что в файле есть линейные этапы и рекомендуемый порядок, но нет отдельного итеративного плана с проверяемыми инкрементами.
- Добавил раздел "Итеративный план реализации" с итерациями 0-6 и критериями выхода.
- Заменил отрицательный чекбокс в seed-разделе на примечание-ограничение, чтобы ИИ не воспринимал запрет как отдельную реализационную задачу.

#### Изменённые артефакты

- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — добавлен итеративный план и уточнено ограничение по адресу/студии.
- `logs/TASK-20260705-mock-backend-db-scope.md` — обновлён задачный лог.

#### Связь с ТЗ

- `api/openapi.yaml` — итерации ориентированы на поэтапную реализацию endpoint-ов контракта.
- `TZ_application/03-business-logic.md` — итерации бронирования, отмены и ошибок привязаны к бизнес-логике.
- `TZ_application/08-feature-list.md` — итерации покрывают технические фичи mock-backend, БД, seed и Docker Compose.

#### Тесты и проверки

- `Select-String -Path 'mock_backend/IMPLEMENTATION_CHECKLIST.md' -Pattern 'Итерация|Критерий выхода|Не создавать|Ограничение|StudioInfo|/studio-info|studios' -Context 1,1`
- `rg -n "^- \[ \] Не создавать|Итеративный план реализации|Критерий выхода|Ограничение: не создавать" mock_backend/IMPLEMENTATION_CHECKLIST.md`
- Результат: итеративный план найден; отрицательный чекбокс по студии удалён, запрет оставлен как ограничение.

#### Следующие шаги

- Использовать итерационный план как порядок реализации mock-backend.

### 2026-07-05 22:54 — документация

#### Промпт пользователя

> зафиксируй архитектуру бэкенда в отдельный файл

#### Краткие действия Codex

- Сверил стек, чеклист реализации и бизнес-логику mock-backend.
- Создал отдельный файл архитектуры mock-backend.
- Зафиксировал слои сервиса, границы ответственности, PostgreSQL-модель, транзакции, API-модули, ошибки, миграции, seed, тестирование, Docker Compose и архитектурные запреты.

#### Изменённые артефакты

- `mock_backend/ARCHITECTURE.md` — создан архитектурный документ.
- `logs/TASK-20260705-mock-backend-db-scope.md` — обновлён задачный лог.

#### Связь с ТЗ

- `api/openapi.yaml` — архитектура фиксирует реализацию endpoint-ов по контракту.
- `TZ_application/03-business-logic.md` — архитектура выносит бизнес-правила в service layer.
- `design/ER-model-and-entity-models.md` — архитектура опирается на доменные сущности и запрет отдельной сущности студии.
- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — архитектура дополняет план реализации.

#### Тесты и проверки

- `rg -n "^(#|##|###)|studios|StudioInfo|/studio-info|POST /bookings|GET /slots|Transaction|Транзакции|Production|production" mock_backend/ARCHITECTURE.md`
- Результат: ключевые разделы, endpoint-ы, транзакции и архитектурные запреты найдены.

#### Следующие шаги

- При реализации mock-backend использовать `mock_backend/ARCHITECTURE.md` как архитектурный ориентир, а `mock_backend/IMPLEMENTATION_CHECKLIST.md` как порядок работ.

## Итоговое решение

Решено включить в дальнейшие задачи демонстрационный mock-backend с PostgreSQL, миграциями и заполнением моковыми данными, не расширяя MVP до production-бэкенда. Подготовлен план-чеклист реализации в `mock_backend/IMPLEMENTATION_CHECKLIST.md`, включая итеративный план поставки с проверяемыми критериями выхода. Архитектура backend зафиксирована отдельно в `mock_backend/ARCHITECTURE.md`.

## Оставшиеся риски

- Бизнес-ограничения мест и отмен требуют сервисной логики, не только SQL-ограничений.
- При реализации нужно не превращать UI/UX-адрес студии в API, таблицу, seed-данные или mock-backend endpoint.
