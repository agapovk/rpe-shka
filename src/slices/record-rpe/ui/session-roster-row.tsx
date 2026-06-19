import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Player } from "@/shared/db/dexie";
import { cn } from "@/shared/lib/cn";
import { rpeTextClass } from "@/shared/lib/rpe";

interface SessionRosterRowProps {
	inSession: boolean;
	onDeleteScore: (playerId: number) => void;
	onToggle: (playerId: number) => void;
	player: Player;
	score: number | undefined;
}

export function SessionRosterRow({
	inSession,
	onDeleteScore,
	onToggle,
	player,
	score,
}: SessionRosterRowProps) {
	const [confirming, setConfirming] = useState(false);
	// корзина только у снятого игрока с оставшейся оценкой — ручное удаление
	const canDeleteScore = !inSession && score !== undefined;
	return (
		<div className="flex items-center">
			<button
				className={cn(
					"flex min-h-14 flex-1 items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-line/30",
					!inSession && "text-muted"
				)}
				onClick={() => {
					setConfirming(false);
					onToggle(player.id);
				}}
				type="button"
			>
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
				<span
					className={cn(
						"flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
						inSession ? "border-accent bg-accent" : "border-line"
					)}
				>
					{inSession && <Check className="h-3.5 w-3.5 text-bg" />}
				</span>
			</button>
			{canDeleteScore &&
				(confirming ? (
					<div className="flex shrink-0 items-center pr-2">
						<button
							className="rounded-md px-2 py-1 font-medium text-rpe-maximal text-xs uppercase tracking-widest hover:bg-rpe-maximal/10"
							onClick={() => onDeleteScore(player.id)}
							type="button"
						>
							Yes
						</button>
						<button
							className="rounded-md px-2 py-1 font-medium text-muted text-xs uppercase tracking-widest hover:bg-line/40"
							onClick={() => setConfirming(false)}
							type="button"
						>
							No
						</button>
					</div>
				) : (
					<button
						aria-label={`Delete score for ${player.name}`}
						className="flex min-h-14 shrink-0 items-center px-4 text-muted transition-colors hover:text-rpe-maximal"
						onClick={() => setConfirming(true)}
						type="button"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				))}
		</div>
	);
}
