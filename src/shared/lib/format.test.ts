import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDuration,
  formatRpe,
  formatSessionsDateRange,
  formatSrpe,
} from "./format";

const LOCALE_THOUSAND_1234 = /1[,. ]?234/;

describe("formatDuration", () => {
  it("formats minutes under an hour", () => {
    expect(formatDuration(0)).toBe("0min");
    expect(formatDuration(45)).toBe("45min");
  });

  it("formats exact hours without minutes", () => {
    expect(formatDuration(60)).toBe("1h");
    expect(formatDuration(120)).toBe("2h");
  });

  it("formats hours with leftover minutes", () => {
    expect(formatDuration(90)).toBe("1h 30min");
    expect(formatDuration(125)).toBe("2h 5min");
  });
});

describe("formatRpe", () => {
  it("renders a single decimal", () => {
    expect(formatRpe(7)).toBe("7.0");
    expect(formatRpe(7.456)).toBe("7.5");
  });
});

describe("formatSrpe", () => {
  it("uses locale grouping", () => {
    const out = formatSrpe(1234);
    expect(out).toMatch(LOCALE_THOUSAND_1234);
  });
});

describe("formatDate", () => {
  it("formats day and short month in en-GB", () => {
    expect(formatDate(new Date("2026-05-07T12:00:00Z"))).toBe("07 May");
  });
});

describe("formatSessionsDateRange", () => {
  it("returns null for an empty list", () => {
    expect(formatSessionsDateRange([])).toBeNull();
  });

  it("returns a single date for one session", () => {
    expect(
      formatSessionsDateRange([{ date: new Date("2026-05-07T12:00:00Z") }])
    ).toBe("07 May");
  });

  it("returns first–last range for multiple sessions", () => {
    expect(
      formatSessionsDateRange([
        { date: new Date("2026-05-01T12:00:00Z") },
        { date: new Date("2026-05-04T12:00:00Z") },
        { date: new Date("2026-05-07T12:00:00Z") },
      ])
    ).toBe("01 May – 07 May");
  });
});
