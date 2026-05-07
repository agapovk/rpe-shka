import { describe, expect, it } from "vitest";
import type { PlayerReportRow } from "../report";
import { buildCsv } from "./csv";

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

describe("buildCsv", () => {
  it("starts with the standard header", () => {
    const csv = buildCsv([]);
    expect(csv).toBe("Player,Sessions,Duration (min),Avg RPE,Total sRPE");
  });

  it("renders empty avg/total cells when sessions is 0", () => {
    const csv = buildCsv([row({ name: "Alice" })]);
    const lines = csv.split("\n");
    expect(lines[1]).toBe('"Alice",0,0,,');
  });

  it("formats avg rpe to one decimal and outputs total srpe when sessions > 0", () => {
    const csv = buildCsv([
      row({ avgRpe: 7.456, sessions: 3, totalDuration: 270, totalSrpe: 1860 }),
    ]);
    expect(csv.split("\n")[1]).toBe('"Alice",3,270,7.5,1860');
  });

  it("wraps player name in quotes (preserves spaces and commas)", () => {
    const csv = buildCsv([row({ name: "Doe, John" })]);
    expect(csv.split("\n")[1]).toContain('"Doe, John"');
  });
});
