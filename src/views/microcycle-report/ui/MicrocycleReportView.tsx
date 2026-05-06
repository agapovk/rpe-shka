"use client";

import { useMicrocycle, useMicrocycleReportData } from "@entities/microcycle";
import { ExportReport } from "@features/export-report";
import { aggregateReport, formatDate } from "@shared/lib";
import { Button } from "@shared/ui";
import { MicrocycleReportSummary } from "@widgets/microcycle-report-summary";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MicrocycleReportViewProps {
  microcycleId: number;
}

export function MicrocycleReportView({
  microcycleId,
}: MicrocycleReportViewProps) {
  const microcycle = useMicrocycle(microcycleId);
  const rawData = useMicrocycleReportData(
    microcycleId,
    microcycle?.teamId ?? 0
  );

  if (microcycle === undefined || rawData === undefined) {
    return null;
  }

  if (microcycle === null) {
    return (
      <div className="flex min-h-full flex-col bg-base">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-border border-b bg-surface px-4">
          <Link href="/">
            <Button size="icon-sm" variant="ghost">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="font-semibold text-primary">Not found</h1>
        </header>
        <div className="flex flex-1 items-center justify-center px-8 py-16 text-center">
          <p className="text-muted-foreground text-sm">Microcycle not found.</p>
        </div>
      </div>
    );
  }

  const { sessions, entries, players } = rawData;
  const rows = aggregateReport(players, sessions, entries);

  const dateRange =
    sessions.length > 0
      ? sessions.length === 1
        ? formatDate(sessions[0].date)
        : `${formatDate(sessions[0].date)} – ${formatDate(sessions.at(-1)!.date)}`
      : "No sessions";

  const totalSrpe = rows.reduce((sum, r) => sum + r.totalSrpe, 0);
  const totalSessions = sessions.length;

  return (
    <div className="flex min-h-full flex-col bg-base">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-border border-b bg-surface px-4">
        <Link href={`/microcycles/${microcycleId}`}>
          <Button size="icon-sm" variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex flex-1 flex-col">
          <h1 className="font-semibold text-primary leading-tight">
            {microcycle.name} — Report
          </h1>
          <p className="text-muted-foreground text-xs">{dateRange}</p>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6 py-4 pb-24">
        {totalSessions > 0 && (
          <div className="flex gap-6 px-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono font-semibold text-primary text-xl tabular-nums">
                {totalSessions}
              </span>
              <span className="text-muted-foreground text-xs">sessions</span>
            </div>
            {totalSrpe > 0 && (
              <div className="flex flex-col gap-0.5">
                <span className="font-mono font-semibold text-primary text-xl tabular-nums">
                  {totalSrpe.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-xs">team sRPE</span>
              </div>
            )}
          </div>
        )}

        <div className="mx-4 overflow-hidden rounded-lg border border-default bg-surface">
          <MicrocycleReportSummary rows={rows} />
        </div>

        <div className="px-4">
          <ExportReport
            dateRange={dateRange}
            microcycleName={microcycle.name}
            rows={rows}
          />
        </div>
      </main>
    </div>
  );
}
