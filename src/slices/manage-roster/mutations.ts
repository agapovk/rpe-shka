import { db, type Player } from "@/shared/db/dexie";

export async function addPlayer(name: string, num: number): Promise<void> {
	await db.players.add({ name, num });
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
