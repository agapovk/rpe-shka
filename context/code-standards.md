# Code Standards

## General

- Keep modules small and single-purpose.
- Fix root causes — do not layer workarounds.
- Do not mix unrelated concerns in one component or slice.
- Respect the layer boundaries defined in `architecture-context.md`.

## Commands

Run after every change:

```bash
pnpm check       # Biome lint + format check
pnpm typecheck   # TypeScript type check (tsc --noEmit)
pnpm test        # Vitest run (CI mode)
```

Run when auto-fixable issues are reported:

```bash
pnpm fix         # Biome lint + format auto-fix
```

Other:

```bash
pnpm test:watch    # Vitest watch mode
pnpm test:coverage # Vitest with v8 coverage report
```

Never commit with failing `check`, `typecheck`, or `test` output.

## TypeScript

- Strict mode is required throughout the project.
- Avoid `any`; use explicit interfaces or narrowly scoped types.
- Use `interface` for object contracts, `type` for unions and aliases.
- Validate unknown external input at system boundaries (form submissions, future API responses) before trusting it.
- Infer types from Dexie table definitions — do not duplicate type declarations alongside the schema.

## Next.js

- Default to React Server Components. Add `"use client"` only where Dexie hooks or browser state are needed.
- `app/api/` handlers stay thin and single-purpose (future sync endpoints only).

## Feature-Sliced Design

Layer rules and import direction are defined in `architecture-context.md`. In code:

- Import slices via their `index.ts` only — never reach into internal files.
- `entities/` carries domain types and passive UI; no user interaction logic.
- `features/` carries user interactions; no layout or page-level concerns.
- `shared/db/` is the only module that imports Dexie directly.

## Styling

Token names and the RPE scale are defined in `ui-context.md`. In code:

- Use Tailwind utility names that map to tokens (`bg-base`, `text-primary`, `border-default`, etc.) — no raw color classes or hex values.
- Use RPE-scale tokens (`rpe-low`, `rpe-medium`, `rpe-high`, `rpe-max`) for any load-intensity indicator.

## Testing

- Vitest with `environment: "node"` and `globals: false` — `describe/it/expect` are imported explicitly from `vitest`.
- Tests live next to the module they cover: `src/**/<module>.test.ts`.
- Cover pure logic in `shared/lib/**` (math, formatters, aggregation, builder functions). DOM/lib writers (`exportPdf`, `exportXlsx`, `exportCsv`, `triggerDownload`) are not unit-tested — they are verified by manual UI regression.
- Tests use **relative imports** to reach the unit under test (`./srpe`, `./csv`); production code keeps importing through `@shared/lib`. The biome `noRestrictedImports` rule blocks deep paths everywhere else.

## Data Access

- All Dexie reads and writes go through helpers in `src/shared/db/`.
- Use `useLiveQuery` for reactive reads; never poll.
- Reference category by `categoryId` (FK), never as a plain string on a session.

## File Organization

Each FSD slice contains only the segments it needs:

```
{slice}/
  ui/        — React components (presentational)
  model/     — Types, Dexie query helpers, business logic
  index.ts   — Public API (the only import point)
```

Name files after their responsibility (`session-row.tsx`, not `components.tsx`). Create a segment folder only when it holds more than one file.
