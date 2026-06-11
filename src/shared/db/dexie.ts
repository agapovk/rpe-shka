import Dexie, { type EntityTable, type Table } from "dexie";
import { DEFAULT_CATEGORIES, ROSTER } from "./seed";

export interface Player {
	id: number;
	name: string;
	num: number;
}

export interface Category {
	id: string;
	name: string;
}

export interface Session {
	categoryId?: string;
	date: string;
	id: string;
	name: string;
	rosterIds: number[];
}

export interface RpeEntry {
	id: string;
	note?: string;
	playerId: number;
	score: number;
	sessionId: string;
}

// детерминированный id: put() делает upsert — повторная оценка не плодит записей
export const rpeEntryId = (sessionId: string, playerId: number): string =>
	`${sessionId}-${playerId}`;

// единый порядок игроков во всех списках; индекс в схеме не нужен — ростер маленький
export const byPlayerName = (a: Player, b: Player): number =>
	a.name.localeCompare(b.name);

class RpeDatabase extends Dexie {
	players!: EntityTable<Player, "id">;
	categories!: Table<Category, string>;
	sessions!: Table<Session, string>;
	rpeEntries!: Table<RpeEntry, string>;

	constructor() {
		super("rpe-db");
		this.version(1).stores({
			players: "++id, num",
			categories: "id",
			sessions: "id, date, categoryId",
			rpeEntries: "id, sessionId, playerId, [sessionId+playerId]",
		});
		// атомарный сид строго один раз при создании БД — двойной вызов
		// из StrictMode-эффекта или второй вкладки не дублирует ростер
		this.on("populate", (tx) => {
			tx.table("players").bulkAdd(ROSTER);
			tx.table("categories").bulkAdd(DEFAULT_CATEGORIES);
		});
	}
}

export const db = new RpeDatabase();
