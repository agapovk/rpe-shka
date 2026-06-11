import type { Player, RpeEntry } from "@/shared/db/dexie";

export interface SessionStats {
	avg: number;
	hard: number;
	hi: number;
	lo: number;
}

export interface RecordedPlayer {
	id: number;
	name: string;
	note?: string;
	num: number;
	score: number;
}

export type RpeBucket = "LIGHT" | "MODERATE" | "HARD" | "MAXIMAL";

export const RPE_SEGMENTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const RPE_LIGHT_MAX = 3;
const RPE_MODERATE_MAX = 6;
const RPE_HARD_MAX = 8;
export const HARD_THRESHOLD = 8;
const FLAG_HIGH = 9;
const FLAG_LOW = 2;

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

// флажок «обратить внимание»: экстремально высокая или подозрительно низкая оценка
export const isFlagged = (score: number): boolean =>
	score >= FLAG_HIGH || score <= FLAG_LOW;

export function calcSessionStats(recorded: RecordedPlayer[]): SessionStats {
	if (recorded.length === 0) {
		return { avg: 0, hi: 0, lo: 0, hard: 0 };
	}
	const scores = recorded.map((p) => p.score);
	return {
		avg: scores.reduce((a, b) => a + b, 0) / scores.length,
		hi: Math.max(...scores),
		lo: Math.min(...scores),
		hard: recorded.filter((p) => p.score >= HARD_THRESHOLD).length,
	};
}

export function joinRecorded(
	players: Player[],
	entries: RpeEntry[]
): RecordedPlayer[] {
	const byPlayer = new Map(entries.map((e) => [e.playerId, e]));
	return players.flatMap((p) => {
		const entry = byPlayer.get(p.id);
		if (!entry) {
			return [];
		}
		return [
			{
				id: p.id,
				name: p.name,
				num: p.num,
				score: entry.score,
				note: entry.note,
			},
		];
	});
}
