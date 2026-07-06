# Таблица поверхностных тестов MVP

## Источники

- `api/openapi.yaml` — контракт endpoint-ов, схем, статусов и ошибок.
- `TZ_application/06-acceptance-checklist.md` — критерии приемки.
- `TZ_application/08-feature-list.md` — фичи MVP.
- `design/SCR-001...SCR-016.md` и `design/SEQ-booking-creation.md` — экранные сценарии.
- `frontend/app/**` — Expo Router экраны клиентского приложения.
- `frontend/src/api/client.ts` и `frontend/src/api/types.ts` — клиентский API-слой.
- `mock_backend/internal/http/router.go` и `mock_backend/internal/service/service.go` — маршруты и бизнес-валидации mock-backend.
- `frontend/tests/*.test.ts` и `mock_backend/internal/domain/domain_test.go` — текущие автотесты.
- `logs/BUG-*.md` — известные найденные и исправленные дефекты.

## Правила выполнения

- Тип набора: поверхностный smoke/regression.
- Цель: быстро проверить, что основные клиентские сценарии MVP не сломаны.
- Платформы: каждый P0 UI-сценарий проверять на Android и iOS. Backend/API проверки можно выполнять один раз, если они не зависят от платформы.
- Web-проверка допустима только как дополнительная, не как замена Android/iOS.
- Онлайн-оплата, админка, CRM, интерфейс шефа и production-интеграции не входят в скоуп.

## Таблица

| ID | Приоритет | Область | Источники | Платформы | Предусловия | Шаги | Ожидаемый результат | Риск/примечание |
|---|---|---|---|---|---|---|---|---|
| ST-001 | P0 | Запуск приложения | `frontend/package.json`, `frontend/app.json`, AC-G01 | Android, iOS | Установлены зависимости, доступен Expo/эмулятор | Запустить приложение через Expo на Android и iOS | Приложение открывается без crash, стартовый экран доступен | Отдельно проверить Android и iOS: успешный web-запуск не закрывает AC-G01 |
| ST-002 | P0 | Навигация | `frontend/app/_layout.tsx`, `frontend/app/**` | Android, iOS | Приложение запущено | Пройти по основным экранам: старт, вход, расписание, класс, бронь, аккаунт, legal | Нет отсутствующих маршрутов, header не ломает переходы, экран не зависает | Учитывать известный баг с project root/header из логов |
| ST-003 | P0 | Авторизация: телефон | SCR-001, `/auth/phone-code`, `RequestPhoneCode` | Android, iOS | Mock-backend доступен | Ввести валидный E.164 телефон, запросить код | API возвращает `202`, пользователь переходит к вводу кода | Проверить клавиатуру phone-pad отдельно на iOS/Android |
| ST-004 | P0 | Авторизация: невалидный телефон | AC-A02, `ValidatePhone`, `business-rules.test.ts` | Android, iOS | Экран входа открыт | Ввести телефон без `+`, попытаться запросить код | Запрос не создает успешную сессию, отображается понятная ошибка | Клиентская валидация не должна полагаться только на backend |
| ST-005 | P0 | Авторизация: код | SCR-002, `/auth/verify-code`, `VerifyCode` | Android, iOS | Код запрошен | Ввести demo-код | Создается/восстанавливается сессия, доступен защищенный сценарий | Проверить SecureStore на iOS/Android, web не является достаточной проверкой |
| ST-006 | P0 | Авторизация: неверный код | AC-A04, `invalid_code` | Android, iOS | Код запрошен | Ввести неверный код | Пользователь остается на экране кода, видит ошибку | Не должно создаваться локальное состояние успешного входа |
| ST-007 | P0 | Восстановление сессии | `sessionStore`, `/me`, BUG-20260706-session-restore-client | Android, iOS | Пользователь вошел, приложение закрыто | Перезапустить приложение | Сессия восстановлена через `/me`, клиентские данные соответствуют текущему token | Особо важно после исправления demo-token/current-client |
| ST-008 | P0 | Logout и персональные данные | BUG-20260706-stale-booking-marker-after-logout | Android, iOS | Пользователь вошел и имеет бронь | Выйти из аккаунта, открыть расписание | Персональная метка "вы записаны" не отображается без token | Проверка кэша React Query |
| ST-009 | P0 | Расписание по умолчанию | SCR-003, `/slots`, `Slots()` | Android, iOS | Backend содержит слоты | Открыть расписание без фильтра | Загружается период ближайших 7 дней, отображаются доступные слоты | Проверить `defaultRangeApplied` при API-осмотре |
| ST-010 | P1 | Empty state расписания | SCR-003, BUG-20260706-schedule-null-items-crash | Android, iOS | Выбран период без слотов | Открыть/применить пустой период | Показывается empty state, приложение не падает при `items: []` или некорректном `items: null` | Регрессия известного crash `Cannot read property 'length' of null` |
| ST-011 | P0 | Фильтр дат | SCR-004, FEAT-SCH-006, `/slots?from&to` | Android, iOS | Есть слоты в разных датах | Выбрать короткий и расширенный диапазон дат | Список обновляется по выбранному диапазону | Проверить сброс фильтра к 7 дням |
| ST-012 | P0 | Невалидный диапазон дат API | `/slots`, `parseDatePtr`, `to.Before(from)` | API | Доступен backend | Отправить `from` позже `to` | Возвращается `validation_error`, UI не ломается | Поверхностная API-проверка без привязки к платформе |
| ST-013 | P0 | Карточка класса | SCR-005, `/slots/{slotId}` | Android, iOS | Есть доступный слот | Открыть карточку класса | Видны программа, меню, шеф, рейтинг, цена, места, прокат, правило отмены | Если `dishImageUrl` есть, изображение не должно блокировать текст |
| ST-014 | P0 | Запрет брони недоступного слота | AC-S05, `canBookSlot`, `slot_cancelled_or_unavailable` | Android, iOS | Есть full/cancelled слот | Открыть слот без мест или отмененный студией | Кнопка бронирования недоступна или API отказ корректно показан | Повторная запись на cancelled slot запрещена |
| ST-015 | P0 | Создание одиночной брони | SCR-006, SCR-007, `/bookings` | Android, iOS | Пользователь авторизован, есть места | Выбрать 1 участника, без аллергий, свой инвентарь, offline payment | После `201` показан success screen, бронь появляется в аккаунте | Локально не создавать confirmed booking до успеха API |
| ST-016 | P0 | Групповая бронь | SCR-006, AC-B02, `ValidateParticipants` | Android, iOS | Доступно минимум 2 места | Добавить 2 участников, разные опции инвентаря | Бронь создается, `participantCount` и участники корректны | Проверить на iOS/Android ввод нескольких полей |
| ST-017 | P0 | Аллергии | AC-B04, AC-B05, `ValidateParticipants` | Android, iOS | Экран участников открыт | Выбрать "есть аллергия" без комментария | Продолжение заблокировано, показана ошибка | Обязательный риск MVP: сбор аллергий до визита |
| ST-018 | P0 | Лимит мест | AC-B06, `no_seats`, `participant_limit_exceeded` | Android, iOS | У слота ограниченное число мест | Попытаться добавить участников сверх `availableSeats` | UI или API блокирует действие, места не резервируются локально | Закрывает риск двойных/лишних бронирований |
| ST-019 | P0 | Расчет суммы | AC-B07, `calculateBookingTotal`, `CalculateTotal` | Android, iOS, API | Есть цена места и проката | Сравнить итог при `seatPrice * count + rentalPrice * rentalCount` | Итог совпадает на UI и backend, валюта RUB | Важна синхронизация frontend/backend расчета |
| ST-020 | P0 | Online payment placeholder | SCR-008, FEAT-PAY-002 | Android, iOS | Экран подтверждения открыт | Выбрать онлайн-оплату | Показывается заглушка, платеж не проводится, бронь не создается без offline fallback | Онлайн-эквайринг вне MVP |
| ST-021 | P0 | API conflict: no seats | `/bookings`, `no_seats`, AC-E01 | Android, iOS, API | Слот заполнен другим действием | Подтвердить бронь со stale availability | Показана нехватка мест, слот обновлен, локальная бронь не создана | Поверхностно проверить через seed/ручное изменение состояния |
| ST-022 | P0 | API conflict: stale total | `/bookings`, `validation_conflict`, AC-E02 | API, Android/iOS при возможности | Подготовлен payload с неверной суммой | Отправить бронь с неправильным `expectedTotalAmount` | Backend отказывает, UI показывает необходимость перепроверить данные | Можно проверить API-клиентом без UI |
| ST-023 | P0 | Мои брони | SCR-010, `/bookings/my`, AC-M01 | Android, iOS | Есть брони текущего клиента | Открыть аккаунт | Отображаются только брони текущего клиента | Связано с исправлением demo-token-current-client |
| ST-024 | P1 | Визуальные статусы броней | SCR-010, `BookingStatus`, AC-M02 | Android, iOS | Есть upcoming/completed/cancelled брони | Открыть список броней | Статусы визуально различимы и не смешиваются | Проверить cancelled_by_client и cancelled_by_studio |
| ST-025 | P0 | Детали брони | SCR-011, `/bookings/{bookingId}` | Android, iOS | Есть бронь | Открыть детали | Видны статус, класс, участники, оплата, сумма, правило отмены | Не показывать действия для неактивной брони |
| ST-026 | P0 | Добавление участников | SCR-012, `/bookings/{bookingId}/participants` | Android, iOS | Есть редактируемая бронь, есть места | Добавить участника | После `200` бронь и слот обновлены | Изменение применяется только после API |
| ST-027 | P0 | Отмена брони до 24 часов | SCR-013, `/bookings/{bookingId}/cancel`, `CanCancel` | Android, iOS, API | До класса больше 24 часов | Отменить бронь | Статус обновлен, места освобождены после API | Связано с BUG-20260706-cancelled-booking-seat-release |
| ST-028 | P0 | Запрет отмены менее чем за 24 часа | AC-C03, `cancellation_window_closed` | Android, iOS, API | До класса меньше 24 часов | Попытаться отменить | Отмена заблокирована, показано правило 24 часов | Денежный возврат только заглушка |
| ST-029 | P0 | Отмена отдельного участника | SCR-013, `/participants/{participantId}/cancel` | Android, iOS, API | Есть групповая бронь | Отменить одного участника | Участник получает статус отмены, сумма/места обновлены после API | Проверить, что не отменяется вся бронь случайно |
| ST-030 | P0 | Отмена класса студией | SCR-014, `cancelled_by_studio` | Android, iOS | Есть бронь на отмененный студией слот | Открыть аккаунт и детали | Показан статус отмены студией и причина/нейтральный текст | Админский интерфейс отмены вне MVP; проверять через seed/API состояние |
| ST-031 | P1 | Уведомления | SCR-014, `/notifications/my` | Android, iOS | Есть seed notifications | Открыть уведомления | Видны class_reminder и studio_cancelled_class, если есть | Реальный push/SMS вне production-скоупа, в MVP это симуляция |
| ST-032 | P0 | Оценка шефа | SCR-015, `/chef-reviews`, `CreateReview` | Android, iOS | Есть completed booking с `reviewAvailable=true` | Поставить оценку 1-5 | Отзыв создается, повторная отправка блокируется | Проверить запрет без рейтинга |
| ST-033 | P0 | Legal | SCR-016, `/legal/terms` | Android, iOS | Backend доступен | Открыть условия | Видны правило 24 часов и политика данных: телефон, имена, аллергии | Legal доступен из входа/карточки/подтверждения, если есть ссылки |
| ST-034 | P0 | Unauthorized | `ApiError`, `onUnauthorized`, `401` | Android, iOS, API | Token отсутствует/протух | Открыть защищенный экран или дернуть protected endpoint | Пользователь переводится к авторизации, персональные данные не показаны | Проверить чистку session/cache |
| ST-035 | P1 | Temporary unavailable | `temporary_unavailable`, AC-E04 | Android, iOS, API | Backend временно недоступен или замокан 503 | Выполнить действие с API | Показана понятная ошибка и возможность повторить | Не создавать локальную бронь/изменение при 503 |
| ST-036 | P0 | Backend health | `/health`, `healthcheck` | API | Запущены backend и БД | Выполнить `GET /health` | `200 {"status":"ok"}` при доступной БД, 503 при недоступной | Быстрая проверка окружения перед UI smoke |
| ST-037 | P0 | Текущие frontend автотесты | `frontend/tests/*.test.ts` | Локально | Node/npm доступны | Запустить `npm.cmd run typecheck` и `npm.cmd test` в `frontend` | Typecheck и Vitest проходят | Сейчас покрывают бизнес-правила и null-list regression |
| ST-038 | P1 | Текущие backend unit-тесты | `mock_backend/internal/domain/domain_test.go` | Локально | Go доступен в PATH | Запустить `go test ./...` в `mock_backend` | Go-тесты проходят | По журналам ранее Go не был доступен в PATH |
| ST-039 | P0 | Android package/runtime risk | BUG-20260706-android-16kb-page-size, Expo/React Native | Android | Android emulator/device доступен | Собрать/запустить Android вариант | Нет платформенного crash при старте, приложение открывает основные экраны | Проверка только на iOS не закрывает Android runtime-риск |
| ST-040 | P0 | iOS runtime risk | Expo/React Native, SecureStore, Safe Area | iOS | iOS simulator/device доступен | Собрать/запустить iOS вариант, пройти auth -> schedule | Нет iOS-специфичных проблем навигации, хранения token и клавиатуры | Проверка только на Android не закрывает iOS runtime-риск |

