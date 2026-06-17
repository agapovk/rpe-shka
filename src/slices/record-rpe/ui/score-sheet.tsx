import { Check, UserX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Player } from "@/shared/db/dexie";
import { cn } from "@/shared/lib/cn";
import { rpeBgClass } from "@/shared/lib/rpe";
import { NOTE_MAX_LENGTH } from "../model";
import { RpeScale } from "./rpe-scale";

const CONFIRM_DELAY_MS = 750;

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
	const [confirming, setConfirming] = useState<number | null>(null);
	const timerRef = useRef<number | null>(null);

	useEffect(
		() => () => {
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
			}
		},
		[]
	);

	const handleSelect = (n: number): void => {
		if (confirming !== null) {
			return;
		}
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;
		if (prefersReduced) {
			onPick(n, note);
			return;
		}
		setConfirming(n);
		timerRef.current = window.setTimeout(
			() => onPick(n, note),
			CONFIRM_DELAY_MS
		);
	};

	const confirmCleared = confirming !== null && confirming === initialScore;

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
				className="relative flex h-[92dvh] w-full max-w-xl animate-sheet-up flex-col gap-4 overflow-y-auto rounded-t-3xl bg-bg px-5 pt-3 pb-6"
				role="dialog"
			>
				{confirming !== null && (
					<div
						className={cn(
							"absolute inset-0 z-10 flex animate-confirm-pop flex-col items-center justify-center gap-3 rounded-t-3xl",
							confirmCleared
								? "bg-surface text-muted"
								: cn("text-bg", rpeBgClass(confirming))
						)}
					>
						{confirmCleared ? (
							<X className="h-10 w-10" />
						) : (
							<Check className="h-10 w-10" strokeWidth={3} />
						)}
						<span
							className={cn(
								"font-bold font-display text-9xl tabular-nums leading-none",
								confirmCleared && "line-through"
							)}
						>
							{confirming}
						</span>
						<span className="text-xs uppercase tracking-widest">
							{confirmCleared ? "Cleared" : "Saved"}
						</span>
					</div>
				)}

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

				<RpeScale onSelect={handleSelect} value={initialScore} />

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
