# RPE Tracker — контекст проекта

Офлайн PWA. Тренер на поле собирает RPE (1–10) от игроков после тренировки. Данные локально в IndexedDB, без бэкенда и синхронизации. Legacy (Next.js) — ветка `legacy`/тег `v1.0.0`, только референс UI.

## Домен

- Типы — в `shared/db/dexie.ts`: `Player` (id auto++, name, num) · `Category` (id uuid, name «MD-4»…«MD+1») · `Session` (id, name, date, categoryId?, rosterIds[]) · `RpeEntry` (id, score 1–10, note?).
- **RPE бакеты:** 1–3 LIGHT · 4–6 MODERATE · 7–8 HARD · 9–10 MAXIMAL. Логика и CSS-классы — `shared/lib/rpe.ts` (`rpeBucket`, `rpeTextClass`, `rpeBgClass`).
- Категории привязаны к сессиям.

## Роуты (`src/routes/`)

`/` список сессий + шапка (7d avg, 30d) · `/sessions/:id/survey` опрос · `/sessions/:id/results` статы + XLSX · `/settings` тема/ростер/категории/storage.

## Стек

Vite + React 19 (SPA, без SSR) · TanStack Router (file-based) · Dexie + `useLiveQuery` · Tailwind v4 (без shadcn) · vite-plugin-pwa · Vitest · Ultracite/Biome.

**Убраны** (не возвращать): Next.js, TanStack Start, Zustand, shadcn, Radix, TanStack Query.

## Архитектура — VSA

`src/slices/*` (record-rpe, view-results, manage-session, manage-roster, manage-categories) + `src/shared/` (ui, lib, context, db).

- Один срез = один сценарий. Срезы не импортируют друг друга — только `shared/`.
- Внешний импорт среза — только через его `index.ts`.
- `routes/` — только `createFileRoute` + импорт из slices, без логики.
- Внутри среза: `model.ts` чистые функции (нет Dexie/React/side effects) · `queries.ts` `useLiveQuery` (чтение) · `mutations.ts` async → Dexie (не хуки) · `ui/` компоненты.

## Данные — инварианты (`shared/db/dexie.ts`)

- `RpeEntry.id = ${sessionId}-${playerId}` — детерминированный → `put()` = upsert, нет дублей.
- Сид через `db.on('populate')`, не count-check (count-check → гонка в StrictMode → задвоение ростера).
- Удаление игрока — каскад в одной транзакции: `rpeEntries` + чистка `rosterIds` всех сессий.
- Старт в `__root.tsx`: `db.open()` + `navigator.storage.persist()`.

## CSS / Тема

- Tailwind v4: конфиг через `@theme {}` в `globals.css` (не `tailwind.config.js`).
- Тема через `color-scheme` на `<html>`, не класс `.dark`.
- Токены: семантические `--color-bg/surface/text/muted/line/accent` · RPE `--color-rpe-light/moderate/hard/maximal` · шрифты `--font-display` (Oswald, цифры/заголовки) / `--font-sans` (Inter).
- Только зарегистрированные утилиты. Нет arbitrary `[var(--…)]`, нет `style=`.

## Конвенции

- Только `pnpm` (не npm/npx/yarn). Скрипты — в `package.json` (dev/build/typecheck/test/check/fix).
- Файлы kebab-case, экспорт PascalCase (`capture-screen.tsx` → `CaptureScreen`).
- `ref` как проп (React 19), не `forwardRef`. `for...of`, `const`, ранние возвраты, `?.`/`??`.
- Нет `console.log`/`debugger` в коммитах.
- Тесты — только чистые функции из `model.ts`.
- `noBarrelFile` выключено для `slices/*/index.ts` (override в `biome.json`) — осознанное VSA-решение.
- Списки игроков сортируются по имени (`byPlayerName` в `shared/db`).
