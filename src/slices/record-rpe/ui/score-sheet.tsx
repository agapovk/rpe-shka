import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Player } from "@/shared/db/dexie";
import { cn } from "@/shared/lib/cn";
import { NOTE_MAX_LENGTH, rpeTextClass } from "../model";
import { RpeScale } from "./rpe-scale";

const BUCKET_LEGEND = [
	{ label: "Light", sample: 2 },
	{ label: "Moderate", sample: 5 },
	{ label: "Hard", sample: 8 },
	{ label: "Max", sample: 10 },
] as const;

interface ScoreSheetProps {
	initialNote: string;
	initialScore: number | null;
	onClear: () => void;
	onClose: () => void;
	onSave: (score: number, note: string) => void;
	player: Player;
}

export function ScoreSheet({
	initialNote,
	initialScore,
	onClear,
	onClose,
	onSave,
	player,
}: ScoreSheetProps) {
	const [score, setScore] = useState<number | null>(initialScore);
	const [note, setNote] = useState(initialNote);

	useEffect(() => {
		const onKey = (e: KeyboardEvent): void => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);

	const handleSave = (): void => {
		if (score === null) {
			return;
		}
		onSave(score, note);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center">
			<button
				aria-label="Close"
				className="absolute inset-0 bg-black/55 backdrop-blur-xs"
				onClick={onClose}
				type="button"
			/>
			<div
				aria-modal="true"
				className="relative flex max-h-[92dvh] w-full max-w-xl flex-col gap-4 overflow-y-auto rounded-t-3xl border-line border-t bg-bg px-5 pt-3 pb-6"
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
					</div>
					<button
						aria-label="Close"
						className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-muted transition-colors hover:text-text"
						onClick={onClose}
						type="button"
					>
						<X className="h-5 w-5" />
					</button>
				</div>

				<RpeScale onSelect={setScore} value={score} />

				<div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest">
					{BUCKET_LEGEND.map(({ label, sample }) => (
						<span className={rpeTextClass(sample)} key={label}>
							● {label}
						</span>
					))}
				</div>

				<input
					className="min-h-12 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
					maxLength={NOTE_MAX_LENGTH}
					onChange={(e) => setNote(e.target.value)}
					placeholder="Add a note (optional) — e.g. tight hamstring"
					value={note}
				/>

				<div className="flex gap-3">
					<button
						className="min-h-12 rounded-xl px-5 font-bold font-display text-red-500 uppercase tracking-wide transition-colors hover:bg-red-500/10 disabled:opacity-30"
						disabled={initialScore === null}
						onClick={onClear}
						type="button"
					>
						Clear
					</button>
					<button
						className={cn(
							"min-h-12 flex-1 rounded-xl bg-accent font-bold font-display text-bg uppercase tracking-wide transition",
							"hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-30"
						)}
						disabled={score === null}
						onClick={handleSave}
						type="button"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}
