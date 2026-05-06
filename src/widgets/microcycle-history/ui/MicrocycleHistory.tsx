"use client";

import type { Microcycle } from "@entities/microcycle";
import { MicrocycleCard } from "@entities/microcycle";
import { useSessions } from "@entities/session";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MicrocycleHistoryItemProps {
  microcycle: Microcycle;
}

function MicrocycleHistoryItem({ microcycle }: MicrocycleHistoryItemProps) {
  const sessions = useSessions(microcycle.id!);
  return (
    <Link className="block" href={`/microcycles/${microcycle.id}`}>
      <MicrocycleCard
        microcycle={microcycle}
        onClick={() => undefined}
        sessionCount={sessions?.length ?? 0}
      />
    </Link>
  );
}

interface MicrocycleHistoryProps {
  microcycles: Microcycle[];
}

export function MicrocycleHistory({ microcycles }: MicrocycleHistoryProps) {
  const [open, setOpen] = useState(false);

  if (microcycles.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-3">
      <button
        className="flex items-center justify-between py-1 text-left"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <h2 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          History · {microcycles.length}
        </h2>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="flex flex-col gap-2">
          {microcycles.map((mc) => (
            <MicrocycleHistoryItem key={mc.id} microcycle={mc} />
          ))}
        </div>
      )}
    </section>
  );
}
