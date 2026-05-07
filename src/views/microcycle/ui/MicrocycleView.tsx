"use client";

import { useMicrocycle } from "@entities/microcycle";
import { useSessions } from "@entities/session";
import { CreateSessionForm } from "@features/create-session";
import { formatDuration, formatSessionsDateRange } from "@shared/lib";
import { BottomSheet, Button, NotFoundShell } from "@shared/ui";
import { SessionList } from "@widgets/session-list";
import { ArrowLeft, BarChart2, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MicrocycleViewProps {
  microcycleId: number;
}

export function MicrocycleView({ microcycleId }: MicrocycleViewProps) {
  const microcycle = useMicrocycle(microcycleId);
  const sessions = useSessions(microcycleId);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (microcycle === undefined || sessions === undefined) {
    return null;
  }

  if (microcycle === null) {
    return <NotFoundShell message="Microcycle not found." />;
  }

  const totalDuration = sessions.reduce((acc, s) => acc + s.duration, 0);
  const dateRange = formatSessionsDateRange(sessions);

  return (
    <div className="flex min-h-full flex-col bg-base">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-border border-b bg-surface px-4">
        <Link href="/">
          <Button size="icon-sm" variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex flex-1 flex-col">
          <h1 className="font-semibold text-primary leading-tight">
            {microcycle.name}
          </h1>
          {dateRange && (
            <p className="text-muted-foreground text-xs">{dateRange}</p>
          )}
        </div>
        <Link href={`/microcycles/${microcycleId}/report`}>
          <Button size="icon-sm" variant="ghost">
            <BarChart2 className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      <main className="flex flex-1 flex-col gap-6 py-4 pb-24">
        {sessions.length > 0 && (
          <div className="flex gap-6 px-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono font-semibold text-primary text-xl tabular-nums">
                {sessions.length}
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
        )}

        <div className="mx-4 overflow-hidden rounded-lg border border-default bg-surface">
          <SessionList microcycleId={microcycleId} sessions={sessions} />
        </div>

        <div className="px-4">
          <Button
            className="h-12 w-full gap-2"
            onClick={() => setSheetOpen(true)}
            variant="outline"
          >
            <Plus className="h-5 w-5" />
            Add session
          </Button>
        </div>
      </main>

      <BottomSheet
        onClose={() => setSheetOpen(false)}
        open={sheetOpen}
        title="New session"
      >
        <CreateSessionForm
          microcycleId={microcycleId}
          onClose={() => setSheetOpen(false)}
        />
      </BottomSheet>
    </div>
  );
}
