"use client";

import { useMicrocycle } from "@entities/microcycle";
import { useSessions } from "@entities/session";
import { CreateSessionForm } from "@features/create-session";
import { formatDate, formatDuration } from "@shared/lib/format";
import { BottomSheet, Button } from "@shared/ui";
import { SessionList } from "@widgets/session-list";
import { ArrowLeft, Plus } from "lucide-react";
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

  const totalDuration = sessions.reduce((acc, s) => acc + s.duration, 0);
  const dateRange =
    sessions.length > 0
      ? sessions.length === 1
        ? formatDate(sessions[0].date)
        : `${formatDate(sessions[0].date)} – ${formatDate(sessions.at(-1)!.date)}`
      : null;

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
