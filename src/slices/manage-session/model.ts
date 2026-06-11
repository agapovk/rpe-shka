import type { RpeEntry, Session } from "@/shared/db/dexie";
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
}

export const DIST_BUCKETS = 5;
const DAY_MS = 86_400_000;
const SESSIONS_WINDOW_DAYS = 30;
const AVG_WINDOW_DAYS = 7;

const avgOf = (values: number[]): number =>
	values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

const distBucket = (score: number): number =>
	Math.min(Math.floor((score - 1) / 2), DIST_BUCKETS - 1);

// время в имени различает две сессии одного дня (утро/вечер, дубликат)
export function suggestSessionName(now: Date = new Date()): string {
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	return `${fmtDate(now.toISOString())} · ${hours}:${minutes}`;
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

export function calcHomeStats(
	sessions: Session[],
	entries: RpeEntry[],
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
	};
}
