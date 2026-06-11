import type { Category, Player } from "./dexie";

export const DEFAULT_CATEGORIES: Category[] = [
	{ id: "md-4", name: "MD-4" },
	{ id: "md-3", name: "MD-3" },
	{ id: "md-2", name: "MD-2" },
	{ id: "md-1", name: "MD-1" },
	{ id: "md", name: "MD" },
	{ id: "md+1", name: "MD+1" },
];

export const ROSTER: Omit<Player, "id">[] = [
	{ name: "AKBASHEV ROMAN", num: 13 },
	{ name: "AYUPOV TIMUR", num: 5 },
	{ name: "BARDACHEV MATVEY", num: 4 },
	{ name: "BEGIC SILVIJE", num: 2 },
	{ name: "BOGOMOLSKIY EGOR", num: 19 },
	{ name: "BONDAREV VITALIY", num: 37 },
	{ name: "CORDEIRO LEO", num: 22 },
	{ name: "FILIPENKO EGOR", num: 24 },
	{ name: "ISHKOV ILYA", num: 97 },
	{ name: "ITALO FERNANDO", num: 16 },
	{ name: "IVANISENYA DMITRIY", num: 21 },
	{ name: "KARAPUZOV VLADISLAV", num: 11 },
	{ name: "KHARIN EVGENIY", num: 59 },
	{ name: "MALKEVICH VLADISLAV", num: 44 },
	{ name: "MAMIN ARTEM", num: 46 },
	{ name: "MARGASOV TIMOFEY", num: 34 },
	{ name: "MARKOV EVGENIY", num: 20 },
	{ name: "MOROZOV NIKITA", num: 18 },
	{ name: "MOSIN EGOR", num: 9 },
	{ name: "SEKULIC MARTIN", num: 10 },
	{ name: "SUNGATULIN FANIL", num: 6 },
	{ name: "ZHELEZNOV YURIY", num: 14 },
];
