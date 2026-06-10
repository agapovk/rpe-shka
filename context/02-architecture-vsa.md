# Архитектура: Vertical Slice Architecture (VSA)

## Почему VSA, а не FSD

**FSD (Feature-Sliced Design)** — горизонтальные слои: `entities`, `features`, `widgets`, `pages`.
Компонент для отображения RPE живёт в `widgets`, логика RPE в `entities`, действие «сохранить оценку»
в `features`. Чтобы понять один сценарий — прыгаешь между слоями.

**VSA (Vertical Slice Architecture)** — вертикальные срезы по сценариям. Всё что нужно для
«сохранить оценку» живёт в одном месте: `slices/record-rpe/`. Когда работаешь с фичей —
открываешь одну папку.

```
FSD — горизонтально:        VSA — вертикально:
┌─────────────────┐         ┌──────┬──────┬────────┬──────────┐
│    widgets      │         │record│ view │ manage │  manage  │
├─────────────────┤         │ rpe  │result│session │  roster  │
│    features     │         ├──────┼──────┼────────┼──────────┤
├─────────────────┤         │  ui  │  ui  │   ui   │    ui    │
│    entities     │         │model │model │ model  │  model   │
├─────────────────┤         │query │query │ query  │  query   │
│     shared      │         │ mut  │ mut  │  mut   │   mut    │
└─────────────────┘         └──────┴──────┴────────┴──────────┘
                                        shared/
```

**Ключевой принцип:** высокая когезия внутри среза, минимальные зависимости между срезами.

---

## Правила

1. **Срез ↔ сценарий.** Один срез = один реальный use case пользователя.
2. **Нет импортов между срезами.** `record-rpe` не импортирует из `manage-roster`. Если
   нужны общие данные — через `shared/`.
3. **Публичный API через `index.ts`.** Внешний код импортирует только из `slices/foo/index.ts`,
   не из внутренних файлов.
4. **`shared/` — только без бизнес-логики.** `Button`, `cn()`, `db` instance, `fmtDate()`.
   Никаких доменных концепций.
5. **`model.ts` — чистые функции.** Без side effects, без импортов Dexie. Легко тестировать.
6. **`mutations.ts` — не хуки.** Просто `async function`, вызываются из компонентов напрямую.
   Нет обёртки в `useMutation`.

---

## Структура среза

```
slices/record-rpe/
├── ui/
│   ├── CaptureScreen.tsx   # Основной экран опроса
│   ├── ScoreSheet.tsx      # Bottom-sheet модал для оценки
│   ├── RpeScale.tsx        # 10 кнопок 1–10
│   └── RosterScoreRow.tsx  # Строка игрока в списке
├── model.ts                # Типы + валидация (без Dexie, без React)
├── queries.ts              # useLiveQuery хуки — только чтение
├── mutations.ts            # async функции записи в Dexie
└── index.ts                # Re-export публичного API
```

### model.ts — только типы и чистая логика
```typescript
// Типы, константы, чистые функции — никаких импортов Dexie или React
export interface ScoreEntry { playerId: number; score: number; note?: string }
export const isValidScore = (n: number): boolean => n >= 1 && n <= 10
```

### queries.ts — только чтение
```typescript
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/shared/db/dexie'

export const useSessionEntries = (sessionId: string) =>
  useLiveQuery(
    () => db.rpeEntries.where('sessionId').equals(sessionId).toArray(),
    [sessionId]
  )
```

### mutations.ts — только запись
```typescript
import { db } from '@/shared/db/dexie'

export async function setScore(sessionId: string, playerId: number, score: number, note: string) {
  await db.rpeEntries.put({ id: `${sessionId}-${playerId}`, sessionId, playerId, score, note })
}

export async function clearScore(sessionId: string, playerId: number) {
  await db.rpeEntries.delete(`${sessionId}-${playerId}`)
}
```

### index.ts — публичный API
```typescript
export { CaptureScreen } from './ui/CaptureScreen'
export { useSessionEntries } from './queries'
export { setScore, clearScore } from './mutations'
// model.ts экспортируем только если типы нужны снаружи
```

---

## Срезы проекта

| Срез | Сценарий | Компоненты |
|------|----------|------------|
| `record-rpe` | Открыть ScoreSheet → выбрать RPE → сохранить | CaptureScreen, ScoreSheet, RpeScale, RosterRow |
| `view-results` | Смотреть статистику + экспорт XLSX | ResultsScreen, Stat, таблица |
| `manage-session` | Создать / дублировать / удалить сессию | SessionCard, StatStrip |
| `manage-roster` | CRUD игроков | RosterSection, RosterEditRow |
| `manage-categories` | CRUD категорий | CategoriesSection |
| `theme-toggle` | Переключить тему | ThemeToggle, ThemeSection |

---

## shared/ — что туда идёт

```
shared/
├── ui/
│   ├── Button.tsx          # Простой Tailwind-компонент, без CVA
│   └── ErrorBoundary.tsx   # Class-based error boundary
├── lib/
│   ├── utils.ts            # cn() для className merging
│   └── date.ts             # fmtDate() и suggestSessionName()
├── context/
│   └── theme.tsx           # ThemeProvider + useTheme (React Context)
└── db/
    ├── dexie.ts            # Dexie instance + типы таблиц
    └── seed.ts             # migrateFromZustand() + seeding defaults
```

**Тест для shared/:** «Это можно скопировать в другой проект без изменений?»
Если да — подходит. Если содержит RPE-логику — не подходит.

---

## Маппинг: старый код → VSA

| Старый файл | Новый путь |
|-------------|-----------|
| `components/survey/CaptureScreen.tsx` | `slices/record-rpe/ui/CaptureScreen.tsx` |
| `components/survey/ScoreSheet.tsx` | `slices/record-rpe/ui/ScoreSheet.tsx` |
| `components/survey/RpeScale.tsx` | `slices/record-rpe/ui/RpeScale.tsx` |
| `components/survey/RosterScoreRow.tsx` | `slices/record-rpe/ui/RosterScoreRow.tsx` |
| `components/survey/RosterEditRow.tsx` | `slices/manage-roster/ui/RosterEditRow.tsx` |
| `hooks/useCaptureScreen.ts` | Распиливается: queries → `record-rpe/queries.ts`, mutations → `record-rpe/mutations.ts`, UI state → `useState` в CaptureScreen |
| `components/results/ResultsScreen.tsx` | `slices/view-results/ui/ResultsScreen.tsx` |
| `components/results/Stat.tsx` | `slices/view-results/ui/Stat.tsx` |
| `features/survey/survey.utils.ts` (rpeColor, rpeBucket, calcSessionStats) | `slices/view-results/model.ts` |
| `features/survey/survey.export.ts` | `slices/view-results/mutations.ts` |
| `hooks/useResultsScreen.ts` | `slices/view-results/queries.ts` |
| `components/home/SessionCard.tsx` | `slices/manage-session/ui/SessionCard.tsx` |
| `components/home/StatStrip.tsx` | `slices/manage-session/ui/StatStrip.tsx` |
| `features/session/session.utils.ts` (calcSessionSummary, calcHomeStats) | `slices/manage-session/model.ts` |
| `features/roster/roster.store.ts` | Удаляется; данные → Dexie, queries/mutations → `slices/manage-roster/` |
| `components/settings/RosterSection.tsx` | `slices/manage-roster/ui/RosterSection.tsx` |
| `components/settings/CategoriesSection.tsx` | `slices/manage-categories/ui/CategoriesSection.tsx` |
| `components/settings/ThemeSection.tsx` | `slices/theme-toggle/ui/ThemeSection.tsx` |
| `components/settings/StorageSection.tsx` | `slices/manage-session/ui/StorageSection.tsx` (или shared) |
| `components/ui/Button.tsx` | `shared/ui/Button.tsx` (переписать без CVA) |
| `components/ui/ThemeToggle.tsx` | `slices/theme-toggle/ui/ThemeToggle.tsx` |
| `components/ui/ErrorBoundary.tsx` | `shared/ui/ErrorBoundary.tsx` |
| `lib/utils.ts` | `shared/lib/utils.ts` |
| `features/survey/survey.store.ts` | Удаляется целиком → Dexie |
| `features/survey/survey.types.ts` | Распиливается по срезам (`model.ts`) |
| `lib/idb-storage.ts` | Удаляется |

---

## Роуты (TanStack Router)

Роуты — тонкий слой. Они только импортируют из срезов и компонуют:

```typescript
// src/routes/sessions.$id.survey.tsx
import { createFileRoute } from '@tanstack/react-router'
import { CaptureScreen } from '@/slices/record-rpe'

export const Route = createFileRoute('/sessions/$id/survey')({
  component: () => {
    const { id } = Route.useParams()
    return <CaptureScreen sessionId={id} />
  },
})
```

Никакой логики в роутах — только импорт и рендер.
