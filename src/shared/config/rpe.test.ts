import { describe, expect, it } from "vitest";
import { getRpeRange } from "./rpe";

describe("getRpeRange", () => {
  it("returns 'low' for RPE 1–3", () => {
    expect(getRpeRange(1)).toBe("low");
    expect(getRpeRange(2)).toBe("low");
    expect(getRpeRange(3)).toBe("low");
  });

  it("returns 'medium' for RPE 4–6", () => {
    expect(getRpeRange(4)).toBe("medium");
    expect(getRpeRange(5)).toBe("medium");
    expect(getRpeRange(6)).toBe("medium");
  });

  it("returns 'high' for RPE 7–8", () => {
    expect(getRpeRange(7)).toBe("high");
    expect(getRpeRange(8)).toBe("high");
  });

  it("returns 'max' for RPE 9–10", () => {
    expect(getRpeRange(9)).toBe("max");
    expect(getRpeRange(10)).toBe("max");
  });
});
