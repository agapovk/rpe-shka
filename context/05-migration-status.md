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

## Фаза 1 — Каркас приложения ✓

**Цель:** пустое SPA (Vite + TanStack Router) запускается, все роуты открываются, тема переключается.

> Решение в ходе фазы: TanStack Start убран — для офлайн-SPA без сервера он давал только
> обёртку над Router. Чистый Vite + `@tanstack/router-plugin`, сборка — статика.

- [x] Инициализировать проект: `package.json`, `tsconfig.json`, pnpm
- [x] Установить `@tanstack/react-router`, `@tanstack/router-plugin`, `react@19`, `@vitejs/plugin-react`, `tailwindcss@4`, `@tailwindcss/vite`
- [x] `vite.config.ts` — `tanstackRouter()` + `viteReact()` + `tailwindcss()`, без SSR
- [x] `index.html` (инлайн-скрипт темы до первой отрисовки) + `src/main.tsx` (RouterProvider)
- [x] `src/router.tsx` (createRouter)
- [x] `src/routes/__root.tsx` — ThemeProvider + Outlet
- [x] Роуты-заглушки: `index.tsx`, `sessions.$id.survey.tsx`, `sessions.$id.results.tsx`, `settings.tsx`
- [x] `src/styles/globals.css` — Tailwind `@theme`: 6 семантических токенов + 4 RPE-бакета через `light-dark()`, тема через `color-scheme`
- [x] Шрифты через `@fontsource` (Barlow Condensed, Inter)
- [x] `shared/ui/button.tsx` — чистый Tailwind, без CVA
- [x] Обработка ошибок рендера — `defaultErrorComponent` роутера (свой ErrorBoundary не нужен)
- [x] `shared/context/theme.tsx` (ThemeProvider + useTheme) + `shared/ui/theme-toggle.tsx`
- [x] Biome + husky + lint-staged
- [x] Скрипты в `package.json`: dev / build / start / typecheck / test / test:watch / check:fix
- [x] Проверка: `pnpm dev` → HTTP 200, `pnpm build` → ✓, `tsc --noEmit` → ✓, `biome check` → ✓

---

## Фаза 2 — Слой данных (Dexie) ✓

**Цель:** БД создаётся, дефолтные данные сеются при первом запуске.

> Решение в ходе фазы: сид через `db.on('populate')` вместо `seedDatabase()` с проверкой
> `count()` — у count-подхода гонка (StrictMode-эффект в dev вызывается дважды, оба вызова
> видели пустую таблицу → 44 игрока вместо 22). `populate` выполняется атомарно ровно один
> раз при создании БД.

- [x] Установить `dexie`, `dexie-react-hooks`
- [x] `shared/db/dexie.ts` — схема + типы сущностей (Player, Category, Session, RpeEntry) + populate-сид
- [x] `shared/db/seed.ts` — данные сида: дефолтный ростер (22 игрока) + категории MD-4…MD+1
- [x] В `__root.tsx` при старте: `db.open()` + `navigator.storage.persist()`
- [x] Проверка (headless Chromium): `rpe-db` создаётся, 22 игрока + 6 категорий, повторная
      загрузка не дублирует, удалённый игрок не пересеивается

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
- [ ] `shared/ui/theme-section.tsx` (выбор Light/Dark/System)
- [ ] `shared/ui/storage-section.tsx` (использование IndexedDB + CLEAR ALL)

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
□ pnpm check — чист (ultracite)
□ pnpm test — все тесты зелёные
□ Базовый флоу: создать → оценить → результаты → XLSX
□ Офлайн: DevTools Offline → приложение работает, данные сохраняются
□ PWA: Lighthouse installable score
```
