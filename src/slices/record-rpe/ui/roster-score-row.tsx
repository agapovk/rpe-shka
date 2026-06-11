import { ArrowRight, Check } from "lucide-react";
import type { Player } from "@/shared/db/dexie";
import { cn } from "@/shared/lib/cn";
import { rpeTextClass } from "@/shared/lib/rpe";

interface RosterScoreRowProps {
	note: string | undefined;
	onOpen: (playerId: number) => void;
	player: Player;
	score: number | undefined;
}

export function RosterScoreRow({
	note,
	onOpen,
	player,
	score,
}: RosterScoreRowProps) {
	const hasScore = score !== undefined;

	return (
		<button
			className={cn(
				"group flex min-h-14 items-center gap-3.5 px-4 py-3 text-left transition-colors hover:bg-line/30",
				!hasScore && "text-muted"
			)}
			onClick={() => onOpen(player.id)}
			type="button"
		>
			<span className="w-7 shrink-0 text-muted text-sm tabular-nums">
				{String(player.num).padStart(2, "0")}
			</span>
			<span className="min-w-0 flex-1 truncate font-display font-medium text-lg">
				{player.name}
				{note && (
					<span className="ml-2 font-normal font-sans text-muted text-xs">
						· {note}
					</span>
				)}
			</span>
			{hasScore ? (
				<span className="flex items-center gap-3">
					<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent">
						<Check className="h-3.5 w-3.5 text-bg" />
					</span>
					<span
						className={cn(
							"min-w-6 text-right font-bold font-display text-2xl tabular-nums leading-none",
							rpeTextClass(score)
						)}
					>
						{score}
					</span>
				</span>
			) : (
				<span className="flex items-center gap-2 text-[10px] text-muted uppercase tracking-widest">
					<span className="transition-colors group-hover:text-accent">
						Tap to score
					</span>
					<ArrowRight className="h-4 w-4" />
				</span>
			)}
		</button>
	);
}
