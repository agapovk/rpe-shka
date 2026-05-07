Read `AGENTS.md` before starting.

### Фаза 8 — Quality foundation (chore/quality-foundation)
**Цель:** тестовая база и чистые экспортёры

- Vitest (env=node, vite-tsconfig-paths) + scripts `test`/`test:watch`/`test:coverage`
- `shared/lib/export/{download,csv,xlsx,pdf,index}.ts` — pure builder + thin writer для каждого формата
- `features/export-report/ui/ExportReport.tsx` — оставить только UI bottom-sheet, экспорты звать из `@shared/lib`
- Тесты: `srpe`, `format`, `report`, `export/{csv,xlsx,pdf}` (pure builders), `config/rpe` (`getRpeRange`)
- biome `noRestrictedImports`: добавить `@shared/lib/export`

**Ветка:** `chore/quality-foundation` (PR в `v1`)
