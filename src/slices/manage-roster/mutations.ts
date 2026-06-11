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
	await db.players.delete(id);
}
