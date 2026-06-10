# Модель данных

## TypeScript-типы (domain)

Живут в `model.ts` каждого среза. Это «view-модели» — то, с чем работает UI.

```typescript
// slices/manage-roster/model.ts
export interface Player {
  id: number       // auto-increment (Dexie ++id)
  name: string     // «Иванов Иван»
  num: number      // номер на футболке (1–99)
}

// slices/manage-categories/model.ts
export interface Category {
  id: string       // uuid
  name: string     // «MD-2»
}

// slices/manage-session/model.ts
export interface Session {
  id: string             // uuid
  name: string           // «Тренировка 9 Jun»
  date: string           // ISO string
  categoryId?: string    // ссылка на Category.id
  rosterIds: number[]    // список Player.id включённых в сессию
}

// slices/record-rpe/model.ts
export interface RpeEntry {
  id: string        // `${sessionId}-${playerId}` — детерминированный
  sessionId: string
  playerId: number
  score: number     // 1–10
  note?: string
}

// Вычисляемые (не хранятся в DB):

// slices/manage-session/model.ts
export interface SessionSummary {
  done: number      // сколько игроков оценено
  total: number     // всего в ростере сессии
  avg: number       // средний RPE
  dist: number[]    // [5] распределение по бакетам 1-2, 3-4, 5-6, 7-8, 9-10
}

export interface HomeStats {
  sessionsLast30d: number
  sevenDayAvg: number
  topLoaded: string   // «Иванов И.» — игрок с макс. средним RPE за 7 дней
}

// slices/view-results/model.ts
export interface SessionStats {
  avg: number
  hi: number
  lo: number
  hard: number   // кол-во игроков с RPE >= 8
}
```

---

## Схема Dexie (IndexedDB)

```typescript
// shared/db/dexie.ts
import Dexie, { type Table } from 'dexie'

// DB-типы = domain-типы (совпадают в этом проекте, нет нормализации)
export type DbPlayer    = Player
export type DbCategory  = Category
export type DbSession   = Session
export type DbRpeEntry  = RpeEntry

class RpeDatabase extends Dexie {
  players!:    Table<DbPlayer,   number>  // PK: number (auto-increment)
  categories!: Table<DbCategory, string>  // PK: string (uuid)
  sessions!:   Table<DbSession,  string>  // PK: string (uuid)
  rpeEntries!: Table<DbRpeEntry, string>  // PK: string (compound key)

  constructor() {
    super('rpe-db')
    this.version(1).stores({
      players:    '++id, num',
      categories: 'id',
      sessions:   'id, date, categoryId',
      //           compound index ↓ для быстрого поиска оценки игрока в сессии
      rpeEntries: 'id, sessionId, playerId, [sessionId+playerId]',
    })
  }
}

export const db = new RpeDatabase()
```

### Почему `id` у RpeEntry детерминированный

`id = \`${sessionId}-${playerId}\`` — при повторном `db.rpeEntries.put()` Dexie делает upsert
(не дублирует запись). Это позволяет вызывать `setScore()` идемпотентно.

---

## Индексы и запросы

| Запрос | Как делаем |
|--------|-----------|
| Все сессии, свежие первые | `db.sessions.orderBy('date').reverse().toArray()` |
| Все оценки сессии | `db.rpeEntries.where('sessionId').equals(id).toArray()` |
| Оценка конкретного игрока | `db.rpeEntries.get(\`${sessionId}-${playerId}\`)` |
| Все игроки сессии | `db.players.where('id').anyOf(session.rosterIds).toArray()` |
| Сессии за последние N дней | `db.sessions.where('date').above(cutoff).toArray()` |

---

## Дефолтные данные (seed)

```typescript
// shared/db/seed.ts

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'md-4', name: 'MD-4' },
  { id: 'md-3', name: 'MD-3' },
  { id: 'md-2', name: 'MD-2' },
  { id: 'md-1', name: 'MD-1' },
  { id: 'md',   name: 'MD'   },
  { id: 'md+1', name: 'MD+1' },
]

// 22 игрока волейбольной команды (номера 1–97, имена на кириллице)
export const ROSTER: Omit<DbPlayer, 'id'>[] = [
  { name: 'Иванов Иван', num: 1 },
  // ...
]

export async function seedDatabase() {
  const playerCount = await db.players.count()
  if (playerCount === 0) await db.players.bulkAdd(ROSTER)

  const catCount = await db.categories.count()
  if (catCount === 0) await db.categories.bulkPut(DEFAULT_CATEGORIES)
}
```

---

## Миграция старых данных (Zustand → Dexie)

Запускается один раз при первом запуске нового приложения.
Старые данные хранились в IndexedDB под ключами `rpe-storage` и `rpe-roster`
(Zustand `persist` сериализует их как JSON).

```typescript
// shared/db/seed.ts
export async function migrateFromZustand() {
  const count = await db.sessions.count()
  if (count > 0) return  // уже мигрировали или нет данных

  // Сессии и категории из survey store
  const surveyRaw = localStorage.getItem('rpe-storage')
  if (surveyRaw) {
    const { sessions = [], categories = [] } = JSON.parse(surveyRaw).state ?? {}

    await db.transaction('rw', db.sessions, db.rpeEntries, db.categories, async () => {
      if (categories.length > 0) await db.categories.bulkPut(categories)

      for (const s of sessions) {
        await db.sessions.put({
          id: s.id, name: s.name, date: s.date,
          categoryId: s.categoryId, rosterIds: s.rosterIds ?? [],
        })
        // scores: Record<playerId, score> + notes: Record<playerId, note>
        for (const [pid, score] of Object.entries(s.scores ?? {})) {
          await db.rpeEntries.put({
            id: `${s.id}-${pid}`,
            sessionId: s.id,
            playerId: Number(pid),
            score: score as number,
            note: s.notes?.[pid],
          })
        }
      }
    })
  }

  // Ростер из roster store
  const rosterRaw = localStorage.getItem('rpe-roster')
  if (rosterRaw) {
    const { players = [] } = JSON.parse(rosterRaw).state ?? {}
    if (players.length > 0) await db.players.bulkPut(players)
  }
}
```

Вызывается в `__root.tsx` один раз при монтировании, до рендера приложения.

---

## Versioning (Dexie миграции)

Если в будущем схема изменится — Dexie умеет мигрировать через `version(N).upgrade()`:

```typescript
this.version(2).stores({
  sessions: 'id, date, categoryId, name',  // добавили индекс по name
}).upgrade(tx =>
  tx.sessions.toCollection().modify(s => { s.name ??= 'Без названия' })
)
```

При изменении схемы всегда добавляем новую `version()`, не редактируем старую.
