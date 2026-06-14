import { useNavigate } from "@tanstack/react-router";
import { Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Session } from "@/shared/db/dexie";
import { cn } from "@/shared/lib/cn";
import { fmtDate } from "@/shared/lib/date";
import { rpeTextClass } from "@/shared/lib/rpe";
import type { SessionSummary } from "../model";
import { deleteSession, duplicateSession } from "../mutations";

const BUCKET_LABELS = ["1-2", "3-4", "5-6", "7-8", "9-10"] as const;
const BUCKET_BAR_COLORS = [
	"bg-rpe-light",
	"bg-rpe-moderate",
	"bg-rpe-moderate",
	"bg-rpe-hard",
	"bg-rpe-maximal",
] as const;
const BAR_HEIGHTS = ["h-2", "h-3", "h-4", "h-5", "h-7"] as const;

const barHeight = (count: number, max: number): string => {
	if (count === 0) {
		return "h-1";
	}
	const idx = Math.min(
		Math.ceil((count / max) * (BAR_HEIGHTS.length - 1)),
		BAR_HEIGHTS.length - 1
	);
	return BAR_HEIGHTS[idx];
};

interface SessionCardProps {
	categoryName?: string;
	editing: boolean;
	session: Session;
	summary: SessionSummary;
}

export function SessionCard({
	categoryName,
	editing,
	session,
	summary,
}: SessionCardProps) {
	const navigate = useNavigate();
	const [confirming, setConfirming] = useState(false);
	const { avg, dist, done, total } = summary;
	const incomplete = done < total;
	const maxCount = Math.max(...dist, 1);

	// завершённую сессию открывают ради цифр — сразу в результаты
	const openSession = (): void => {
		if (incomplete || total === 0) {
			navigate({ to: "/sessions/$id/survey", params: { id: session.id } });
		} else {
			navigate({ to: "/sessions/$id/results", params: { id: session.id } });
		}
	};

	return (
		<div className="flex overflow-hidden rounded-xl border border-line bg-surface">
			<button
				className={cn(
					"flex min-w-0 flex-1 flex-col gap-2.5 px-4 py-3 text-left transition-colors",
					!editing && "hover:bg-line/30 active:bg-line/50"
				)}
				disabled={editing}
				onClick={openSession}
				type="button"
			>
				<div className="flex items-start justify-between gap-3">
					<div className="flex min-w-0 flex-col gap-0.5">
						<span className="text-[10px] text-muted uppercase tracking-widest">
							{fmtDate(session.date)}
							{categoryName && (
								<span className="text-accent"> · {categoryName}</span>
							)}
						</span>
						<span className="truncate font-display font-semibold text-xl leading-tight">
							{session.name}
						</span>
					</div>
					<span
						className={cn(
							"shrink-0 rounded-full border px-2.5 py-1 font-semibold text-xs tabular-nums",
							incomplete
								? "border-line text-muted"
								: "border-accent/30 bg-accent/10 text-accent"
						)}
					>
						{done}/{total}
					</span>
				</div>

				<div className="flex items-end justify-between gap-4">
					<div className="flex flex-col">
						<span
							className={cn(
								"font-bold font-display text-3xl tabular-nums leading-none",
								done > 0 && rpeTextClass(Math.round(avg))
							)}
						>
							{done > 0 ? avg.toFixed(1) : "—"}
						</span>
						<span className="text-[10px] text-muted uppercase tracking-widest">
							Avg RPE
						</span>
					</div>
					<div
						aria-label="RPE distribution"
						className="flex items-end gap-1"
						role="img"
					>
						{dist.map((count, i) => (
							<span
								className={cn(
									"w-2 rounded-xs",
									BUCKET_BAR_COLORS[i],
									barHeight(count, maxCount),
									count === 0 && "opacity-20"
								)}
								key={BUCKET_LABELS[i]}
								title={`RPE ${BUCKET_LABELS[i]}: ${count}`}
							/>
						))}
					</div>
				</div>
			</button>

			{editing && (
				<div className="flex shrink-0 items-center gap-1 border-line border-l px-2">
					{confirming ? (
						<>
							<button
								className="rounded-md px-2 py-1.5 font-medium text-red-500 text-xs uppercase tracking-widest hover:bg-red-500/10"
								onClick={() => deleteSession(session.id)}
								type="button"
							>
								Yes
							</button>
							<button
								className="rounded-md px-2 py-1.5 font-medium text-muted text-xs uppercase tracking-widest hover:bg-line/40"
								onClick={() => setConfirming(false)}
								type="button"
							>
								No
							</button>
						</>
					) : (
						<>
							<button
								aria-label={`Duplicate ${session.name}`}
								className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-line/40 hover:text-text"
								onClick={() => duplicateSession(session.id)}
								type="button"
							>
								<Copy className="h-4 w-4" />
							</button>
							<button
								aria-label={`Delete ${session.name}`}
								className="flex h-9 w-9 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-500/10"
								onClick={() => setConfirming(true)}
								type="button"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</>
					)}
				</div>
			)}
		</div>
	);
}
