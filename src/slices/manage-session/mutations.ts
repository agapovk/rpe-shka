import { db } from "@/shared/db/dexie";
import { suggestSessionName } from "./model";

export async function createSession(): Promise<string> {
	const players = await db.players.toArray();
	const id = crypto.randomUUID();
	await db.sessions.add({
		id,
		name: suggestSessionName(),
		date: new Date().toISOString(),
		rosterIds: players.map((p) => p.id),
	});
	return id;
}

export async function deleteSession(id: string): Promise<void> {
	await db.transaction("rw", db.sessions, db.rpeEntries, async () => {
		await db.rpeEntries.where("sessionId").equals(id).delete();
		await db.sessions.delete(id);
	});
}

export async function duplicateSession(id: string): Promise<string | null> {
	const source = await db.sessions.get(id);
	if (!source) {
		return null;
	}
	const newId = crypto.randomUUID();
	await db.sessions.add({
		...source,
		id: newId,
		name: suggestSessionName(),
		date: new Date().toISOString(),
	});
	return newId;
}
