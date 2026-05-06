"use client";

import type { Player } from "@entities/player";
import { usePlayers } from "@entities/player";
import type { SessionEntry } from "@entities/session";
import { useSessionEntries } from "@entities/session";
import { RecordRpe } from "@features/record-rpe";
import { getRpeRange } from "@shared/config";
import { calculateSrpe } from "@shared/lib";
import { cn } from "@shared/lib/utils";
import { BottomSheet } from "@shared/ui";
import { Users } from "lucide-react";
import { useState } from "react";

const rpeTextClasses = {
  low: "text-rpe-low",
  medium: "text-rpe-medium",
  high: "text-rpe-high",
  max: "text-rpe-max",
} as const;

interface PlayerRpeTableProps {
  sessionDuration: number;
  sessionId: number;
  teamId: number;
}

interface SelectedPlayer {
  id: number;
  name: string;
}

export function PlayerRpeTable({
  sessionId,
  teamId,
  sessionDuration,
}: PlayerRpeTableProps) {
  const players = usePlayers(teamId);
  const entries = useSessionEntries(sessionId);
  const [selected, setSelected] = useState<SelectedPlayer | null>(null);

  if (players === undefined || entries === undefined) {
    return null;
  }

  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          No players in this team. Add some in Settings.
        </p>
      </div>
    );
  }

  const entryMap = new Map(entries.map((e) => [e.playerId, e]));
  const currentEntry = selected ? entryMap.get(selected.id) : undefined;

  return (
    <>
      <div className="flex flex-col divide-y divide-border">
        <div className="flex items-center justify-between px-4 py-2">
          <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Player
          </span>
          <div className="flex items-center gap-8">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              RPE
            </span>
            <span className="w-12 text-right font-medium text-muted-foreground text-xs uppercase tracking-wide">
              sRPE
            </span>
          </div>
        </div>
        {players.map((player) => (
          <PlayerRpeRow
            entry={entryMap.get(player.id!)}
            key={player.id}
            onPress={() => setSelected({ id: player.id!, name: player.name })}
            player={player}
            sessionDuration={sessionDuration}
          />
        ))}
      </div>

      <BottomSheet
        onClose={() => setSelected(null)}
        open={!!selected}
        title={selected ? `RPE — ${selected.name}` : ""}
      >
        {selected && (
          <RecordRpe
            currentRpe={currentEntry?.rpe}
            onClose={() => setSelected(null)}
            playerId={selected.id}
            sessionId={sessionId}
          />
        )}
      </BottomSheet>
    </>
  );
}

interface PlayerRpeRowProps {
  entry: SessionEntry | undefined;
  onPress: () => void;
  player: Player;
  sessionDuration: number;
}

function PlayerRpeRow({
  player,
  entry,
  sessionDuration,
  onPress,
}: PlayerRpeRowProps) {
  return (
    <button
      className="flex min-h-14 w-full items-center justify-between px-4 text-left transition-colors hover:bg-elevated active:bg-elevated"
      onClick={onPress}
      type="button"
    >
      <div className="flex items-center gap-3">
        <span className="w-6 text-center font-mono text-muted-foreground text-xs">
          {player.number ?? "—"}
        </span>
        <span className="text-primary text-sm">{player.name}</span>
      </div>
      <div className="flex items-center gap-8">
        {entry ? (
          <>
            <span
              className={cn(
                "font-mono font-semibold text-base tabular-nums",
                rpeTextClasses[getRpeRange(entry.rpe)]
              )}
            >
              {entry.rpe}
            </span>
            <span className="w-12 text-right font-mono text-muted-foreground text-sm tabular-nums">
              {calculateSrpe(entry.rpe, sessionDuration)}
            </span>
          </>
        ) : (
          <span className="text-faint text-sm">—</span>
        )}
      </div>
    </button>
  );
}
