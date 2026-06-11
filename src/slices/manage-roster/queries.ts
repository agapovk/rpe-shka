import { useLiveQuery } from "dexie-react-hooks";
import { byPlayerName, db, type Player } from "@/shared/db/dexie";

export const usePlayers = (): Player[] | undefined =>
	useLiveQuery(async () => (await db.players.toArray()).sort(byPlayerName));
