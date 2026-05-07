import { describe, expect, it } from "vitest";
import type { PlayerReportRow } from "../report";
import { buildPdfRows } from "./pdf";

function row(overrides: Partial<PlayerReportRow> = {}): PlayerReportRow {
  return {
    avgRpe: 0,
    name: "Alice",
    playerId: 1,
    sessions: 0,
    totalDuration: 0,
    totalSrpe: 0,
    ...overrides,
  };
}

describe("buildPdfRows", () => {
  it("renders em-dash placeholders when player has no sessions", () => {
    const rows = buildPdfRows([row({ name: "Alice" })]);
    expect(rows[0]).toEqual(["Alice", "—", "—", "—", "—"]);
  });

  it("formats duration via formatDuration and avg rpe to 1 decimal", () => {
    const rows = buildPdfRows([
      row({ avgRpe: 7.456, sessions: 3, totalDuration: 90, totalSrpe: 1860 }),
    ]);
    expect(rows[0]).toEqual(["Alice", "3", "1h 30min", "7.5", "1860"]);
  });

  it("preserves order across multiple players", () => {
    const rows = buildPdfRows([
      row({
        name: "Alice",
        sessions: 1,
        totalDuration: 60,
        avgRpe: 5,
        totalSrpe: 300,
      }),
      row({ name: "Bob" }),
    ]);
    expect(rows.map((r) => r[0])).toEqual(["Alice", "Bob"]);
  });
});
