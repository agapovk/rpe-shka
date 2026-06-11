import { describe, expect, it } from "vitest";
import type { RecordedPlayer } from "./model";
import { calcSessionStats, joinRecorded } from "./model";

const player = (id: number, score: number): RecordedPlayer => ({
	id,
	name: `Player ${id}`,
	num: id,
	score,
});

describe("calcSessionStats", () => {
	it("returns zeros for empty list", () => {
		expect(calcSessionStats([])).toEqual({ avg: 0, hi: 0, lo: 0, hard: 0 });
	});

	it("handles single player", () => {
		expect(calcSessionStats([player(1, 5)])).toEqual({
			avg: 5,
			hi: 5,
			lo: 5,
			hard: 0,
		});
	});

	it("calculates avg, hi, lo correctly", () => {
		const stats = calcSessionStats([player(1, 4), player(2, 6), player(3, 8)]);
		expect(stats.avg).toBeCloseTo(6);
		expect(stats.hi).toBe(8);
		expect(stats.lo).toBe(4);
	});

	it("counts hard as score >= 8", () => {
		const stats = calcSessionStats([
			player(1, 7),
			player(2, 8),
			player(3, 9),
			player(4, 10),
		]);
		expect(stats.hard).toBe(3);
	});

	it("hard is 0 when no score >= 8", () => {
		expect(calcSessionStats([player(1, 5), player(2, 7)]).hard).toBe(0);
	});
});

describe("joinRecorded", () => {
	it("joins players with their entries", () => {
		const players = [
			{ id: 1, name: "A", num: 10 },
			{ id: 2, name: "B", num: 7 },
		];
		const entries = [
			{ id: "s-1", sessionId: "s", playerId: 1, score: 6 },
			{ id: "s-2", sessionId: "s", playerId: 2, score: 9, note: "tired" },
		];
		const result = joinRecorded(players, entries);
		expect(result).toHaveLength(2);
		expect(result[0]).toMatchObject({ id: 1, score: 6 });
		expect(result[1]).toMatchObject({ id: 2, score: 9, note: "tired" });
	});

	it("skips players without an entry", () => {
		const players = [
			{ id: 1, name: "A", num: 1 },
			{ id: 2, name: "B", num: 2 },
		];
		const entries = [{ id: "s-1", sessionId: "s", playerId: 1, score: 5 }];
		expect(joinRecorded(players, entries)).toHaveLength(1);
	});
});
