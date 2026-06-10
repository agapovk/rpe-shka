# CLAUDE.md — Контекст проекта RPE Tracker (TanStack Start)

## 1. Описание проекта
Офлайн PWA для сбора оценок *RPE* (*Rating of Perceived Exertion*) после тренировки.
Тренер на поле → собирает оценки 1–10 → смотрит аналитику. Без интернета, без бэкенда.

Подробный контекст — в папке `context/`:
- `context/01-overview.md` — домен, флоу, терминология
- `context/02-architecture-vsa.md` — VSA, правила срезов
- `context/03-data-model.md` — Dexie-схема, типы
- `context/04-stack-conventions.md` — стек, команды, соглашения
- `context/05-migration-status.md` — живой чек-лист фаз
- `context/new-release.md` — план разработки, принятые решения

Предыдущая версия (Next.js) — в ветке `legacy` (тег `v1.0.0`), используется только
как референс UI и логики. Код и данные не мигрируем, пишем с нуля.

## 2. Целевой стек
| Слой | Технология |
|------|-----------|
| Framework | **TanStack Start v1** (Vite, SPA-режим — SSR выключен) |
| Routing | **TanStack Router** (file-based) |
| Local DB | **Dexie.js** + `useLiveQuery` |
| UI state | `useState` + React Context |
| Тема | React Context + localStorage |
| Стилизация | **Tailwind CSS v4** (без shadcn) |
| Архитектура | **VSA** (`src/slices/` + `src/shared/`) |
| PWA | **vite-plugin-pwa** |
| Tests | **Vitest** |
| Lint | Ultracite / Biome |

**Убраны:** Next.js, Zustand, idb-keyval, shadcn, Radix UI, class-variance-authority.

## 3. Архитектура — Vertical Slice Architecture

Каждый срез = один пользовательский сценарий. Срезы не импортируют друг друга.

```
src/
├── routes/          ← Тонкий слой: только createFileRoute + импорт из slices
├── slices/
│   ├── record-rpe/         # Оценить игрока
│   ├── view-results/       # Результаты сессии + XLSX
│   ├── manage-session/     # CRUD сессий, список
│   ├── manage-roster/      # CRUD игроков
│   └── manage-categories/  # CRUD категорий
└── shared/
    ├── ui/          ← Button, ErrorBoundary, ThemeToggle (без shadcn)
    ├── lib/         ← cn(), fmtDate()
    ├── context/     ← ThemeProvider
    └── db/          ← Dexie instance + типы сущностей + seed
```

Структура каждого среза:
```
slice-name/
├── ui/          # React-компоненты
├── model.ts     # Типы + чистые функции (без side effects)
├── queries.ts   # useLiveQuery хуки (только чтение)
├── mutations.ts # async функции → Dexie (не хуки)
└── index.ts     # Публичный API
```

## 4. Команды

```bash
pnpm dev                    # dev-сервер
pnpm build                  # production build
pnpm test                   # Vitest
pnpm dlx ultracite fix      # автоисправление
pnpm dlx ultracite check    # проверка
```

## 5. Стандарты кодирования

### Типы
- Явные типы для параметров и возвращаемых значений
- `unknown` вместо `any`; сужение типов вместо type assertions
- `as const` для неизменяемых значений; именованные константы вместо magic numbers

### Синтаксис
- Стрелочные функции для колбэков; `for...of`; `const` по умолчанию
- Опциональная цепочка `?.` и нулл-коалесцинг `??`; деструктуризация

### React
- Функциональные компоненты; хуки только на верхнем уровне
- Уникальный `key` (id, не index); семантический HTML + ARIA
- `ref` как проп (React 19+), не `React.forwardRef`
- Не определять компоненты внутри компонентов

### Код
- Без `console.log`, `debugger`, `alert` в коммитах
- Ранние возвраты вместо вложенных условий
- Комментарии только если WHY неочевиден

### Безопасность
- `rel="noopener"` для `target="_blank"`
- Не использовать `dangerouslySetInnerHTML`

## 6. Порядок работы с Git

### Принципы
- **`main` — защищённая ветка.** Прямые коммиты запрещены. Только через Pull Request.
- **Одна фаза — одна ветка.** Называть по паттерну `feat/phase-N-название`.
- **PR = завершённая единица работы.** Ветка должна компилироваться и проходить линтер.

### Жизненный цикл ветки

```
main
 └─ feat/phase-1-tanstack-start     # работа
      └─ PR → main                  # ревью + мёрж
 └─ feat/phase-2-dexie              # следующая фаза
      └─ PR → main
 ...
```

### Именование веток

| Тип | Паттерн | Пример |
|-----|---------|--------|
| Фаза миграции | `feat/phase-N-короткое-описание` | `feat/phase-1-tanstack-start` |
| Фича | `feat/название` | `feat/session-duplicates` |
| Исправление | `fix/описание` | `fix/rpe-scale-mobile` |
| Рефакторинг | `chore/описание` | `chore/cleanup-types` |

### Создание ветки для фазы

```bash
git checkout main
git pull origin main
git checkout -b feat/phase-N-название
# ... работа ...
git push origin feat/phase-N-название
# создать PR через GitHub UI
```

### Перед созданием PR
```bash
pnpm dlx ultracite check    # линтер чист
tsc --noEmit                # типы чисты
pnpm build                  # сборка проходит
```

### Что НЕ делать
- Не делать `git push --force` в `main`
- Не мёржить ветку в `main` напрямую (только через PR)
- Не коммитить сгенерированные файлы (`node_modules`, `.next`, `dist`)
- Не пропускать хуки `--no-verify`

### Теги
- `v1.0.0` — legacy Next.js версия (ветка `legacy`)
- Следующий тег ставится после завершения всех фаз и деплоя
