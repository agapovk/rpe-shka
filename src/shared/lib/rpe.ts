export type RpeBucket = "LIGHT" | "MODERATE" | "HARD" | "MAXIMAL";

export const RPE_MIN = 1;
export const RPE_MAX = 10;
export const RPE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const RPE_LIGHT_MAX = 3;
const RPE_MODERATE_MAX = 6;
const RPE_HARD_MAX = 8;

export const rpeBucket = (score: number): RpeBucket => {
	if (score <= RPE_LIGHT_MAX) {
		return "LIGHT";
	}
	if (score <= RPE_MODERATE_MAX) {
		return "MODERATE";
	}
	if (score <= RPE_HARD_MAX) {
		return "HARD";
	}
	return "MAXIMAL";
};

const BUCKET_TEXT_CLASS: Record<RpeBucket, string> = {
	LIGHT: "text-rpe-light",
	MODERATE: "text-rpe-moderate",
	HARD: "text-rpe-hard",
	MAXIMAL: "text-rpe-maximal",
};

const BUCKET_BG_CLASS: Record<RpeBucket, string> = {
	LIGHT: "bg-rpe-light",
	MODERATE: "bg-rpe-moderate",
	HARD: "bg-rpe-hard",
	MAXIMAL: "bg-rpe-maximal",
};

export const rpeTextClass = (score: number): string =>
	BUCKET_TEXT_CLASS[rpeBucket(score)];

export const rpeBgClass = (score: number): string =>
	BUCKET_BG_CLASS[rpeBucket(score)];
