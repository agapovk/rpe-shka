import { describe, expect, it } from "vitest";
import { calculateSrpe } from "./srpe";

describe("calculateSrpe", () => {
  it("multiplies rpe by duration", () => {
    expect(calculateSrpe(7, 90)).toBe(630);
  });

  it("returns 0 when rpe is 0", () => {
    expect(calculateSrpe(0, 120)).toBe(0);
  });

  it("returns 0 when duration is 0", () => {
    expect(calculateSrpe(8, 0)).toBe(0);
  });

  it("handles maximum scale", () => {
    expect(calculateSrpe(10, 120)).toBe(1200);
  });
});
