import { useLiveQuery } from "dexie-react-hooks";
import {
	type Category,
	db,
	type RpeEntry,
	type Session,
} from "@/shared/db/dexie";

export const useSessions = (): Session[] | undefined =>
	useLiveQuery(() => db.sessions.orderBy("date").reverse().toArray());

export const useAllEntries = (): RpeEntry[] | undefined =>
	useLiveQuery(() => db.rpeEntries.toArray());

export const useCategories = (): Category[] | undefined =>
	useLiveQuery(() => db.categories.toArray());
