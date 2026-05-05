import Dexie, { type Table } from "dexie";

export interface Team {
  createdAt: Date;
  id?: number;
  name: string;
}

export interface Player {
  id?: number;
  name: string;
  number?: number;
  teamId: number;
}

export interface Microcycle {
  createdAt: Date;
  id?: number;
  name: string;
  teamId: number;
}

export interface Session {
  categoryId: number;
  date: Date;
  duration: number;
  id?: number;
  microcycleId: number;
}

export interface SessionEntry {
  id?: number;
  playerId: number;
  rpe: number;
  sessionId: number;
}

export interface Category {
  id?: number;
  name: string;
  order: number;
}

class AppDatabase extends Dexie {
  teams!: Table<Team>;
  players!: Table<Player>;
  microcycles!: Table<Microcycle>;
  sessions!: Table<Session>;
  sessionEntries!: Table<SessionEntry>;
  categories!: Table<Category>;

  constructor() {
    super("rpe-shka");
    this.version(1).stores({
      teams: "++id, name, createdAt",
      players: "++id, teamId, name",
      microcycles: "++id, teamId, name, createdAt",
      sessions: "++id, microcycleId, categoryId, date",
      sessionEntries: "++id, sessionId, playerId",
      categories: "++id, name, order",
    });
  }
}

export const db = new AppDatabase();
