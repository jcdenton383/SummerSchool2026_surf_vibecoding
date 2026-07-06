# BUG-20260706-expo-secure-store-web-runtime — Ошибка SecureStore при открытии приложения в web runtime

## Статус

`fixed`

## Где найден

- Экран запуска приложения.
- `frontend/app/_layout.tsx` — вызов восстановления сессии в `useEffect`.
- `frontend/src/features/auth/sessionStore.ts` — метод `restore()`.
- Runtime: web, так как stack trace содержит `react-dom`.

## Связь с ТЗ и требованиями

- `TZ_application/07-technology-stack.md` — Expo SecureStore выбран для хранения access token.
- `frontend/IMPLEMENTATION_CHECKLIST.md` — итерация 2, авторизация и сессия; SecureStore token.
- `TZ_application/03-business-logic.md` — LOGIC-001: токен хранится в защищённом хранилище платформы.
- `logs/TASK-20260705-frontend-implementation.md` — реализация сессии frontend.

## Описание

При открытии приложения появляется runtime-ошибка:

```text
Uncaught Error
_ExpoSecureStore.default.getValueWithKeyAsync is not a function
```

После dismiss приложение продолжает работать.

## Шаги воспроизведения

1. Запустить frontend-приложение.
2. Открыть приложение в web runtime.
3. Дождаться выполнения `useEffect` в `app/_layout.tsx`.
4. Получить ошибку при восстановлении сессии через `SecureStore.getItemAsync`.

## Фактический результат

Приложение выбрасывает ошибку при старте:

```text
_ExpoSecureStore.default.getValueWithKeyAsync is not a function
```

Ошибка возникает в цепочке:

```text
app/_layout.tsx
src/features/auth/sessionStore.ts restore()
expo-secure-store getItemAsync()
```

После закрытия ошибки приложение продолжает работать.

## Ожидаемый результат

Приложение должно стартовать без runtime-ошибки. Восстановление токена должно:

- использовать `expo-secure-store` на поддерживаемых native-платформах;
- иметь безопасный fallback для web/development runtime;
- не блокировать запуск приложения, если защищённое хранилище недоступно.

## Причина

Предварительная причина: `expo-secure-store` был вызван в web runtime, где нативный метод `getValueWithKeyAsync` недоступен или не подключён в ожидаемом виде.

На это указывает stack trace:

```text
react-dom/cjs/react-dom.development.js
```

То есть приложение работает не в native Expo runtime, а через web/React DOM. В текущей реализации `sessionStore.ts` напрямую вызывает:

```ts
SecureStore.getItemAsync(TOKEN_KEY)
```

без проверки платформы и без fallback.

Дополнительный возможный фактор: после исправления `dependencies` был добавлен web-compatible набор Expo Router зависимостей, но слой хранения сессии остался нативно-ориентированным и не учитывает web-режим.

## Исправление

- Создан адаптер `frontend/src/features/auth/tokenStorage.ts`.
- Для native runtime используется `expo-secure-store`.
- Для web runtime используется `window.localStorage`.
- `frontend/src/features/auth/sessionStore.ts` больше не импортирует и не вызывает `expo-secure-store` напрямую.
- `restore()`, `setSession()` и `clear()` работают через `tokenStorage`.

## Изменённые артефакты

- `frontend/src/features/auth/tokenStorage.ts` — создана платформенная обёртка хранения access token.
- `frontend/src/features/auth/sessionStore.ts` — прямые вызовы `SecureStore` заменены на `tokenStorage`.
- `logs/BUG-20260706-expo-secure-store-web-runtime.md` — создан баг-репорт.
- `.agents/AI_JOURNAL.md` — добавлена запись о регистрации бага.

## Журнал работы

### 2026-07-06 00:51 — багфикс

#### Промпт пользователя

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

#### Краткие действия Codex

- Проверил `frontend/src/features/auth/sessionStore.ts`.
- Зафиксировал баг в отдельном баг-репорте.
- Предварительно определил вероятную причину: прямой вызов `expo-secure-store` в web runtime без platform fallback.

#### Тесты и проверки

- `Get-Content -Raw -Encoding UTF8 frontend\src\features\auth\sessionStore.ts`
- Результат: подтверждён прямой вызов `SecureStore.getItemAsync`, `setItemAsync`, `deleteItemAsync`.

## Проверка после исправления

- `rg -n "SecureStore|getItemAsync|setItemAsync|deleteItemAsync" frontend\src\features\auth`
- Результат: прямые вызовы `SecureStore` остались только в `tokenStorage.ts`; `sessionStore.ts` их больше не содержит.
- `npm.cmd run typecheck`
- Результат: успешно.
- `npm.cmd test`
- Результат: успешно, 1 файл тестов, 5 тестов пройдены.

## Оставшиеся риски

- Runtime web-старт в браузере Codex не проверял; нужен ручной запуск приложения и проверка, что ошибка исчезла.
- Нужно проверить поведение на native Expo runtime после изменения.
- `localStorage` допустим как web/development fallback для учебного MVP, но не является production-secure storage.

### 2026-07-06 01:08 — исправление

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

- Создал `tokenStorage.ts` с выбором хранилища по `Platform.OS`.
- Перевёл `sessionStore.ts` на использование `tokenStorage`.
- Проверил, что `sessionStore.ts` больше не вызывает `SecureStore` напрямую.
- Запустил typecheck и unit tests.

#### Тесты и проверки

- `rg -n "SecureStore|getItemAsync|setItemAsync|deleteItemAsync" frontend\src\features\auth`
- Результат: прямые вызовы `SecureStore` есть только в `tokenStorage.ts`.
- `npm.cmd run typecheck`
- Результат: успешно.
- `npm.cmd test`
- Результат: успешно, 5 тестов пройдены.
