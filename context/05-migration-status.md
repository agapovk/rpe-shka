# Статус миграции

Ветка: `feat/tanstack-migration` (создать от `main`)

---

## Фаза 0 — Документация `context/`

- [x] `context/new-release.md` — план миграции, стек, решения
- [x] `context/01-overview.md` — приложение, домен, флоу
- [x] `context/02-architecture-vsa.md` — VSA, правила, маппинг
- [x] `context/03-data-model.md` — типы, Dexie-схема, миграция
- [x] `context/04-stack-conventions.md` — стек, команды, соглашения
- [x] `context/05-migration-status.md` — этот файл

---

## Фаза 1 — Next.js → TanStack Start

**Цель:** приложение запускается на TanStack Start, UI не меняется.

- [ ] Установить `@tanstack/react-start`, `@tanstack/react-router`, `@vitejs/plugin-react`, `@tailwindcss/vite`
- [ ] Удалить `next`, `next-themes`, `postcss`, `shadcn`, `radix-ui`, `class-variance-authority`
- [ ] Удалить файлы: `next.config.mjs`, `next-env.d.ts`, `postcss.config.mjs`, `components.json`
- [ ] Создать `vite.config.ts`
- [ ] Создать `src/router.tsx` (createRouter)
- [ ] Создать `src/routes/__root.tsx` (ThemeProvider, ErrorBoundary, шрифты)
- [ ] Создать маршруты: `index.tsx`, `sessions.$id.survey.tsx`, `sessions.$id.results.tsx`, `settings.tsx`
- [ ] Перенести `app/globals.css` → `src/styles/globals.css`
- [ ] Шрифты: `next/font` → `@fontsource/*` или Google Fonts `<link>`
- [ ] Переписать `Button` как чистый Tailwind-компонент (без CVA, без Radix Slot)
- [ ] Создать `shared/context/theme.tsx` (ThemeProvider + useTheme)
- [ ] Обновить `package.json` скрипты (dev/build/start через Vite)
- [ ] Проверка: `pnpm dev` поднимается, все страницы открываются

---

## Фаза 2 — Zustand + idb-keyval → Dexie

**Цель:** данные переехали в Dexie, приложение работает как раньше.

- [ ] Установить `dexie`, `dexie-react-hooks`
- [ ] Удалить `zustand`, `idb-keyval`
- [ ] Создать `shared/db/dexie.ts` (схема: players, categories, sessions, rpeEntries)
- [ ] Создать `shared/db/seed.ts` (migrateFromZustand + seedDatabase)
- [ ] Вызвать `migrateFromZustand()` + `seedDatabase()` в `__root.tsx` при монтировании
- [ ] Удалить `lib/idb-storage.ts`
- [ ] Удалить `features/survey/survey.store.ts`
- [ ] Удалить `features/roster/roster.store.ts`
- [ ] Проверка: старые данные подхватились, новые сессии создаются

---

## Фаза 3 — Реструктуризация под VSA

**Цель:** код разложен по срезам, поведение не изменилось.

- [ ] Создать `src/slices/record-rpe/` — перенести CaptureScreen, ScoreSheet, RpeScale, RosterRows
- [ ] Создать `src/slices/view-results/` — перенести ResultsScreen, Stat, exportXlsx, calcSessionStats
- [ ] Создать `src/slices/manage-session/` — перенести SessionCard, StatStrip, calcSessionSummary, calcHomeStats
- [ ] Создать `src/slices/manage-roster/` — перенести RosterSection, RosterEditRow
- [ ] Создать `src/slices/manage-categories/` — перенести CategoriesSection
- [ ] Создать `src/slices/theme-toggle/` — перенести ThemeToggle, ThemeSection
- [ ] Перенести `components/ui/ErrorBoundary.tsx` → `shared/ui/`
- [ ] Перенести `lib/utils.ts` → `shared/lib/utils.ts`
- [ ] Перенести `fmtDate`, `suggestSessionName` → `shared/lib/date.ts`
- [ ] Удалить старые папки `components/`, `features/`, `hooks/`, `lib/`
- [ ] Проверка: `tsc --noEmit` чист, приложение работает

---

## Фаза 4 — Подключить Dexie к UI

**Цель:** Zustand убран, весь data-слой через Dexie + useLiveQuery.

- [ ] `slices/record-rpe/queries.ts` — useSessionEntries, useSessionPlayers
- [ ] `slices/record-rpe/mutations.ts` — setScore, clearScore, updateSessionName
- [ ] `slices/view-results/queries.ts` — useSessionWithEntries
- [ ] `slices/manage-session/queries.ts` — useSessions
- [ ] `slices/manage-session/mutations.ts` — createSession, deleteSession, duplicateSession, updateSession
- [ ] `slices/manage-roster/queries.ts` — usePlayers
- [ ] `slices/manage-roster/mutations.ts` — addPlayer, updatePlayer, removePlayer
- [ ] `slices/manage-categories/queries.ts` — useCategories
- [ ] `slices/manage-categories/mutations.ts` — addCategory, updateCategory, removeCategory
- [ ] Заменить все `useSurveyStore` / `useRosterStore` → useLiveQuery хуки
- [ ] Заменить Zustand-мутации → прямые вызовы Dexie
- [ ] Убрать `useHydrated` → обработать `undefined` от `useLiveQuery` (skeleton/null)
- [ ] UI-стейт (открыт ScoreSheet, активный фильтр, режим редактирования) → `useState`
- [ ] Проверка: создать сессию → расставить RPE → Results считает верно → XLSX открывается

---

## Фаза 5 — PWA + тесты + деплой

**Цель:** устанавливаемое PWA, тесты зелёные, живое демо.

- [ ] Установить `vite-plugin-pwa`
- [ ] Настроить manifest (name, icons 192/512/maskable, theme_color)
- [ ] Настроить Workbox (precache assets, NetworkFirst для HTML)
- [ ] Проверить Lighthouse: installable, offline works
- [ ] Установить `vitest`
- [ ] Написать тесты: `rpeBucket`, `calcSessionStats`, `calcSessionSummary`, `calcHomeStats`
- [ ] `pnpm test` зелёный
- [ ] Задеплоить (Netlify / Cloudflare Pages / Vercel)
- [ ] Написать README портфолио-уровня

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
□ Миграция: проверить со старыми данными в localStorage
```
