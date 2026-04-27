Хорошее решение — не прыгать сразу в Clean Architecture. Вот более простой вариант, который всё равно учит хорошим привычкам.

## Простая слоистая архитектура (3 слоя)

```
src/
├── app/                    ← Next.js pages (только роутинг)
│   ├── page.tsx
│   ├── sessions/
│   │   └── [id]/
│   │       ├── survey/page.tsx
│   │       └── results/page.tsx
│
├── features/               ← Вся логика по фичам
│   ├── session/
│   │   ├── session.types.ts
│   │   ├── session.store.ts
│   │   └── session.utils.ts
│   └── survey/
│       ├── survey.types.ts
│       ├── survey.store.ts
│       └── survey.utils.ts
│
└── components/             ← Чистые UI-компоненты
    ├── ui/
    │   ├── Button.tsx
    │   └── Card.tsx
    └── survey/
        ├── RpeScaleInput.tsx
        └── PlayerCard.tsx
```

---

## Хранение данных — Zustand + localStorage

Самый простой стек для твоей цели — быстро, без сервера, работает офлайн.

```bash
npm install zustand
```

```typescript
// src/features/survey/survey.types.ts

export interface Player {
  id: string
  name: string
}

export interface RpeEntry {
  playerId: string
  playerName: string
  score: number        // 1–10
  note?: string
}

export interface Session {
  id: string
  name: string
  date: string         // ISO string
  players: Player[]
  entries: RpeEntry[]
}
```

```typescript
// src/features/survey/survey.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Session, RpeEntry } from './survey.types'

interface SurveyStore {
  sessions: Session[]
  currentSessionId: string | null

  // actions
  createSession: (name: string, players: Player[]) => string
  submitEntry: (sessionId: string, entry: RpeEntry) => void
  setCurrentSession: (id: string) => void
  getSession: (id: string) => Session | undefined
}

export const useSurveyStore = create<SurveyStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionId: null,

      createSession: (name, players) => {
        const id = crypto.randomUUID()
        const session: Session = {
          id,
          name,
          date: new Date().toISOString(),
          players,
          entries: [],
        }
        set((state) => ({ sessions: [...state.sessions, session] }))
        return id
      },

      submitEntry: (sessionId, entry) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, entries: [...s.entries, entry] }
              : s
          ),
        }))
      },

      setCurrentSession: (id) => set({ currentSessionId: id }),

      getSession: (id) => get().sessions.find((s) => s.id === id),
    }),
    {
      name: 'rpe-storage', // ключ в localStorage
    }
  )
)
```

---

## Как использовать в компоненте

```typescript
// src/app/sessions/[id]/survey/page.tsx
'use client'
import { useSurveyStore } from '@/features/survey/survey.store'

export default function SurveyPage({ params }: { params: { id: string } }) {
  const { getSession, submitEntry } = useSurveyStore()
  const session = getSession(params.id)

  const handleScore = (playerId: string, score: number) => {
    submitEntry(params.id, {
      playerId,
      playerName: '...',
      score,
    })
  }

  // ...рендер
}
```

---

## Почему этот стек

`persist` из Zustand автоматически синхронизирует store в `localStorage` — тебе не нужно писать ни одной строки для сохранения. Данные живут между перезагрузками страницы, работают офлайн, и это ровно одна зависимость.

Когда освоишься и захочешь усложнить — `features/survey/survey.store.ts` легко разбить на слои Clean Architecture, не трогая компоненты. Это и есть главная ценность даже такой простой структуры: слои уже разделены, просто без лишних абстракций.