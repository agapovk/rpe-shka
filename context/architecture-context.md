# Architecture Context

## Stack

| Layer             | Technology                  | Role                                                              |
| ----------------- | --------------------------- | ----------------------------------------------------------------- |
| Framework         | Next.js 16 + TypeScript     | Full-stack app, PWA shell, API routes                             |
| UI                | Tailwind CSS + shadcn/ui    | Component composition and styling                                 |
| Local Storage     | Dexie.js (IndexedDB)        | Offline-first browser storage — all core data lives here          |
| Export            | jsPDF + SheetJS (xlsx)      | On-device PDF, CSV, and XLSX generation                           |
| PWA               | @serwist/next               | Service worker, asset caching, installability                     |
| Future: Cloud DB  | Drizzle ORM + Neon Postgres | Cloud-side storage mirror for sync (Vercel-integrated, free tier) |
| Future: Sync      | Next.js API routes          | Push/pull sync between local IndexedDB and Neon                   |

---

## Routes

| Route                        | View              | Description                                             |
| ---------------------------- | ----------------- | ------------------------------------------------------- |
| `/`                          | dashboard         | Active microcycle summary + collapsible history         |
| `/microcycles/[id]`          | microcycle        | Session list for a microcycle                           |
| `/microcycles/[id]/report`   | microcycle-report | Aggregated microcycle report + export                   |
| `/sessions/[id]`             | session           | Session detail: player list + RPE entry modals          |
| `/settings`                  | settings          | Team management, players, session categories            |

---

## System Boundaries

The project follows **Feature-Sliced Design (FSD)**. Next.js `app/` directory handles routing only — each route renders a single component from `src/views/`. All product logic lives under `src/`.

```
app/                              — Next.js App Router (routing shell only)
  page.tsx                        → renders src/views/dashboard
  microcycles/[id]/
    page.tsx                      → renders src/views/microcycle
    report/
      page.tsx                    → renders src/views/microcycle-report
  sessions/[id]/
    page.tsx                      → renders src/views/session
  settings/
    page.tsx                      → renders src/views/settings
  api/                            — Future sync endpoints
    sync/push/route.ts
    sync/pull/route.ts

src/
  views/                          — FSD: Pages layer (renamed to avoid Next.js conflict)
    dashboard/
    microcycle/
    microcycle-report/
    session/
    settings/

  widgets/                        — Large self-contained UI blocks
    active-microcycle-card/       — Current microcycle summary on dashboard
    microcycle-history/           — Collapsible list of past microcycles
    session-list/                 — Session rows within a microcycle
    player-rpe-table/             — Player list with RPE status on session page
    microcycle-report-summary/    — Aggregated stats table for report page

  features/                       — User-facing interactions
    create-microcycle/            — Form/modal to create a microcycle
    create-session/               — Form/modal to create a session
    record-rpe/                   — Modal for entering RPE per player
    export-report/                — Export trigger and format selector (PDF/CSV/XLSX)
    manage-team/                  — Create and edit team in settings
    manage-players/               — Add, edit, remove players in settings
    manage-categories/            — Create and order session categories in settings

  entities/                       — Business domain objects
    team/
      ui/                         — TeamCard, TeamBadge
      model/                      — TypeScript types, Dexie query helpers
    player/
      ui/                         — PlayerRow, PlayerAvatar
      model/
    microcycle/
      ui/                         — MicrocycleCard, MicrocycleBadge
      model/
    session/
      ui/                         — SessionRow, SessionStatusBadge
      model/
    category/
      ui/                         — CategoryBadge
      model/

  shared/                         — Framework-agnostic foundation
    ui/                           — shadcn/ui re-exports + custom base components
    db/                           — Dexie instance, schema, typed tables
    lib/                          — sRPE calculation, date/number formatters
    config/                       — App-wide constants (RPE scale, default categories)

public/                           — PWA manifest, app icons
```

---

## FSD Import Rules

Modules may only import from layers **strictly below** their own. The order top → bottom:

```
views → widgets → features → entities → shared
```

- A `widget` may import from `features`, `entities`, and `shared` — not from `views`.
- A `feature` may import from `entities` and `shared` — not from `widgets` or `views`.
- An `entity` may import from `shared` only — never from `features` or `widgets`.
- Slices on the **same layer** must not import from each other.
- Every slice exposes a public API via `index.ts`; internal file structure is private.
- `app/` and `shared/` have no slices — their segments may import freely within the layer.

---

## Data Model

Core entity hierarchy: **Team → Microcycle → Session → SessionEntry (per player)**

| Table            | Key fields                                                  |
| ---------------- | ----------------------------------------------------------- |
| `teams`          | `id`, `name`, `createdAt`                                   |
| `players`        | `id`, `teamId`, `name`, `number`                            |
| `microcycles`    | `id`, `teamId`, `name`, `createdAt`                         |
| `sessions`       | `id`, `microcycleId`, `categoryId`, `date`, `duration` (min) |
| `sessionEntries` | `id`, `sessionId`, `playerId`, `rpe` (1–10)                 |
| `categories`     | `id`, `name`, `order` (used for custom category management) |

**sRPE** is never stored — always derived at read time: `sRPE = rpe × session.duration`.

Microcycle date range is derived from its sessions: `min(session.date)` → `max(session.date)`. No separate start/end fields.

---

## Storage Model

- **All data is local.** Reads and writes go to IndexedDB via Dexie. No network required for any core operation.
- **Reactive UI** via Dexie's `useLiveQuery` — components re-render automatically when underlying data changes.
- **Future sync**: Neon Postgres mirrors the same schema. Sync is implemented as background push/pull via Next.js API routes using `updatedAt` timestamps for change detection. Local is always the source of truth.

---

## Export Model

- All export generation runs entirely on the client — no data leaves the device.
- **PDF**: `jsPDF` renders a structured report. Delivered via a Blob URL download.
- **CSV**: plain string construction, Blob URL download.
- **XLSX**: `SheetJS` builds a workbook from the same data. Blob URL download.
- Two export scopes are supported:
  - **Session** — one session with per-player RPE, duration, and sRPE.
  - **Microcycle** — aggregated summary across all sessions: per-player totals and averages, breakdown by category.

---

## PWA Model

- `@serwist/next` registers the service worker; app shell, fonts, page bundles, and visited routes are cached.
- Installable on iOS and Android via the PWA manifest.
- No authentication in V1 — all data is local to the device.

---

## Invariants

1. All reads and writes work offline — no network call is on the critical path for any core feature.
2. `sRPE` is always computed from `rpe × session.duration` — never stored, never accepted as input.
3. Every session belongs to exactly one microcycle.
4. Microcycle dates are derived from contained sessions — no manual start/end fields.
5. Export runs fully client-side — no session data is sent to a server.
6. `app/` route files contain no product logic — they render one `views/` component and nothing else.
7. (Future) Sync is additive: local IndexedDB is the source of truth; Neon is a mirror, never the authority.
