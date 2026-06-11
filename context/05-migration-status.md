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

## Фаза 3 — Срезы (по одному, каждый целиком: model → queries/mutations → ui → роут) ✓

> Решения в ходе фазы:
> - цвета RPE — только классами (`text-rpe-*` / `bg-rpe-*`), функции-мапперы в model
>   срезов; inline-стили и arbitrary values не используются (динамика — квантованными
>   утилитами и сегментными барами)
> - правило `noBarrelFile` выключено для `slices/*/index.ts` (override в biome.json) —
>   публичный API среза через index.ts это осознанное VSA-решение
> - язык UI — английский (как в legacy)

### 3.1 `manage-roster` ✓
- [x] `queries.ts` — usePlayers
- [x] `mutations.ts` — addPlayer, updatePlayer, removePlayer
- [x] `ui/` — RosterSection, RosterEditRow
- [x] Подключить в `settings.tsx`
- [x] Проверка: CRUD игроков работает, список реактивен

### 3.2 `manage-categories` ✓
- [x] `queries.ts` — useCategories
- [x] `mutations.ts` — addCategory, updateCategory, removeCategory
- [x] `ui/` — CategoriesSection
- [x] Подключить в `settings.tsx`
- [x] Проверка: CRUD категорий работает

### 3.3 `manage-session` ✓
- [x] `model.ts` — calcSessionSummary, calcHomeStats, suggestSessionName
- [x] `queries.ts` — useSessions (+ useAllEntries, useRosterPlayers)
- [x] `mutations.ts` — createSession, deleteSession (каскад rpeEntries), duplicateSession, updateSession
- [x] `ui/` — HomeScreen, SessionCard, StatStrip, NewSessionButton
- [x] Подключить в `index.tsx` (главная)
- [x] Проверка: создание/удаление/дублирование сессий, статистика шапки

### 3.4 `record-rpe` ✓
- [x] `model.ts` — валидация score/note
- [x] `queries.ts` — useSession, useSessionEntries, useSessionPlayers
- [x] `mutations.ts` — setScore, clearScore, updateSessionName (+ toggleSessionPlayer)
- [x] `ui/` — CaptureScreen, ScoreSheet, RpeScale, RosterScoreRow, SessionRosterRow
- [x] Подключить в `sessions.$id.survey.tsx`
- [x] Проверка: оценки ставятся/снимаются, прогресс x/22, фильтры ALL/DONE/PENDING

### 3.5 `view-results` ✓
- [x] `model.ts` — rpeBucket + классы цветов, calcSessionStats, joinRecorded
- [x] `queries.ts` — useSessionWithEntries
- [x] `mutations.ts` — exportXlsx через `await import('xlsx')` (отдельный чанк 282 КБ)
- [x] `ui/` — ResultsScreen, Stat, таблица игроков
- [x] Подключить в `sessions.$id.results.tsx`
- [x] Проверка: avg/hi/lo/≥8 считаются верно, XLSX скачивается

### 3.6 Settings: остальное ✓
- [x] `shared/ui/theme-section.tsx` (выбор Light/Dark/System)
- [x] `shared/ui/storage-section.tsx` (использование + persisted-статус + CLEAR ALL)

**Runtime-проверка фазы (headless Chromium, 33 шага):** полный флоу создать → оценить →
фильтры → edit roster → результаты → XLSX → дубль/удаление → настройки → CLEAR ALL →
populate пересеял; межвкладочная реактивность Dexie; ошибок в консоли нет.

### 3.7 Ревизия фазы (код-ревью «простота и эффективность») ✓
- [x] Категории привязаны к сессиям: чипы выбора на survey, бейдж в SessionCard
      (раньше CRUD существовал, но `categoryId` нигде не присваивался)
- [x] Удалён мёртвый код: `findTopLoaded`/`topLoaded` (считался, не отображался),
      `updateSession`, `useRosterPlayers`
- [x] RPE-словарь (бакеты, `rpeTextClass`/`rpeBgClass`, `RPE_VALUES`) вынесен из трёх
      срезов в `shared/lib/rpe.ts` — границы бакетов меняются в одном месте
- [x] Имя сессии сохраняется по blur/Enter (было: запись в Dexie на каждый keystroke);
      пустое поле откатывается к сохранённому имени
- [x] Удаление игрока — каскад в транзакции (оценки + чистка `rosterIds`) с Yes/No
      подтверждением; у категорий тоже подтверждение
- [x] `suggestSessionName` включает время («9 Jun 2026 · 14:30») — сессии одного дня различимы
- [x] Номер игрока валидируется на уникальность при добавлении/редактировании
- [x] `useSessionPlayers` → `useAllPlayers` (имя обещало игроков сессии, возвращал всех)
- [x] Results: High/Low показывают «—» без оценок (как Avg); прогресс-бар survey
      подсвечивает сегмент конкретного оценённого игрока, а не первые N

### 3.8 UX-проход по скорости опроса ✓
- [x] ScoreSheet без кнопок Save/Clear: тап по баллу — мгновенное сохранение и закрытие,
      тап по уже выбранному баллу — сброс оценки (подсказка в шите); оценка игрока = 2 тапа
- [x] Заметка коммитится при закрытии шита (бэкдроп / X / Escape / Enter в поле)
- [x] Блокировка скролла фона, пока шит открыт
- [x] Карточка полностью оценённой сессии открывает сразу результаты, незавершённой — опрос

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
