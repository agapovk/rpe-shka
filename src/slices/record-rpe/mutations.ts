import { db, rpeEntryId } from "@/shared/db/dexie";
import { isValidScore, normalizeNote } from "./model";

export async function setScore(
	sessionId: string,
	playerId: number,
	score: number,
	note: string
): Promise<void> {
	if (!isValidScore(score)) {
		return;
	}
	await db.rpeEntries.put({
		id: rpeEntryId(sessionId, playerId),
		sessionId,
		playerId,
		score,
		note: normalizeNote(note),
	});
}

export async function clearScore(
	sessionId: string,
	playerId: number
): Promise<void> {
	await db.rpeEntries.delete(rpeEntryId(sessionId, playerId));
}

export async function updateSessionName(
	sessionId: string,
	name: string
): Promise<void> {
	const trimmed = name.trim();
	if (!trimmed) {
		return;
	}
	await db.sessions.update(sessionId, { name: trimmed });
}

export async function setSessionCategory(
	sessionId: string,
	categoryId: string | undefined
): Promise<void> {
	await db.sessions.update(sessionId, { categoryId });
}

export async function toggleSessionPlayer(
	sessionId: string,
	playerId: number
): Promise<void> {
	const session = await db.sessions.get(sessionId);
	if (!session) {
		return;
	}
	const rosterIds = session.rosterIds.includes(playerId)
		? session.rosterIds.filter((id) => id !== playerId)
		: [...session.rosterIds, playerId];
	await db.sessions.update(sessionId, { rosterIds });
}

export async function setSessionRoster(
	sessionId: string,
	rosterIds: number[]
): Promise<void> {
	await db.sessions.update(sessionId, { rosterIds });
}
