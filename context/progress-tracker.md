# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 8 — Quality foundation (`chore/quality-foundation`) — in progress

## Current Goal

- Set up Vitest, extract export writers into pure modules, cover `shared/lib` with unit tests

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

- Phase 7 — PWA (`chore/pwa`) — merged to `v1`:
  - `app/manifest.ts` — Next.js MetadataRoute.Manifest (standalone, dark theme, icon set)
  - `public/icons/` — icon.svg, icon-192.png, icon-512.png, icon-maskable-512.png
  - `app/layout.tsx` — appleWebApp meta + Viewport export (themeColor, viewportFit=cover)
  - `public/sw.js` — cache-first for `/_next/static/`, network-first elsewhere; on offline navigation miss, picks an exact pre-cached shell URL per route family (`/microcycles/0`, `/microcycles/0/report`, `/sessions/0`), then falls back to `/`.
  - `app/register-pwa.tsx` — registers `/sw.js`, runs a warmCache on first online load (fetches every route shell + parses HTML for `/_next/static/*` chunks). Dispatches `rpe-shka:offline-ready` when warmup completes.
  - `src/shared/ui/offline-ready-toast.tsx` — one-time toast on offline-ready event (gated by localStorage `rpe-shka:offline-ready-ack`).
  - Dynamic-route pages converted to client components that read the id from `window.location.pathname` post-mount — keeps SSR-cached HTML id-agnostic so any cached shell hydrates at any concrete id.
  - Same branch also delivered FSD cleanup: collapsed entity barrels (only `entities/<x>/index.ts` is the public API), unified `@shared/lib/*` imports, biome `noRestrictedImports` ban on deep imports.

## In Progress

- Phase 8 — Quality foundation (`chore/quality-foundation`):
  - Vitest 4.x added (`vitest`, `@vitest/coverage-v8`, `vite-tsconfig-paths`); env=node, globals=false, include `src/**/*.test.ts`. Scripts: `pnpm test`, `pnpm test:watch`, `pnpm test:coverage`.
  - Export logic extracted from `features/export-report/ui/ExportReport.tsx` into `src/shared/lib/export/{download,csv,xlsx,pdf,index}.ts`. Each format split into a pure builder (`buildCsv`, `buildSheetData`, `buildPdfRows`) and a thin DOM/lib writer (`exportCsv`, `exportXlsx`, `exportPdf`). Public API exposes only writers via `@shared/lib`; biome bans `@shared/lib/export` deep imports. `ExportReport.tsx` is now ~73 lines of UI only.
  - Tests: 33 cases across `srpe`, `format`, `report`, `export/{csv,xlsx,pdf}`, `config/rpe`. `aggregateReport` covers empty/no-entries/multi-session/missing-session edge cases. `getRpeRange` covers all four bands and their boundaries. DOM writers (`triggerDownload`, `exportPdf/Xlsx/Csv`) are not unit-tested — verified by manual UI regression.

## Next Up

- Optional follow-ups (deferred): drop root `lib/utils.ts` shim if shadcn CLI alias allows, split `shared/ui/index.ts` into primitives vs app components when it grows
- Backlog from latest planning audit: navigation toggle (tab bar/navbar), microcycle archiving, single-session export, cross-microcycle compare, breakdown by category in reports, `updatedAt` foundation for sync, PlayerAvatar, RecordRpe «next player» UX, split `DashboardView.tsx`

## Open Questions

- PlayerAvatar (deferred from Phase 1) — not blocking any current phase.

## Architecture Decisions

- FSD structure lives under src/; app/ is routing shell only.
- Dexie schema versioned at v1 with 6 tables.
- CSS tokens defined as raw CSS variables; mapped to Tailwind v4 utilities via @theme inline.
- noBarrelFile biome rule disabled — FSD architecture requires index.ts slice public APIs.
- biome `style/noRestrictedImports` enforces public-API imports for `@shared/lib` subpaths (utils, format, srpe, report, export).
- Vitest is the test runner (env=node, globals=false). Pure logic in `src/shared/lib/**` is unit-tested; UI/DOM writers are verified by manual regression.
- shadcn `utils` alias points at `@shared/lib` (segment public API), so `shadcn add` generates `import { cn } from "@shared/lib"` rather than a deep import.

## Session Notes

- Old flat-structure files (app/sessions/, components/*, features/*, hooks/) were deleted in working tree on v1 before this phase; committed as part of foundation cleanup.
