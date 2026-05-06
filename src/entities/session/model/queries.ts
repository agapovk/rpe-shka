import { db } from "@shared/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useSessions = (microcycleId: number) =>
  useLiveQuery(
    () => db.sessions.where("microcycleId").equals(microcycleId).sortBy("date"),
    [microcycleId]
  );

export const useSession = (id: number) =>
  useLiveQuery(() => db.sessions.get(id), [id]);
