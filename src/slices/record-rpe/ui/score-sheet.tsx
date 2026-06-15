import { UserX, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Player } from "@/shared/db/dexie";
import { NOTE_MAX_LENGTH } from "../model";
import { RpeScale } from "./rpe-scale";

interface ScoreSheetProps {
	initialNote: string;
	initialScore: number | null;
	onAbsent: () => void;
	onClose: (note: string) => void;
	onPick: (score: number, note: string) => void;
	player: Player;
}

export function ScoreSheet({
	initialNote,
	initialScore,
	onAbsent,
	onClose,
	onPick,
	player,
}: ScoreSheetProps) {
	const [note, setNote] = useState(initialNote);

	useEffect(() => {
		const onKey = (e: KeyboardEvent): void => {
			if (e.key === "Escape") {
				onClose(note);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose, note]);

	// фон под шитом не должен прокручиваться
	useEffect(() => {
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
		};
	}, []);

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center">
			<button
				aria-label="Close"
				className="absolute inset-0 animate-fade-in bg-black/55 backdrop-blur-xs"
				onClick={() => onClose(note)}
				type="button"
			/>
			<div
				aria-modal="true"
				className="relative flex max-h-[92dvh] w-full max-w-xl animate-sheet-up flex-col gap-4 overflow-y-auto rounded-t-3xl border-line border-t bg-bg px-5 pt-3 pb-6"
				role="dialog"
			>
				<div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-line" />

				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0 flex-1">
						<p className="mb-1 text-muted text-xs tracking-widest">
							#{String(player.num).padStart(2, "0")}
						</p>
						<p className="font-bold font-display text-3xl uppercase leading-none tracking-tight">
							{player.name}
						</p>
						<p className="pt-2 text-[10px] text-muted uppercase tracking-widest">
							{initialScore === null
								? "Tap to save"
								: "Tap same score to clear"}
						</p>
					</div>
					<button
						aria-label="Close"
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-text active:bg-line/40"
						onClick={() => onClose(note)}
						type="button"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<RpeScale onSelect={(n) => onPick(n, note)} value={initialScore} />

				<div className="relative">
					<input
						className="min-h-14 w-full rounded-xl border border-line bg-surface px-4 py-3 pr-14 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
						enterKeyHint="done"
						maxLength={NOTE_MAX_LENGTH}
						onChange={(e) => setNote(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								onClose(note);
							}
						}}
						placeholder="Add a note (optional)"
						value={note}
					/>
					{note.length > NOTE_MAX_LENGTH - 20 && (
						<span className="absolute top-1/2 right-3 -translate-y-1/2 text-[10px] text-muted tabular-nums">
							{NOTE_MAX_LENGTH - note.length}
						</span>
					)}
				</div>

				<button
					className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-line bg-surface font-bold font-display text-muted uppercase tracking-wide transition-colors hover:text-text active:bg-line/40"
					onClick={onAbsent}
					type="button"
				>
					<UserX className="h-4 w-4" />
					Did not train
				</button>
			</div>
		</div>
	);
}
