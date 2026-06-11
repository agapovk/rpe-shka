import type { Player, RpeEntry, Session } from "@/shared/db/dexie";
import { fmtDate } from "@/shared/lib/date";

export interface SessionSummary {
	avg: number;
	dist: number[];
	done: number;
	total: number;
}

export interface HomeStats {
	sessionsLast30d: number;
	sevenDayAvg: number;
	topLoaded: string;
}

export const DIST_BUCKETS = 5;
const DAY_MS = 86_400_000;
const SESSIONS_WINDOW_DAYS = 30;
const AVG_WINDOW_DAYS = 7;
const RPE_LIGHT_MAX = 3;
const RPE_MODERATE_MAX = 6;
const RPE_HARD_MAX = 8;

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

const avgOf = (values: number[]): number =>
	values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

const distBucket = (score: number): number =>
	Math.min(Math.floor((score - 1) / 2), DIST_BUCKETS - 1);

export function suggestSessionName(): string {
	return fmtDate(new Date().toISOString());
}

export function calcSessionSummary(
	session: Session,
	entries: RpeEntry[]
): SessionSummary {
	const roster = new Set(session.rosterIds);
	const scores = entries
		.filter((e) => e.sessionId === session.id && roster.has(e.playerId))
		.map((e) => e.score);

	const dist = new Array<number>(DIST_BUCKETS).fill(0);
	for (const score of scores) {
		dist[distBucket(score)] += 1;
	}

	return {
		done: scores.length,
		total: session.rosterIds.length,
		avg: avgOf(scores),
		dist,
	};
}

function findTopLoaded(entries: RpeEntry[], players: Player[]): string {
	const totals = new Map<number, { count: number; sum: number }>();
	for (const entry of entries) {
		const prev = totals.get(entry.playerId) ?? { count: 0, sum: 0 };
		totals.set(entry.playerId, {
			count: prev.count + 1,
			sum: prev.sum + entry.score,
		});
	}

	let topLoaded = "—";
	let topAvg = 0;
	for (const [playerId, { count, sum }] of totals) {
		const avg = sum / count;
		const player = players.find((p) => p.id === playerId);
		if (avg > topAvg && player) {
			topAvg = avg;
			const [last = "", first = ""] = player.name.split(" ");
			const lastTitle = last.charAt(0) + last.slice(1).toLowerCase();
			topLoaded = first ? `${lastTitle} ${first.charAt(0)}.` : lastTitle;
		}
	}
	return topLoaded;
}

export function calcHomeStats(
	sessions: Session[],
	entries: RpeEntry[],
	players: Player[],
	now: number = Date.now()
): HomeStats {
	const within = (session: Session, days: number): boolean =>
		now - new Date(session.date).getTime() < days * DAY_MS;

	const recentIds = new Set(
		sessions.filter((s) => within(s, AVG_WINDOW_DAYS)).map((s) => s.id)
	);
	const recentEntries = entries.filter((e) => recentIds.has(e.sessionId));

	return {
		sessionsLast30d: sessions.filter((s) => within(s, SESSIONS_WINDOW_DAYS))
			.length,
		sevenDayAvg: avgOf(recentEntries.map((e) => e.score)),
		topLoaded: findTopLoaded(recentEntries, players),
	};
}
