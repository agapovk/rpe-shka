import { describe, expect, it } from "vitest";
import type { RpeEntry, Session } from "@/shared/db/dexie";
import { calcHomeStats, calcSessionSummary, DIST_BUCKETS } from "./model";

const makeSession = (id: string, rosterIds: number[], daysAgo = 0): Session => {
	const date = new Date(Date.now() - daysAgo * 86_400_000);
	return { id, name: id, date: date.toISOString(), rosterIds };
};

const entry = (
	sessionId: string,
	playerId: number,
	score: number
): RpeEntry => ({
	id: `${sessionId}-${playerId}`,
	sessionId,
	playerId,
	score,
});

describe("calcSessionSummary", () => {
	it("returns zeros for no matching entries", () => {
		const session = makeSession("s1", [1, 2, 3]);
		const result = calcSessionSummary(session, []);
		expect(result).toEqual({
			done: 0,
			total: 3,
			avg: 0,
			dist: new Array(DIST_BUCKETS).fill(0),
		});
	});

	it("counts done/total correctly", () => {
		const session = makeSession("s1", [1, 2, 3]);
		const entries = [entry("s1", 1, 5), entry("s1", 2, 7)];
		const result = calcSessionSummary(session, entries);
		expect(result.done).toBe(2);
		expect(result.total).toBe(3);
	});

	it("ignores entries not in rosterIds", () => {
		const session = makeSession("s1", [1, 2]);
		const entries = [entry("s1", 1, 5), entry("s1", 99, 8)];
		expect(calcSessionSummary(session, entries).done).toBe(1);
	});

	it("ignores entries from other sessions", () => {
		const session = makeSession("s1", [1]);
		const entries = [entry("s2", 1, 5)];
		expect(calcSessionSummary(session, entries).done).toBe(0);
	});

	it("calculates avg correctly", () => {
		const session = makeSession("s1", [1, 2]);
		const entries = [entry("s1", 1, 4), entry("s1", 2, 8)];
		expect(calcSessionSummary(session, entries).avg).toBe(6);
	});

	it("distributes scores into correct buckets", () => {
		const session = makeSession("s1", [1, 2, 3, 4, 5]);
		const entries = [
			entry("s1", 1, 1), // bucket 0: 1-2
			entry("s1", 2, 3), // bucket 1: 3-4
			entry("s1", 3, 6), // bucket 2: 5-6
			entry("s1", 4, 7), // bucket 3: 7-8
			entry("s1", 5, 10), // bucket 4: 9-10
		];
		expect(calcSessionSummary(session, entries).dist).toEqual([1, 1, 1, 1, 1]);
	});
});

describe("calcHomeStats", () => {
	const NOW = new Date("2026-01-15T12:00:00Z").getTime();

	it("returns zeros with no sessions", () => {
		expect(calcHomeStats([], [], NOW)).toEqual({
			sessionsLast30d: 0,
			sevenDayAvg: 0,
		});
	});

	it("counts sessions within 30 days", () => {
		const sessions = [
			makeSession("s1", [], 5),
			makeSession("s2", [], 29),
			makeSession("s3", [], 31),
		];
		// create sessions relative to NOW
		const s1 = {
			...sessions[0],
			date: new Date(NOW - 5 * 86_400_000).toISOString(),
		};
		const s2 = {
			...sessions[1],
			date: new Date(NOW - 29 * 86_400_000).toISOString(),
		};
		const s3 = {
			...sessions[2],
			date: new Date(NOW - 31 * 86_400_000).toISOString(),
		};
		const result = calcHomeStats([s1, s2, s3], [], NOW);
		expect(result.sessionsLast30d).toBe(2);
	});

	it("averages only entries from last 7 days", () => {
		const s1 = {
			id: "s1",
			name: "s1",
			date: new Date(NOW - 3 * 86_400_000).toISOString(),
			rosterIds: [1],
		};
		const s2 = {
			id: "s2",
			name: "s2",
			date: new Date(NOW - 10 * 86_400_000).toISOString(),
			rosterIds: [1],
		};
		const entries = [entry("s1", 1, 8), entry("s2", 1, 2)];
		const result = calcHomeStats([s1, s2], entries, NOW);
		expect(result.sevenDayAvg).toBe(8);
	});
});
