import type { Player } from "@/shared/db/dexie";

export type RosterEntry = Pick<Player, "name" | "num">;

export interface ParseResult {
	errors: string[];
	players: RosterEntry[];
}

const NEWLINE = /\r?\n/;
const SEPARATOR = /[,\t;]/;
const DIGITS = /^\d+$/;

const isValidNum = (n: number): boolean => Number.isInteger(n) && n >= 0;

// Принимает либо JSON-массив [{name,num}], либо строки «Имя, Номер»
// (разделитель — запятая/таб/точка-с-запятой, порядок токенов любой).
export function parseRoster(text: string): ParseResult {
	const trimmed = text.trim();
	if (!trimmed) {
		return { players: [], errors: [] };
	}
	return trimmed.startsWith("[") ? parseJson(trimmed) : parseLines(trimmed);
}

function parseJson(text: string): ParseResult {
	let raw: unknown;
	try {
		raw = JSON.parse(text);
	} catch {
		return { players: [], errors: ["Invalid JSON"] };
	}
	if (!Array.isArray(raw)) {
		return { players: [], errors: ["Expected a JSON array of players"] };
	}
	const players: RosterEntry[] = [];
	const errors: string[] = [];
	for (const [i, item] of raw.entries()) {
		const rec = item as Record<string, unknown>;
		const name = typeof rec?.name === "string" ? rec.name.trim() : "";
		const num = typeof rec?.num === "number" ? rec.num : Number.NaN;
		if (name && isValidNum(num)) {
			players.push({ name, num });
		} else {
			errors.push(`Item ${i + 1}: need a name and a number`);
		}
	}
	return { players, errors };
}

function parseLines(text: string): ParseResult {
	const players: RosterEntry[] = [];
	const errors: string[] = [];
	for (const [i, line] of text.split(NEWLINE).entries()) {
		if (!line.trim()) {
			continue;
		}
		const tokens = line
			.split(SEPARATOR)
			.map((t) => t.trim())
			.filter(Boolean);
		const numToken = tokens.find((t) => DIGITS.test(t));
		const name = tokens.filter((t) => t !== numToken).join(" ");
		const num = numToken ? Number(numToken) : Number.NaN;
		if (name && isValidNum(num)) {
			players.push({ name, num });
		} else {
			errors.push(`Line ${i + 1}: expected "Name, Number"`);
		}
	}
	return { players, errors };
}

export function serializeRoster(players: RosterEntry[]): string {
	const sorted = [...players].sort((a, b) => a.name.localeCompare(b.name));
	return JSON.stringify(
		sorted.map(({ name, num }) => ({ name, num })),
		null,
		2
	);
}
