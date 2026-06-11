import { Check } from "lucide-react";
import type { Player } from "@/shared/db/dexie";
import { cn } from "@/shared/lib/cn";
import { rpeTextClass } from "@/shared/lib/rpe";

interface SessionRosterRowProps {
	inSession: boolean;
	onToggle: (playerId: number) => void;
	player: Player;
	score: number | undefined;
}

export function SessionRosterRow({
	inSession,
	onToggle,
	player,
	score,
}: SessionRosterRowProps) {
	return (
		<button
			className={cn(
				"flex min-h-14 items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-line/30",
				!inSession && "text-muted"
			)}
			onClick={() => onToggle(player.id)}
			type="button"
		>
			<span
				className={cn(
					"flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
					inSession ? "border-accent bg-accent" : "border-line"
				)}
			>
				{inSession && <Check className="h-3.5 w-3.5 text-bg" />}
			</span>
			<span className="w-7 shrink-0 text-muted text-sm tabular-nums">
				{String(player.num).padStart(2, "0")}
			</span>
			<span className="min-w-0 flex-1 truncate font-display font-medium text-lg">
				{player.name}
			</span>
			{score !== undefined && (
				<span
					className={cn(
						"font-bold font-display text-xl tabular-nums leading-none",
						rpeTextClass(score)
					)}
				>
					{score}
				</span>
			)}
		</button>
	);
}
