"use client";

import { getRpeRange } from "@shared/config";
import { cn, formatDuration, type PlayerReportRow } from "@shared/lib";
import { Users } from "lucide-react";

const rpeTextClasses = {
  low: "text-rpe-low",
  medium: "text-rpe-medium",
  high: "text-rpe-high",
  max: "text-rpe-max",
} as const;

interface MicrocycleReportSummaryProps {
  rows: PlayerReportRow[];
}

export function MicrocycleReportSummary({
  rows,
}: MicrocycleReportSummaryProps) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <Users className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          No players in this team. Add some in Settings.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 px-4 py-2">
        <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Player
        </span>
        <span className="w-10 text-right font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Dur
        </span>
        <span className="w-10 text-right font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Avg
        </span>
        <span className="w-14 text-right font-medium text-muted-foreground text-xs uppercase tracking-wide">
          sRPE
        </span>
      </div>
      {rows.map((row) => (
        <ReportRow key={row.playerId} row={row} />
      ))}
    </div>
  );
}

function ReportRow({ row }: { row: PlayerReportRow }) {
  const hasData = row.sessions > 0;
  const avgRpeRange = hasData ? getRpeRange(Math.round(row.avgRpe)) : null;

  return (
    <div className="grid min-h-14 grid-cols-[1fr_auto_auto_auto] items-center gap-x-4 px-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="w-6 shrink-0 text-center font-mono text-muted-foreground text-xs">
          {row.number ?? "—"}
        </span>
        <div className="min-w-0">
          <span className="block truncate text-primary text-sm">
            {row.name}
          </span>
          {hasData && (
            <span className="text-muted-foreground text-xs">
              {row.sessions} session{row.sessions === 1 ? "" : "s"}
            </span>
          )}
        </div>
      </div>
      {hasData ? (
        <>
          <span className="w-10 text-right font-mono text-muted-foreground text-xs tabular-nums">
            {formatDuration(row.totalDuration)}
          </span>
          <span
            className={cn(
              "w-10 text-right font-mono font-semibold text-sm tabular-nums",
              avgRpeRange
                ? rpeTextClasses[avgRpeRange]
                : "text-muted-foreground"
            )}
          >
            {row.avgRpe.toFixed(1)}
          </span>
          <span className="w-14 text-right font-mono font-semibold text-primary text-sm tabular-nums">
            {row.totalSrpe}
          </span>
        </>
      ) : (
        <span className="col-span-3 text-right text-faint text-sm">—</span>
      )}
    </div>
  );
}
