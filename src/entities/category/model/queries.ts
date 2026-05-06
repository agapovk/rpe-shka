import { db } from "@shared/db";
import { useLiveQuery } from "dexie-react-hooks";

export const useCategories = () =>
  useLiveQuery(() => db.categories.orderBy("order").toArray(), []);

export const useCategory = (id: number) =>
  useLiveQuery(() => db.categories.get(id), [id]);
