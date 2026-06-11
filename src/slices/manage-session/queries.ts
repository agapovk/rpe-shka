import { useLiveQuery } from "dexie-react-hooks";
import {
	db,
	type Player,
	type RpeEntry,
	type Session,
} from "@/shared/db/dexie";

export const useSessions = (): Session[] | undefined =>
	useLiveQuery(() => db.sessions.orderBy("date").reverse().toArray());

export const useAllEntries = (): RpeEntry[] | undefined =>
	useLiveQuery(() => db.rpeEntries.toArray());

export const useRosterPlayers = (): Player[] | undefined =>
	useLiveQuery(() => db.players.toArray());
