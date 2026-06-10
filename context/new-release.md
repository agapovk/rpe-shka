# План: RPE Tracker — TanStack Start + Dexie + PWA (VSA, local-first)

## Context

`rpe-shka` — офлайн-приложение для сбора оценок RPE после тренировки.
Предыдущая версия (Next.js 16 + Zustand + shadcn) сохранена в ветке `legacy` (тег `v1.0.0`)
и используется **только как референс UI и логики**. Новая версия пишется с нуля:
ни код, ни данные не мигрируем — приложение стартует с чистой БД и дефолтным ростером.

Цели:
1. **Освоить TanStack Start** — изучить новый стек.
2. **Изучить Vertical Slice Architecture (VSA)** — следующий шаг после FSD.
3. **Local-first PWA** — устанавливаемое приложение, работает полностью офлайн.
4. **Портфолио уровня middle frontend** — чистый код, понятная архитектура, без лишних зависимостей.

> Бэкенд, синхронизация и миграция старых данных — осознанно убраны.
> Фокус на архитектуре, local-first паттернах и PWA.

---

## Принятые решения

| Вопрос | Решение | Причина |
|--------|---------|---------|
| Framework | **TanStack Start v1** | Стабильный v1, Vite-based, file-based routing |
| SSR | **Выключен (SPA-режим)** | Сервера нет; IndexedDB существует только в браузере — SSR дал бы лишь проблемы гидрации |
| Local DB | **Dexie.js** | Лучший DX для IndexedDB, типобезопасный |
| Реактивные запросы | **`useLiveQuery`** (dexie-react-hooks) | Нативная реактивность: UI обновляется при любом изменении DB |
| UI state | **`useState`** + React Context | Простое приложение — нет смысла в глобальном стейт-менеджере |
| Тема | React Context + localStorage | Тривиальная логика, не нужна библиотека; живёт в `shared/`, отдельного среза нет |
| Типы сущностей | **`shared/db/`** | Общий словарь домена (Player, Session…) нужен нескольким срезам; срезы друг из друга не импортируют |
| SW-стратегия | **CacheFirst** (precache app shell) | На поле связь мерцает: NetworkFirst висел бы до таймаута на каждой навигации |
| Защита данных | `navigator.storage.persist()` | Единственная копия данных — запрещаем браузеру выселять IndexedDB |
| XLSX-экспорт | `xlsx` через **dynamic import** | ~400 КБ грузятся только по клику на кнопку, не раздувают precache PWA |
| ~~Zustand~~ | Убрали | Данные → Dexie, UI state → useState |
| ~~shadcn~~ | Убрали | Использовался только Button. Пишем компоненты на чистом Tailwind |
| ~~TanStack Query~~ | Убрали | Для server state, здесь не нужен |
| ~~Миграция данных~~ | Убрали | Старыми данными пренебрегаем, старт с чистой БД + seed |
| Архитектура | **Vertical Slice Architecture** | FSD уже знаком; VSA — новый угол зрения |
| PWA | **vite-plugin-pwa** | Устанавливаемое офлайн-приложение |
| Стилизация | **Tailwind v4** (без shadcn) | Кастомные компоненты, полный контроль |
| Lint | Ultracite/Biome | Как в legacy |
| Tests | **Vitest** | Юниты на domain-логику |

---

## Зависимости

```
@tanstack/react-start, @tanstack/react-router   ← framework + routing
react, react-dom (^19)
dexie, dexie-react-hooks                        ← local DB
tailwindcss (^4), @tailwindcss/vite             ← стили
tailwind-merge, clsx                            ← утилиты className
lucide-react                                    ← иконки
xlsx                                            ← экспорт (dynamic import)
vite-plugin-pwa                                 ← PWA
vitest                                          ← тесты
@biomejs/biome, ultracite                       ← линтер
husky, lint-staged, typescript
```

---

## Vertical Slice Architecture

Каждый сценарий использования — срез. Срез владеет всем своим стеком (model → DB-доступ → UI).
Срезы не импортируют друг друга, только из `shared/`.

```
src/slices/
├── record-rpe/        # «Открыть ScoreSheet → выбрать RPE → сохранить»
├── view-results/      # «Смотреть статистику сессии + экспорт XLSX»
├── manage-session/    # «Создать / дублировать / удалить сессию, список»
├── manage-roster/     # «CRUD игроков»
└── manage-categories/ # «CRUD категорий»
```

Тема — не бизнес-сценарий: ThemeProvider и ThemeToggle живут в `shared/`.

Структура каждого среза:
```
slice-name/
├── ui/          # React-компоненты
├── model.ts     # Вычисляемые типы + чистые функции (без side effects)
├── queries.ts   # useLiveQuery хуки — только чтение из Dexie
├── mutations.ts # async функции записи в Dexie (не хуки)
└── index.ts     # Публичный API среза
```

---

## Структура проекта

```
src/
├── routes/
│   ├── __root.tsx               # Layout: ThemeProvider, ErrorBoundary, шрифты, seed
│   ├── index.tsx                # Главная
│   ├── sessions.$id.survey.tsx  # Опрос
│   ├── sessions.$id.results.tsx # Результаты
│   └── settings.tsx             # Настройки
│
├── slices/
│   ├── record-rpe/
│   │   ├── ui/             # CaptureScreen, ScoreSheet, RpeScale, RosterScoreRow
│   │   ├── model.ts        # Валидация score/note
│   │   ├── queries.ts      # useLiveQuery: игроки сессии + оценки
│   │   ├── mutations.ts    # setScore(), clearScore() → db.rpeEntries
│   │   └── index.ts
│   │
│   ├── view-results/
│   │   ├── ui/             # ResultsScreen, Stat, таблица
│   │   ├── model.ts        # rpeColor, rpeBucket, calcSessionStats
│   │   ├── queries.ts      # useLiveQuery: entries для сессии
│   │   ├── mutations.ts    # exportXlsx() — dynamic import('xlsx')
│   │   └── index.ts
│   │
│   ├── manage-session/
│   │   ├── ui/             # SessionCard, StatStrip, NewSessionButton
│   │   ├── model.ts        # calcSessionSummary, calcHomeStats, suggestSessionName
│   │   ├── queries.ts      # useLiveQuery: все сессии
│   │   ├── mutations.ts    # createSession(), deleteSession(), duplicateSession()
│   │   └── index.ts
│   │
│   ├── manage-roster/
│   │   ├── ui/             # RosterSection, RosterEditRow
│   │   ├── queries.ts      # useLiveQuery: все игроки
│   │   ├── mutations.ts    # addPlayer(), updatePlayer(), removePlayer()
│   │   └── index.ts
│   │
│   └── manage-categories/
│       ├── ui/             # CategoriesSection
│       ├── queries.ts      # useLiveQuery: все категории
│       ├── mutations.ts    # addCategory(), updateCategory(), removeCategory()
│       └── index.ts
│
└── shared/
    ├── ui/                 # Button, ErrorBoundary, ThemeToggle, ThemeSection, StorageSection
    ├── lib/                # cn(), fmtDate()
    ├── context/
    │   └── theme.tsx       # ThemeProvider + useTheme (React Context + localStorage)
    └── db/
        ├── dexie.ts        # Dexie instance + схема + типы сущностей
        └── seed.ts         # ROSTER + DEFAULT_CATEGORIES при первом запуске
```

---

## Схема Dexie

Типы сущностей объявлены здесь — это общий словарь домена для всех срезов.

```typescript
// shared/db/dexie.ts
import Dexie, { type Table } from 'dexie'

export interface Player    { id: number; name: string; num: number }
export interface Category  { id: string; name: string }
export interface Session   {
  id: string; name: string; date: string
  categoryId?: string; rosterIds: number[]
}
export interface RpeEntry  {
  id: string; sessionId: string; playerId: number
  score: number; note?: string
}

class RpeDatabase extends Dexie {
  players!:    Table<Player, number>
  categories!: Table<Category, string>
  sessions!:   Table<Session, string>
  rpeEntries!: Table<RpeEntry, string>

  constructor() {
    super('rpe-db')
    this.version(1).stores({
      players:    '++id, num',
      categories: 'id',
      sessions:   'id, date, categoryId',
      rpeEntries: 'id, sessionId, playerId, [sessionId+playerId]',
    })
  }
}

export const db = new RpeDatabase()
```

---

## Паттерн чтения и записи

```typescript
// Чтение — реактивно, автообновляется при изменении DB
const sessions = useLiveQuery(() => db.sessions.orderBy('date').reverse().toArray())

// Запись — прямой вызов, никаких хуков
async function setScore(sessionId: string, playerId: number, score: number, note: string) {
  const id = `${sessionId}-${playerId}`
  await db.rpeEntries.put({ id, sessionId, playerId, score, note })
}
// → useLiveQuery автоматически переподпишется, UI обновится
```

---

## Фазы реализации

Подробные чек-листы — в `05-migration-status.md`. Каждая фаза = ветка `feat/phase-N-…` → PR.

### Фаза 0 — Документация `context/` ✓

### Фаза 1 — Каркас приложения
TanStack Start в SPA-режиме (SSR выключен), Tailwind v4, шрифты, тема,
`shared/ui` (Button, ErrorBoundary, ThemeToggle), роуты-заглушки, линтер + husky.
Проверка: `pnpm dev` поднимается, все страницы открываются, тема переключается.

### Фаза 2 — Слой данных
`dexie` + `dexie-react-hooks`, схема в `shared/db/dexie.ts`,
`seed.ts` (дефолтный ростер + категории), `navigator.storage.persist()` при старте.

### Фаза 3 — Срезы, по одному за раз
Каждый срез реализуется целиком (model → queries/mutations → ui → подключение к роуту),
проверяется и коммитится отдельно. Порядок — от простого к сложному:
1. `manage-roster` (settings)
2. `manage-categories` (settings)
3. `manage-session` (главная)
4. `record-rpe` (survey)
5. `view-results` (results + XLSX)

### Фаза 4 — PWA + тесты + деплой
- `vite-plugin-pwa`: manifest, иконки, precache app shell, **CacheFirst**
- Vitest: юниты на `rpeBucket`, `calcSessionStats`, `calcSessionSummary`, `calcHomeStats`
- Деплой: Netlify / Vercel / Cloudflare Pages (чистая статика)
- README портфолио-уровня: задача, VSA-диаграмма, стек, гиф офлайн, ссылка на демо

---

## Verification

1. `pnpm dev` поднимается, `pnpm build` проходит, `tsc --noEmit` чист, `ultracite check` чист
2. Базовый флоу: создать сессию → RPE → Results (avg/hi/lo/≥8) → XLSX открывается
3. Реактивность: изменение в одной вкладке мгновенно отражается в другой (Dexie cross-tab sync)
4. PWA: Lighthouse installable, открывается офлайн после установки
5. `pnpm test` зелёный

---

## Открытые риски

- **TanStack Start v1** — молодая экосистема, держим версии зафиксированными.
- **`useLiveQuery` + `undefined`** — до загрузки возвращает `undefined`. Обработать во всех компонентах (skeleton/null).
