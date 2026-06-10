# Стек и соглашения по коду

## Технологии

| Роль | Библиотека | Версия |
|------|-----------|--------|
| Framework | `@tanstack/react-start` | ^1.x |
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
pnpm dev          # Dev-сервер (Vite + TanStack Start)
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

**CSS-переменные темы** (dark/light переключаются классом `dark` на `<html>`):
```css
--color-bg, --color-bg-1, --color-bg-2, --color-bg-3
--color-text, --color-text-2, --color-text-3
--color-line, --color-line-2
--color-accent    /* основной акцентный цвет */
--color-warning
```

**RPE-цвета** (1–10, oklch, зелёный → красный):
```css
--rpe-1 … --rpe-10
```

Используются в `rpeColor(n)` → `var(--rpe-7)` и в `.rpe-btn` компоненте.

**Шрифты:**
- `--font-display`: Barlow Condensed (цифры, заголовки)
- `--font-sans`: Inter (основной текст)
- `--font-mono`: JetBrains Mono (данные, коды)

**Кастомные CSS-классы** (в `@layer components`):
- `.rpe-btn` — круглые кнопки RPE с glow-эффектом
- `.bar-fill` — анимированный прогресс-бар (Results)
- `.sheet-anim` — slide-up анимация ScoreSheet

---

## Тема (ThemeProvider)

```typescript
// shared/context/theme.tsx
type Theme = 'dark' | 'light' | 'system'

// Хранит выбор в localStorage под ключом 'rpe-theme'
// Применяет class 'dark' на document.documentElement
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
