import { useLiveQuery } from "dexie-react-hooks";
import {
	db,
	type Player,
	type RpeEntry,
	type Session,
} from "@/shared/db/dexie";

interface SessionWithEntries {
	entries: RpeEntry[];
	players: Player[];
	session: Session | undefined;
}

export const useSessionWithEntries = (
	sessionId: string
): SessionWithEntries | undefined =>
	useLiveQuery(async () => {
		const [session, entries, players] = await Promise.all([
			db.sessions.get(sessionId),
			db.rpeEntries.where("sessionId").equals(sessionId).toArray(),
			db.players.toArray(),
		]);
		const roster = new Set(session?.rosterIds ?? []);
		return {
			session,
			entries: entries.filter((e) => roster.has(e.playerId)),
			players: players.filter((p) => roster.has(p.id)),
		};
	}, [sessionId]);
