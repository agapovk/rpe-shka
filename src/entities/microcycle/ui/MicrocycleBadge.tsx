import { cn } from "@shared/lib/utils";
import { Badge } from "@/src/shared/ui";
import type { Microcycle } from "../model";

interface MicrocycleBadgeProps {
  className?: string;
  microcycle: Pick<Microcycle, "name">;
}

// Badge
export function MicrocycleBadge({
  microcycle,
  className,
}: MicrocycleBadgeProps) {
  return (
    <Badge
      className={cn("h-6 rounded-md bg-elevated text-secondary", className)}
    >
      {microcycle.name}
    </Badge>
  );
}
