Read `AGENTS.md` before starting.

### Фаза 0 — Foundation (chore/foundation)
**Цель:** установить зависимости и поднять каркас FSD + дизайн-систему

1. Установить пакеты: `dexie`, `dexie-react-hooks`, `jspdf`, `xlsx`, `@serwist/next`
2. Создать FSD-структуру папок в `src/`
3. `src/shared/db/` — Dexie-схема (6 таблиц: teams, players, microcycles, sessions, sessionEntries, categories)
4. `app/globals.css` — CSS-токены из ui-context.md (light/dark theme + RPE scale)
5. `app/layout.tsx` — подключить Geist Sans + Geist Mono через `next/font/google`, ThemeProvider
6. `src/shared/ui/` — перенести shadcn-компоненты из `components/ui/`
7. `src/shared/lib/` — `srpe.ts` (sRPE = rpe × duration), форматтеры
8. `src/shared/config/` — константы RPE scale, дефолтные категории (MD-4…MD, Recovery)
9. `README.md` — чистый технический README: стек, архитектура, структура, команды

**Ветка:** `chore/foundation`  
**Результат:** `pnpm check` и `pnpm typecheck` зелёные, пустое приложение запускается
