import { ArrowRight, MessageSquareText } from "lucide-react";
import { useState } from "react";
import type { Player } from "@/shared/db/dexie";
import { cn } from "@/shared/lib/cn";
import { rpeBgClass, rpeTextClass } from "@/shared/lib/rpe";

interface RosterScoreRowProps {
	flash: number | null;
	note: string | undefined;
	onOpen: (playerId: number) => void;
	player: Player;
	score: number | undefined;
}

export function RosterScoreRow({
	flash,
	note,
	onOpen,
	player,
	score,
}: RosterScoreRowProps) {
	const hasScore = score !== undefined;
	const [noteOpen, setNoteOpen] = useState(false);

	return (
		<div className="flex flex-col">
			<div
				className={cn(
					"group relative flex min-h-14 items-center overflow-hidden transition-colors",
					hasScore
						? "bg-accent/10 hover:bg-accent/15 active:bg-accent/20"
						: "text-muted hover:bg-line/30 active:bg-line/50"
				)}
			>
				{flash !== null && hasScore && (
					<span
						aria-hidden="true"
						className={cn(
							"pointer-events-none absolute inset-0 animate-row-flash",
							rpeBgClass(score)
						)}
						key={flash}
					/>
				)}
				<button
					className="flex min-w-0 flex-1 items-center gap-4 px-4 py-3 text-left"
					onClick={() => onOpen(player.id)}
					type="button"
				>
					<span className="w-7 shrink-0 text-muted text-sm tabular-nums">
						{String(player.num).padStart(2, "0")}
					</span>
					<span className="min-w-0 flex-1 truncate font-display font-medium text-lg">
						{player.name}
					</span>
				</button>
				{hasScore ? (
					<div className="flex shrink-0 items-center gap-2.5 pr-4 pl-1">
						{note && (
							<button
								aria-expanded={noteOpen}
								aria-label={`Toggle note for ${player.name}`}
								className={cn(
									"flex h-7 w-7 items-center justify-center rounded-md transition-colors active:bg-line/40",
									noteOpen ? "text-accent" : "text-muted hover:text-text"
								)}
								onClick={() => setNoteOpen(!noteOpen)}
								type="button"
							>
								<MessageSquareText className="h-4 w-4" />
							</button>
						)}
						<button
							className="flex items-center"
							onClick={() => onOpen(player.id)}
							type="button"
						>
							<span
								className={cn(
									"min-w-6 text-right font-bold font-display text-2xl tabular-nums leading-none",
									rpeTextClass(score)
								)}
							>
								{score}
							</span>
						</button>
					</div>
				) : (
					<button
						className="flex shrink-0 items-center gap-2 px-4 py-3 text-[10px] text-muted uppercase tracking-widest"
						onClick={() => onOpen(player.id)}
						type="button"
					>
						<span className="transition-colors group-hover:text-accent">
							Tap to score
						</span>
						<ArrowRight className="h-4 w-4" />
					</button>
				)}
			</div>
			{note && noteOpen && (
				<div className="flex gap-4 px-4 pb-3">
					<span aria-hidden="true" className="w-7 shrink-0" />
					<p className="min-w-0 text-muted text-sm leading-snug">{note}</p>
				</div>
			)}
		</div>
	);
}
