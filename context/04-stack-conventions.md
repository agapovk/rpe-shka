# Стек и соглашения по коду

## Технологии

| Роль | Библиотека | Версия |
|------|-----------|--------|
| Framework | `vite` + `react` (чистый SPA) | ^8.x / ^19.x |
| Routing | `@tanstack/react-router` | ^1.x |
| Local DB | `dexie` | ^4.x |
| Реактивные запросы | `dexie-react-hooks` | ^1.x |
| Стилизация | `tailwindcss` | ^4.x |
| Слияние классов | `tailwind-merge` + `clsx` | — |
| Иконки | `lucide-react` | — |
| Экспорт | `xlsx` (только dynamic import) | — |
| PWA | `vite-plugin-pwa` | — |
| Тесты | `vitest` | — |
| Lint/Format | `@biomejs/biome` + `ultracite` | — |
| Хуки git | `husky` + `lint-staged` | — |
| Package manager | `pnpm` | — |

---

## Команды

```bash
pnpm dev          # Dev-сервер (Vite)
pnpm build        # Production build
pnpm start        # Запустить production build локально
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run
pnpm test:watch   # vitest (watch mode)

# Lint / Format (Biome через Ultracite)
pnpm dlx ultracite check   # проверить
pnpm dlx ultracite fix     # автоисправление
pnpm dlx ultracite doctor  # диагностика конфига
```

Pre-commit хук (husky + lint-staged) автоматически запускает `ultracite fix` на изменённых файлах.

---

## Структура файлов

```
src/
├── routes/          # TanStack Router — только рендер срезов
├── slices/          # Вертикальные срезы (VSA)
├── shared/          # ui, lib, context, db — без бизнес-логики
└── styles/
    └── globals.css  # Tailwind @import + CSS-переменные темы + RPE-цвета
```

Правило импортов:
- `routes/` → `slices/*/index.ts` и `shared/`
- `slices/*/` → только `shared/` (не друг в друга)
- `shared/` → ничего из `slices/`

---

## Стиль кода (Ultracite/Biome)

Полная спецификация: [`.claude/CLAUDE.md`](../.claude/CLAUDE.md).

Ключевые правила:

**TypeScript**
- Явные типы для параметров и возвращаемых значений функций
- `unknown` вместо `any`
- `as const` для неизменяемых массивов/объектов
- Нет «магических чисел» — именованные константы

**React**
- Только функциональные компоненты
- Хуки только на верхнем уровне
- Уникальные `key` в списках (id, не index)
- Семантический HTML + ARIA где нужно
- Нет компонентов внутри компонентов

**Общее**
- `const` по умолчанию, `let` только если переприсвоение
- `for...of` вместо `.forEach`
- Optional chaining `?.` и nullish coalescing `??`
- Early returns вместо вложенных `if`
- Нет `console.log` / `debugger` в коммитах

**Комментарии**
- Пишем только когда WHY неочевиден (скрытое ограничение, обходной путь для бага)
- Никаких doc-блоков и многострочных комментариев

---

## CSS / Тема

**Tailwind v4** — конфигурация через `@theme {}` в `globals.css`, не через `tailwind.config.js`.

**Цветовые токены** — каждый определён один раз через `light-dark()`,
темы переключаются `color-scheme` на `<html>` (никакого класса `.dark`):
```css
--color-bg        /* фон страницы */
--color-surface   /* карточки, инпуты, контейнеры */
--color-text      /* основной текст */
--color-muted     /* вторичный текст */
--color-line      /* границы */
--color-accent    /* акцент */
```
Для редких опасных действий — стандартный `red-500` из Tailwind, отдельного токена нет.

**RPE-цвета** — по бакету, не по баллу (oklch):
```css
--color-rpe-light      /* 1–3 */
--color-rpe-moderate   /* 4–6 */
--color-rpe-hard       /* 7–8 */
--color-rpe-maximal    /* 9–10 */
```

**Правило использования:** только зарегистрированные утилиты (`bg-surface`, `text-muted`,
`border-line`, `font-display`). Никаких arbitrary values `[var(--…)]` и inline `style`.

**Шрифты:**
- `--font-display`: Barlow Condensed (цифры, заголовки)
- `--font-sans`: Inter (основной текст)

**Кастомных CSS-классов нет** — компоненты стилизуются утилитами на месте.
Анимации добавляются точечно (`@keyframes`) когда появляется компонент.

---

## Тема (ThemeProvider)

```typescript
// shared/context/theme.tsx
type Theme = 'dark' | 'light' | 'system'

// Хранит выбор в localStorage под ключом 'rpe-theme', дефолт — 'system'
// Применяет color-scheme на document.documentElement:
//   'system' → 'light dark' (браузер сам следит за системной темой)
// useTheme() — хук для чтения и смены темы
```

Нет зависимости от `next-themes` или других библиотек.

---

## PWA (vite-plugin-pwa)

Конфигурация в `vite.config.ts`:
- `registerType: 'autoUpdate'` — SW обновляется автоматически
- `manifest`: name, short_name, icons (192×192, 512×512, maskable)
- `workbox.globPatterns` — precache всего app shell (SPA: единственный HTML + assets)
- Стратегия — **CacheFirst**: на поле связь *мерцает*, NetworkFirst висел бы до
  таймаута на каждой навигации. Обновления подтягивает autoUpdate SW в фоне.

Offline: приложение работает полностью из кэша SW + IndexedDB. Нет сетевых запросов.

---

## Тесты (Vitest)

Тестируем только **чистые функции** из `model.ts` файлов:

```typescript
// slices/view-results/model.test.ts
import { describe, it, expect } from 'vitest'
import { rpeBucket, calcSessionStats } from './model'

describe('rpeBucket', () => {
  it('returns LIGHT for score <= 3', () => {
    expect(rpeBucket(1)).toBe('LIGHT')
    expect(rpeBucket(3)).toBe('LIGHT')
  })
  it('returns MAXIMAL for score > 8', () => {
    expect(rpeBucket(9)).toBe('MAXIMAL')
    expect(rpeBucket(10)).toBe('MAXIMAL')
  })
})
```

Не тестируем: компоненты, Dexie-запросы, интеграцию. Фокус на domain-логике.

---

## Именование

| Что | Конвенция | Пример |
|-----|-----------|--------|
| Компоненты | PascalCase | `CaptureScreen.tsx` |
| Хуки | camelCase с `use` | `useSessionEntries.ts` |
| Утилиты / мутации | camelCase | `setScore`, `fmtDate` |
| Папки срезов | kebab-case | `record-rpe/`, `manage-roster/` |
| CSS-переменные | kebab-case с префиксом | `--color-accent`, `--rpe-7` |
| Типы сущностей | PascalCase, живут в `shared/db/dexie.ts` | `Session`, `RpeEntry` |
| Env-переменные | UPPER_SNAKE через `VITE_` | `VITE_APP_VERSION` |
