# RPE Tracker

Офлайн PWA для сбора оценок RPE (Rating of Perceived Exertion) после тренировки.
Тренер на поле → собирает оценки 1–10 → смотрит аналитику. Без интернета, без бэкенда.

**Стек:** Vite + React 19 (SPA) · TanStack Router (file-based) · Dexie.js (IndexedDB) ·
Tailwind CSS v4 · Vertical Slice Architecture.

Подробный контекст и план разработки — в папке [context/](context/).

```bash
pnpm install
pnpm dev        # dev-сервер на :3000
pnpm build      # production build (статика в dist/)
pnpm typecheck  # tsc --noEmit
pnpm check      # biome
```

> Полноценный README (демо, скриншоты, архитектура) — после фазы 4, см.
> [context/05-migration-status.md](context/05-migration-status.md).
