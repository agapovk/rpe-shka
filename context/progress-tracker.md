# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 4 — Microcycle view (`feat/microcycle-view`) — in progress

## Current Goal

- Phase 4 — Microcycle detail view: session list + create-session flow

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

## In Progress

- Phase 3 — Dashboard (`feat/dashboard`): merged to v1
- Phase 4 — Microcycle view:
  - src/features/create-session/ — CreateSessionForm (category chips, date, duration)
  - src/widgets/session-list/ — SessionList (rows linking to /sessions/[id])
  - src/views/microcycle/ — MicrocycleView (header, stats, session list, add session sheet)
  - app/microcycles/[id]/page.tsx — route shell
- Phase 4 — Microcycle view (`feat/microcycle-view`): implementation complete, pending PR

## Next Up

- Phase 5 — Session detail view (RPE entry per player)

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
