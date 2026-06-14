import type { Category, Player } from "./dexie";

export const DEFAULT_CATEGORIES: Category[] = [
	{ id: "md-4", name: "MD-4" },
	{ id: "md-3", name: "MD-3" },
	{ id: "md-2", name: "MD-2" },
	{ id: "md-1", name: "MD-1" },
	{ id: "md", name: "MD" },
	{ id: "md+1", name: "MD+1" },
];

// Демо-состав: вымышленные игроки. Свой ростер импортируется в Settings
// (JSON-файл или вставка «Имя, Номер») — реальные данные в репо не хранятся.
export const ROSTER: Omit<Player, "id">[] = [
	{ name: "PLAYER ONE", num: 1 },
	{ name: "PLAYER TWO", num: 2 },
	{ name: "PLAYER THREE", num: 3 },
	{ name: "PLAYER FOUR", num: 4 },
	{ name: "PLAYER FIVE", num: 5 },
];
