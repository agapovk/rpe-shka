# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 7 — PWA (`chore/pwa`) — done; FSD cleanup in progress on same branch

## Current Goal

- Tighten FSD slice public APIs (one barrel per slice) and unify shared/lib imports

## Completed

- Phase 0 — Foundation:
  - Installed packages: dexie, dexie-react-hooks, jspdf, xlsx, @serwist/next
  - Created FSD structure: src/{shared,views,widgets,features,entities}
  - src/shared/db/ — Dexie schema, 6 tables (teams, players, microcycles, sessions, sessionEntries, categories)
  - app/globals.css — full design token system (light/dark + RPE scale), shadcn compat vars
  - app/layout.tsx — Geist Sans + Geist Mono via next/font/google, ThemeProvider (next-themes)
  - src/shared/ui/ — button.tsx moved from components/ui/, ThemeProvider wrapper, index.ts
  - src/shared/lib/ — srpe.ts (sRPE = rpe × duration), format.ts, utils.ts (cn), index.ts
  - src/shared/config/ — rpe.ts (RPE_SCALE, getRpeRange), categories.ts (DEFAULT_CATEGORIES), index.ts
  - biome.jsonc — disabled noBarrelFile rule (FSD requires index.ts public APIs)
  - tsconfig.json — added @shared/*, @entities/*, @features/*, @widgets/*, @views/* path aliases
  - components.json — updated aliases to src/shared/ui, src/shared/lib
  - pnpm check + pnpm typecheck: green

- Phase 1 — Entities (`feat/entities`) — merged to main:
  - src/shared/ui/ — badge.tsx, item.tsx, separator.tsx added; index.ts updated
  - src/entities/team/ — model (types, queries), ui (TeamCard, TeamBadge)
  - src/entities/player/ — model (types, queries), ui (PlayerRow) — PlayerAvatar deferred
  - src/entities/microcycle/ — model (types, queries), ui (MicrocycleCard, MicrocycleBadge)
  - src/entities/session/ — model (types, queries, SessionStatus), ui (SessionRow, SessionStatusBadge)
  - src/entities/category/ — model (types, queries), ui (CategoryBadge)

- Phase 2 — Settings (`feat/settings`) — merged to main:
  - src/shared/ui/ — input.tsx, bottom-sheet.tsx added; index.ts updated
  - src/features/manage-team/ — TeamForm (create/edit team), index.ts
  - src/features/manage-players/ — ManagePlayers (list + PlayerForm + delete), index.ts
  - src/features/manage-categories/ — ManageCategories (list + CategoryForm + reorder + reset), index.ts
  - src/views/settings/ — SettingsView (assembles all three features), index.ts
  - app/settings/page.tsx — route shell rendering SettingsView

- Phase 3 — Dashboard (`feat/dashboard`) — in progress:
  - src/features/create-microcycle/ — CreateMicrocycleForm (name input, creates via Dexie), index.ts
  - src/widgets/active-microcycle-card/ — ActiveMicrocycleCard (sessions live query, stats, link to microcycle), index.ts
  - src/widgets/microcycle-history/ — MicrocycleHistory (collapsible, per-item session count), index.ts
  - src/views/dashboard/ — DashboardView (team selector, empty states, BottomSheet for create), index.ts
  - app/page.tsx — replaced preview page with DashboardView

- Phase 4 — Microcycle view (`feat/microcycle-view`): merged to main
  - src/features/create-session/ — CreateSessionForm (category chips, date, duration)
  - src/widgets/session-list/ — SessionList (rows linking to /sessions/[id])
  - src/views/microcycle/ — MicrocycleView (header, stats, session list, add session sheet, report link)
  - app/microcycles/[id]/page.tsx — route shell

- Phase 5 — Session + RPE entry (`feat/session-rpe`): merged to main

- Phase 6 — Reports / export (`feat/report-export`): merged to main
  - `src/shared/lib/report.ts` — `PlayerReportRow` type + `aggregateReport` function
  - `src/entities/microcycle/model/` — `useMicrocycleReportData` live query
  - `src/widgets/microcycle-report-summary/` — MicrocycleReportSummary table
  - `src/features/export-report/` — PDF/CSV/XLSX export bottom sheet
  - `src/views/microcycle-report/` — MicrocycleReportView
  - `app/microcycles/[id]/report/page.tsx` — route shell
  - `src/entities/session/model/` — added `useSessionEntries` query, exported `SessionEntry` type
  - `src/features/record-rpe/` — RecordRpe bottom sheet (RPE 1–10 grid, upsert to sessionEntries)
  - `src/widgets/player-rpe-table/` — PlayerRpeTable (player list + RPE value + sRPE, opens RecordRpe sheet)
  - `src/views/session/` — SessionView (header with category/date/duration, PlayerRpeTable)
  - `app/sessions/[id]/page.tsx` — route shell

## In Progress

- FSD cleanup (`chore/pwa`):
  - Removed inner `model/index.ts` and `ui/index.ts` barrels in all 5 entities — only `entities/<x>/index.ts` remains as the public API. `entities/<x>/index.ts` now imports directly from concrete files (`./model/queries`, `./model/types`, `./ui/<Component>`).
  - Inner ui files now import types from `../model/types` directly (was `../model`).
  - Unified all `@shared/lib/utils` and `@shared/lib/format` deep imports to `@shared/lib` (16 occurrences across entities/features/widgets/views). Two files where both `cn` and a formatter were imported separately were collapsed into a single `@shared/lib` import.
  - `shared/lib/report.ts` keeps `import type { Player, Session, SessionEntry } from "@shared/db"` — this file lives in the shared layer and cannot import from entities (FSD).
  - Decision left in place: domain types continue to live in `shared/db/db.ts` next to the Dexie schema. Entity layer re-exports them as the public domain type. Outside-entity callers (features, widgets, views) only see types via `@entities/*`.
  - `shared/ui/not-found-shell.tsx` extracted earlier in this branch — see commit `6c80c40`.

- Phase 7 — PWA (`chore/pwa`):
  - `app/manifest.ts` — Next.js MetadataRoute.Manifest (standalone, dark theme, icon set)
  - `public/icons/` — icon.svg, icon-192.png, icon-512.png, icon-maskable-512.png
  - `app/layout.tsx` — appleWebApp meta + Viewport export (themeColor, viewportFit=cover)
  - `public/sw.js` (cache `rpe-shka-v3`) — hand-rolled SW: cache-first for `/_next/static/`, network-first elsewhere; on offline navigation miss, picks an exact pre-cached shell URL per route family (`/microcycles/0`, `/microcycles/0/report`, `/sessions/0`), then falls back to `/`. Earlier prefix matching for `/microcycles/` was ambiguous (could match the `/0/report` shell first) — fixed by using exact shell lookup with route-pattern dispatch.
  - `app/register-pwa.tsx` — registers `/sw.js` and runs a warmCache on first online load: fetches every known route shell, parses the HTML for `/_next/static/*` references, and fetches every chunk so the SW caches the full asset graph. Without this, only routes visited online would work offline. Dispatches `rpe-shka:offline-ready` when warmup completes.
  - `src/shared/ui/offline-ready-toast.tsx` — listens for the offline-ready event and shows a one-time toast confirming the app is fully cached for offline use (gated by localStorage `rpe-shka:offline-ready-ack`). Mounted from `app/layout.tsx`.
  - `src/views/settings/ui/SettingsView.tsx` — added a back-arrow link to `/` in the header.
  - Dynamic-route pages converted to client components that read the id from `window.location.pathname` post-mount (`app/microcycles/[id]/page.tsx`, `.../report/page.tsx`, `app/sessions/[id]/page.tsx`). This makes SSR-cached HTML id-agnostic so any cached shell hydrates correctly at any concrete id — fixes the bug where microcycles created offline rendered the wrong (server-baked) id.

## Next Up

- Phase 7 + FSD cleanup PR + merge
- Optional follow-ups (deferred): drop root `lib/utils.ts` shim if shadcn CLI alias allows, split `shared/ui/index.ts` into primitives vs app components when it grows

## Open Questions

- PlayerAvatar (deferred from Phase 1) — not blocking any current phase.

## Architecture Decisions

- FSD structure lives under src/; app/ is routing shell only.
- Dexie schema versioned at v1 with 6 tables.
- CSS tokens defined as raw CSS variables; mapped to Tailwind v4 utilities via @theme inline.
- noBarrelFile biome rule disabled — FSD architecture requires index.ts slice public APIs.
- lib/utils.ts kept as-is at root for shadcn CLI compatibility; src/shared/lib/utils.ts is canonical FSD location.

## Session Notes

- Old flat-structure files (app/sessions/, components/*, features/*, hooks/) were deleted in working tree on v1 before this phase; committed as part of foundation cleanup.
