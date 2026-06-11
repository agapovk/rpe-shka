import { useLiveQuery } from "dexie-react-hooks";
import {
	type Category,
	db,
	type Player,
	type RpeEntry,
	type Session,
} from "@/shared/db/dexie";

export const useSession = (sessionId: string): Session | undefined =>
	useLiveQuery(() => db.sessions.get(sessionId), [sessionId]);

export const useSessionEntries = (sessionId: string): RpeEntry[] | undefined =>
	useLiveQuery(
		() => db.rpeEntries.where("sessionId").equals(sessionId).toArray(),
		[sessionId]
	);

export const useAllPlayers = (): Player[] | undefined =>
	useLiveQuery(() => db.players.orderBy("num").toArray());

export const useCategories = (): Category[] | undefined =>
	useLiveQuery(() => db.categories.toArray());
