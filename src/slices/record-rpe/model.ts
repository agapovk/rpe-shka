import { RPE_MAX, RPE_MIN } from "@/shared/lib/rpe";

export const NOTE_MAX_LENGTH = 120;

export type ScoreFilter = "all" | "done" | "pending";

export const isValidScore = (n: number): boolean =>
	Number.isInteger(n) && n >= RPE_MIN && n <= RPE_MAX;

export const normalizeNote = (note: string): string | undefined => {
	const trimmed = note.trim().slice(0, NOTE_MAX_LENGTH);
	return trimmed === "" ? undefined : trimmed;
};
