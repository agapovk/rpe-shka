import { db } from "@shared/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useMicrocycles = (teamId: number) =>
  useLiveQuery(
    () => db.microcycles.where("teamId").equals(teamId).sortBy("createdAt"),
    [teamId]
  );

export const useMicrocycle = (id: number) =>
  useLiveQuery(() => db.microcycles.get(id), [id]);
