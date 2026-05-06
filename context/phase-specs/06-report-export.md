Read `AGENTS.md` before starting.

### Фаза 6 — Microcycle report + Export (feat/report-export)
**Цель:** агрегированный отчёт и экспорт

- `widgets/microcycle-report-summary` — таблица по игрокам (total sRPE, avg RPE, duration)
- `features/export-report` — выбор формата (PDF/CSV/XLSX), генерация на клиенте
- `views/microcycle-report` — компоновка
- `app/microcycles/[id]/report/page.tsx`

**Ветка:** `feat/report-export`