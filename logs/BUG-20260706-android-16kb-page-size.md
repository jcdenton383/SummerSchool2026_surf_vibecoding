# BUG-20260706-android-16kb-page-size — Android 16 KB page size incompatibility

## Статус

`fixed`

## Где найден

- Запуск frontend-приложения в Android emulator Pixel 7 после устранения проблемы с кириллицей в пути проекта.
- Expo/React Native native runtime.

## Связь с ТЗ и требованиями

- `frontend/IMPLEMENTATION_CHECKLIST.md` — критерий запуска приложения без ошибок.
- `TZ_application/07-technology-stack.md` — Expo + React Native + TypeScript.
- `logs/BUG-20260706-metro-project-root-header.md` — исходный баг-репорт, из которого 16 KB проблема выделена как отдельная причина.

## Описание

После устранения проблемы с кириллицей остаётся ошибка Android:

```text
this app isnt 16 kb compatible
```

Это не ошибка экранной бизнес-логики и не ошибка TypeScript-кода. Для Android 16 KB page size критичны нативные `.so` библиотеки приложения или runtime-контейнера, через который запускается Expo-приложение.

## Шаги воспроизведения

1. Запустить frontend в Android emulator Pixel 7 с образом, использующим или проверяющим 16 KB page size.
2. Открыть приложение через Expo/React Native runtime.
3. Получить сообщение о несовместимости с 16 KB.

## Фактический результат

Приложение не открывается на Android runtime с требованием 16 KB compatibility.

## Ожидаемый результат

Приложение должно запускаться на Android runtime, совместимом с 16 KB page size.

## Причина

Текущая frontend-имплементация использует Expo SDK 52 и React Native 0.76:

```json
"expo": "~52.0.20",
"react-native": "0.76.9"
```

Фактически установлено:

```text
expo@52.0.49
react-native@0.76.9
react-native-reanimated@3.16.7
react-native-screens@4.4.0
react-native-gesture-handler@2.20.2
react-native-safe-area-context@4.12.0
expo-secure-store@14.0.1
```

В проекте нет собственного `frontend/android/` и собственного C/C++ кода. Но frontend использует React Native и нативные зависимости Expo/React Navigation:

- `react-native-reanimated`;
- `react-native-screens`;
- `react-native-gesture-handler`;
- `react-native-safe-area-context`;
- `expo-secure-store`;
- Expo Go или иной Expo native runtime при запуске на Android.

Официальная поддержка Android 16 KB page size заявлена начиная с React Native 0.77. Текущая версия `react-native@0.76.9` ниже этого порога, поэтому базовый native runtime проекта является наиболее вероятной причиной ошибки.

## Исправление

Выполнена миграция frontend-зависимостей с Expo SDK 52 / React Native 0.76.9 на Expo SDK 55 / React Native 0.83.6.

Ключевые изменения:

```text
expo: ~52.0.20 -> ~55.0.0
react-native: 0.76.9 -> 0.83.6
react: 18.3.1 -> 19.2.0
react-dom: 18.3.1 -> 19.2.0
expo-router: ~4.0.14 -> ~55.0.16
react-native-reanimated: ~3.16.1 -> 4.2.1
react-native-screens: ~4.4.0 -> ~4.23.0
```

После промежуточного конфликта npm старое дерево `node_modules` и `package-lock.json` было пересобрано с нуля по обновлённому `package.json`.

## Изменённые артефакты

- `logs/BUG-20260706-android-16kb-page-size.md` — создан отдельный баг-репорт по 16 KB.
- `.agents/AI_JOURNAL.md` — добавлена запись об анализе.
- `frontend/package.json` — обновлены Expo SDK, React Native, React и связанные native-зависимости.
- `frontend/package-lock.json` — пересобран lockfile после миграции зависимостей.

## Журнал работы

### 2026-07-06 01:59 — анализ

#### Промпт пользователя

> проанализируй баг описанный в багрепорте. часть, связанная с кириллицей, устранена. необходимо решить проблему с 16kb. проанализируй нашу имплементацию фронтенда и найди причину проблемы

#### Краткие действия Codex

- Проверил frontend-структуру: managed Expo, собственного `android/` проекта нет.
- Проверил `frontend/package.json` и фактически установленные версии.
- Сопоставил стек с требованием Android 16 KB page size.
- Определил наиболее вероятную причину: Expo SDK 52 / React Native 0.76.9 ниже версии RN 0.77, где заявлена поддержка 16 KB.

#### Тесты и проверки

- `Get-ChildItem -LiteralPath 'frontend' -Force`
- Результат: собственного `android/` проекта нет.
- `rg --files frontend | rg "(^|/)android/|\\.so$|CMakeLists|build.gradle|gradle.properties|AndroidManifest.xml"`
- Результат: Android/native файлы найдены только в `node_modules`, не в коде приложения.
- `npm.cmd ls expo react-native react-native-reanimated react-native-screens react-native-gesture-handler react-native-safe-area-context expo-secure-store --depth=0`
- Результат: стек Expo SDK 52 / RN 0.76.9 подтверждён.
- Android emulator Codex не запускал.

### 2026-07-06 02:12 — багфикс

#### Промпт пользователя

> внеси необходимые изменения

#### Краткие действия Codex

- Обновил Expo SDK до 55 и синхронизировал React Native/native-зависимости до версий, совместимых с SDK 55.
- Исправил `@types/react` до версии, ожидаемой Expo SDK 55.
- Удалил старые `node_modules` и `package-lock.json`, затем пересобрал зависимости с нуля из обновлённого `package.json`.
- Проверил согласованность Expo-зависимостей, TypeScript и unit-тесты.

#### Тесты и проверки

- `npm.cmd install expo@~55.0.0`
- Результат: Expo обновлён, но потребовалась синхронизация зависимостей.
- `npx.cmd expo install --fix`
- Результат: выявлены ожидаемые версии SDK 55, установка остановилась из-за старого промежуточного дерева зависимостей.
- `npm.cmd install`
- Результат: после очистки `node_modules` и `package-lock.json` зависимости установлены успешно.
- `npm.cmd ls expo react react-dom react-native expo-router react-native-reanimated react-native-screens --depth=0`
- Результат: `expo@55.0.27`, `react-native@0.83.6`, `react@19.2.0`, `expo-router@55.0.16`.
- `npx.cmd expo install --check`
- Результат: `Dependencies are up to date`.
- `npm.cmd run typecheck`
- Результат: успешно.
- `npm.cmd test`
- Результат: успешно, 1 файл тестов, 5 тестов пройдены.
- Android emulator Codex не запускал.

## Проверка после исправления

- `npx.cmd expo install --check` — зависимости согласованы с Expo SDK 55.
- `npm.cmd run typecheck` — успешно.
- `npm.cmd test` — успешно, 5 тестов пройдены.
- Android emulator Pixel 7 не запускался в Codex, поэтому runtime-проверка 16 KB остаётся за пользователем.

## Оставшиеся риски

- Нужно удалить старый Expo Go/runtime с эмулятора, если он был установлен до миграции, и открыть приложение заново.
- Нужно подтвердить запуск на конкретном Android emulator Pixel 7 с 16 KB page size.
- `npm install` сообщает о 14 audit vulnerabilities; это не проверялось и не исправлялось в рамках 16 KB бага.
