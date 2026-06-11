import { db } from "@/shared/db/dexie";

export async function addCategory(name: string): Promise<void> {
	await db.categories.add({ id: crypto.randomUUID(), name });
}

export async function updateCategory(id: string, name: string): Promise<void> {
	await db.categories.update(id, { name });
}

export async function removeCategory(id: string): Promise<void> {
	await db.categories.delete(id);
}
