export const RPE_SCALE = [
  { value: 1, label: "1 — Rest" },
  { value: 2, label: "2 — Very Easy" },
  { value: 3, label: "3 — Easy" },
  { value: 4, label: "4 — Moderate" },
  { value: 5, label: "5 — Somewhat Hard" },
  { value: 6, label: "6 — Hard" },
  { value: 7, label: "7 — Very Hard" },
  { value: 8, label: "8 — Very Hard+" },
  { value: 9, label: "9 — Near Max" },
  { value: 10, label: "10 — Maximal" },
] as const;

export type RpeValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export function getRpeRange(rpe: number): "low" | "medium" | "high" | "max" {
  if (rpe <= 3) {
    return "low";
  }
  if (rpe <= 6) {
    return "medium";
  }
  if (rpe <= 8) {
    return "high";
  }
  return "max";
}
