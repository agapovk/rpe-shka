import { db } from "@shared/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useMicrocycles = (teamId: number) =>
  useLiveQuery(
    () => db.microcycles.where("teamId").equals(teamId).sortBy("createdAt"),
    [teamId]
  );

export const useMicrocycle = (id: number) =>
  useLiveQuery(() => db.microcycles.get(id), [id]);

export const useMicrocycleReportData = (microcycleId: number, teamId: number) =>
  useLiveQuery(async () => {
    const sessions = await db.sessions
      .where("microcycleId")
      .equals(microcycleId)
      .sortBy("date");
    const sessionIds = sessions.map((s) => s.id!);
    const entries =
      sessionIds.length > 0
        ? await db.sessionEntries.where("sessionId").anyOf(sessionIds).toArray()
        : [];
    const players = await db.players
      .where("teamId")
      .equals(teamId)
      .sortBy("name");
    return { entries, players, sessions };
  }, [microcycleId, teamId]);
