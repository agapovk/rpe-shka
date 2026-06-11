export const RPE_MIN = 1;
export const RPE_MAX = 10;
export const RPE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export const NOTE_MAX_LENGTH = 120;

const RPE_LIGHT_MAX = 3;
const RPE_MODERATE_MAX = 6;
const RPE_HARD_MAX = 8;

export type ScoreFilter = "all" | "done" | "pending";

export const isValidScore = (n: number): boolean =>
	Number.isInteger(n) && n >= RPE_MIN && n <= RPE_MAX;

export const normalizeNote = (note: string): string | undefined => {
	const trimmed = note.trim().slice(0, NOTE_MAX_LENGTH);
	return trimmed === "" ? undefined : trimmed;
};

export const rpeTextClass = (score: number): string => {
	if (score <= RPE_LIGHT_MAX) {
		return "text-rpe-light";
	}
	if (score <= RPE_MODERATE_MAX) {
		return "text-rpe-moderate";
	}
	if (score <= RPE_HARD_MAX) {
		return "text-rpe-hard";
	}
	return "text-rpe-maximal";
};

export const rpeBgClass = (score: number): string => {
	if (score <= RPE_LIGHT_MAX) {
		return "bg-rpe-light";
	}
	if (score <= RPE_MODERATE_MAX) {
		return "bg-rpe-moderate";
	}
	if (score <= RPE_HARD_MAX) {
		return "bg-rpe-hard";
	}
	return "bg-rpe-maximal";
};
