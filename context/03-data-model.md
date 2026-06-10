# Модель данных

## Типы сущностей — `shared/db/dexie.ts`

Сущности (Player, Category, Session, RpeEntry) — общий словарь домена: они нужны
нескольким срезам, а срезы друг из друга не импортируют. Поэтому типы живут рядом
со схемой в `shared/db/` и импортируются оттуда.

```typescript
// shared/db/dexie.ts
export interface Player {
  id: number       // auto-increment (Dexie ++id)
  name: string     // «Иванов Иван»
  num: number      // номер на футболке (1–99)
}

export interface Category {
  id: string       // uuid
  name: string     // «MD-2»
}

export interface Session {
  id: string             // uuid
  name: string           // «Тренировка 9 Jun»
  date: string           // ISO string
  categoryId?: string    // ссылка на Category.id
  rosterIds: number[]    // список Player.id включённых в сессию
}

export interface RpeEntry {
  id: string        // `${sessionId}-${playerId}` — детерминированный
  sessionId: string
  playerId: number
  score: number     // 1–10
  note?: string
}
```

## Вычисляемые типы — `model.ts` срезов

Не хранятся в DB, специфичны для сценария — живут в своём срезе.

```typescript
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

class RpeDatabase extends Dexie {
  players!:    Table<Player,   number>  // PK: number (auto-increment)
  categories!: Table<Category, string>  // PK: string (uuid)
  sessions!:   Table<Session,  string>  // PK: string (uuid)
  rpeEntries!: Table<RpeEntry, string>  // PK: string (compound key)

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

### Политика «осиротевших» rosterIds

Если игрок удалён из ростера, его `id` остаётся в `rosterIds` старых сессий.
**Не каскадим**: историю не трогаем, при чтении просто фильтруем id, для которых
игрок не найден. История сессий важнее ссылочной целостности.

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

При первом запуске сеем дефолтный ростер и категории. Никакой миграции старых данных нет —
приложение всегда стартует с чистой БД.

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

// 22 игрока команды (номера 1–97, имена на кириллице)
export const ROSTER: Omit<Player, 'id'>[] = [
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

Вызывается в `__root.tsx` один раз при монтировании, вместе с запросом
`navigator.storage.persist()` — без него браузер вправе выселить IndexedDB
при нехватке места, а это единственная копия данных.

---

## Versioning (Dexie миграции схемы)

Если в будущем схема изменится — Dexie умеет мигрировать через `version(N).upgrade()`:

```typescript
this.version(2).stores({
  sessions: 'id, date, categoryId, name',  // добавили индекс по name
}).upgrade(tx =>
  tx.sessions.toCollection().modify(s => { s.name ??= 'Без названия' })
)
```

При изменении схемы всегда добавляем новую `version()`, не редактируем старую.
