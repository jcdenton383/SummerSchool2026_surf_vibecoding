# ТЗ мобильного приложения "Шеф-стол"

Комплект артефактов описывает MVP клиентского мобильного приложения для записи на кулинарные классы студии "Шеф-стол".

## Состав

| Файл | Назначение |
|---|---|
| [01-main-specification.md](01-main-specification.md) | Полное техническое задание: цель, границы MVP, роли, функциональные и нефункциональные требования. |
| [02-screen-specification.md](02-screen-specification.md) | ТЗ по экранам SCR-001...SCR-016: назначение, данные, действия, состояния и API. |
| [03-business-logic.md](03-business-logic.md) | Сквозные бизнес-логики приложения: авторизация, расписание, бронирование, отмена, уведомления, оценка. |
| [04-api-contract-map.md](04-api-contract-map.md) | Карта использования готового OpenAPI-контракта по экранам и сценариям. |
| [05-data-and-access.md](05-data-and-access.md) | Модель данных, права доступа, владение сущностями и инварианты. |
| [06-acceptance-checklist.md](06-acceptance-checklist.md) | Критерии приёмки MVP и тестовые сценарии. |
| [07-technology-stack.md](07-technology-stack.md) | Утверждённый технологический стек MVP и правила мокового режима. |
| [08-feature-list.md](08-feature-list.md) | Фича-лист клиентского приложения для планирования разработки MVP. |

## Источники

- `requirements.md`
- `functional_requirements.md`
- `non_functional_requirements.md`
- `screen_registry.md`
- `design/SCR-001...SCR-016`
- `design/ER-model-and-entity-models.md`
- `design/entity-access-matrix.md`
- `design/SEQ-booking-creation.md`
- `api/openapi.yaml`
- `TEMPLATE/_SCREEN_TEMPLATE.md`
- `TEMPLATE/_LOGIC_TEMPLATE.md`

## Границы документа

Документ описывает клиентское приложение для Android и iOS. Административная панель, интерфейс шефа, управление расписанием, реальная онлайн-оплата, скидки, бонусы и программа лояльности не входят в MVP.
