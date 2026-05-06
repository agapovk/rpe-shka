import { db } from "@shared/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useTeams = () =>
  useLiveQuery(() => db.teams.orderBy("name").toArray(), []);

export const useTeam = (id: number) =>
  useLiveQuery(() => db.teams.get(id), [id]);
