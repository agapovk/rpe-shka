### Фаза 1 — Entities (feat/entities)
**Цель:** описать доменные типы и пассивные UI-компоненты

Для каждого entity — `model/` (типы, Dexie query helpers) + `ui/` + `index.ts`:

| Entity       | UI-компоненты                  |
|--------------|-------------------------------|
| `team`       | TeamCard, TeamBadge            |
| `player`     | PlayerRow, PlayerAvatar        |
| `microcycle` | MicrocycleCard, MicrocycleBadge|
| `session`    | SessionRow, SessionStatusBadge |
| `category`   | CategoryBadge                  |

**Ветка:** `feat/entities`