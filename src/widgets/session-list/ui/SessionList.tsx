"use client";

import { useCategories } from "@entities/category";
import type { Session } from "@entities/session";
import { SessionRow } from "@entities/session";
import { Layers } from "lucide-react";
import Link from "next/link";

interface SessionListProps {
  microcycleId: number;
  sessions: Session[];
}

export function SessionList({
  sessions,
  microcycleId: _microcycleId,
}: SessionListProps) {
  const categories = useCategories();

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <Layers className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          No sessions yet. Add the first one.
        </p>
      </div>
    );
  }

  const categoryMap = new Map(categories?.map((c) => [c.id!, c]) ?? []);

  return (
    <div className="flex flex-col divide-y divide-border">
      {sessions.map((session) => {
        const category = categoryMap.get(session.categoryId) ?? {
          name: "—",
        };
        return (
          <Link
            className="block transition-colors hover:bg-elevated active:bg-elevated"
            href={`/sessions/${session.id}`}
            key={session.id}
          >
            <SessionRow
              category={category}
              className="px-4"
              session={session}
            />
          </Link>
        );
      })}
    </div>
  );
}
