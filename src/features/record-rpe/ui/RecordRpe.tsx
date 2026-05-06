"use client";

import { getRpeRange, RPE_SCALE } from "@shared/config";
import { db } from "@shared/db";
import { cn } from "@shared/lib/utils";

const rpeRangeClasses = {
  low: "text-rpe-low bg-rpe-low-dim",
  medium: "text-rpe-medium bg-rpe-medium-dim",
  high: "text-rpe-high bg-rpe-high-dim",
  max: "text-rpe-max bg-rpe-max-dim",
} as const;

interface RecordRpeProps {
  currentRpe?: number;
  onClose: () => void;
  playerId: number;
  sessionId: number;
}

export function RecordRpe({
  sessionId,
  playerId,
  currentRpe,
  onClose,
}: RecordRpeProps) {
  async function handleSelect(rpe: number) {
    const existing = await db.sessionEntries
      .where("sessionId")
      .equals(sessionId)
      .filter((e) => e.playerId === playerId)
      .first();

    if (existing?.id == null) {
      await db.sessionEntries.add({ sessionId, playerId, rpe });
    } else {
      await db.sessionEntries.update(existing.id, { rpe });
    }
    onClose();
  }

  return (
    <div className="grid grid-cols-5 gap-2">
      {RPE_SCALE.map(({ value }) => {
        const range = getRpeRange(value);
        const isSelected = currentRpe === value;
        return (
          <button
            className={cn(
              "flex h-14 items-center justify-center rounded-lg font-mono font-semibold text-xl tabular-nums transition-all",
              rpeRangeClasses[range],
              isSelected && "ring-2 ring-current ring-offset-1"
            )}
            key={value}
            onClick={() => handleSelect(value)}
            type="button"
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}
