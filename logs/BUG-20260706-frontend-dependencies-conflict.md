# BUG-20260706-frontend-dependencies-conflict — Конфликт frontend dependencies

## Статус

`fixed`

## Где найден

- `frontend/package.json`
- Команда установки зависимостей frontend: `npm install`

## Связь с ТЗ и требованиями

- `frontend/IMPLEMENTATION_CHECKLIST.md` — итерация 0, каркас приложения и установка frontend-зависимостей.
- `TZ_application/07-technology-stack.md` — утверждённый frontend-стек: Expo, React Native, TypeScript, Expo Router, TanStack Query, Zustand, React Hook Form, Zod.
- `logs/TASK-20260705-frontend-implementation.md` — реализация frontend MVP и оставшийся риск проверки зависимостей.

## Описание

Сгенерированный ранее блок `dependencies` в `frontend/package.json` был неполным для Expo Router/Expo SDK 52 и конфликтовал при установке. Из-за этого frontend-зависимости не устанавливались корректно, а запуск проекта и дальнейшие проверки были заблокированы.

## Шаги воспроизведения

1. Открыть `frontend/package.json` с первоначально сгенерированным блоком `dependencies`.
2. Запустить установку зависимостей:

```powershell
npm install
```

3. Получить конфликт зависимостей или невозможность корректной установки Expo Router окружения.

## Фактический результат

Первоначально сгенерированный набор зависимостей не позволял установить frontend-проект без конфликтов.

## Ожидаемый результат

`frontend/package.json` должен содержать согласованный набор зависимостей для Expo SDK 52, Expo Router, React Native и связанных runtime-пакетов, чтобы `npm install` мог завершиться успешно.

## Причина

При генерации frontend-проекта был указан недостаточный и конфликтный блок `dependencies`: не были явно добавлены обязательные runtime-зависимости Expo Router/Expo SDK 52, включая `expo-constants`, `expo-linking`, `expo-status-bar`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`.

## Исправление

По сообщению пользователя, предыдущий блок `dependencies` был заменён на следующий:

```json
"dependencies": {
  "@expo/vector-icons": "^14.0.4",
  "@hookform/resolvers": "^3.9.1",
  "@tanstack/react-query": "^5.62.7",
  "expo": "~52.0.20",
  "expo-constants": "~17.0.8",
  "expo-linking": "~7.0.5",
  "expo-router": "~4.0.14",
  "expo-secure-store": "~14.0.0",
  "expo-status-bar": "~2.0.1",
  "react": "18.3.1",
  "react-hook-form": "^7.54.2",
  "react-native": "0.76.5",
  "react-native-gesture-handler": "~2.20.2",
  "react-native-reanimated": "~3.16.1",
  "react-native-safe-area-context": "4.12.0",
  "react-native-screens": "~4.4.0",
  "zod": "^3.24.1",
  "zustand": "^5.0.2"
}
```

## Изменённые артефакты

- `frontend/package.json` — блок `dependencies` был заменён пользователем на расширенный набор Expo/React Native зависимостей.
- `logs/BUG-20260706-frontend-dependencies-conflict.md` — создан баг-репорт и статус установлен в `fixed`.
- `.agents/AI_JOURNAL.md` — добавлена запись о фиксации баг-репорта.

## Журнал работы

### 2026-07-06 00:38 — багфикс

#### Промпт пользователя

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

#### Краткие действия Codex

- Проверил текущий `frontend/package.json`.
- Создал баг-репорт по конфликту frontend dependencies.
- Зафиксировал причину, исправление и статус `fixed`.

#### Тесты и проверки

- `Get-Content -Raw -Encoding UTF8 frontend\package.json`
- Результат: текущий `package.json` содержит расширенный набор зависимостей Expo/React Native.

## Проверка после исправления

- Полная проверка `npm install` не выполнялась Codex в текущем окружении.
- Причина: в окружении ранее отсутствовали `node` и `npm`; пользователь сообщил, что конфликтный блок был заменён.

## Оставшиеся риски

- Текущий `frontend/package.json`, прочитанный Codex, отличается от переданного пользователем блока в двух местах:
  - `@expo/vector-icons`: в файле `~14.0.4`, в переданном блоке `^14.0.4`;
  - `react-native`: в файле `0.76.9`, в переданном блоке `0.76.5`.
- Если требуется точное соответствие переданному блоку, нужна отдельная правка `frontend/package.json`.
