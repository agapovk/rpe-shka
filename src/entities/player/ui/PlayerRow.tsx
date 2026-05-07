import { cn } from "@shared/lib";
import type { Player } from "../model/types";

interface PlayerRowProps {
  className?: string;
  player: Player;
}

export function PlayerRow({ player, className }: PlayerRowProps) {
  return (
    <div className={cn("flex items-center gap-3 py-2", className)}>
      <span className="w-6 text-center font-mono text-muted-foreground text-xs">
        {player.number ?? "-"}
      </span>
      <span className="text-primary text-sm">{player.name}</span>
    </div>
  );
}
