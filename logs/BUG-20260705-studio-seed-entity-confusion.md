# BUG-20260705-studio-seed-entity-confusion — Смешение StudioInfo и ER-сущности Studio

## Статус

`verified`

## Где найден

- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — этап 3, seed-данные, пункт "Создать одну студию".

## Связь с ТЗ и требованиями

- `design/ER-model-and-entity-models.md` — адрес студии не выделяется в отдельную ER-сущность.
- `TZ_application/05-data-and-access.md` — `StaticStudioInfo` указан как read-only API/конфигурация и вне ER-модели.
- `api/openapi.yaml` — `GET /studio-info` возвращает `StudioInfo`.
- `TZ_application/01-main-specification.md` — требуется отображать название и адрес единственной студии в баннере.

## Описание

В чеклисте реализации mock-backend seed-данных используется формулировка "Создать одну студию". Она может быть ошибочно прочитана как требование создать ER-сущность или таблицу `studios`, хотя текущая ER-модель такой сущности не содержит.

## Шаги воспроизведения

1. Открыть `mock_backend/IMPLEMENTATION_CHECKLIST.md`.
2. Перейти к этапу 3 "Seed-данные".
3. Найти пункт "Создать одну студию".
4. Сверить с `design/ER-model-and-entity-models.md`, где сказано, что адрес студии не выделяется в отдельную ER-сущность.

## Фактический результат

Формулировка в чеклисте создаёт впечатление, что для seed-данных нужна сущность/таблица студии.

## Ожидаемый результат

Чеклист должен говорить о seed-данных для `StudioInfo` / `/studio-info` как read-only конфигурации или статической записи API, не как о доменной ER-сущности.

## Причина

Смешались два уровня модели:

- API/UI-уровень: `StudioInfo`, `GET /studio-info`, название и адрес единственной студии для баннера.
- ER-уровень: отдельной сущности `Studio` нет; адрес студии явно не выделяется как ER-сущность.

## Причинно-следственная связь

1. В ранних требованиях адрес студии был зафиксирован как отображаемый элемент баннера.
2. Это требование было перенесено в бизнес-требования, функциональные требования, экранные документы и чек-лист приёмки как обязанность системы показывать адрес.
3. При детализации API это превратилось в endpoint `GET /studio-info` и схему `StudioInfo`.
4. При описании данных это превратилось в `StaticStudioInfo`, хотя документ одновременно помечает его как конфигурацию вне ER-модели.
5. При планировании mock-backend наличие `StudioInfo` и `/studio-info` было ошибочно прочитано как необходимость seed-данных для "одной студии".
6. В чеклисте появился пункт "Создать одну студию", который может привести к ошибочной таблице `studios`, endpoint-у, seed-записи и тестам.
7. Уточнение пользователя меняет трактовку: адрес студии всегда один, не меняется и является задачей UI/UX-дизайна, а не программной реализации.
8. Следствие: любые упоминания адреса студии как API, БД, seed, mock-backend, acceptance или feature-требования должны быть удалены или переформулированы как внепрограммный UI/UX-контент.

## Полный перечень затронутых документов

### Критично влияет на имплементацию

- `api/openapi.yaml:99` — endpoint `/studio-info`.
- `api/openapi.yaml:103` — `operationId: getStudioInfo`.
- `api/openapi.yaml:111` — ответ через схему `StudioInfo`.
- `api/openapi.yaml:568` — схема `StudioInfo`.
- `api/openapi.yaml:580` — поле `mapUrl`.
- `TZ_application/04-api-contract-map.md:12` — endpoint "Информация о студии".
- `TZ_application/03-business-logic.md:35` — `GET /studio-info` указан в API загрузки расписания.
- `TZ_application/03-business-logic.md:41` — флоу загрузки расписания вызывает `GET /studio-info`.
- `mock_backend/IMPLEMENTATION_CHECKLIST.md:160` — пункт "Создать одну студию".
- `mock_backend/IMPLEMENTATION_CHECKLIST.md:213` — endpoint `GET /studio-info`.

### Влияет на требования и приёмку

- `TZ_application/01-main-specification.md:40` — отображение названия и адреса единственной студии в MVP.
- `TZ_application/01-main-specification.md:75` — приложение запрашивает `GET /studio-info`.
- `TZ_application/01-main-specification.md:167` — FR-044 "Адрес студии в баннере".
- `TZ_application/01-main-specification.md:212` — UI-правило про название и адрес студии.
- `TZ_application/02-screen-specification.md:102` — API `GET /studio-info` на экране расписания.
- `TZ_application/02-screen-specification.md:107` — баннер студии с названием и адресом.
- `TZ_application/02-screen-specification.md:134` — адрес студии виден на баннере.
- `TZ_application/02-screen-specification.md:347` — адрес студии в экране успешной записи.
- `TZ_application/06-acceptance-checklist.md:32` — AC-S06 про адрес в баннере.
- `TZ_application/08-feature-list.md:22` — FEAT-SCH-002 про баннер единственной студии с названием и адресом.

### Влияет на модель данных

- `TZ_application/05-data-and-access.md:27` — `StaticStudioInfo` как read-only API/конфигурация.
- `TZ_application/05-data-and-access.md:61` — `StaticStudioInfo` в матрице доступа.
- `design/entity-access-matrix.md:44` — `StaticStudioInfo` как статическая конфигурация.
- `design/ER-model-and-entity-models.md:120` — корректная защитная формулировка: адрес студии не является ER-сущностью.

### Влияет на экранную документацию

- `screen_registry.md:30` — адрес единственной студии на баннере.
- `screen_registry.md:58` — расписание содержит баннер студии с названием и адресом.
- `screen_registry.md:74` — карточка класса содержит баннер студии с адресом.
- `screen_registry.md:104` — успешная запись содержит адрес студии.
- `screen_registry.md:118` — детали брони содержат адрес студии.
- `screen_registry.md:142` — отмена класса студией содержит адрес студии.
- `design/SCR-003-class-schedule.md:22` — баннер студии с названием и адресом.
- `design/SCR-005-class-details.md:22` — баннер студии с адресом.
- `design/SCR-009-booking-success.md:25` — адрес студии.
- `design/SCR-014-studio-cancelled-class.md:25` — адрес студии как контекст.

### Корневые требования, из которых пошло искажение

- `business_requirements.md:17` — BR-013 про адрес единственной студии.
- `functional_requirements.md:49` — FR-044 про адрес единственной студии.
- `requirements.md:35` — отображение адреса единственной студии.
- `requirements.md:272` — адрес не должен передаваться как поле API расписания или карточки класса, но всё ещё описан как требование отображения.
- `requirements.md:303` — адрес студии отображается на баннере.
- `domainanalysis.md:69` — адрес единственной студии в баннере.
- `domainanalysis.md:91` — адрес не передаётся как поле API расписания, но должен быть показан клиенту.
- `domainanalysis.md:115` — адрес является статичной информацией клиентского интерфейса.
- `customeranswers.md:137` — ответ заказчика про адрес в баннере.
- `customeranswers.md:139` — зафиксированное решение про адрес в баннере.

### Не является проблемой

- Упоминания `cancelled_by_studio`, "отмена студией", "оплата в студии", "студия" как бизнес-контекст не относятся к багу адреса и не должны удаляться автоматически.
- Статусы `cancelled_by_studio` в слотах, бронях и участниках остаются частью доменной модели.
- Требования по push/SMS при отмене класса студией остаются в скоупе.

## Исправление

Выполнена жёсткая точечная правка: адрес единственной студии оставлен только как статический UI/UX-контент макета. Из программного контура удалены `/studio-info`, `StudioInfo`, `StaticStudioInfo`, seed "одной студии" и acceptance/API-требования, которые могли привести к созданию сущности или таблицы студии.

## Изменённые артефакты

- `logs/BUG-20260705-studio-seed-entity-confusion.md` — создан баг-лог расследования.
- `logs/BUG-20260705-studio-seed-entity-confusion.md` — дополнен полным перечнем затронутых документов и причинно-следственной связью.
- `api/openapi.yaml` — удалены endpoint `/studio-info`, схема `StudioInfo` и tag `Studio`.
- `TZ_application/01-main-specification.md` — адрес студии переписан как статический UI/UX-контент, не API/БД/seed.
- `TZ_application/02-screen-specification.md` — удалён `GET /studio-info` из SCR-003, адрес переведён в статический макетный текст.
- `TZ_application/03-business-logic.md` — загрузка расписания больше не вызывает `GET /studio-info`.
- `TZ_application/04-api-contract-map.md` — удалена строка endpoint-а "Информация о студии"; добавлено ограничение по адресу вне API.
- `TZ_application/05-data-and-access.md` — удалён `StaticStudioInfo` из сущностей и матрицы доступа.
- `TZ_application/06-acceptance-checklist.md` — acceptance по баннеру больше не проверяет API/БД/seed/mock-backend.
- `TZ_application/08-feature-list.md` — фича баннера переведена в статический UI/UX-контент.
- `design/entity-access-matrix.md` — удалён `StaticStudioInfo` из матрицы доступа.
- `design/ER-model-and-entity-models.md` — усилено ограничение: адрес не входит в API/БД/seed-модель.
- `design/SCR-003-class-schedule.md` — баннер адреса описан как статический UI/UX-текст.
- `design/SCR-005-class-details.md` — баннер адреса описан как статический UI/UX-текст.
- `design/SCR-009-booking-success.md` — адрес описан как статический UI/UX-текст при наличии в макете.
- `design/SCR-014-studio-cancelled-class.md` — адрес описан как статический UI/UX-контекст при наличии в макете.
- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — удалены seed "одной студии" и endpoint `/studio-info`; добавлен прямой запрет на `studios`/`StudioInfo`.
- `business_requirements.md` — BR-013 переписан без программного требования.
- `functional_requirements.md` — FR-044 переписан без API/БД/seed.
- `requirements.md` — требование адреса ограничено UI/UX-макетом.
- `domainanalysis.md` — уточнено, что адрес не входит в API/БД/seed.
- `screen_registry.md` — адрес переведён в статический UI/UX-текст.
- `customeranswers.md` — зафиксированное решение уточнено: адрес не является программным требованием.

## Журнал работы

### 2026-07-05 22:22 — анализ

#### Промпт пользователя

> внимание: обнаружил баг. при осмотре 3 этапа в сид-данных вылезло "создать одну студию". в ЕР-схеме подобной сущности нет. проверь все текущие документы и определи, почему появилось упоминание такой сущности.

#### Краткие действия Codex

- Проверил упоминания студии, `StaticStudioInfo`, `StudioInfo`, `/studio-info` и ER-модели по проекту.
- Определил источник ошибки: смешение API/config-объекта `StudioInfo` с отсутствующей ER-сущностью `Studio`.

#### Тесты и проверки

- `rg -n "(?i)(студи|studio|StaticStudioInfo|studio-info|одну студию|единственной студии|адрес)" .`
- Проверены фрагменты `design/ER-model-and-entity-models.md`, `TZ_application/05-data-and-access.md`, `api/openapi.yaml`, `mock_backend/IMPLEMENTATION_CHECKLIST.md`.

### 2026-07-05 22:28 — анализ

#### Промпт пользователя

> эта часть технического задания была неправильно понята при обработке. адрес студии всегда один, и других студий не существует. задача ТЗ отображать адрес не является необходимой к программной реализации, так как адрес не может изменяться. это задача дизайнера UI\UX и программной реализации касаться НЕ должна ни при каких обстоятельствах. проведи анализ и найди все упоминания студии и ее адреса, которые могут повлиять на имплементацию.

#### Краткие действия Codex

- Проверил документы проекта на упоминания адреса студии, `StudioInfo`, `StaticStudioInfo`, `/studio-info` и требований к баннеру.
- Отделил нейтральные доменные упоминания "студии" от упоминаний, которые могут повлиять на реализацию.
- Выявил документы, где адрес студии может быть ошибочно воспринят как API, БД, seed или acceptance-требование.
- Добавил полный перечень затронутых документов и причинно-следственную связь.
- Добавил полный перечень затронутых документов и причинно-следственную связь.

#### Тесты и проверки

- `rg -n "(GET /studio-info|/studio-info|StudioInfo|StaticStudioInfo|адрес студии|Адрес студии|баннер студии|адрес единственной студии|название и адрес|Создать одну студию|mapUrl)" TZ_application design api mock_backend logs business_requirements.md functional_requirements.md requirements.md screen_registry.md domainanalysis.md customeranswers.md`
- `rg -n "(студии с адресом|адрес студии|адрес единственной студии|название и адрес|StudioInfo|StaticStudioInfo|studio-info|Создать одну студию)" mock_backend/IMPLEMENTATION_CHECKLIST.md TZ_application/01-main-specification.md TZ_application/02-screen-specification.md TZ_application/03-business-logic.md TZ_application/04-api-contract-map.md TZ_application/05-data-and-access.md TZ_application/06-acceptance-checklist.md TZ_application/08-feature-list.md design/ER-model-and-entity-models.md design/entity-access-matrix.md api/openapi.yaml`

### 2026-07-05 22:43 — багфикс

#### Промпт пользователя

> необходимо произвести жесткую правку. так как проблема возникла в результате расхождений в чтении начальных предложений заказчика, разрешаю в порядке исключения произвести точечные правки во всех упомянутых в багрепорте файлах с целью уточнения требования: наличие адреса на баннере является ИСКЛЮЧИТЕЛЬНО ui\ux-задачей. также поправь логику в местах, где это необходимо. перепроверь чеклист имплементации мок-бэкенда с целью исправить проблему, указанную в багрепорте.

#### Краткие действия Codex

- Удалил `/studio-info`, `StudioInfo` и `StaticStudioInfo` из программного контура.
- Переписал требования к адресу студии как исключительно статический UI/UX-контент.
- Исправил чеклист mock-backend: запретил `studios`, `StudioInfo`, `/studio-info` и seed одной студии.
- Обновил баг-лог и подготовил проверку поиском.

#### Тесты и проверки

- `rg -n "(GET /studio-info|/studio-info|StudioInfo|StaticStudioInfo|mapUrl|Создать одну студию)" ...`
- Результат: программные упоминания удалены, остались только запреты в чеклисте mock-backend.

## Проверка после исправления

- `rg -n "(GET /studio-info|/studio-info|StudioInfo|StaticStudioInfo|mapUrl|Создать одну студию)" api TZ_application design mock_backend business_requirements.md functional_requirements.md requirements.md screen_registry.md domainanalysis.md customeranswers.md`
- Результат: программные упоминания удалены; `StudioInfo`, `/studio-info` и `studios` остались только как запреты в `mock_backend/IMPLEMENTATION_CHECKLIST.md`.
- `rg -n "(адрес студии|Адрес студии|адрес единственной студии|название и адрес|баннер студии|Баннер студии)" TZ_application design mock_backend business_requirements.md functional_requirements.md requirements.md screen_registry.md domainanalysis.md customeranswers.md`
- Результат: оставшиеся упоминания адреса сформулированы как статический UI/UX-контент или исторический ответ заказчика с уточнённым зафиксированным решением.

## Оставшиеся риски

- Исторический ответ заказчика в `customeranswers.md` сохранён дословно как исходный ответ, но зафиксированное решение ниже уточняет актуальную трактовку.
- В экранных документах адрес всё ещё может быть видимым текстом макета; при реализации нельзя делать для него источник данных.
