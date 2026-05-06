import { cn } from "@shared/lib/utils";
import type { Team } from "../model";

interface TeamBadgeProps {
  className?: string;
  team: Pick<Team, "name">;
}

// Badge
export function TeamBadge({ team, className }: TeamBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-elevated px-2 py-0.5 font-medium text-secondary text-xs",
        className
      )}
    >
      {team.name}
    </span>
  );
}
