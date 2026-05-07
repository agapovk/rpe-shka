import { cn } from "@shared/lib";
import { Badge } from "@shared/ui";
import type { Team } from "../model/types";

interface TeamBadgeProps {
  className?: string;
  team: Pick<Team, "name">;
}

export function TeamBadge({ team, className }: TeamBadgeProps) {
  return (
    <Badge
      className={cn(
        "rounded-md bg-elevated px-2 py-0.5 text-secondary text-xs",
        className
      )}
    >
      {team.name}
    </Badge>
  );
}
