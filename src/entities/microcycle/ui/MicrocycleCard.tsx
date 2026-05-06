import { formatDate } from "@shared/lib/format";
import { cn } from "@shared/lib/utils";

import type { Microcycle } from "../model";

interface MicrocycleCardProps {
  className?: string;
  microcycle: Microcycle;
  onClick?: () => void;
  sessionCount?: number;
}

const cardClass =
  "w-full rounded-xl border border-default bg-surface p-4 text-left";

function CardContent({
  microcycle,
  sessionCount,
}: Pick<MicrocycleCardProps, "microcycle" | "sessionCount">) {
  return (
    <>
      <p className="font-semibold text-primary">{microcycle.name}</p>
      <p className="mt-0.5 text-muted-foreground text-xs">
        {formatDate(microcycle.createdAt)}
        {sessionCount !== undefined && ` · ${sessionCount} sessions`}
      </p>
    </>
  );
}

export function MicrocycleCard({
  microcycle,
  sessionCount,
  onClick,
  className,
}: MicrocycleCardProps) {
  if (onClick) {
    return (
      <button
        className={cn(
          cardClass,
          "cursor-pointer transition-colors hover:bg-elevated",
          className
        )}
        onClick={onClick}
        type="button"
      >
        <CardContent microcycle={microcycle} sessionCount={sessionCount} />
      </button>
    );
  }

  return (
    <div className={cn(cardClass, className)}>
      <CardContent microcycle={microcycle} sessionCount={sessionCount} />
    </div>
  );
}
