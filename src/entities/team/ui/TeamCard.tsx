import { cn } from "@shared/lib";
import type { Team } from "../model/types";

interface TeamCardProps {
  className?: string;
  onClick?: () => void;
  playerCount?: number;
  team: Team;
}

const cardClass =
  "w-full rounded-xl border border-default bg-surface p-4 text-left";

// Item
export function TeamCard({
  team,
  playerCount,
  onClick,
  className,
}: TeamCardProps) {
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
        <p className="font-semibold text-primary">{team.name}</p>
        {playerCount !== undefined && (
          <p className="mt-1 text-muted-foreground text-xs">
            {playerCount} players
          </p>
        )}
      </button>
    );
  }

  return (
    <div className={cn(cardClass, className)}>
      <p className="font-semibold text-primary">{team.name}</p>
      {playerCount !== undefined && (
        <p className="mt-1 text-muted-foreground text-xs">
          {playerCount} players
        </p>
      )}
    </div>
  );
}
