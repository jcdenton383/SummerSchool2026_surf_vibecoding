# SEQ. Создание брони

## Назначение

Диаграмма фиксирует API-сценарий создания брони из мобильного приложения с основными ветками ответа:
- `201 Created` - бронь создана;
- `409 Conflict` - бронь не создана из-за конфликта состояния слота или мест;
- `410 Gone` - слот больше недоступен для бронирования.

## Sequence-диаграмма

```mermaid
sequenceDiagram
    autonumber
    actor Client as Клиент
    participant App as Мобильное приложение
    participant API as API / существующий бэкенд

    Client->>App: Выбирает класс и заполняет участников
    App->>App: Валидирует форму
    Note over App: Имя каждого участника, аллергия есть/нет,<br/>комментарий при наличии аллергии,<br/>выбор инвентаря, способ оплаты

    alt Форма заполнена некорректно
        App-->>Client: Показывает ошибки формы
    else Форма валидна
        Client->>App: Подтверждает запись
        App->>API: POST /bookings
        Note over App,API: slotId, participants[], equipmentOption,<br/>paymentMethod, expectedTotalAmount

        alt 201 Created
            API-->>App: 201 Created + Booking
            App-->>Client: Показывает успешную запись
            App->>API: GET /bookings/my
            API-->>App: Актуальный список броней клиента
        else 409 Conflict
            API-->>App: 409 Conflict + errorCode
            Note over API,App: Возможные причины:<br/>no_seats, stale_slot_data,<br/>participant_limit_exceeded,<br/>validation_conflict
            App->>API: GET /slots/{slotId}
            API-->>App: Актуальное состояние слота
            App-->>Client: Показывает отказ и обновлённые места
        else 410 Gone
            API-->>App: 410 Gone + errorCode slot_cancelled_or_unavailable
            App->>API: GET /slots/{slotId}
            API-->>App: Слот со статусом cancelled_by_studio / unavailable
            App-->>Client: Показывает, что класс больше недоступен для записи
        else 5xx / network error
            API--xApp: Ошибка сервера или сети
            App-->>Client: Показывает понятное сообщение без создания брони
        end
    end
```

## Правила обработки

1. При `201 Created` приложение считает бронь созданной только по телу ответа API.
2. При `409 Conflict` приложение не создаёт локальную бронь, обновляет слот и предлагает пользователю выбрать доступное количество мест или другой класс.
3. При `410 Gone` приложение не повторяет запрос создания брони для этого слота и показывает состояние недоступности.
4. При сетевой ошибке или `5xx` приложение не создаёт локальную бронь и предлагает повторить действие позже.
5. Черновик формы может сохраняться локально, но не является бизнес-сущностью.
