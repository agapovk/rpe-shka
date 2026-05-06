import type { Player, Session, SessionEntry } from "@shared/db";
import { calculateSrpe } from "./srpe";

export interface PlayerReportRow {
  avgRpe: number;
  name: string;
  number?: number;
  playerId: number;
  sessions: number;
  totalDuration: number;
  totalSrpe: number;
}

export function aggregateReport(
  players: Player[],
  sessions: Session[],
  entries: SessionEntry[]
): PlayerReportRow[] {
  return players.map((player) => {
    const playerEntries = entries.filter((e) => e.playerId === player.id);
    const attendedSessionIds = new Set(playerEntries.map((e) => e.sessionId));
    const attendedSessions = sessions.filter((s) =>
      attendedSessionIds.has(s.id!)
    );
    const totalDuration = attendedSessions.reduce(
      (sum, s) => sum + s.duration,
      0
    );
    const totalSrpe = playerEntries.reduce((sum, e) => {
      const session = sessions.find((s) => s.id === e.sessionId);
      return sum + (session ? calculateSrpe(e.rpe, session.duration) : 0);
    }, 0);
    const avgRpe =
      playerEntries.length > 0
        ? playerEntries.reduce((sum, e) => sum + e.rpe, 0) /
          playerEntries.length
        : 0;
    return {
      avgRpe,
      name: player.name,
      number: player.number,
      playerId: player.id!,
      sessions: playerEntries.length,
      totalDuration,
      totalSrpe,
    };
  });
}
