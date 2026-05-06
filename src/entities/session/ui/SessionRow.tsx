import type { Category } from "@shared/db";
import { formatDate, formatDuration } from "@shared/lib/format";
import { cn } from "@shared/lib/utils";

import type { Session, SessionStatus } from "../model";
import { SessionStatusBadge } from "./SessionStatusBadge";

interface SessionRowProps {
  category: Pick<Category, "name">;
  className?: string;
  session: Session;
  status?: SessionStatus;
}

export function SessionRow({
  session,
  category,
  status,
  className,
}: SessionRowProps) {
  return (
    <div
      className={cn("flex items-center justify-between gap-3 py-2", className)}
    >
      <div className="flex items-center gap-3">
        <span className="w-16 font-mono text-muted-foreground text-xs">
          {formatDate(session.date)}
        </span>
        <span className="text-primary text-sm">{category.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">
          {formatDuration(session.duration)}
        </span>
        {status && <SessionStatusBadge status={status} />}
      </div>
    </div>
  );
}
