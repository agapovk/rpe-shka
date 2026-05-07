import { describe, expect, it } from "vitest";
import type { PlayerReportRow } from "../report";
import { buildSheetData } from "./xlsx";

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

describe("buildSheetData", () => {
  it("starts with the header row", () => {
    expect(buildSheetData([])[0]).toEqual([
      "Player",
      "Sessions",
      "Duration (min)",
      "Avg RPE",
      "Total sRPE",
    ]);
  });

  it("uses empty strings for avg/total when sessions is 0", () => {
    const data = buildSheetData([row({ name: "Alice" })]);
    expect(data[1]).toEqual(["Alice", 0, 0, "", ""]);
  });

  it("rounds avg rpe to 1 decimal as a number when sessions > 0", () => {
    const data = buildSheetData([
      row({ avgRpe: 7.456, sessions: 3, totalDuration: 270, totalSrpe: 1860 }),
    ]);
    expect(data[1]).toEqual(["Alice", 3, 270, 7.5, 1860]);
    expect(typeof data[1][3]).toBe("number");
  });
});
