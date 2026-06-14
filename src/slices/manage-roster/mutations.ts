import { byPlayerName, db, type Player } from "@/shared/db/dexie";
import type { RosterEntry } from "./model";

export async function addPlayer(name: string, num: number): Promise<void> {
	await db.players.add({ name, num });
}

export async function exportRoster(): Promise<RosterEntry[]> {
	const players = await db.players.toArray();
	return players.sort(byPlayerName).map(({ name, num }) => ({ name, num }));
}

// Добавляет только игроков с новым номером — номер уникален в ростере,
// поэтому совпадение считаем дублем и пропускаем (без перезаписи).
export async function importRoster(
	incoming: RosterEntry[]
): Promise<{ added: number; skipped: number }> {
	const existing = await db.players.toArray();
	const takenNums = new Set(existing.map((p) => p.num));
	const toAdd: RosterEntry[] = [];
	for (const player of incoming) {
		if (takenNums.has(player.num)) {
			continue;
		}
		takenNums.add(player.num);
		toAdd.push(player);
	}
	await db.players.bulkAdd(toAdd);
	return { added: toAdd.length, skipped: incoming.length - toAdd.length };
}

export async function updatePlayer(
	id: number,
	patch: Partial<Pick<Player, "name" | "num">>
): Promise<void> {
	await db.players.update(id, patch);
}

export async function removePlayer(id: number): Promise<void> {
	// каскад: без него оценки-сироты искажали бы 7-day avg,
	// а мёртвые id в rosterIds — знаменатель done/total
	await db.transaction(
		"rw",
		db.players,
		db.rpeEntries,
		db.sessions,
		async () => {
			await db.rpeEntries.where("playerId").equals(id).delete();
			await db.sessions.toCollection().modify((s) => {
				s.rosterIds = s.rosterIds.filter((rosterId) => rosterId !== id);
			});
			await db.players.delete(id);
		}
	);
}
