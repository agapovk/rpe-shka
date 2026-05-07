import type { Player, Session, SessionEntry } from "@shared/db";
import { describe, expect, it } from "vitest";
import { aggregateReport } from "./report";

function player(id: number, name: string, number?: number): Player {
  return { id, name, number, teamId: 1 };
}

function session(id: number, duration: number): Session {
  return {
    id,
    microcycleId: 1,
    categoryId: 1,
    date: new Date("2026-05-01T12:00:00Z"),
    duration,
  };
}

function entry(playerId: number, sessionId: number, rpe: number): SessionEntry {
  return { playerId, sessionId, rpe };
}

describe("aggregateReport", () => {
  it("returns an empty array when there are no players", () => {
    expect(aggregateReport([], [], [])).toEqual([]);
  });

  it("returns zeroed row for a player without entries", () => {
    const row = aggregateReport(
      [player(1, "Alice", 7)],
      [session(1, 60)],
      []
    )[0];
    expect(row).toEqual({
      avgRpe: 0,
      name: "Alice",
      number: 7,
      playerId: 1,
      sessions: 0,
      totalDuration: 0,
      totalSrpe: 0,
    });
  });

  it("aggregates a single player and a single session", () => {
    const rows = aggregateReport(
      [player(1, "Alice")],
      [session(10, 90)],
      [entry(1, 10, 7)]
    );
    expect(rows[0]).toMatchObject({
      avgRpe: 7,
      sessions: 1,
      totalDuration: 90,
      totalSrpe: 630,
    });
  });

  it("sums duration across attended sessions only", () => {
    const sessions = [session(1, 60), session(2, 90), session(3, 120)];
    const entries = [entry(1, 1, 5), entry(1, 3, 8)];
    const rows = aggregateReport([player(1, "Alice")], sessions, entries);
    expect(rows[0].sessions).toBe(2);
    expect(rows[0].totalDuration).toBe(180);
    expect(rows[0].totalSrpe).toBe(5 * 60 + 8 * 120);
    expect(rows[0].avgRpe).toBe(6.5);
  });

  it("ignores entries that point to a missing session in totalSrpe but still counts the entry", () => {
    const rows = aggregateReport(
      [player(1, "Alice")],
      [session(1, 60)],
      [entry(1, 1, 6), entry(1, 999, 8)]
    );
    expect(rows[0].sessions).toBe(2);
    expect(rows[0].totalDuration).toBe(60);
    expect(rows[0].totalSrpe).toBe(6 * 60);
    expect(rows[0].avgRpe).toBe(7);
  });

  it("computes per-player rows independently", () => {
    const rows = aggregateReport(
      [player(1, "Alice"), player(2, "Bob")],
      [session(1, 60)],
      [entry(1, 1, 7), entry(2, 1, 4)]
    );
    expect(rows[0].totalSrpe).toBe(420);
    expect(rows[1].totalSrpe).toBe(240);
  });
});
