import { useLiveQuery } from "dexie-react-hooks";
import { type Category, db } from "@/shared/db/dexie";

export const useCategories = (): Category[] | undefined =>
	useLiveQuery(() => db.categories.toArray());
