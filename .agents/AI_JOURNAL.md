## 2026-07-05 21:40 — анализ

### Промпт пользователя

> проведи онбординг на текущий проект на основе ТЗ

### Что сделал Codex

- Изучил структуру проекта и ключевые документы ТЗ в `TZ_application/`.
- Сверил состав MVP, бизнес-логики, фича-лист, технологический стек и карту API.
- Подготовил краткий онбординг по текущему состоянию проекта.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — создан обязательный общий журнал взаимодействия с ИИ и добавлена запись об анализе проекта.

### Принятые решения

- Отдельный задачный лог в `logs/` не создавался, потому что содержательные артефакты проекта не изменялись; создан только обязательный общий журнал.

### Тесты

- не запускались
- Проверка не требовалась: выполнялся аналитический онбординг без изменения кода и ТЗ.

### Следующие шаги

- При переходе к реализации сверить текущую кодовую базу с `TZ_application/07-technology-stack.md`, `TZ_application/08-feature-list.md` и `api/openapi.yaml`.

## 2026-07-05 21:42 — анализ

### Промпт пользователя

> спасибо, выдели доменные сущности в проекте

### Что сделал Codex

- Изучил доменную модель, матрицу доступа, данные и OpenAPI-схемы проекта.
- Выделил основные доменные сущности, value objects, локальные черновики и внешних участников домена.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — добавлена запись об анализе доменных сущностей.

### Принятые решения

- Отдельный лог в `logs/` не создавался, потому что содержательные артефакты проекта не изменялись.
- `BookingDraft` отнесён к локальному состоянию, а не к подтверждённой бизнес-сущности.

### Тесты

- не запускались
- Проверка не требовалась: выполнялся аналитический разбор без изменения кода и ТЗ.

### Следующие шаги

- При реализации использовать `api/openapi.yaml`, `design/ER-model-and-entity-models.md` и `TZ_application/05-data-and-access.md` как источники для типов, моков и правил доступа.

## 2026-07-05 21:44 — анализ

### Промпт пользователя

> выбрана ли инструменты для golang приложения и cmp, а также архитектура?

### Что сделал Codex

- Проверил ТЗ и проектные документы на упоминания Go/Golang, CMP и архитектурных решений.
- Сверил утверждённый технологический стек и границы MVP.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — добавлена запись о проверке выбранного стека и архитектуры.

### Принятые решения

- Подтверждено, что Go/Golang и CMP не выбраны в текущем ТЗ.
- Архитектура выбрана только на уровне клиентского Expo/React Native приложения: модульная структура по фичам без сложных архитектурных паттернов.

### Тесты

- не запускались
- Проверка не требовалась: выполнялся анализ документации.

### Следующие шаги

- Если потребуется переход на Go или CMP, сначала зафиксировать изменение скоупа и обновить `TZ_application/07-technology-stack.md`.

## 2026-07-05 21:55 — анализ

### Промпт пользователя

> хорошо. будь любезен, проверь для postgresql миграцию на инициализацию бд и соответствие ограничений из ТЗ

### Что сделал Codex

- Проверил файлы проекта на наличие PostgreSQL-миграций, SQL-скриптов и схем инициализации БД.
- Сопоставил найденную структуру проекта с ТЗ, где текущий backend считается внешним black-box источником истины.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — добавлена запись о проверке наличия миграции PostgreSQL.

### Принятые решения

- Отдельный лог в `logs/` не создавался, потому что содержательные артефакты проекта не изменялись.
- Полная проверка миграции невозможна без файла миграции: в текущем репозитории SQL/миграции PostgreSQL не найдены.

### Тесты

- `rg --files`
- `rg -n "(?i)(postgres|postgresql|migration|migrate|CREATE TABLE|ALTER TABLE|CHECK|FOREIGN KEY|booking|participant|allergy|payment|slot|chef|review)" .`
- Результат: миграции PostgreSQL или SQL-скрипты инициализации БД в проекте не обнаружены.

### Следующие шаги

- Если миграция находится вне текущего репозитория, передать путь или файл для проверки ограничений по ТЗ.

## 2026-07-05 22:09 — анализ

### Промпт пользователя

> согласно нашим входным данным оцени сложность создания мокап-бэкенда, предложи стак и архитектуру. ориентируемся на отсутствие полноценных платежей и админки. требования к безопасности также не выдвигаются.

### Что сделал Codex

- Оценил сложность создания mock-backend по текущему ТЗ и OpenAPI-контракту.
- Подготовил рекомендацию по стеку и архитектуре с учётом отсутствия реальных платежей, админки и production-требований безопасности.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — добавлена запись об архитектурной оценке mock-backend.

### Принятые решения

- Рекомендовать mock-backend как демонстрационный компонент, а не production-бэкенд.
- Предпочтительный стек для учебного MVP: Go + PostgreSQL + Docker Compose либо более быстрый вариант Node/Nest/Fastify; итоговая рекомендация зависит от цели демонстрации.

### Тесты

- не запускались
- Проверка не требовалась: выполнялась архитектурная оценка без изменения кода.

### Следующие шаги

- При принятии решения о mock-backend обновить `TZ_application/07-technology-stack.md` и завести задачный лог в `logs/`.

## 2026-07-05 22:12 — документация

### Промпт пользователя

> одобряю. в решаемые задачи также будет входить создание бд и заполнение ее мокап-данными.

### Что сделал Codex

- Зафиксировал в ТЗ, что в дальнейший технический скоуп входит демонстрационный mock-backend.
- Добавил PostgreSQL, миграции, seed-данные и Docker Compose в технологический стек и фича-лист.
- Создал задачный лог по уточнению скоупа mock-backend и БД.

### Изменённые файлы

- `TZ_application/07-technology-stack.md` — добавлены Go + chi, PostgreSQL, golang-migrate, Docker Compose и структура `mock-backend/`.
- `TZ_application/08-feature-list.md` — добавлены фичи FEAT-MOCK-009...FEAT-MOCK-012.
- `logs/TASK-20260705-mock-backend-db-scope.md` — создан лог задачи.
- `.agents/AI_JOURNAL.md` — добавлена запись о выполненной документационной правке.

### Принятые решения

- Mock-backend зафиксирован как демонстрационный компонент для проверки MVP и передачи проекта, а не как production-бэкенд.
- Создание БД и заполнение mock-данными включены в решаемые технические задачи.

### Тесты

- `rg -n "mock-backend|PostgreSQL|Production-сервер|Production-бэкенд|golang-migrate|Docker Compose|FEAT-MOCK-009|FEAT-MOCK-010|FEAT-MOCK-011|FEAT-MOCK-012" TZ_application logs`
- Результат: новые формулировки найдены в `TZ_application/07-technology-stack.md`, `TZ_application/08-feature-list.md` и задачном логе.
- `git diff -- TZ_application/07-technology-stack.md TZ_application/08-feature-list.md logs/TASK-20260705-mock-backend-db-scope.md`
- Результат: команда не выполнена, текущая папка не распознана как git-репозиторий.

### Следующие шаги

- Спроектировать PostgreSQL-схему и миграцию инициализации.
- Подготовить seed-данные для демонстрационных сценариев.
- Создать структуру `mock-backend/` и Docker Compose.

## 2026-07-05 22:17 — документация

### Промпт пользователя

> спроектируй пошаговый план-чеклист реализации мокап-бэкенда. обрати внимания на ограничения, имеющиеся в ТЗ. полученный артефакт сохрани в новой папке, mock_backend.

### Что сделал Codex

- Создал папку `mock_backend`.
- Подготовил пошаговый план-чеклист реализации mock-backend с учётом ограничений ТЗ.
- Обновил задачный лог по mock-backend и БД.

### Изменённые файлы

- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — создан артефакт с планом реализации.
- `logs/TASK-20260705-mock-backend-db-scope.md` — обновлён задачный лог.
- `.agents/AI_JOURNAL.md` — добавлена запись о создании плана.

### Принятые решения

- План реализации оформлен в новой папке `mock_backend`, как запросил пользователь.
- Чеклист разделён на этапы: основа сервиса, PostgreSQL-схема, seed-данные, endpoint-ы, ограничения, Docker Compose, тесты и критерии готовности.

### Тесты

- Проверка через `rg` по ключевым ограничениям в `mock_backend/IMPLEMENTATION_CHECKLIST.md`.
- Результат: ключевые ограничения и этапы реализации найдены в созданном артефакте.

### Следующие шаги

- При следующем шаге перейти к проектированию SQL-миграции и seed-данных.

## 2026-07-05 22:22 — багфикс

### Промпт пользователя

> внимание: обнаружил баг. при осмотре 3 этапа в сид-данных вылезло "создать одну студию". в ЕР-схеме подобной сущности нет. проверь все текущие документы и определи, почему появилось упоминание такой сущности.

### Что сделал Codex

- Проверил документы проекта на упоминания студии, `StudioInfo`, `StaticStudioInfo`, `/studio-info` и ER-модели.
- Определил, что формулировка "Создать одну студию" появилась из смешения API/config-объекта `StudioInfo` с отсутствующей ER-сущностью `Studio`.
- Создал баг-лог расследования.

### Изменённые файлы

- `logs/BUG-20260705-studio-seed-entity-confusion.md` — создан баг-лог.
- `.agents/AI_JOURNAL.md` — добавлена запись о расследовании бага.

### Принятые решения

- Исправление чеклиста не выполнялось в рамках текущего запроса: пользователь попросил определить причину появления упоминания.

### Тесты

- `rg -n "(?i)(студи|studio|StaticStudioInfo|studio-info|одну студию|единственной студии|адрес)" .`
- Результат: найдена цепочка источников `StudioInfo`/`StaticStudioInfo` и явное указание ER-модели, что отдельной ER-сущности студии нет.

### Следующие шаги

- Исправить `mock_backend/IMPLEMENTATION_CHECKLIST.md`: заменить "Создать одну студию" на seed/config для `StudioInfo` без создания ER-сущности `Studio`.

## 2026-07-05 22:28 — анализ

### Промпт пользователя

> эта часть технического задания была неправильно понята при обработке. адрес студии всегда один, и других студий не существует. задача ТЗ отображать адрес не является необходимой к программной реализации, так как адрес не может изменяться. это задача дизайнера UI\UX и программной реализации касаться НЕ должна ни при каких обстоятельствах. проведи анализ и найди все упоминания студии и ее адреса, которые могут повлиять на имплементацию.

### Что сделал Codex

- Проверил документы проекта на упоминания адреса студии, `StudioInfo`, `StaticStudioInfo`, `/studio-info`, баннера и seed-данных.
- Определил перечень документов, где адрес студии может ошибочно повлиять на программную реализацию.
- Обновил баг-лог по смешению `StudioInfo` и ER/implementation-сущности.

### Изменённые файлы

- `logs/BUG-20260705-studio-seed-entity-confusion.md` — дополнен анализом расширенного риска.
- `.agents/AI_JOURNAL.md` — добавлена запись об анализе.

### Принятые решения

- Уточнение пользователя трактуется как изменение понимания требования: адрес студии не должен быть API, БД, seed, mock-backend или acceptance-обязательством для программной реализации.

### Тесты

- `rg -n "(GET /studio-info|/studio-info|StudioInfo|StaticStudioInfo|адрес студии|Адрес студии|баннер студии|адрес единственной студии|название и адрес|Создать одну студию|mapUrl)" ...`
- `rg -n "(студии с адресом|адрес студии|адрес единственной студии|название и адрес|StudioInfo|StaticStudioInfo|studio-info|Создать одну студию)" ...`
- Результат: найдены документы, которые могут повлиять на реализацию через API, БД, seed-данные, фичи и acceptance.

### Следующие шаги

- По отдельной команде исправить документы: убрать адрес студии из программных требований, API/mock-backend/БД/seed и оставить только как UI/UX-контент вне реализации.

## 2026-07-05 22:32 — документация

### Промпт пользователя

> будь любезен, добавь весь список файлов и детальную классификацию в баглог, а также проверь, указана ли там причинно-следственная связь

### Что сделал Codex

- Проверил текущий баг-лог.
- Добавил разделы "Причинно-следственная связь" и "Полный перечень затронутых документов".
- Классифицировал найденные упоминания по влиянию на имплементацию, требования, модель данных, screen-документацию и корневые требования.

### Изменённые файлы

- `logs/BUG-20260705-studio-seed-entity-confusion.md` — дополнен полным анализом.
- `.agents/AI_JOURNAL.md` — добавлена запись о дополнении баг-лога.

### Принятые решения

- Причинно-следственная связь должна быть явным отдельным разделом, а не только кратким описанием причины.

### Тесты

- Проверка через `rg` по разделам и ключевым файлам баг-лога.
- Результат: проверка будет выполнена после правки.

### Следующие шаги

- Проверить наличие новых разделов в баг-логе.

## 2026-07-05 22:34 — анализ

### Промпт пользователя

> рассмотри баг-репорт [BUG-20260705-studio-seed-entity-confusion.md](C:/Users/acard/Desktop/учеба/2 сем/практика производственная/proj/logs/BUG-20260705-studio-seed-entity-confusion.md) и предложи пути решения проблемы

### Что сделал Codex

- Рассмотрел баг-репорт о смешении `StudioInfo` и отсутствующей ER-сущности `Studio`.
- Сверил ключевые упоминания в `mock_backend/IMPLEMENTATION_CHECKLIST.md`, `api/openapi.yaml`, `TZ_application/03-business-logic.md`, `TZ_application/04-api-contract-map.md`, `TZ_application/05-data-and-access.md`, `TZ_application/06-acceptance-checklist.md`, `TZ_application/08-feature-list.md` и `design/ER-model-and-entity-models.md`.
- Подготовил варианты решения по глубине вмешательства.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — добавлена запись об анализе баг-репорта.

### Принятые решения

- Принятые решения: нет

### Тесты

- `Select-String` по ключевым документам и паттернам `studio-info`, `StudioInfo`, `StaticStudioInfo`, `адрес студии`, `баннер студии`.
- Результат: подтверждён конфликт между ER-моделью и документами, влияющими на API/mock-backend/acceptance.

### Следующие шаги

- Выбрать один из вариантов исправления и внести согласованные правки в документы.

## 2026-07-05 22:43 — багфикс

### Промпт пользователя

> необходимо произвести жесткую правку. так как проблема возникла в результате расхождений в чтении начальных предложений заказчика, разрешаю в порядке исключения произвести точечные правки во всех упомянутых в багрепорте файлах с целью уточнения требования: наличие адреса на баннере является ИСКЛЮЧИТЕЛЬНО ui\ux-задачей. также поправь логику в местах, где это необходимо. перепроверь чеклист имплементации мок-бэкенда с целью исправить проблему, указанную в багрепорте.

### Что сделал Codex

- Удалил `/studio-info`, `StudioInfo` и `StaticStudioInfo` из программного контура.
- Переписал требования к адресу студии как исключительно статический UI/UX-контент макета.
- Исправил чеклист mock-backend: запретил `studios`, `StudioInfo`, `/studio-info` и seed одной студии.
- Обновил баг-лог и перевёл его в статус `verified`.

### Изменённые файлы

- `api/openapi.yaml` — удалён `/studio-info` и схема `StudioInfo`.
- `TZ_application/01-main-specification.md` — уточнён скоуп адреса студии.
- `TZ_application/02-screen-specification.md` — удалён `GET /studio-info`, адрес переведён в UI/UX-текст.
- `TZ_application/03-business-logic.md` — логика загрузки расписания больше не вызывает `/studio-info`.
- `TZ_application/04-api-contract-map.md` — удалена строка API информации о студии.
- `TZ_application/05-data-and-access.md` — удалён `StaticStudioInfo`.
- `TZ_application/06-acceptance-checklist.md` — acceptance баннера отвязан от API/БД/seed.
- `TZ_application/08-feature-list.md` — фича баннера уточнена как UI/UX.
- `design/entity-access-matrix.md` — удалён `StaticStudioInfo`.
- `design/ER-model-and-entity-models.md` — усилено ограничение по адресу.
- `design/SCR-003-class-schedule.md` — уточнён баннер.
- `design/SCR-005-class-details.md` — уточнён баннер.
- `design/SCR-009-booking-success.md` — уточнён адрес как макетный текст.
- `design/SCR-014-studio-cancelled-class.md` — уточнён адрес как макетный контекст.
- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — исправлена проблема seed-данных и endpoint-а.
- `business_requirements.md` — BR-013 переписан без программного требования.
- `functional_requirements.md` — FR-044 переписан без API/БД/seed.
- `requirements.md` — требование адреса ограничено UI/UX-макетом.
- `domainanalysis.md` — уточнено, что адрес не входит в API/БД/seed.
- `screen_registry.md` — адрес переведён в статический UI/UX-текст.
- `customeranswers.md` — зафиксированное решение уточнено.
- `logs/BUG-20260705-studio-seed-entity-confusion.md` — обновлён статус, исправление, артефакты и проверка.
- `.agents/AI_JOURNAL.md` — добавлена запись о багфиксе.

### Принятые решения

- Адрес единственной студии не является программным требованием и не должен попадать в API, БД, seed-данные, mock-backend или backend acceptance.
- Видимость адреса на баннере допустима только как статический UI/UX-контент макета.

### Тесты

- `rg -n "(GET /studio-info|/studio-info|StudioInfo|StaticStudioInfo|mapUrl|Создать одну студию)" ...`
- `rg -n "(адрес студии|Адрес студии|адрес единственной студии|название и адрес|баннер студии|Баннер студии)" ...`
- Результат: программные упоминания удалены; запретительные упоминания остались в чеклисте mock-backend.

### Следующие шаги

- При реализации mock-backend не создавать `studios`, `StudioInfo`, `/studio-info` и seed-записи студии.

## 2026-07-05 22:46 — анализ

### Промпт пользователя

> оцени целесообразность оставленных запретительных комментариев в контексте ии-подкрепленной разработки

### Что сделал Codex

- Проверил оставленные запретительные формулировки в `mock_backend/IMPLEMENTATION_CHECKLIST.md`.
- Сверил их с баг-логом `logs/BUG-20260705-studio-seed-entity-confusion.md`.
- Оценил пользу и риски таких запретов для ИИ-подкреплённой разработки.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — добавлена запись об анализе запретительных комментариев.

### Принятые решения

- Принятые решения: нет

### Тесты

- `Select-String -Path 'mock_backend/IMPLEMENTATION_CHECKLIST.md' -Pattern 'studios|StudioInfo|studio-info|адрес|UI/UX' -Context 2,2`
- `Select-String -Path 'logs/BUG-20260705-studio-seed-entity-confusion.md' -Pattern 'StudioInfo|studio-info|studios|запрет|Оставшиеся риски' -Context 2,2`
- Результат: запреты присутствуют в общем разделе "Не входит" и в этапе seed-данных mock-backend.

### Следующие шаги

- При желании можно заменить чекбокс-запрет в seed-разделе на короткое примечание, чтобы он не выглядел как отдельная реализационная задача.

## 2026-07-05 22:50 — документация

### Промпт пользователя

> одобряю. проверь implementation_checklist на наличие плана итеративной реализации в виде чеклиста, при отсутствии - спроектируй

### Что сделал Codex

- Проверил `mock_backend/IMPLEMENTATION_CHECKLIST.md`.
- Выявил, что файл содержит линейные этапы и рекомендуемый порядок, но не содержит отдельного итеративного плана с проверяемыми инкрементами.
- Добавил раздел "Итеративный план реализации" с итерациями 0-6 и критериями выхода.
- Заменил отрицательный чекбокс по студии в seed-разделе на примечание-ограничение.

### Изменённые файлы

- `mock_backend/IMPLEMENTATION_CHECKLIST.md` — добавлен итеративный план реализации; запрет по `studios`/`StudioInfo`/`/studio-info` переведён из чекбокса в ограничение.
- `logs/TASK-20260705-mock-backend-db-scope.md` — обновлён задачный лог и статус.
- `.agents/AI_JOURNAL.md` — добавлена запись о правке.

### Принятые решения

- Детальный этапный чеклист оставить как справочник задач.
- Итеративный план вынести отдельным разделом до детальных этапов.
- Запрет по студии в seed-разделе формулировать как ограничение, а не как отдельный чекбокс.

### Тесты

- `Select-String -Path 'mock_backend/IMPLEMENTATION_CHECKLIST.md' -Pattern 'Итерация|Критерий выхода|Не создавать|Ограничение|StudioInfo|/studio-info|studios' -Context 1,1`
- `rg -n "^- \[ \] Не создавать|Итеративный план реализации|Критерий выхода|Ограничение: не создавать" mock_backend/IMPLEMENTATION_CHECKLIST.md`
- Результат: итеративный план найден; отрицательный чекбокс по студии отсутствует, ограничение сохранено.

### Следующие шаги

- При реализации mock-backend идти по итерациям 0-6, сверяя критерии выхода.

## 2026-07-05 22:54 — документация

### Промпт пользователя

> зафиксируй архитектуру бэкенда в отдельный файл

### Что сделал Codex

- Сверил `mock_backend/IMPLEMENTATION_CHECKLIST.md`, `TZ_application/07-technology-stack.md` и `TZ_application/03-business-logic.md`.
- Создал отдельный архитектурный документ для демонстрационного mock-backend.
- Зафиксировал слои, границы ответственности, PostgreSQL-модель, транзакции, API-модули, ошибки, миграции, seed, тестирование, Docker Compose и архитектурные запреты.

### Изменённые файлы

- `mock_backend/ARCHITECTURE.md` — создан отдельный файл архитектуры backend.
- `logs/TASK-20260705-mock-backend-db-scope.md` — обновлён задачный лог.
- `.agents/AI_JOURNAL.md` — добавлена запись о создании архитектуры.

### Принятые решения

- Архитектуру фиксировать в `mock_backend/ARCHITECTURE.md`, отдельно от чеклиста реализации.
- Backend трактуется как демонстрационный mock-backend, не production-сервер.
- Бизнес-логика размещается в service layer, HTTP handlers не должны содержать бизнес-решения.

### Тесты

- `rg -n "^(#|##|###)|studios|StudioInfo|/studio-info|POST /bookings|GET /slots|Transaction|Транзакции|Production|production" mock_backend/ARCHITECTURE.md`
- Результат: ключевые разделы, endpoint-ы, транзакции и архитектурные запреты найдены.

### Следующие шаги

- Использовать `mock_backend/ARCHITECTURE.md` как архитектурный ориентир при реализации mock-backend.

## 2026-07-05 23:15 — реализация

### Промпт пользователя

> на основе информации об архитектуре и чеклиста, а также ТЗ, приступи к реализации бэкенда проекта. веди отдельный лог разработки. по окончании выведи, что было реализовано, а что не удалось

### Что сделал Codex

- Сверил `mock_backend/ARCHITECTURE.md`, `mock_backend/IMPLEMENTATION_CHECKLIST.md`, `api/openapi.yaml` и `TZ_application/03-business-logic.md`.
- Создал структуру Go mock-backend, HTTP API, сервисную бизнес-логику, PostgreSQL-хранилище, миграции, seed-данные, Docker Compose, README и unit-тесты доменных правил.
- Зафиксировал отдельный лог разработки.
- Провёл доступные статические проверки и проверку `docker compose config`.
- Зафиксировал блокеры проверки сборки: локально нет `go`, Docker daemon недоступен.

### Изменённые файлы

- `logs/TASK-20260705-mock-backend-implementation.md` — создан и обновлён отдельный лог разработки backend.
- `mock_backend/go.mod` — создан Go-модуль.
- `mock_backend/cmd/server/main.go` — создана точка входа сервера.
- `mock_backend/internal/config/config.go` — создана конфигурация env.
- `mock_backend/internal/domain/domain.go` — добавлены доменные модели, статусы, ошибки и правила.
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
- `mock_backend/README.md` — создано описание запуска и demo-сценариев.
- `.agents/AI_JOURNAL.md` — добавлена запись о реализации.

### Принятые решения

- Реализовывать только клиентские endpoint-ы из OpenAPI без админки, `/studio-info`, `StudioInfo`, `studios` и реальной оплаты.
- Критичные операции с местами выполнять транзакционно через PostgreSQL и `FOR UPDATE`.
- Проверку сборки считать незавершённой до запуска на машине с Go или работающим Docker daemon.

### Тесты

- `docker compose config`
- Результат: Compose-конфигурация валидна.
- `go test ./...`
- Результат: не выполнено, `go` не установлен.
- `docker compose build mock-backend`
- Результат: не выполнено, Docker daemon недоступен.
- `rg -n "studio-info|StudioInfo|create table studios|studios" mock_backend\migrations mock_backend\internal`
- Результат: запрещённые сущности в коде и миграциях не найдены.

### Следующие шаги

- Установить Go 1.22+ или запустить Docker daemon.
- Выполнить `go mod tidy`, `go test ./...`, `go build ./cmd/server`.
- Выполнить `docker compose up --build` и проверить happy path API.

## 2026-07-05 23:41 — документация

### Промпт пользователя

> на основе технического задания, а также информации о мок-бэкенде, сформируй план-чеклист итеративной реализации фронтэнда. получившийся артефакт положи в папку frontend.

### Что сделал Codex

- Сверил ТЗ, бизнес-логику, фича-лист, карту API и документы mock-backend.
- Создал папку `frontend/`.
- Сформировал план-чеклист итеративной реализации frontend MVP.
- Создал отдельный задачный лог для документационной задачи.

### Изменённые файлы

- `frontend/IMPLEMENTATION_CHECKLIST.md` — создан план-чеклист итеративной реализации frontend.
- `logs/TASK-20260705-frontend-implementation-plan.md` — создан задачный лог.
- `.agents/AI_JOURNAL.md` — добавлена запись о работе.

### Принятые решения

- Frontend-план строить вокруг Expo, React Native, TypeScript, Expo Router, TanStack Query, Zustand, React Hook Form и Zod из утверждённого ТЗ.
- Не включать в frontend-реализацию онлайн-оплату, админку, интерфейс шефа, production SMS/push и программную модель адреса студии.
- Указать `local_mock` только как fallback для разработки, а основной интеграционный ориентир оставить за HTTP mock-backend и OpenAPI.

### Тесты

- `Test-Path frontend`
- Результат до создания: `False`.
- Проверка содержимого через чтение `TZ_application/03-business-logic.md`, `TZ_application/04-api-contract-map.md`, `TZ_application/07-technology-stack.md`, `TZ_application/08-feature-list.md`, `mock_backend/ARCHITECTURE.md`, `mock_backend/IMPLEMENTATION_CHECKLIST.md`, `logs/TASK-20260705-mock-backend-implementation.md`.
- Результат: документы использованы как источники для плана; автоматические тесты не запускались, так как создавался документационный артефакт.
- `rg -n "Итерация|Критерий выхода|Онлайн-оплата|/studio-info|StudioInfo|studios|EXPO_PUBLIC_API_BASE_URL|POST /bookings|GET /slots" frontend\IMPLEMENTATION_CHECKLIST.md`
- Результат: итерации, критерии выхода, ключевые endpoint-ы и ограничения найдены.
- `rg -n "Статус|Итоговое решение|frontend/IMPLEMENTATION_CHECKLIST.md|2026-07-05 23:41" logs\TASK-20260705-frontend-implementation-plan.md .agents\AI_JOURNAL.md`
- Результат: задачный лог и общий журнал содержат запись о создании frontend-чеклиста.
- `git status --short`
- Результат: не выполнено, текущая папка не распознана как git-репозиторий.

### Следующие шаги

- При реализации frontend начать с итерации 0 из `frontend/IMPLEMENTATION_CHECKLIST.md`.

## 2026-07-06 00:01 — реализация

### Промпт пользователя

> согласно ТЗ, информации по openapi, информации по бэкэнду и имплементационному чеклисту фронтэнда, приступи к реализации фронтэнда. папка назначения - frontend. по окончании проинформируй, что из чеклиста было реализовано, что реализовать не удалось. веди отдельный дополнительный лог работы по реализации фронтенда.

### Что сделал Codex

- Сверил `api/openapi.yaml`, документы ТЗ, архитектуру mock-backend и `frontend/IMPLEMENTATION_CHECKLIST.md`.
- Создал frontend-проект в `frontend/` на Expo Router + React Native + TypeScript.
- Добавил API-клиент с режимами `http` и `local_mock`, typed errors, query keys и типы OpenAPI.
- Реализовал экраны авторизации, расписания, карточки класса, бронирования, успеха, аккаунта, деталей, добавления участников, отмены, уведомлений, оценки шефа и legal.
- Добавил Zustand-сессию, SecureStore token, черновик брони, Zod-валидацию и unit tests бизнес-правил.
- Создал отдельный лог реализации frontend.

### Изменённые файлы

- `frontend/package.json` — создана конфигурация frontend-проекта.
- `frontend/app.json` — создана Expo-конфигурация.
- `frontend/tsconfig.json` — настроен TypeScript.
- `frontend/babel.config.js` — настроен Babel.
- `frontend/.env.example` — добавлены env-переменные.
- `frontend/README.md` — добавлено описание запуска и скоупа.
- `frontend/app/*` — добавлены маршруты и экраны MVP.
- `frontend/src/api/*` — добавлены типы, клиент, ошибки, query keys и local mock.
- `frontend/src/features/*` — добавлены stores сессии и черновика брони.
- `frontend/src/shared/*` — добавлены UI-компоненты, config, validation и утилиты.
- `frontend/tests/business-rules.test.ts` — добавлены unit tests бизнес-правил.
- `logs/TASK-20260705-frontend-implementation.md` — создан отдельный лог реализации frontend.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Основной API-контур реализован через `api/client.ts`; `local_mock` оставлен как fallback для разработки без запущенного backend.
- Подтверждённая бронь появляется только после успешного ответа API/mock API.
- Онлайн-оплата оставлена только как экран недоступности без платёжной формы.
- `/studio-info`, `StudioInfo`, `studios` не добавлялись в программный код frontend.

### Тесты

- `node --version`
- Результат: не выполнено, `node` не установлен.
- `npm --version`
- Результат: не выполнено, `npm` не установлен.
- `npm run typecheck`
- Результат: не запускался из-за отсутствия `npm`.
- `npm test`
- Результат: не запускался из-за отсутствия `npm`.
- `rg -n "studio-info|StudioInfo|studios" frontend\app frontend\src frontend\tests`
- Результат: запрещённые программные сущности не найдены.
- `Get-ChildItem -Recurse -File frontend`
- Результат: структура frontend-файлов проверена.

### Следующие шаги

- Установить Node.js/npm.
- Выполнить `npm install`, `npm run typecheck`, `npm test`.
- Запустить Expo через `npm run start` и вручную пройти happy path.
- Найденные ошибки после запуска оформить отдельными `logs/BUG-*.md`.

## 2026-07-06 00:38 — багфикс

### Промпт пользователя

> будь любезен, создай багрепорт, отрази в нем что предыдущий блок dependancies был заменен на следующий:
> "dependencies": {
>   "@expo/vector-icons": "^14.0.4",
>   "@hookform/resolvers": "^3.9.1",
>   "@tanstack/react-query": "^5.62.7",
>   "expo": "~52.0.20",
>   "expo-constants": "~17.0.8",
>   "expo-linking": "~7.0.5",
>   "expo-router": "~4.0.14",
>   "expo-secure-store": "~14.0.0",
>   "expo-status-bar": "~2.0.1",
>   "react": "18.3.1",
>   "react-hook-form": "^7.54.2",
>   "react-native": "0.76.5",
>   "react-native-gesture-handler": "~2.20.2",
>   "react-native-reanimated": "~3.16.1",
>   "react-native-safe-area-context": "4.12.0",
>   "react-native-screens": "~4.4.0",
>   "zod": "^3.24.1",
>   "zustand": "^5.0.2"
> }
>
> причина: сгенерированные тобой dependancies конфликтовали и не позволяли их установить. пометь баг как решенный.

### Что сделал Codex

- Проверил текущий `frontend/package.json`.
- Создал отдельный баг-репорт о конфликте frontend dependencies.
- Зафиксировал, что первоначально сгенерированные зависимости конфликтовали и были заменены на расширенный Expo/React Native набор.
- Пометил баг как `fixed`.

### Изменённые файлы

- `logs/BUG-20260706-frontend-dependencies-conflict.md` — создан баг-репорт.
- `.agents/AI_JOURNAL.md` — добавлена запись о создании баг-репорта.

### Принятые решения

- Баг считается решённым по сообщению пользователя о замене конфликтного блока dependencies.
- Остаточный риск: текущий `frontend/package.json` отличается от переданного блока в версиях `@expo/vector-icons` и `react-native`; это зафиксировано в баг-репорте.

### Тесты

- `Get-Content -Raw -Encoding UTF8 frontend\package.json`
- Результат: текущий `package.json` содержит расширенный набор Expo/React Native зависимостей.
- `npm install`
- Результат: не запускался Codex в текущем окружении.

### Следующие шаги

- Если нужно точное соответствие переданному блоку, отдельно исправить `frontend/package.json`.
- После установки Node.js/npm выполнить `npm install`, `npm run typecheck`, `npm test`.

## 2026-07-06 00:51 — багфикс

### Промпт пользователя

> обнаружен баг. будь любезен, заведи багрепорт. при открытии приложения получаем ошибку ниже, после dismiss приложение продолжает работать. статус багрепорта - в работе.
>
> Uncaught Error
> _ExpoSecureStore.default.getValueWithKeyAsync is not a function
> Call Stack
> getItemAsync
> node_modules/expo-secure-store/build/SecureStore.js
> restore
> src/features/auth/sessionStore.ts
> useEffect$argument_0
> app/_layout.tsx
> commitHookEffectListMount
> node_modules/react-dom/cjs/react-dom.development.js
> commitPassiveMountOnFiber
> node_modules/react-dom/cjs/react-dom.development.js
> commitPassiveMountEffects_complete
> node_modules/react-dom/cjs/react-dom.development.js
> commitPassiveMountEffects_begin
> node_modules/react-dom/cjs/react-dom.development.js
> commitPassiveMountEffects
> node_modules/react-dom/cjs/react-dom.development.js
> flushPassiveEffectsImpl
> node_modules/react-dom/cjs/react-dom.development.js
> flushPassiveEffects
> node_modules/react-dom/cjs/react-dom.development.js
> scheduleCallback$1$argument_1
> node_modules/react-dom/cjs/react-dom.development.js
> workLoop
> node_modules/scheduler/cjs/scheduler.development.js
> flushWork
> node_modules/scheduler/cjs/scheduler.development.js
> performWorkUntilDeadline
> node_modules/scheduler/cjs/scheduler.development.js
> Collapse all 14 frames
>
> что могло спровоцировать ошибку?

### Что сделал Codex

- Проверил `frontend/src/features/auth/sessionStore.ts`.
- Создал отдельный баг-репорт по ошибке `expo-secure-store` в web runtime.
- Зафиксировал статус бага как `in_progress`.
- Указал предварительную причину: прямое использование `SecureStore.getItemAsync` без проверки платформы и fallback для web.

### Изменённые файлы

- `logs/BUG-20260706-expo-secure-store-web-runtime.md` — создан баг-репорт.
- `.agents/AI_JOURNAL.md` — добавлена запись о регистрации бага.

### Принятые решения

- Баг относится к runtime/storage-совместимости frontend, а не к бизнес-логике MVP.
- Исправление пока не выполнялось; статус оставлен `in_progress`.

### Тесты

- `Get-Content -Raw -Encoding UTF8 frontend\src\features\auth\sessionStore.ts`
- Результат: подтверждён прямой вызов `SecureStore.getItemAsync`, `setItemAsync`, `deleteItemAsync`.

### Следующие шаги

- Реализовать platform-safe token storage: SecureStore для native, fallback для web.
- Проверить старт приложения, login/logout, восстановление сессии и обработку `401`.

## 2026-07-06 01:08 — багфикс

### Промпт пользователя

> Исправь баг web-запуска: при открытии приложения в браузере падает ошибка _ExpoSecureStore.default.getValueWithKeyAsync is not a function.
>
> Причина: expo-secure-store нельзя использовать напрямую на web.
>
> Сделай платформенную обёртку для хранения сессии:
> - на native используй expo-secure-store;
> - на web используй window.localStorage;
> - не вызывай SecureStore напрямую из sessionStore.ts;
> - обнови тесты, если нужно;

### Что сделал Codex

- Создал `frontend/src/features/auth/tokenStorage.ts`.
- Реализовал platform-safe хранение токена: `expo-secure-store` для native и `window.localStorage` для web.
- Обновил `frontend/src/features/auth/sessionStore.ts`, чтобы он не вызывал `SecureStore` напрямую.
- Обновил баг-репорт и перевёл статус бага в `fixed`.
- Запустил typecheck и unit tests.

### Изменённые файлы

- `frontend/src/features/auth/tokenStorage.ts` — создан адаптер хранения токена.
- `frontend/src/features/auth/sessionStore.ts` — прямые вызовы `SecureStore` заменены на `tokenStorage`.
- `logs/BUG-20260706-expo-secure-store-web-runtime.md` — обновлены статус, исправление и проверка.
- `logs/TASK-20260705-frontend-implementation.md` — добавлена запись о багфиксе.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Для web-режима использовать `window.localStorage` как development fallback учебного MVP.
- Для native сохранить `expo-secure-store`, чтобы не отходить от утверждённого стека.
- Баг помечен `fixed`, но не `verified`, потому что runtime web-старт в браузере Codex не проверял.

### Тесты

- `rg -n "SecureStore|getItemAsync|setItemAsync|deleteItemAsync" frontend\src\features\auth`
- Результат: прямые вызовы `SecureStore` остались только в `tokenStorage.ts`.
- `npm.cmd run typecheck`
- Результат: успешно.
- `npm.cmd test`
- Результат: успешно, 1 файл тестов, 5 тестов пройдены.

### Следующие шаги

- Запустить приложение в браузере и убедиться, что ошибка `_ExpoSecureStore.default.getValueWithKeyAsync is not a function` больше не появляется.
- Проверить login/logout и восстановление сессии в web.

## 2026-07-06 01:44 — багфикс

### Промпт пользователя

> обнаружен баг. при открытии приложения в эмуляторе андроид пиксель 7 отображается ошибка: this app isnt 16 kb compatible. терминал выдает следующую информацию
> TypeError: Invalid character in header content ["X-React-Native-Project-Root"]
>     at ServerResponse.setHeader (node:_http_outgoing:650:3)
>     at C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend\node_modules\@expo\cli\src\start\server\metro\dev-server\createMetroMiddleware.ts:71:9
>     at call (C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend\node_modules\connect\index.js:239:7)
>     at next (C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend\node_modules\connect\index.js:183:5)
>     at next (C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend\node_modules\connect\index.js:161:14)
>     at next (C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend\node_modules\connect\index.js:161:14)
>     at next (C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend\node_modules\connect\index.js:161:14)
>     at compression (C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend\node_modules\compression\index.js:243:5)
>     at call (C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend\node_modules\connect\index.js:239:7)
>     at next (C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend\node_modules\connect\index.js:183:5)

### Что сделал Codex

- Создал отдельный баг-репорт по ошибке Metro header `X-React-Native-Project-Root`.
- Зафиксировал статус `in_progress`.
- Предварительно определил вероятную причину: путь проекта содержит кириллицу, а Expo CLI/Metro пытается записать этот путь в HTTP header.
- Отделил terminal stack Metro от сообщения эмулятора про 16 KB compatibility как потенциально отдельный симптом.

### Изменённые файлы

- `logs/BUG-20260706-metro-project-root-header.md` — создан баг-репорт.
- `.agents/AI_JOURNAL.md` — добавлена запись о регистрации бага.

### Принятые решения

- Основной блокер по stack trace считать проблемой окружения/пути проекта, а не ошибкой бизнес-кода frontend.
- Рекомендуемый workaround: перенести проект в ASCII-путь без кириллицы и очистить Metro cache.

### Тесты

- `Get-Content -Raw -Encoding UTF8 frontend\package.json`
- Результат: frontend использует Expo/React Native стек; stack trace относится к Expo CLI/Metro.
- Android emulator Codex не запускал.

### Следующие шаги

- Перенести проект в путь без кириллицы, например `C:\projects\chef-table\proj`.
- Выполнить `npm.cmd install` при необходимости.
- Запустить Metro с очисткой cache и повторить Android emulator запуск.

## 2026-07-06 01:59 — анализ

### Промпт пользователя

> проанализируй баг описанный в багрепорте. часть, связанная с кириллицей, устранена. необходимо решить проблему с 16kb. проанализируй нашу имплементацию фронтенда и найди причину проблемы

### Что сделал Codex

- Проанализировал оставшуюся 16 KB проблему отдельно от уже устранённой проблемы кириллицы в пути.
- Проверил frontend-структуру, `package.json`, `app.json`, установленные версии Expo/React Native и наличие собственного Android-проекта.
- Установил, что frontend использует Expo SDK 52 / React Native 0.76.9, а собственного `frontend/android/` и C/C++ кода в проекте нет.
- Создал отдельный баг-репорт для Android 16 KB page size incompatibility.

### Изменённые файлы

- `logs/BUG-20260706-android-16kb-page-size.md` — создан баг-репорт по 16 KB compatibility.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- 16 KB проблему считать отдельным Android/native compatibility багом, а не продолжением исправленной проблемы с кириллицей.
- Наиболее вероятная причина: текущий стек `expo@52.0.49` / `react-native@0.76.9`; поддержка Android 16 KB page size заявлена начиная с React Native 0.77.
- Не менять точечно только `react-native` без миграции Expo SDK, чтобы не получить несовместимый стек.

### Тесты

- `Get-ChildItem -LiteralPath 'frontend' -Force`
- Результат: собственного `android/` проекта нет.
- `rg --files frontend | rg "(^|/)android/|\\.so$|CMakeLists|build.gradle|gradle.properties|AndroidManifest.xml"`
- Результат: Android/native файлы найдены только в `node_modules`.
- `npm.cmd ls expo react-native react-native-reanimated react-native-screens react-native-gesture-handler react-native-safe-area-context expo-secure-store --depth=0`
- Результат: `expo@52.0.49`, `react-native@0.76.9`, `react-native-reanimated@3.16.7`, `react-native-screens@4.4.0`.
- Android emulator Codex не запускал.

### Следующие шаги

- Обновить frontend на Expo SDK с React Native 0.77 или выше отдельной миграционной задачей.
- После обновления переустановить native runtime на эмуляторе и проверить запуск.
- Для точного подтверждения проверить APK/runtime через APK Analyzer или ELF alignment check.

## 2026-07-06 02:12 — багфикс

### Промпт пользователя

> внеси необходимые изменения

### Что сделал Codex

- Обновил frontend с Expo SDK 52 / React Native 0.76.9 на Expo SDK 55 / React Native 0.83.6.
- Синхронизировал связанные native-зависимости Expo Router, Reanimated, Screens, Gesture Handler, Safe Area Context, Secure Store и другие SDK-пакеты.
- Пересобрал `node_modules` и `package-lock.json` с нуля после npm-конфликта старого дерева зависимостей.
- Проверил согласованность Expo-зависимостей, TypeScript и unit-тесты.

### Изменённые файлы

- `frontend/package.json` — обновлены Expo SDK, React Native, React и связанные зависимости.
- `frontend/package-lock.json` — пересобран lockfile после миграции.
- `logs/BUG-20260706-android-16kb-page-size.md` — статус изменён на `fixed`, добавлены исправление и проверки.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Выполнить миграцию через Expo SDK, а не точечно менять только `react-native`.
- Выбрать стабильный Expo SDK 55 как достаточный для 16 KB fix: он использует React Native 0.83.6, что выше порога RN 0.77.
- Не выполнять `npm audit fix --force`, потому что это отдельная потенциально ломающая задача вне текущего 16 KB бага.

### Тесты

- `npm.cmd install expo@~55.0.0`
- Результат: Expo обновлён, затем потребовалась синхронизация зависимостей.
- `npx.cmd expo install --fix`
- Результат: выявлены ожидаемые версии SDK 55, установка остановилась из-за старого промежуточного дерева npm.
- `npm.cmd install`
- Результат: успешно после удаления старых `node_modules` и `package-lock.json`.
- `npm.cmd ls expo react react-dom react-native expo-router react-native-reanimated react-native-screens --depth=0`
- Результат: `expo@55.0.27`, `react-native@0.83.6`, `react@19.2.0`, `expo-router@55.0.16`.
- `npx.cmd expo install --check`
- Результат: `Dependencies are up to date`.
- `npm.cmd run typecheck`
- Результат: успешно.
- `npm.cmd test`
- Результат: успешно, 1 файл тестов, 5 тестов пройдены.
- Android emulator Codex не запускал.

### Следующие шаги

- Удалить старый Expo Go/runtime с Android emulator, если он был установлен до миграции.
- Запустить `npm.cmd run android` или `npm.cmd run start -- --clear` и проверить приложение на Pixel 7 emulator.
- Если 16 KB сообщение останется, проверить конкретный APK/runtime через Android Studio APK Analyzer или ELF alignment check.

## 2026-07-06 02:27 — анализ

### Промпт пользователя

> откуда в приложении уже информация о расписании, если мы не поднимали сервер? мы во фронтенд зашили мокап???

### Что сделал Codex

- Проверил frontend env-конфигурацию, API-клиент и локальный mock-слой.
- Подтвердил, что расписание и связанные demo-данные сейчас берутся из `frontend/src/api/mocks/localMock.ts`.
- Установил, что режим `local_mock` включён по умолчанию, если `EXPO_PUBLIC_API_MODE` не задан.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Программно зашитый local mock считать development fallback для проверки frontend без поднятого backend, а не production-источником истины.

### Тесты

- `Get-Content -LiteralPath 'frontend/src/shared/config/env.ts' -Encoding UTF8`
- Результат: `apiMode` по умолчанию равен `local_mock`.
- `Get-Content -LiteralPath 'frontend/src/api/client.ts' -Encoding UTF8`
- Результат: API выбирает `localApi`, если `env.apiMode !== "http"`.
- `Get-Content -LiteralPath 'frontend/src/api/mocks/localMock.ts' -Encoding UTF8`
- Результат: найдены зашитые demo `slots`, `bookings`, `notifications`.

### Следующие шаги

- Для проверки с сервером явно выставить `EXPO_PUBLIC_API_MODE=http` и `EXPO_PUBLIC_API_BASE_URL`.
- Перед финальной сдачей явно описать local mock как dev fallback или отключить его по умолчанию, если требуется строгая демонстрация через backend.
## 2026-07-06 03:40 — анализ

### Промпт пользователя

> на основе текущего фронтенда и бекенда, информации по ним, а также свидетельствам пользователя, необходимо задокументировать баги, необходимые исправления и таски по доведению мобильного приложения до рабочего состояния. на основе моих описаний распредели проблемы, которые я опишу, либо в такси, которые нужно выполнить, либо в баги, которые надо исправить. для каждого необходимо сгенерировать репорт в папке logs.

### Что сделал Codex

- Проверил наличие структуры проекта, `.agents/AI_JOURNAL.md` и папки `logs/`.
- Зафиксировал, что в `logs/` уже есть существующие отчёты по багам и задачам фронтенда, mock backend и окружения.
- Подготовил порядок классификации будущих описаний пользователя на баги и задачи.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — добавлена запись о подготовке к классификации багов и задач.

### Принятые решения

- Не создавать отдельные `logs/*.md` без конкретного описания проблемы, чтобы не плодить пустые или формальные отчёты.
- Для каждого следующего описания классифицировать проблему как `BUG-*`, если фактическое поведение противоречит ожидаемому, или как `TASK-*`, если требуется доработка, интеграция, настройка или доведение до рабочего состояния без уже подтверждённой поломки.

### Тесты

- `Get-ChildItem -Force`
- Результат: структура проекта, `.agents/AI_JOURNAL.md` и `logs/` найдены.

### Следующие шаги

- Получить от пользователя список наблюдений по фронтенду, backend и поведению приложения.
- Для каждого наблюдения создать или обновить соответствующий отчёт в `logs/`.
## 2026-07-06 03:53 — документация

### Промпт пользователя

> приступим.
> баг: пользователь может записаться на один и тот же класс много раз. необходимо, чтобы в случае, если пользователь был уже записан, выбор карточки в расписании предлагал бы только добавить дополнительных людей в свою группу, с измененной ценой на это, так как сам клиент уже записан. факт того, что он записан, следует явно указать.
> таск: в случае если пользователь авторизован, то карточки классов в расписании, на которые он записан, должны помечаться иначе, чем те, на которые он НЕ записан. например, изменить цвет фона карточки.
> таск: карточки классов в расписании должны иметь возможность прикрепления фото. смысловая нагрузка: фото блюда. это фото должно быть также видно при открытии расширенной карточки (выборе ее в расписании).
> таск: визуальное оформление тех классов в "моих записях", бронь на которые отменена клиентом, должно отличаться от тех, которые еще актуальны. например, цветом карточки.
> таск: фильтр дат лучше сделать выбором на выпадающем календаре, визуально, а не заставлять пользователя печатать даты вручную.
> баг(проверить): при отмене клиентом брони его место не освобождается в расписании.

### Что сделал Codex

- Проверил текущие файлы фронтенда и mock backend, связанные с расписанием, карточкой класса, созданием брони, моими записями и отменой.
- Разделил описания пользователя на 2 баг-репорта и 4 задачи.
- Для каждого пункта создал отдельный отчёт в `logs/` с привязкой к файлам, API и ТЗ.

### Изменённые файлы

- `logs/BUG-20260706-duplicate-slot-booking.md` — создан баг-репорт по повторной записи на один слот.
- `logs/TASK-20260706-schedule-booked-slot-marking.md` — создана задача по маркировке уже забронированных слотов в расписании.
- `logs/TASK-20260706-class-dish-photos.md` — создана задача по фото блюда в карточках классов.
- `logs/TASK-20260706-client-cancelled-booking-visual-state.md` — создана задача по визуальному состоянию отменённых клиентом броней.
- `logs/TASK-20260706-calendar-date-filter.md` — создана задача по календарному выбору дат.
- `logs/BUG-20260706-cancelled-booking-seat-release.md` — создан баг-репорт на проверку освобождения места после отмены.
- `.agents/AI_JOURNAL.md` — добавлена запись о классификации и документировании проблем.

### Принятые решения

- Повторную запись клиента на один и тот же слот классифицировать как баг, потому что она нарушает бизнес-логику бронирования.
- Визуальную маркировку забронированных слотов, фото блюд, оформление отменённых броней и календарный выбор дат классифицировать как задачи доработки.
- Освобождение места после отмены классифицировать как баг на проверку: backend-код освобождения мест есть, но frontend может показывать устаревший кэш расписания.

### Тесты

- `Get-Content -LiteralPath 'frontend/app/schedule/index.tsx' -Encoding UTF8`
- Результат: расписание не учитывает брони пользователя и использует ручной ввод дат.
- `Get-Content -LiteralPath 'frontend/app/schedule/[slotId].tsx' -Encoding UTF8`
- Результат: карточка доступного слота ведёт в создание новой брони.
- `Get-Content -LiteralPath 'frontend/app/account/index.tsx' -Encoding UTF8`
- Результат: отмена клиентом не имеет отдельного визуального состояния карточки.
- `Get-Content -LiteralPath 'frontend/app/account/cancel.tsx' -Encoding UTF8`
- Результат: после отмены не инвалидируются query расписания.
- `Get-Content -LiteralPath 'mock_backend/internal/service/service.go' -Encoding UTF8`
- Результат: нет проверки активной брони клиента на тот же слот перед созданием брони.
- `Get-Content -LiteralPath 'mock_backend/internal/storage/postgres/store.go' -Encoding UTF8`
- Результат: backend при отмене вызывает увеличение свободных мест.
- `rg -n "image|photo|picture|thumbnail|cover|program|ScheduleSlot|ClassProgram" ...`
- Результат: поля фото блюда в API/типах/backend не найдено.

### Следующие шаги

- Реализовать исправление повторной записи и связанный UX добавления участников.
- Реализовать визуальные состояния расписания и моих записей.
- Добавить поле фото блюда в API, mock backend и frontend.
- Проверить освобождение мест после отмены на запущенном frontend + backend.
## 2026-07-06 04:11 — реализация

### Промпт пользователя

> баги необходимо пофиксить, а таски - выполнить.
> дополнительный комментарий, касающийся картинки блюд: так как это НЕ-мвп фича, это необходимо пометить в журнале, а также в логе выполнения. разрешается сгенерировать дополнительные артефакты-ревизии ер-диаграммы, карты сущностей и сопутствующих документов, новые версии с изменениями должны быть промаркированы как версии 1.1 оригинальных документов. для остальных тасков необходимо создать дополнительные артефакты в папке design, названия должны начинаться с номера версии 1.1, и должны содержать описание добавленных фич. багфиксы сопровождать стандартным логированием.

### Что сделал Codex

- Исправил баг повторной записи клиента на один и тот же класс: backend запрещает вторую активную бронь, frontend для уже записанного слота ведёт к существующей записи/добавлению участников.
- Исправил вероятную frontend-причину бага с неосвобождением места после отмены: после отмены брони или участника инвалидируется кэш расписания и слота.
- Выполнил задачи по визуальной маркировке уже записанных слотов, визуальному состоянию отменённых клиентом броней и календарному выбору дат.
- Реализовал фото блюда как non-MVP фичу версии 1.1 и явно пометил это в API, логах и design-документах.
- Создал дополнительные design-артефакты версии 1.1.

### Изменённые файлы

- `api/openapi.yaml` — добавлено поле `ClassProgram.dishImageUrl` с пометкой Non-MVP 1.1.
- `mock_backend/internal/domain/domain.go` — добавлено поле `DishImageURL`.
- `mock_backend/internal/storage/postgres/store.go` — добавлена проверка дубля активной брони и выборка `dish_image_url`.
- `mock_backend/migrations/001_init_schema.up.sql` — добавлены `dish_image_url` и уникальный индекс активной брони.
- `mock_backend/migrations/002_seed_demo_data.up.sql` — добавлены демонстрационные URL фото блюд.
- `frontend/src/api/types.ts` — добавлено поле `dishImageUrl`.
- `frontend/src/api/errors.ts` — уточнён текст ошибки `already_exists`.
- `frontend/src/shared/ui/Card.tsx` — добавлена поддержка кастомного стиля карточки.
- `frontend/app/schedule/index.tsx` — добавлены календарный выбор дат, фото блюд и маркировка уже записанных слотов.
- `frontend/app/schedule/[slotId].tsx` — добавлены фото блюда и сценарий добавления участников для уже записанного клиента.
- `frontend/app/booking/confirm.tsx` — после создания брони обновляется кэш расписания и слота.
- `frontend/app/account/add-participants.tsx` — добавлено пояснение и расчёт доплаты только за нового участника.
- `frontend/app/account/cancel.tsx` — после отмены обновляется кэш расписания и слота.
- `frontend/app/account/index.tsx` — добавлено визуальное состояние для `cancelled_by_client`.
- `design/1.1-ER-model-and-entity-models-revision.md` — создана ревизия ER-модели 1.1.
- `design/1.1-entity-access-matrix-revision.md` — создана ревизия матрицы доступа 1.1.
- `design/1.1-schedule-booked-slot-feature.md` — создано описание фичи маркировки записанных слотов.
- `design/1.1-duplicate-booking-bugfix-flow.md` — создано описание исправления повторной записи.
- `design/1.1-class-dish-photo-feature.md` — создано описание non-MVP фичи фото блюда.
- `design/1.1-client-cancelled-booking-visual-feature.md` — создано описание визуального состояния отменённых клиентом броней.
- `design/1.1-calendar-date-filter-feature.md` — создано описание календарного фильтра дат.
- `logs/BUG-20260706-duplicate-slot-booking.md` — обновлён статус и ход исправления.
- `logs/BUG-20260706-cancelled-booking-seat-release.md` — обновлён статус и ход исправления.
- `logs/TASK-20260706-schedule-booked-slot-marking.md` — обновлён статус и ход выполнения.
- `logs/TASK-20260706-class-dish-photos.md` — обновлён статус, указано Non-MVP.
- `logs/TASK-20260706-client-cancelled-booking-visual-state.md` — обновлён статус и ход выполнения.
- `logs/TASK-20260706-calendar-date-filter.md` — обновлён статус и ход выполнения.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Фото блюда считается non-MVP фичей версии 1.1, не критерием готовности MVP.
- Поле фото хранится на уровне `ClassProgram`, потому что фото описывает блюдо/программу, а не конкретную дату слота.
- Для дубля активной брони используется backend-ошибка `already_exists`.
- Визуальная маркировка не полагается только на цвет: добавлен явный текст.
- Календарь реализован без новой зависимости как простой выбор ближайших дат, чтобы не раздувать учебный MVP.

### Тесты

- `npm.cmd run typecheck` во `frontend`
- Результат: успешно.
- `npm.cmd test` во `frontend`
- Результат: успешно, 1 файл тестов, 5 тестов пройдено.
- `go test ./...` в `mock_backend`
- Результат: не запущен, команда `go` недоступна в PATH.

### Следующие шаги

- Провести ручную e2e-проверку на запущенном frontend + mock backend.
- Проверить на устройстве/эмуляторе отображение remote images.
- При наличии Go в окружении запустить `go test ./...` и при необходимости добавить backend-тесты на запрет дубля брони.
## 2026-07-06 04:41 — реализация

### Промпт пользователя

> отличная работа с UI/UX, крайне доволен.
> Хотелось бы разработать более управляемую схему перемещения по экранам. на данный момент единственный способ перемещения по экранам - это нажатие на элемент и кнопка "назад" для возвращения. нужно модифицировать интерфейс. заведем новый таск по улучшению отзывчивости интерфейса.
> теперь пользователь должен всегда иметь возможность перейти к своему аккаунту, то есть в нашем случае к странице "мои записи". для этого предлагаю завести кнопку, находящуюся диаметрально напротив кнопки "назад" относительно центра экрана, справа сверху, с плейсхолдер-дизайном. находится на той же панели, на которой находятся кнопка "назад" и надпись "мои записи" и прочие заголовки. стартовой страницей приложения для теста сделаем scr-003. в случае если пользователь не залогинен и нажмет эту кнопку,  его перекинет на экран входа. если залогинен, то в "мои записи", scr-010. если пользователь перейдет в "мои записи" во время оформления заявки на этапе выбора оплаты, заявка автоматически отменяется, ее данные не сохраняются, если на этапе заполнения данных - заявка просто не сохраняется.
> дополнительно добавить клавишу "расписание" рядом с клавишей "мои записи", поведение аналогично, но ведет на скрин scr-003.
> при имплементации проверь, чтобы логика этих кнопок не сломала "залогиненность" клиента.

### Что сделал Codex

- Создал task-log по глобальной навигации.
- Добавил две кнопки в правую часть верхней панели: `Расписание` и `Мои записи`.
- Сделал стартовым экраном SCR-003 через redirect с `/` на `/schedule`.
- Настроил переход неавторизованного пользователя в `Мои записи` через экран входа с возвратом на `/account`.
- Очистку незавершённой заявки реализовал через очистку booking draft при глобальном переходе; авторизация при этом не сбрасывается.
- Обновил `screen_registry.md`, `screen_flowchart.md` и создал design-артефакт версии 1.1.

### Изменённые файлы

- `frontend/src/shared/navigation/HeaderActions.tsx` — создан компонент глобальных кнопок верхней панели.
- `frontend/app/_layout.tsx` — подключён `headerRight`.
- `frontend/app/index.tsx` — стартовый маршрут перенаправлен на `/schedule`.
- `design/1.1-global-header-navigation-feature.md` — создано описание фичи версии 1.1.
- `screen_registry.md` — обновлены требования к глобальной навигации и SCR-003.
- `screen_flowchart.md` — обновлены стартовый и глобальные переходы.
- `logs/TASK-20260706-global-header-navigation.md` — создан и закрыт task-log.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Не сбрасывать `accessToken` и `client` при переходе через глобальные кнопки.
- Очищать только `bookingDraftStore`, потому что до SCR-009 бронь ещё не создана на backend.
- Для неавторизованного перехода в `Мои записи` использовать `returnTo="/account"`, чтобы не ломать существующую login-логику.
- Не вводить нижнюю tab-навигацию в рамках этой задачи.

### Тесты

- `npm.cmd run typecheck` во `frontend`
- Результат: успешно.
- `npm.cmd test` во `frontend`
- Результат: успешно, 1 файл тестов, 5 тестов пройдено.

### Следующие шаги

- Визуально проверить на эмуляторе/устройстве, что две кнопки помещаются в header на малом экране.
## 2026-07-06 04:49 — багфикс

### Промпт пользователя

> внимание: обнаружен баг. при попытке  выставления периода расписания с расстоянием 0 или 1 день приложение падает с ошибкой cannot read property "length" of null.
>
> ERROR  [TypeError: Cannot read property 'length' of null]
>
> баг необходимо залогировать и исправить

### Что сделал Codex

- Создал отдельный баг-лог для падения SCR-003 при пустом коротком периоде.
- Исправил backend, чтобы пустые списки сериализовались как `[]`, а не `null`.
- Добавил нормализацию списковых ответов во frontend API-клиенте.
- Защитил экран расписания через `slots = query.data?.items ?? []`.
- Добавил регрессионный frontend-тест на нормализацию `items: null`.

### Изменённые файлы

- `mock_backend/internal/storage/postgres/store.go` — пустые списки слотов, броней и уведомлений инициализируются пустыми массивами.
- `frontend/src/api/client.ts` — добавлена нормализация `items: null` в `items: []`.
- `frontend/app/schedule/index.tsx` — экран расписания использует безопасный список `slots`.
- `frontend/tests/api-client.test.ts` — добавлен регрессионный тест.
- `logs/BUG-20260706-schedule-null-items-crash.md` — создан и закрыт баг-лог.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Исправить проблему на двух уровнях: backend должен отдавать корректный пустой массив, frontend должен быть устойчив к некорректному `null`.
- Не менять API-контракт: по контракту `items` остаётся массивом.

### Тесты

- `npm.cmd run typecheck` во `frontend`
- Результат: успешно.
- `npm.cmd test` во `frontend`
- Результат: успешно, 2 файла тестов, 6 тестов пройдено.
- `go test ./...` в `mock_backend`
- Результат: не выполнен, команда `go` недоступна в PATH.

### Следующие шаги

- Ручно проверить на устройстве/эмуляторе выбор периода 0 или 1 день без доступных классов.
- Запустить `go test ./...` в окружении с установленным Go.
## 2026-07-06 04:57 — багфикс

### Промпт пользователя

> Внимание: обнаружен баг. при выходе из аккаунта в расписании класс, на который клиент записан, все еще отображается как "вы записаны на этот класс". очевидно, что у нас либо расписание не подтягивается заново как для незалогиненного пользователя и состояние остается, либо разлогинивание некорректно срабатывает. баг необходимо залогировать и исправить

### Что сделал Codex

- Создал отдельный баг-лог для stale-состояния расписания после logout.
- Проверил `ScheduleScreen`, `AccountScreen`, `sessionStore` и `queryKeys`.
- Исправил построение меток `Вы записаны`: при отсутствии токена персональные брони больше не используются.
- Добавил очистку персональных React Query cache при выходе из аккаунта.
- После logout пользователь возвращается на `/schedule`.

### Изменённые файлы

- `frontend/app/schedule/index.tsx` — `activeBookingsBySlot` теперь пустой без `token`.
- `frontend/app/account/index.tsx` — logout очищает query-кэши `bookings`, `notifications`, `booking` и возвращает на расписание.
- `logs/BUG-20260706-stale-booking-marker-after-logout.md` — создан и закрыт баг-лог.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Не менять backend: проблема находится в frontend state/cache.
- Не сбрасывать публичный кэш расписания при logout, потому что он не содержит персональных данных.
- Удалять только персональные кэши: брони, детали брони и уведомления.

### Тесты

- `npm.cmd run typecheck` во `frontend`
- Результат: успешно.
- `npm.cmd test` во `frontend`
- Результат: успешно, 2 файла тестов, 6 тестов пройдено.

### Следующие шаги

- Ручно проверить сценарий: login → расписание с меткой → выход → расписание без метки.

## 2026-07-06 05:07 — багфикс

### Промпт пользователя

> хорошо. для всех этих багрепортов укажи источник - автоматизированное тестирование с помощью ИИ без участия разработчика(мы должны знать, что это не юнит тесты, а осмотр архитектуры и поведения системы с помощью ИИ). поправь эти баги, залогируй произошедшее в ai_journal.

### Что сделал Codex

- Зафиксировал источник обнаружения в двух баг-логах: автоматизированное тестирование с помощью ИИ без участия разработчика, то есть осмотр архитектуры и поведения системы, не unit-тесты.
- Исправил mock-backend demo-auth: защищённые методы теперь получают клиента из `clientId`, встроенного в demo-token, а не через первого клиента из БД.
- Исправил восстановление frontend-сессии: после чтения token приложение вызывает `/me` и восстанавливает `client`, при ошибке очищает сессию.

### Изменённые файлы

- `mock_backend/internal/service/service.go` — demo-token привязан к `clientId`, `CurrentClient` получает token и загружает клиента по ID.
- `mock_backend/internal/http/router.go` — auth middleware передаёт token в service.
- `mock_backend/internal/storage/postgres/store.go` — удалён небезопасный `DemoClient`.
- `frontend/src/features/auth/sessionStore.ts` — `restore()` восстанавливает клиента через `api.getCurrentClient()`.
- `logs/BUG-20260706-demo-token-current-client.md` — создан баг-лог с источником обнаружения.
- `logs/BUG-20260706-session-restore-client.md` — создан баг-лог с источником обнаружения.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Для учебного mock-backend не вводить полноценную auth-инфраструктуру; минимально связать demo-token с `clientId`, чтобы сохранить MVP-скоуп и устранить смешивание клиентских данных.
- При восстановлении frontend-сессии использовать существующий endpoint `GET /me`, а не хранить отдельную копию клиента в локальном storage.

### Тесты

- `npm.cmd run typecheck` во `frontend`
- Результат: успешно.
- `npm.cmd test` во `frontend`
- Результат: успешно, 2 файла тестов, 6 тестов пройдено.
- `go test ./...` в `mock_backend`
- Результат: не выполнен, команда `go` не найдена в PATH.

### Следующие шаги

- Запустить `go test ./...` в окружении с установленным Go.
- Ручно проверить сценарии: вход клиентом A/B, `/me` и «Мои записи» для каждого клиента; refresh/restart приложения после входа.

## 2026-07-06 05:20 — анализ

### Промпт пользователя

> согласно текущему состоянию системы проанализируй соответствие ее МВП, выбранному на стадии формирования ТЗ

### Что сделал Codex

- Сверил текущую структуру frontend, mock-backend, API-клиента, маршрутов backend, README, тестов и логов багов с MVP-скоупом, зафиксированным в ТЗ и фича-листе.
- Проверил наличие ключевых клиентских сценариев: авторизация, расписание, фильтр дат, карточка класса, создание брони, offline-payment, заглушка онлайн-оплаты, мои брони, добавление участников, отмена, уведомления, оценка шефа, legal.
- Проверил отсутствие явных выходов за MVP: реальной онлайн-оплаты, админки, интерфейса шефа, `/studio-info`, `StudioInfo`, таблицы `studios`.

### Изменённые файлы

- `.agents/AI_JOURNAL.md` — добавлена запись об аналитической сверке MVP.

### Принятые решения

- Отдельный задачный лог в `logs/` не создавался, потому что продуктовые артефакты, API, код и документация MVP не изменялись; зафиксирован только обязательный общий журнал анализа.

### Тесты

- `npm.cmd test` во `frontend`
- Результат: успешно, 2 файла тестов, 6 тестов пройдено.
- `npm.cmd run typecheck` во `frontend`
- Результат: успешно.
- `go test ./...` в `mock_backend`
- Результат: не выполнен, команда `go` не найдена в PATH.
- `npm test` и `npm run typecheck` через PowerShell
- Результат: не выполнены из-за блокировки `npm.ps1`; повторно успешно запущены через `npm.cmd`.

### Следующие шаги

- Запустить backend-тесты в окружении с установленным Go.
- Провести ручной smoke-test полного сценария: auth -> schedule -> slot -> booking -> account -> cancel/review.
## 2026-07-06 08:08 — документация

### Промпт пользователя

> сгенерируй таблицу поверхностных тестов, основываясь на известных артефактах и коде фронтенда\бекенда. обрати отдельное внимание на необходимость учета разработки одновременно под андроид и ios. обрати отдельное внимание на тесты, связанные с layout-компоновкой приложения - для них сгенерируй отдельную таблицу тестов. полученные таблицы оформи в артефакты в папке testing.

### Что сделал Codex

- Проверил структуру проекта, OpenAPI-контракт, критерии приемки, фичи MVP, Expo/React Native frontend, Go mock-backend, текущие автотесты и известные баг-логи.
- Создал папку `testing` и оформил тестовые таблицы как проектные артефакты.
- Сформировал отдельную таблицу layout-тестов с обязательной проверкой Android и iOS.
- Создал задачный лог для работы с тестовыми артефактами.

### Изменённые файлы

- `testing/README.md` — создана навигация по тестовым артефактам.
- `testing/surface-test-table.md` — создана таблица поверхностных smoke/regression тестов.
- `testing/layout-test-table.md` — создана отдельная таблица layout-тестов.
- `logs/TASK-20260706-surface-testing-artifacts.md` — создан задачный лог.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Ограничить артефакты поверхностным smoke/regression набором, а не полноценной тест-стратегией, чтобы не раздувать MVP.
- Считать проверку только через Expo Web недостаточной для приемки мобильного MVP; P0 UI-сценарии должны проверяться на Android и iOS.
- Layout-проверки вынести в отдельный артефакт из-за платформенных рисков Safe Area, клавиатуры, системного размера шрифта и длинных русских текстов.

### Тесты

- не запускались
- Результат: изменения документационные; выполнена ручная сверка с релевантными артефактами и кодом.

### Следующие шаги

- Выполнить ручной smoke на Android и iOS по P0 строкам таблиц.
- При необходимости автоматизировать часть P0 проверок после стабилизации demo-сценариев и тестового окружения.
## 2026-07-06 08:15 — документация

### Промпт пользователя

> создай подобную таблицу тестов для ручного тестирования

### Что сделал Codex

- Создал отдельный артефакт `testing/manual-test-table.md` для ручной приемочной и регрессионной проверки MVP.
- Добавил в таблицу ручные тест-кейсы с приоритетами, платформами Android/iOS, предусловиями, тестовыми данными, шагами, ожидаемым результатом, полями фактического результата, статуса и ссылки на дефект.
- Обновил `testing/README.md` и задачный лог по тестовым артефактам.

### Изменённые файлы

- `testing/manual-test-table.md` — создана таблица ручного тестирования.
- `testing/README.md` — добавлена ссылка на таблицу ручного тестирования.
- `logs/TASK-20260706-surface-testing-artifacts.md` — дополнен задачный лог.
- `.agents/AI_JOURNAL.md` — добавлена текущая запись.

### Принятые решения

- Оформить ручные тесты отдельным артефактом, а не смешивать их с поверхностной smoke-матрицей и layout-матрицей.
- Оставить поля `Фактический результат`, `Статус` и `Дефект/лог` пустыми для заполнения после реального ручного прогона.
- Сохранить обязательное требование: P0 ручные UI-проверки выполняются отдельно на Android и iOS.

### Тесты

- не запускались
- Результат: изменения документационные; выполнена проверка наличия нового артефакта.

### Следующие шаги

- Провести ручной прогон по `testing/manual-test-table.md` на Android и iOS и заполнить фактические результаты.
