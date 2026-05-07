"use client";

import { useCategory } from "@entities/category";
import { useMicrocycle } from "@entities/microcycle";
import { useSession } from "@entities/session";
import { formatDate, formatDuration } from "@shared/lib";
import { Button, NotFoundShell } from "@shared/ui";
import { PlayerRpeTable } from "@widgets/player-rpe-table";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SessionViewProps {
  sessionId: number;
}

export function SessionView({ sessionId }: SessionViewProps) {
  const session = useSession(sessionId);
  const microcycle = useMicrocycle(session?.microcycleId ?? 0);
  const category = useCategory(session?.categoryId ?? 0);

  if (session === undefined || microcycle === undefined) {
    return null;
  }

  if (session === null) {
    return <NotFoundShell message="Session not found." />;
  }

  const backHref = microcycle?.id ? `/microcycles/${microcycle.id}` : "/";

  return (
    <div className="flex min-h-full flex-col bg-base">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-border border-b bg-surface px-4">
        <Link href={backHref}>
          <Button size="icon-sm" variant="ghost">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex flex-1 flex-col">
          <h1 className="font-semibold text-primary leading-tight">
            {category?.name ?? "Session"}
          </h1>
          <p className="text-muted-foreground text-xs">
            {formatDate(session.date)} · {formatDuration(session.duration)}
          </p>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 py-4 pb-24">
        <div className="mx-4 overflow-hidden rounded-lg border border-default bg-surface">
          {microcycle?.teamId && (
            <PlayerRpeTable
              sessionDuration={session.duration}
              sessionId={session.id!}
              teamId={microcycle.teamId}
            />
          )}
        </div>
      </main>
    </div>
  );
}
