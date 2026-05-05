# RPE-shka

Local-first workload tracking app for sports teams. Coaches record RPE and session duration post-training; the app computes session load (sRPE), organises sessions into microcycles, and exports structured reports — all offline.

---

## Stack

| Technology | Role |
|---|---|
| Next.js 16 + TypeScript (strict) | App framework, PWA shell, future sync API routes |
| Tailwind CSS v4 + shadcn/ui | Utility-first styling, accessible component primitives |
| Dexie.js (IndexedDB) | Offline-first local storage with reactive `useLiveQuery` |
| next-themes | System-aware light/dark theme without flash |
| jsPDF + SheetJS | On-device PDF, CSV, and XLSX export — no server involved |
| @serwist/next | Service worker, asset caching, PWA installability |
| Biome (via ultracite) | Linting and formatting in one tool |

---

## Architecture

The project follows [Feature-Sliced Design (FSD)](https://feature-sliced.design). Next.js `app/` handles routing only — each route renders a single component from `src/views/`. All product logic lives under `src/`.

```
src/
  views/       # Page-level components (one per route)
  widgets/     # Self-contained UI blocks composed from features + entities
  features/    # User interactions (create microcycle, record RPE, export…)
  entities/    # Domain objects: team, player, microcycle, session, category
  shared/
    db/        # Dexie instance and schema — only module that imports Dexie
    lib/       # sRPE calculation, date/number formatters, cn utility
    config/    # RPE scale constants, default session categories
    ui/        # shadcn/ui components re-exported from a single public API
```

**Import direction:** `views → widgets → features → entities → shared`. Slices on the same layer never import each other. Each slice exposes a public API through `index.ts` only.

---

## Data model

| Table | Key fields |
|---|---|
| `teams` | `id`, `name`, `createdAt` |
| `players` | `id`, `teamId`, `name`, `number` |
| `microcycles` | `id`, `teamId`, `name`, `createdAt` |
| `sessions` | `id`, `microcycleId`, `categoryId`, `date`, `duration` (min) |
| `sessionEntries` | `id`, `sessionId`, `playerId`, `rpe` (1–10) |
| `categories` | `id`, `name`, `order` |

`sRPE` is never stored — always derived at read time: `sRPE = rpe × duration`.

Microcycle date range is derived from contained sessions — no manual start/end fields.

---

## Design system

Warm neutral palette, monochrome accent (black on light, white on dark). Tokens are defined as CSS custom properties in `globals.css` and mapped to Tailwind v4 utilities via `@theme inline`.

RPE values carry a fixed semantic colour scale: `rpe-low` (1–3) → `rpe-medium` (4–6) → `rpe-high` (7–8) → `rpe-max` (9–10). All numeric data renders in Geist Mono with `tabular-nums`.

---

## Commands

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm typecheck    # tsc --noEmit
pnpm check        # Biome lint + format check
pnpm fix          # Biome lint + format auto-fix
```
