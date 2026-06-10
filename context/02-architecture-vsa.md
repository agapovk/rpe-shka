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
├─────────────────┤         ├──────┼──────┼────────┼──────────┤
│    features     │         │  ui  │  ui  │   ui   │    ui    │
├─────────────────┤         │model │model │ model  │  model   │
│    entities     │         │query │query │ query  │  query   │
├─────────────────┤         │ mut  │ mut  │  mut   │   mut    │
│     shared      │         └──────┴──────┴────────┴──────────┘
└─────────────────┘                     shared/
```

**Ключевой принцип:** высокая когезия внутри среза, минимальные зависимости между срезами.

---

## Правила

1. **Срез ↔ сценарий.** Один срез = один реальный use case пользователя.
2. **Нет импортов между срезами.** `record-rpe` не импортирует из `manage-roster`. Если
   нужны общие данные — через `shared/`.
3. **Публичный API через `index.ts`.** Внешний код импортирует только из `slices/foo/index.ts`,
   не из внутренних файлов.
4. **`shared/` — без бизнес-логики, но со словарём домена.** Типы сущностей (Player,
   Session, Category, RpeEntry) живут в `shared/db/` рядом со схемой — они нужны нескольким
   срезам. А вот доменная *логика* (калькуляции, валидация) — только в срезах.
5. **`model.ts` — чистые функции.** Без side effects, без импортов Dexie. Легко тестировать.
6. **`mutations.ts` — не хуки.** Просто `async function`, вызываются из компонентов напрямую.
   Нет обёртки в `useMutation`.

---

## Структура среза

```
slices/record-rpe/
├── ui/
│   ├── capture-screen.tsx   # Основной экран опроса
│   ├── score-sheet.tsx      # Bottom-sheet модал для оценки
│   ├── rpe-scale.tsx        # 10 кнопок 1–10
│   └── roster-score-row.tsx # Строка игрока в списке
├── model.ts                # Вычисляемые типы + валидация (без Dexie, без React)
├── queries.ts              # useLiveQuery хуки — только чтение
├── mutations.ts            # async функции записи в Dexie
└── index.ts                # Re-export публичного API
```

### model.ts — только чистая логика
```typescript
// Вычисляемые типы, константы, чистые функции — никаких импортов Dexie или React
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
| `record-rpe` | Открыть ScoreSheet → выбрать RPE → сохранить | CaptureScreen, ScoreSheet, RpeScale, RosterScoreRow |
| `view-results` | Смотреть статистику + экспорт XLSX | ResultsScreen, Stat, таблица |
| `manage-session` | Создать / дублировать / удалить сессию | SessionCard, StatStrip, NewSessionButton |
| `manage-roster` | CRUD игроков | RosterSection, RosterEditRow |
| `manage-categories` | CRUD категорий | CategoriesSection |

Тема — не пользовательский сценарий, а UI-хром: ThemeProvider, ThemeToggle и ThemeSection
живут в `shared/`. Срез должен зарабатывать своё существование.

---

## shared/ — что туда идёт

```
shared/
├── ui/
│   ├── button.tsx          # Простой Tailwind-компонент, без CVA
│   ├── theme-toggle.tsx    # Кнопка переключения темы
│   ├── theme-section.tsx   # Блок темы в Settings (Light/Dark/System)
│   └── storage-section.tsx # Блок Storage в Settings (использование + CLEAR ALL)
├── lib/
│   ├── utils.ts            # cn() для className merging
│   └── date.ts             # fmtDate()
├── context/
│   └── theme.tsx           # ThemeProvider + useTheme (React Context + localStorage)
└── db/
    ├── dexie.ts            # Dexie instance + схема + типы сущностей
    └── seed.ts             # ROSTER + DEFAULT_CATEGORIES при первом запуске
```

**Тест для shared/:** «Это переносимо в другой проект или нужно всем срезам сразу?»
Утилиты (`cn`, `fmtDate`) — переносимы. Типы сущностей и схема — словарь, общий для всех
срезов. А вот калькуляция `calcSessionStats` — логика одного сценария, ей место в срезе.

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

---

## Референс

UI и логика предыдущей версии — в ветке `legacy` (тег `v1.0.0`). Код оттуда не переносим,
используем только как образец вёрстки и поведения.
