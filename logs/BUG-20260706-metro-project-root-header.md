# BUG-20260706-metro-project-root-header — Android/web запуск падает из-за невалидного header `X-React-Native-Project-Root`

## Статус

`in_progress`

## Где найден

- Запуск frontend-приложения в Android emulator Pixel 7.
- Expo/Metro dev server.
- Терминал frontend.
- Путь проекта:

```text
C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend
```

## Связь с ТЗ и требованиями

- `frontend/IMPLEMENTATION_CHECKLIST.md` — итерация 0, критерий запуска приложения без ошибок.
- `TZ_application/07-technology-stack.md` — Expo + React Native + TypeScript.
- `logs/TASK-20260705-frontend-implementation.md` — реализация frontend MVP и проверки запуска.

## Описание

При открытии приложения в Android emulator Pixel 7 отображается ошибка:

```text
this app isnt 16 kb compatible
```

Терминал при этом выдаёт ошибку Metro/Node:

```text
TypeError: Invalid character in header content ["X-React-Native-Project-Root"]
```

Ошибка возникает в Expo CLI:

```text
node_modules\@expo\cli\src\start\server\metro\dev-server\createMetroMiddleware.ts:71:9
```

## Шаги воспроизведения

1. Открыть проект из текущего пути с кириллицей и пробелами:

```text
C:\Users\acard\Desktop\учеба\2 сем\практика производственная\proj\frontend
```

2. Запустить Expo/Android сценарий.
3. Открыть приложение в Android emulator Pixel 7.
4. Получить ошибку в эмуляторе и stack trace в терминале.

## Фактический результат

- В эмуляторе отображается ошибка совместимости приложения.
- Metro dev server падает при установке HTTP header `X-React-Native-Project-Root`.
- Node сообщает, что в содержимом header есть недопустимый символ.

## Ожидаемый результат

Frontend-приложение должно открываться в Android emulator без ошибки Metro/Node, а dev server должен корректно отдавать bundle.

## Причина

Предварительная причина по stack trace: Expo CLI/Metro пытается записать абсолютный путь проекта в HTTP header `X-React-Native-Project-Root`.

Текущий путь проекта содержит символы кириллицы:

```text
учеба
практика производственная
```

HTTP headers в Node ограничены допустимыми символами. Из-за не-ASCII символов в пути `ServerResponse.setHeader()` выбрасывает:

```text
TypeError: Invalid character in header content
```

Сообщение эмулятора `this app isnt 16 kb compatible` может быть сопутствующим или вторичным симптомом запуска в Android emulator, но terminal stack указывает на конкретный блокер Metro: невалидное значение header из-за пути проекта.

## Исправление

Пока не выполнено.

Минимальный рекомендуемый workaround:

1. Переместить или скопировать проект в путь без кириллицы и желательно без пробелов, например:

```text
C:\projects\chef-table\proj
```

2. Перейти в новый путь:

```powershell
cd C:\projects\chef-table\proj\frontend
```

3. Переустановить зависимости, если `node_modules` не переносится:

```powershell
npm.cmd install
```

4. Очистить Metro cache:

```powershell
npm.cmd run start -- --clear
```

5. Повторить запуск на Android emulator.

Альтернативный путь: проверить обновление Expo CLI/Expo SDK, если в новой версии проблема с header уже исправлена. Но это может затронуть стек проекта и должно выполняться отдельно.

## Изменённые артефакты

- `logs/BUG-20260706-metro-project-root-header.md` — создан баг-репорт.
- `.agents/AI_JOURNAL.md` — добавлена запись о регистрации бага.

## Журнал работы

### 2026-07-06 01:44 — багфикс

#### Промпт пользователя

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

#### Краткие действия Codex

- Зафиксировал баг в отдельном баг-репорте.
- Предварительно классифицировал проблему как ошибку окружения Expo/Metro при работе из пути с кириллицей.
- Указал workaround: перенести проект в ASCII-путь без кириллицы.

#### Тесты и проверки

- `Get-Content -Raw -Encoding UTF8 frontend\package.json`
- Результат: frontend использует Expo/React Native стек; terminal stack относится к Expo CLI/Metro.
- Запуск Android emulator Codex не выполнял.

## Проверка после исправления

- Исправление ещё не выполнено.

## Оставшиеся риски

- Ошибка Metro/header отделена от сообщения Android `this app isnt 16 kb compatible`.
- После устранения кириллицы оставшаяся 16 KB проблема подтверждена как отдельный Android/native compatibility баг: `logs/BUG-20260706-android-16kb-page-size.md`.
- Перенос проекта может потребовать переустановки `node_modules` и очистки Metro cache.

### 2026-07-06 01:59 — анализ

#### Промпт пользователя

> проанализируй баг описанный в багрепорте. часть, связанная с кириллицей, устранена. необходимо решить проблему с 16kb. проанализируй нашу имплементацию фронтенда и найди причину проблемы

#### Краткие действия Codex

- Повторно проанализировал баг после устранения проблемы кириллицы в пути.
- Проверил `frontend/package.json`, `frontend/app.json`, структуру `frontend/`, установленные версии Expo/React Native и наличие собственного Android-проекта.
- Установил, что сообщение 16 KB не относится к уже исправленной проблеме `X-React-Native-Project-Root`.
- Выделил 16 KB compatibility в отдельный баг-репорт.

#### Тесты и проверки

- `npm.cmd ls expo react-native react-native-reanimated react-native-screens react-native-gesture-handler react-native-safe-area-context expo-secure-store --depth=0`
- Результат: `expo@52.0.49`, `react-native@0.76.9`, `react-native-reanimated@3.16.7`, `react-native-screens@4.4.0`.
- Android emulator Codex не запускал.
