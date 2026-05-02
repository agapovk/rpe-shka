import type { Category, Player } from "./survey.types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "md-4", name: "MD-4" },
  { id: "md-3", name: "MD-3" },
  { id: "md-2", name: "MD-2" },
  { id: "md-1", name: "MD-1" },
  { id: "md", name: "MD" },
  { id: "md+1", name: "MD+1" },
];

export const ROSTER: Player[] = [
  { id: 1, name: "AKBASHEV ROMAN", num: 13 },
  { id: 2, name: "AYUPOV TIMUR", num: 5 },
  { id: 4, name: "BARDACHEV MATVEY", num: 4 },
  { id: 5, name: "BEGIC SILVIJE", num: 2 },
  { id: 6, name: "BOGOMOLSKIY EGOR", num: 19 },
  { id: 7, name: "BONDAREV VITALIY", num: 37 },
  { id: 8, name: "CORDEIRO LEO", num: 22 },
  { id: 9, name: "FILIPENKO EGOR", num: 24 },
  { id: 11, name: "ISHKOV ILYA", num: 97 },
  { id: 12, name: "ITALO FERNANDO", num: 16 },
  { id: 13, name: "IVANISENYA DMITRIY", num: 21 },
  { id: 14, name: "KARAPUZOV VLADISLAV", num: 11 },
  { id: 15, name: "KHARIN EVGENIY", num: 59 },
  { id: 16, name: "MALKEVICH VLADISLAV", num: 44 },
  { id: 17, name: "MAMIN ARTEM", num: 46 },
  { id: 18, name: "MARGASOV TIMOFEY", num: 34 },
  { id: 19, name: "MARKOV EVGENIY", num: 20 },
  { id: 20, name: "MOROZOV NIKITA", num: 18 },
  { id: 21, name: "MOSIN EGOR", num: 9 },
  { id: 22, name: "SEKULIC MARTIN", num: 10 },
  { id: 23, name: "SUNGATULIN FANIL", num: 6 },
  { id: 24, name: "ZHELEZNOV YURIY", num: 14 },
];

export function rpeColor(n: number): string {
  const clamped = Math.max(1, Math.min(10, Math.round(n)));
  return `var(--rpe-${clamped})`;
}

export function rpeBucket(n: number): string {
  if (n <= 3) {
    return "LIGHT";
  }
  if (n <= 6) {
    return "MODERATE";
  }
  if (n <= 8) {
    return "HARD";
  }
  return "MAXIMAL";
}

export type RecordedPlayer = Player & { rpe: number; note: string | undefined };

export interface SessionStats {
  avg: number;
  hard: number;
  hi: number;
  lo: number;
}

export function calcSessionStats(recorded: RecordedPlayer[]): SessionStats {
  if (recorded.length === 0) {
    return { avg: 0, hard: 0, hi: 0, lo: 0 };
  }
  const vals = recorded.map((p) => p.rpe);
  return {
    avg: vals.reduce((a, b) => a + b, 0) / vals.length,
    hard: recorded.filter((p) => p.rpe >= 8).length,
    hi: Math.max(...vals),
    lo: Math.min(...vals),
  };
}
