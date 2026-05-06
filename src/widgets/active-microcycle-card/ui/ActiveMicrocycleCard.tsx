"use client";

import type { Microcycle } from "@entities/microcycle";
import { useSessions } from "@entities/session";
import { formatDate, formatDuration } from "@shared/lib/format";
import { Button } from "@shared/ui";
import { ChevronRight, Layers } from "lucide-react";
import Link from "next/link";

interface ActiveMicrocycleCardProps {
  microcycle: Microcycle;
}

export function ActiveMicrocycleCard({
  microcycle,
}: ActiveMicrocycleCardProps) {
  const sessions = useSessions(microcycle.id!);

  const sessionCount = sessions?.length ?? 0;
  const totalDuration = sessions?.reduce((acc, s) => acc + s.duration, 0) ?? 0;
  const dateRange =
    sessions && sessions.length > 0
      ? sessions.length === 1
        ? formatDate(sessions[0].date)
        : `${formatDate(sessions[0].date)} – ${formatDate(sessions.at(-1)!.date)}`
      : formatDate(microcycle.createdAt);

  return (
    <div className="rounded-xl border border-default bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg text-primary leading-tight">
            {microcycle.name}
          </p>
          <p className="text-muted-foreground text-xs">{dateRange}</p>
        </div>
        <Link href={`/microcycles/${microcycle.id}`}>
          <Button size="icon-sm" variant="ghost">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="mt-4 flex gap-6">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono font-semibold text-primary text-xl tabular-nums">
            {sessionCount}
          </span>
          <span className="text-muted-foreground text-xs">sessions</span>
        </div>
        {totalDuration > 0 && (
          <div className="flex flex-col gap-0.5">
            <span className="font-mono font-semibold text-primary text-xl tabular-nums">
              {formatDuration(totalDuration)}
            </span>
            <span className="text-muted-foreground text-xs">
              total duration
            </span>
          </div>
        )}
      </div>

      {sessionCount === 0 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-elevated px-3 py-2">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">No sessions yet</span>
        </div>
      )}
    </div>
  );
}
