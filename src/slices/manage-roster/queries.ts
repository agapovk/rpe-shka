import { useLiveQuery } from "dexie-react-hooks";
import { db, type Player } from "@/shared/db/dexie";

export const usePlayers = (): Player[] | undefined =>
	useLiveQuery(() => db.players.orderBy("num").toArray());
