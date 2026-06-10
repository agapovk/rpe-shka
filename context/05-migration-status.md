# Статус разработки

Каждая фаза — отдельная ветка `feat/phase-N-…` → PR в `main`.
Референс UI и логики — ветка `legacy` (тег `v1.0.0`). Код и данные оттуда не мигрируем, пишем с нуля.

---

## Фаза 0 — Документация `context/`

- [x] `context/new-release.md` — план, стек, решения
- [x] `context/01-overview.md` — приложение, домен, флоу
- [x] `context/02-architecture-vsa.md` — VSA, правила
- [x] `context/03-data-model.md` — типы, Dexie-схема
- [x] `context/04-stack-conventions.md` — стек, команды, соглашения
- [x] `context/05-migration-status.md` — этот файл

---

## Фаза 1 — Каркас приложения

**Цель:** пустое приложение на TanStack Start запускается, все роуты открываются, тема переключается.

- [ ] Инициализировать проект: `package.json`, `tsconfig.json`, pnpm
- [ ] Установить `@tanstack/react-start`, `@tanstack/react-router`, `react@19`, `@vitejs/plugin-react`, `tailwindcss@4`, `@tailwindcss/vite`
- [ ] `vite.config.ts` — **SPA-режим, SSR выключен**
- [ ] `src/router.tsx` (createRouter)
- [ ] `src/routes/__root.tsx` — ThemeProvider, ErrorBoundary, шрифты
- [ ] Роуты-заглушки: `index.tsx`, `sessions.$id.survey.tsx`, `sessions.$id.results.tsx`, `settings.tsx`
- [ ] `src/styles/globals.css` — Tailwind `@theme`, переменные темы, RPE-цвета (референс — `app/globals.css` в ветке `legacy`)
- [ ] Шрифты через `@fontsource` (Barlow Condensed, Inter, JetBrains Mono)
- [ ] `shared/ui/Button.tsx` — чистый Tailwind, без CVA
- [ ] `shared/ui/ErrorBoundary.tsx`
- [ ] `shared/context/theme.tsx` (ThemeProvider + useTheme) + `shared/ui/ThemeToggle.tsx`
- [ ] Ultracite/Biome + husky + lint-staged
- [ ] Скрипты в `package.json`: dev / build / start / typecheck / test
- [ ] Проверка: `pnpm dev`, `pnpm build`, `tsc --noEmit` — без ошибок

---

## Фаза 2 — Слой данных (Dexie)

**Цель:** БД создаётся, дефолтные данные сеются при первом запуске.

- [ ] Установить `dexie`, `dexie-react-hooks`
- [ ] `shared/db/dexie.ts` — схема + типы сущностей (Player, Category, Session, RpeEntry)
- [ ] `shared/db/seed.ts` — `seedDatabase()`: дефолтный ростер + категории MD-4…MD+1
- [ ] В `__root.tsx` при старте: `seedDatabase()` + `navigator.storage.persist()`
- [ ] Проверка: в DevTools → IndexedDB видна `rpe-db` с игроками и категориями

---

## Фаза 3 — Срезы (по одному, каждый целиком: model → queries/mutations → ui → роут)

### 3.1 `manage-roster`
- [ ] `queries.ts` — usePlayers
- [ ] `mutations.ts` — addPlayer, updatePlayer, removePlayer
- [ ] `ui/` — RosterSection, RosterEditRow
- [ ] Подключить в `settings.tsx`
- [ ] Проверка: CRUD игроков работает, список реактивен

### 3.2 `manage-categories`
- [ ] `queries.ts` — useCategories
- [ ] `mutations.ts` — addCategory, updateCategory, removeCategory
- [ ] `ui/` — CategoriesSection
- [ ] Подключить в `settings.tsx`
- [ ] Проверка: CRUD категорий работает

### 3.3 `manage-session`
- [ ] `model.ts` — calcSessionSummary, calcHomeStats, suggestSessionName
- [ ] `queries.ts` — useSessions
- [ ] `mutations.ts` — createSession, deleteSession, duplicateSession, updateSession
- [ ] `ui/` — SessionCard, StatStrip, NewSessionButton
- [ ] Подключить в `index.tsx` (главная)
- [ ] Проверка: создание/удаление/дублирование сессий, статистика шапки

### 3.4 `record-rpe`
- [ ] `model.ts` — валидация score/note
- [ ] `queries.ts` — useSessionEntries, useSessionPlayers
- [ ] `mutations.ts` — setScore, clearScore, updateSessionName
- [ ] `ui/` — CaptureScreen, ScoreSheet, RpeScale, RosterScoreRow
- [ ] Подключить в `sessions.$id.survey.tsx`
- [ ] Проверка: оценки ставятся/снимаются, прогресс 18/22, фильтры ALL/DONE/PENDING

### 3.5 `view-results`
- [ ] `model.ts` — rpeColor, rpeBucket, calcSessionStats
- [ ] `queries.ts` — useSessionWithEntries
- [ ] `mutations.ts` — exportXlsx через `await import('xlsx')`
- [ ] `ui/` — ResultsScreen, Stat, таблица игроков
- [ ] Подключить в `sessions.$id.results.tsx`
- [ ] Проверка: avg/hi/lo/≥8 считаются верно, XLSX открывается

### 3.6 Settings: остальное
- [ ] `shared/ui/ThemeSection.tsx` (выбор Light/Dark/System)
- [ ] `shared/ui/StorageSection.tsx` (использование IndexedDB + CLEAR ALL)

---

## Фаза 4 — PWA + тесты + деплой

**Цель:** устанавливаемое PWA, тесты зелёные, живое демо.

- [ ] Установить `vite-plugin-pwa`
- [ ] Manifest: name, icons 192/512/maskable, theme_color
- [ ] Workbox: precache app shell, стратегия **CacheFirst**, `registerType: 'autoUpdate'`
- [ ] Проверить Lighthouse: installable, offline works
- [ ] Установить `vitest`
- [ ] Тесты: `rpeBucket`, `calcSessionStats`, `calcSessionSummary`, `calcHomeStats`
- [ ] `pnpm test` зелёный
- [ ] Задеплоить (Netlify / Cloudflare Pages / Vercel)
- [ ] README портфолио-уровня

---

## Проверка готовности к деплою

```
□ pnpm build — без ошибок
□ tsc --noEmit — без ошибок
□ pnpm dlx ultracite check — чист
□ pnpm test — все тесты зелёные
□ Базовый флоу: создать → оценить → результаты → XLSX
□ Офлайн: DevTools Offline → приложение работает, данные сохраняются
□ PWA: Lighthouse installable score
```
