import { db } from "@shared/db";
import { useLiveQuery } from "dexie-react-hooks";

export const usePlayers = (teamId: number) =>
  useLiveQuery(
    () => db.players.where("teamId").equals(teamId).sortBy("name"),
    [teamId]
  );

export const usePlayer = (id: number) =>
  useLiveQuery(() => db.players.get(id), [id]);
