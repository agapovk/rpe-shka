import type { Session } from "@/features/survey/survey.types";
import { ROSTER } from "@/features/survey/survey.utils";

export function fmtDate(d: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function suggestSessionName(): string {
  return `${fmtDate(new Date())}`;
}

// ─── Home page types ──────────────────────────────────────────────────────────

export interface SessionSummary {
  avg: number;
  date: string;
  dist: number[];
  done: number;
  id: string;
  name: string;
  total: number;
}

export interface AtRiskPlayer {
  flags: number;
  id: number;
  name: string;
}

export interface HomeStats {
  sessionsLast30d: number;
  sevenDayAvg: number;
  topLoaded: string;
}

// ─── Home page utils ──────────────────────────────────────────────────────────

const BUCKET_RPES = [2, 4, 6, 8, 10] as const;

export { BUCKET_RPES };

function scoreToBucket(score: number): number {
  return Math.min(Math.floor((score - 1) / 2), 4);
}

function toTitleCase(word: string): string {
  return word.charAt(0) + word.slice(1).toLowerCase();
}

export function calcSessionSummary(session: Session): SessionSummary {
  const { rosterIds, scores } = session;
  const done = rosterIds.filter((id) => id in scores).length;
  const values = rosterIds
    .map((id) => scores[id])
    .filter((s): s is number => s !== undefined);

  const avg =
    values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  const dist = new Array<number>(5).fill(0);
  for (const score of values) {
    dist[scoreToBucket(score)]++;
  }

  return {
    avg,
    date: fmtDate(new Date(session.date)),
    dist,
    done,
    id: session.id,
    name: session.name,
    total: rosterIds.length,
  };
}

export function calcAtRisk(sessions: Session[]): AtRiskPlayer[] {
  const recent = sessions.slice(-5);
  const flagMap = new Map<number, number>();

  for (const session of recent) {
    for (const [idStr, score] of Object.entries(session.scores)) {
      if (score >= 8) {
        const id = Number(idStr);
        flagMap.set(id, (flagMap.get(id) ?? 0) + 1);
      }
    }
  }

  return ROSTER.filter((p) => (flagMap.get(p.id) ?? 0) >= 2)
    .map((p) => ({ flags: flagMap.get(p.id) ?? 0, id: p.id, name: p.name }))
    .sort((a, b) => b.flags - a.flags);
}

export function calcHomeStats(sessions: Session[]): HomeStats {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const sessionsLast30d = sessions.filter(
    (s) => now - new Date(s.date).getTime() < 30 * DAY
  ).length;

  const last7Scores = sessions
    .filter((s) => now - new Date(s.date).getTime() < 7 * DAY)
    .flatMap((s) => Object.values(s.scores));

  const sevenDayAvg =
    last7Scores.length > 0
      ? last7Scores.reduce((a, b) => a + b, 0) / last7Scores.length
      : 0;

  // Player with the highest average RPE across all sessions
  const playerTotals = new Map<number, { count: number; sum: number }>();
  for (const session of sessions) {
    for (const [idStr, score] of Object.entries(session.scores)) {
      const id = Number(idStr);
      const prev = playerTotals.get(id) ?? { count: 0, sum: 0 };
      playerTotals.set(id, { count: prev.count + 1, sum: prev.sum + score });
    }
  }

  let topLoaded = "—";
  let topAvg = 0;
  for (const [id, { count, sum }] of playerTotals) {
    const avg = sum / count;
    if (avg > topAvg) {
      topAvg = avg;
      const player = ROSTER.find((p) => p.id === id);
      if (player) {
        const parts = player.name.split(" ");
        const firstName = toTitleCase(parts.at(-1) ?? parts[0]);
        const lastInitial = parts[0][0];
        topLoaded = `${firstName} ${lastInitial}.`;
      }
    }
  }

  return { sevenDayAvg, sessionsLast30d, topLoaded };
}
