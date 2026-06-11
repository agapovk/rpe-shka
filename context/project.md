# RPE Tracker — контекст проекта

Офлайн PWA. Тренер на поле собирает RPE (1–10) от игроков после тренировки. Данные — локально в IndexedDB. Нет бэкенда, нет синхронизации. Legacy (Next.js) — ветка `legacy`/тег `v1.0.0`, только референс UI. Новая версия пишется с нуля.

---

## Домен

| Сущность | Ключевые поля |
|----------|--------------|
| `Player` | `id` (auto++), `name`, `num` (номер футболки) |
| `Category` | `id` (uuid), `name` — «MD-4»…«MD+1» |
| `Session` | `id`, `name`, `date`, `categoryId?`, `rosterIds[]` |
| `RpeEntry` | `id="${sessionId}-${playerId}"`, `score` 1–10, `note?` |

**RPE бакеты:** 1–3 LIGHT · 4–6 MODERATE · 7–8 HARD · 9–10 MAXIMAL  
Цвета: `text-rpe-*` / `bg-rpe-*` — из `shared/lib/rpe.ts` (`rpeBucket`, `rpeTextClass`, `rpeBgClass`)

## Роуты

| Путь | Экран |
|------|-------|
| `/` | Список сессий + шапка (7-day avg, last 30d) |
| `/sessions/:id/survey` | Опрос — выставить RPE каждому игроку |
| `/sessions/:id/results` | avg / hi / lo / ≥8 + XLSX |
| `/settings` | Тема · Ростер · Категории · Storage |

---

## Стек

| Слой | Технология |
|------|-----------|
| Framework | Vite + React 19 (чистый SPA, без SSR) |
| Routing | TanStack Router (file-based, `@tanstack/router-plugin`) |
| Local DB | Dexie.js + `useLiveQuery` |
| Стилизация | Tailwind CSS v4 (без shadcn) |
| Архитектура | VSA (`src/slices/` + `src/shared/`) |
| PWA | vite-plugin-pwa |
| Tests | Vitest |
| Lint | Ultracite / Biome |

Убраны: Next.js, TanStack Start, Zustand, shadcn, Radix UI, TanStack Query.

---

## Архитектура — VSA

Один срез = один user scenario. Срезы не импортируют друг друга — только `shared/`.

```
src/
├── routes/          ← только createFileRoute + import из slices (логики нет)
├── slices/
│   ├── record-rpe/         # оценить игрока
│   ├── view-results/       # результаты + XLSX
│   ├── manage-session/     # CRUD сессий, главная
│   ├── manage-roster/      # CRUD игроков
│   └── manage-categories/  # CRUD категорий
└── shared/
    ├── ui/          ← Button, ThemeToggle, ThemeSection, StorageSection
    ├── lib/         ← cn(), fmtDate(), rpe.ts
    ├── context/     ← ThemeProvider + useTheme
    └── db/          ← dexie.ts (схема + типы) · seed.ts
```

Структура каждого среза:
```
slice-name/
├── ui/          # React-компоненты
├── model.ts     # чистые функции — нет side effects, нет Dexie, нет React
├── queries.ts   # useLiveQuery хуки (только чтение)
├── mutations.ts # async функции → Dexie (не хуки)
└── index.ts     # публичный API — внешний код импортирует только отсюда
```

---

## Dexie схема

```typescript
// shared/db/dexie.ts
class RpeDatabase extends Dexie {
  players!:    Table<Player,   number>
  categories!: Table<Category, string>
  sessions!:   Table<Session,  string>
  rpeEntries!: Table<RpeEntry, string>

  constructor() {
    super('rpe-db')
    this.version(1).stores({
      players:    '++id, num',
      categories: 'id',
      sessions:   'id, date, categoryId',
      rpeEntries: 'id, sessionId, playerId, [sessionId+playerId]',
    })
    // сид через populate, не count-check (гонка в StrictMode)
    this.on('populate', (tx) => {
      tx.table('players').bulkAdd(ROSTER)
      tx.table('categories').bulkAdd(DEFAULT_CATEGORIES)
    })
  }
}
export const db = new RpeDatabase()
```

`RpeEntry.id = \`${sessionId}-${playerId}\`` — детерминированный → `put()` = upsert, нет дублей.  
Удаление игрока — каскад в одной транзакции: `rpeEntries` + чистка `rosterIds` всех сессий.  
В `__root.tsx`: `db.open()` + `navigator.storage.persist()` при старте.

---

## CSS / Тема

Tailwind v4: конфигурация через `@theme {}` в `globals.css` (не `tailwind.config.js`).  
Тема через `color-scheme` на `<html>` — не класс `.dark`.

Семантические токены: `--color-bg/surface/text/muted/line/accent`  
RPE токены: `--color-rpe-light/moderate/hard/maximal`  
Шрифты: `--font-display` (Oswald, цифры/заголовки), `--font-sans` (Inter)

Правило: только зарегистрированные утилиты. Нет arbitrary values `[var(--…)]`, нет `style=`.

---

## Команды

```bash
pnpm dev          # dev-сервер
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run
pnpm check        # ultracite check
pnpm fix          # ultracite fix (автоисправление)
```

Только `pnpm`. Не `npm`/`npx`/`yarn`.

---

## Конвенции кода

- Файлы компонентов — kebab-case, экспорт — PascalCase (`capture-screen.tsx` → `CaptureScreen`)
- `ref` как проп (React 19+), не `forwardRef`
- `for...of`, `const` по умолчанию, ранние возвраты, `?.` и `??`
- Нет `console.log`/`debugger` в коммитах
- Тесты — только чистые функции из `model.ts`
- `noBarrelFile` выключено для `slices/*/index.ts` (override в `biome.json`) — это осознанное VSA-решение
- Списки игроков везде сортируются по имени (`byPlayerName` в `shared/db`)
