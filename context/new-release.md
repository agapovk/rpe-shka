# План: миграция RPE Tracker → TanStack Start + Dexie + PWA (VSA, local-first)

## Context

`rpe-shka` — офлайн-приложение для сбора оценок RPE после тренировки (Next.js 16 + React 19 +
Tailwind v4 + Zustand + shadcn). Данные хранятся в IndexedDB через Zustand `persist` + `idb-keyval`.

Цели:
1. **Сменить фреймворк** на TanStack Start — изучить новый стек.
2. **Изучить Vertical Slice Architecture (VSA)** — следующий шаг после FSD.
3. **Local-first PWA** — устанавливаемое приложение, работает полностью офлайн.
4. **Портфолио уровня middle frontend** — чистый код, понятная архитектура, без лишних зависимостей.

> Бэкенд и синхронизация — осознанно убраны. Фокус на архитектуре, local-first паттернах и PWA.

---

## Принятые решения

| Вопрос | Решение | Причина |
|--------|---------|---------|
| Framework | **TanStack Start v1** | Стабильный v1, Vite-based, file-based routing |
| Local DB | **Dexie.js** | Лучший DX для IndexedDB, типобезопасный |
| Реактивные запросы | **`useLiveQuery`** (dexie-react-hooks) | Нативная реактивность: UI обновляется при любом изменении DB |
| UI state | **`useState`** + React Context | Простое приложение — нет смысла в глобальном стейт-менеджере |
| Тема | React Context + localStorage | Тривиальная логика, не нужна библиотека |
| ~~Zustand~~ | **Убрали** | Данные → Dexie, UI state → useState. Zustand не нужен. |
| ~~shadcn~~ | **Убрали** | Использовался только Button. Пишем компоненты на чистом Tailwind. |
| ~~TanStack Query~~ | **Убрали** | Для server state, здесь не нужен |
| ~~Supabase~~ | **Убрали** | Нет бэкенда — нет сложности |
| Архитектура | **Vertical Slice Architecture** | FSD уже знаком; VSA — новый угол зрения |
| PWA | **vite-plugin-pwa** | Устанавливаемое офлайн-приложение |
| Стилизация | **Tailwind v4** (без shadcn) | Кастомные компоненты, полный контроль |
| Lint | Ultracite/Biome | Без изменений |
| Tests | **Vitest** | Юниты на domain-логику |

---

## Целевой стек (итоговый)

| Слой | Сейчас | Станет |
|------|--------|--------|
| Framework | Next.js 16 | **TanStack Start v1** |
| Routing | App Router | **TanStack Router** |
| Local DB | idb-keyval + Zustand persist | **Dexie.js** |
| Реактивные запросы | Zustand selectors | **`useLiveQuery`** |
| UI state | Zustand | **`useState`** + React Context |
| Тема | next-themes | React Context + localStorage |
| UI-компоненты | shadcn/Radix | **Чистый Tailwind v4** |
| Архитектура | app/features/components | **VSA (slices)** |
| PWA | нет | **vite-plugin-pwa** |
| Tests | нет | **Vitest** |

### Зависимости которые уходят
```
next, next-themes
zustand
idb-keyval
shadcn, radix-ui, class-variance-authority
postcss, next.config.mjs, next-env.d.ts, components.json
```

### Зависимости которые приходят
```
@tanstack/react-start, @tanstack/react-router
dexie, dexie-react-hooks
@tailwindcss/vite
vite-plugin-pwa
vitest
```

### Остаются без изменений
```
react, react-dom (^19)
tailwindcss (^4)
tailwind-merge, clsx        ← утилиты для className
lucide-react                ← иконки
xlsx                        ← экспорт
@biomejs/biome, ultracite   ← линтер
husky, lint-staged
typescript
```

---

## Vertical Slice Architecture

Каждый сценарий использования — срез. Срез владеет всем своим стеком (типы → DB → UI).
Срезы не импортируют друг друга, только из `shared/`.

```
src/slices/
├── record-rpe/        # «Открыть ScoreSheet → выбрать RPE → сохранить»
├── view-results/      # «Смотреть статистику сессии + экспорт XLSX»
├── manage-session/    # «Создать / дублировать / удалить сессию, список»
├── manage-roster/     # «CRUD игроков»
├── manage-categories/ # «CRUD категорий»
└── theme-toggle/      # «Переключить тему»
```

Структура каждого среза:
```
slice-name/
├── ui/          # React-компоненты
├── model.ts     # Типы + чистые функции (domain logic, без side effects)
├── queries.ts   # useLiveQuery хуки — только чтение из Dexie
├── mutations.ts # async функции записи в Dexie (не хуки)
└── index.ts     # Публичный API среза
```

---

## Структура проекта

```
src/
├── routes/
│   ├── __root.tsx               # Layout: ThemeProvider, ErrorBoundary, шрифты
│   ├── index.tsx                # Главная
│   ├── sessions.$id.survey.tsx  # Опрос
│   ├── sessions.$id.results.tsx # Результаты
│   └── settings.tsx             # Настройки
│
├── slices/
│   ├── record-rpe/
│   │   ├── ui/             # CaptureScreen, ScoreSheet, RpeScale, RosterRow
│   │   ├── model.ts        # Типы, валидация score/note
│   │   ├── queries.ts      # useLiveQuery: игроки сессии + оценки
│   │   ├── mutations.ts    # setScore(), clearScore() → db.rpeEntries
│   │   └── index.ts
│   │
│   ├── view-results/
│   │   ├── ui/             # ResultsScreen, Stat, таблица
│   │   ├── model.ts        # rpeColor, rpeBucket, calcSessionStats ← перенос
│   │   ├── queries.ts      # useLiveQuery: entries для сессии
│   │   ├── mutations.ts    # exportXlsx() ← перенос
│   │   └── index.ts
│   │
│   ├── manage-session/
│   │   ├── ui/             # SessionCard, StatStrip, NewSessionButton
│   │   ├── model.ts        # calcSessionSummary, calcHomeStats, suggestName ← перенос
│   │   ├── queries.ts      # useLiveQuery: все сессии
│   │   ├── mutations.ts    # createSession(), deleteSession(), duplicateSession()
│   │   └── index.ts
│   │
│   ├── manage-roster/
│   │   ├── ui/             # RosterSection, RosterEditRow
│   │   ├── model.ts        # Тип Player, ROSTER (дефолт)
│   │   ├── queries.ts      # useLiveQuery: все игроки
│   │   ├── mutations.ts    # addPlayer(), updatePlayer(), removePlayer()
│   │   └── index.ts
│   │
│   ├── manage-categories/
│   │   ├── ui/             # CategoriesSection
│   │   ├── model.ts        # Тип Category, DEFAULT_CATEGORIES
│   │   ├── queries.ts      # useLiveQuery: все категории
│   │   ├── mutations.ts    # addCategory(), updateCategory(), removeCategory()
│   │   └── index.ts
│   │
│   └── theme-toggle/
│       ├── ui/             # ThemeToggle, ThemeSection
│       └── index.ts
│
└── shared/
    ├── ui/                 # Button, ErrorBoundary — чистый Tailwind, без shadcn
    ├── lib/                # cn(), fmtDate()
    ├── context/
    │   └── theme.tsx       # ThemeProvider + useTheme (React Context + localStorage)
    └── db/
        ├── dexie.ts        # Dexie instance + схема
        └── seed.ts         # ROSTER + DEFAULT_CATEGORIES при первом запуске
```

---

## Схема Dexie

```typescript
// shared/db/dexie.ts
import Dexie, { type Table } from 'dexie'

export interface DbPlayer    { id: number; name: string; num: number }
export interface DbCategory  { id: string; name: string }
export interface DbSession   {
  id: string; name: string; date: string
  categoryId?: string; rosterIds: number[]
}
export interface DbRpeEntry  {
  id: string; sessionId: string; playerId: number
  score: number; note?: string
}

class RpeDatabase extends Dexie {
  players!:    Table<DbPlayer>
  categories!: Table<DbCategory>
  sessions!:   Table<DbSession>
  rpeEntries!: Table<DbRpeEntry>

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

## Миграция с Zustand → Dexie

При первом запуске нового приложения — разовая миграция:

```typescript
// shared/db/seed.ts
export async function migrateFromZustand() {
  const count = await db.sessions.count()
  if (count > 0) return // уже мигрировали

  const raw = localStorage.getItem('rpe-storage')
  if (raw) {
    const { sessions, categories } = JSON.parse(raw).state
    // sessions хранили scores как Record<playerId, score> →
    // нормализуем в отдельные rpeEntries
    await db.transaction('rw', db.sessions, db.rpeEntries, db.categories, async () => {
      await db.categories.bulkPut(categories)
      for (const s of sessions) {
        await db.sessions.put({ id: s.id, name: s.name, date: s.date,
          categoryId: s.categoryId, rosterIds: s.rosterIds })
        for (const [playerId, score] of Object.entries(s.scores)) {
          await db.rpeEntries.put({ id: `${s.id}-${playerId}`, sessionId: s.id,
            playerId: Number(playerId), score: score as number,
            note: s.notes?.[playerId] })
        }
      }
    })
  }

  const rosterRaw = localStorage.getItem('rpe-roster')
  if (rosterRaw) {
    const { players } = JSON.parse(rosterRaw).state
    await db.players.bulkPut(players)
  } else {
    await db.players.bulkPut(ROSTER) // дефолтный ростер
  }
}
```

---

## Фазы реализации

### Фаза 0 — Документация `context/`
- [x] `context/new-release.md` — этот файл
- [ ] `context/01-overview.md` — приложение, домен, флоу
- [ ] `context/02-architecture-vsa.md` — VSA, правила срезов, маппинг старый → новый
- [ ] `context/03-data-model.md` — Dexie-схема + TS-типы
- [ ] `context/04-stack-conventions.md` — команды, стандарты
- [ ] `context/05-migration-status.md` — живой чек-лист

### Фаза 1 — Next.js → TanStack Start
- Установить: `@tanstack/react-start`, `@tanstack/react-router`, `@vitejs/plugin-react`, `@tailwindcss/vite`
- Удалить: `next`, `next-themes`, `postcss`, `shadcn`, `radix-ui`, `class-variance-authority`, `zustand`, `idb-keyval`
- Удалить файлы: `next.config.mjs`, `next-env.d.ts`, `postcss.config.mjs`, `components.json`, `lib/idb-storage.ts`
- Создать: `vite.config.ts`, `src/router.tsx`, `src/routes/__root.tsx`
- Маршруты: `index.tsx`, `sessions.$id.survey.tsx`, `sessions.$id.results.tsx`, `settings.tsx`
- Переписать `Button` как чистый Tailwind-компонент (без CVA, без Radix Slot)
- Темизация: `ThemeProvider` на React Context + localStorage
- Шрифты: `next/font` → `@fontsource/*`

### Фаза 2 — Zustand + idb-keyval → Dexie
- Установить: `dexie`, `dexie-react-hooks`
- Создать: `shared/db/dexie.ts`, `shared/db/seed.ts` (миграция + дефолтные данные)
- Запускать `migrateFromZustand()` один раз при старте приложения

### Фаза 3 — Реструктуризация под VSA
| Старое | Новое |
|--------|-------|
| `components/survey/*` + `hooks/useCaptureScreen` | `slices/record-rpe/` |
| `components/results/*` + `survey.export.ts` | `slices/view-results/` |
| `components/home/*` + `session.utils.ts` | `slices/manage-session/` |
| `features/roster/*` | `slices/manage-roster/` |
| categories из survey store | `slices/manage-categories/` |
| `components/ui/Button`, `ThemeToggle` | `shared/ui/`, `slices/theme-toggle/` |

### Фаза 4 — Подключить Dexie к UI
- Заменить Zustand-хуки → `useLiveQuery` в `queries.ts` каждого среза
- Заменить мутации Zustand → прямые `db.*` вызовы в `mutations.ts`
- Убрать `useHydrated` → обработать `undefined` от `useLiveQuery`
- Локальный UI-стейт → `useState` внутри компонентов

### Фаза 5 — PWA + тесты + деплой
- `vite-plugin-pwa`: manifest, иконки, service worker (precache)
- Vitest: юниты на `rpeBucket`, `calcSessionStats`, `calcSessionSummary`, `calcHomeStats`
- Деплой: Netlify/Vercel/Cloudflare Pages (чистая статика)
- README портфолио-уровня: задача, VSA-диаграмма, стек, гиф офлайн, ссылка на демо

---

## Verification

1. `pnpm dev` поднимается, `pnpm build` проходит, `tsc --noEmit` чист, `ultracite check` чист
2. Базовый флоу: создать сессию → RPE → Results (avg/hi/lo/≥8) → XLSX открывается
3. Реактивность: изменение в одной вкладке мгновенно отражается в другой (Dexie cross-tab sync)
4. Миграция: старые данные из Zustand/idb-keyval подхватываются при первом запуске
5. PWA: Lighthouse installable, открывается офлайн после установки
6. `pnpm test` зелёный

---

## Открытые риски

- **TanStack Start v1** — молодая экосистема, держим версии зафиксированными.
- **`useLiveQuery` + `undefined`** — до загрузки возвращает `undefined`. Нужно обработать во всех компонентах.
- **Миграция данных** Zustand → Dexie — разовая операция, написать аккуратно с транзакцией.
