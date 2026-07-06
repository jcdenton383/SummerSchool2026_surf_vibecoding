# TASK-20260705-frontend-implementation — Реализация frontend MVP

## Статус

`in_progress`

## Тип

`feature`

## Связь с ТЗ и требованиями

- `frontend/IMPLEMENTATION_CHECKLIST.md` — итерации 0-13 реализации frontend.
- `api/openapi.yaml` — клиентские endpoint-ы и схемы данных.
- `TZ_application/03-business-logic.md` — правила авторизации, расписания, бронирования, отмены и оценки.
- `TZ_application/04-api-contract-map.md` — связь экранов с API.
- `TZ_application/07-technology-stack.md` — Expo, React Native, TypeScript, Expo Router, TanStack Query, Zustand, React Hook Form, Zod.
- `TZ_application/08-feature-list.md` — P0/P1 MVP-фичи.
- `mock_backend/ARCHITECTURE.md` — ограничения mock-backend и запрет production-сценариев.
- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — сценарии mock-backend, ошибки и ограничения.

## Цель

Создать клиентский frontend MVP в папке `frontend/` по ТЗ, OpenAPI и информации о mock-backend: авторизация, расписание, карточка класса, создание брони, мои записи, изменение/отмена, уведомления, оценка шефа и legal.

## Не входит в задачу

- Реальная онлайн-оплата, платёжные формы, эквайринг, фискализация и автоматические возвраты.
- Админка, интерфейс шефа и управление расписанием.
- Production SMS/push.
- Программная модель адреса студии, `/studio-info`, `StudioInfo`, `studios`.
- Production auth, OAuth, refresh-token flow и RBAC.

## Изменённые артефакты

- `frontend/package.json` — создан Expo/React Native/TypeScript проект и scripts.
- `frontend/app.json` — создана Expo-конфигурация.
- `frontend/tsconfig.json` — настроен TypeScript и alias `@/*`.
- `frontend/babel.config.js` — добавлена конфигурация Babel для Expo.
- `frontend/.env.example` — добавлены переменные API/mock-режима.
- `frontend/README.md` — добавлено описание запуска и скоупа.
- `frontend/app/_layout.tsx` — подключены Expo Router и TanStack Query.
- `frontend/app/index.tsx` — стартовый экран MVP.
- `frontend/app/auth/index.tsx` — SCR-001 ввод телефона.
- `frontend/app/auth/code.tsx` — SCR-002 ввод кода.
- `frontend/app/schedule/index.tsx` — SCR-003/SCR-004 расписание и фильтр дат.
- `frontend/app/schedule/[slotId].tsx` — SCR-005 карточка класса.
- `frontend/app/booking/[slotId].tsx` — SCR-006 участники брони.
- `frontend/app/booking/confirm.tsx` — SCR-007 подтверждение offline-оплаты.
- `frontend/app/booking/online-unavailable.tsx` — SCR-008 заглушка онлайн-оплаты.
- `frontend/app/booking/success.tsx` — SCR-009 успех бронирования.
- `frontend/app/account/index.tsx` — SCR-010 мои записи.
- `frontend/app/account/[bookingId].tsx` — SCR-011 детали брони и оценка шефа.
- `frontend/app/account/add-participants.tsx` — SCR-012 добавление участника.
- `frontend/app/account/cancel.tsx` — SCR-013 отмена брони/участника.
- `frontend/app/account/notifications.tsx` — SCR-014 in-app уведомления.
- `frontend/app/legal/index.tsx` — SCR-016 legal screen.
- `frontend/src/api/types.ts` — TypeScript-типы по OpenAPI.
- `frontend/src/api/client.ts` — HTTP/local_mock API-клиент.
- `frontend/src/api/errors.ts` — typed API errors и UI-маппинг.
- `frontend/src/api/queryKeys.ts` — query keys.
- `frontend/src/api/mocks/localMock.ts` — локальный mock-слой по OpenAPI.
- `frontend/src/features/auth/sessionStore.ts` — Zustand-сессия и SecureStore token.
- `frontend/src/features/booking/bookingDraftStore.ts` — черновик брони.
- `frontend/src/shared/config/env.ts` — env-конфигурация.
- `frontend/src/shared/lib/date.ts` — форматирование дат и проверка окна отмены.
- `frontend/src/shared/lib/money.ts` — расчёт и форматирование суммы.
- `frontend/src/shared/lib/status.ts` — статусы и доступность действий.
- `frontend/src/shared/validation/booking.ts` — Zod-валидация телефона, кода, участников и аллергий.
- `frontend/src/shared/ui/*` — базовые UI-компоненты.
- `frontend/tests/business-rules.test.ts` — unit tests для бизнес-правил.

## Журнал работы

### 2026-07-06 00:01 — реализация

#### Промпт пользователя

> согласно ТЗ, информации по openapi, информации по бэкэнду и имплементационному чеклисту фронтэнда, приступи к реализации фронтэнда. папка назначения - frontend. по окончании проинформируй, что из чеклиста было реализовано, что реализовать не удалось. веди отдельный дополнительный лог работы по реализации фронтенда.

#### Краткие действия Codex

- Сверил OpenAPI, технологический стек, фича-лист, бизнес-логику, карту API, архитектуру mock-backend и frontend-чеклист.
- Создал Expo Router frontend в `frontend/`.
- Реализовал API-слой с режимами `http` и `local_mock`.
- Реализовал основные клиентские P0/P1-сценарии MVP: auth, schedule, slot details, booking, account, cancel, notifications, reviews, legal.
- Добавил unit tests для бизнес-правил.
- Провёл доступные статические проверки.

#### Изменённые артефакты

- `frontend/` — создана структура приложения, экраны, API, shared UI, validation, stores и tests.
- `logs/TASK-20260705-frontend-implementation.md` — создан отдельный лог реализации frontend.
- `.agents/AI_JOURNAL.md` — будет обновлён общей записью о реализации.

#### Связь с ТЗ

- `TZ_application/08-feature-list.md` — реализованы основные P0-фичи авторизации, расписания, бронирования, аккаунта, отмены, уведомлений, оценки и legal.
- `api/openapi.yaml` — подключены все клиентские endpoint-ы через API-клиент или local_mock.
- `TZ_application/03-business-logic.md` — учтены правила 24 часов, аллергий, расчёта суммы, offline-payment и источника истины API.
- `mock_backend/ARCHITECTURE.md` — не добавлены real payments, admin, chef UI, `/studio-info`, `StudioInfo`, `studios`.

#### Тесты и проверки

- `node --version`
- Результат: не выполнено, `node` не установлен.
- `npm --version`
- Результат: не выполнено, `npm` не установлен.
- `npm run typecheck`
- Результат: не запускался, отсутствует `npm`.
- `npm test`
- Результат: не запускался, отсутствует `npm`.
- `rg -n "studio-info|StudioInfo|studios" frontend\app frontend\src frontend\tests`
- Результат: запрещённые программные сущности не найдены.
- `Get-ChildItem -Recurse -File frontend`
- Результат: структура созданных файлов проверена.
- `git status --short`
- Результат: не выполнено, текущая папка не распознана как git-репозиторий.

#### Следующие шаги

- Установить Node.js/npm.
- Выполнить `npm install`.
- Выполнить `npm run typecheck` и `npm test`.
- Запустить `npm run start` и пройти happy path вручную.
- При наличии ошибок компиляции или runtime завести отдельные `BUG-*.md`.

## Итоговое решение

Не заполняется до успешного запуска typecheck/tests или явного решения принять реализацию без локальной проверки.

## Оставшиеся риски

- Не подтверждена компиляция TypeScript и Expo Router из-за отсутствия Node.js/npm.
- Не проверен runtime на устройстве/эмуляторе.
- Local mock может отличаться от HTTP mock-backend в деталях поведения, требуется интеграционная проверка.

### 2026-07-06 01:08 — багфикс frontend storage

#### Промпт пользователя

> Исправь баг web-запуска: при открытии приложения в браузере падает ошибка _ExpoSecureStore.default.getValueWithKeyAsync is not a function.
>
> Причина: expo-secure-store нельзя использовать напрямую на web.
>
> Сделай платформенную обёртку для хранения сессии:
> - на native используй expo-secure-store;
> - на web используй window.localStorage;
> - не вызывай SecureStore напрямую из sessionStore.ts;
> - обнови тесты, если нужно;

#### Краткие действия Codex

- Добавил платформенную обёртку `tokenStorage`.
- Убрал прямое использование `SecureStore` из `sessionStore.ts`.
- Проверил typecheck и unit tests.

#### Изменённые артефакты

- `frontend/src/features/auth/tokenStorage.ts` — создан адаптер хранения токена.
- `frontend/src/features/auth/sessionStore.ts` — обновлён для работы через адаптер.
- `logs/BUG-20260706-expo-secure-store-web-runtime.md` — баг переведён в `fixed`.

#### Связь с ТЗ

- `TZ_application/07-technology-stack.md` — SecureStore сохранён для native.
- `frontend/IMPLEMENTATION_CHECKLIST.md` — сценарий хранения access token сделан platform-safe для web.

#### Тесты и проверки

- `npm.cmd run typecheck`
- Результат: успешно.
- `npm.cmd test`
- Результат: успешно, 5 тестов пройдены.

#### Следующие шаги

- Проверить старт приложения в браузере и на native runtime.
