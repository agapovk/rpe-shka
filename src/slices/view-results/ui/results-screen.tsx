import { Link } from "@tanstack/react-router";
import {
	ArrowDownWideNarrow,
	ArrowLeft,
	ArrowUpNarrowWide,
	Download,
	Home,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import {
	RPE_VALUES,
	rpeBgClass,
	rpeBucket,
	rpeTextClass,
} from "@/shared/lib/rpe";
import { calcSessionStats, isFlagged, joinRecorded } from "../model";
import { exportXlsx } from "../mutations";
import { useSessionWithEntries } from "../queries";
import { Stat } from "./stat";

interface ResultsScreenProps {
	sessionId: string;
}

export function ResultsScreen({ sessionId }: ResultsScreenProps) {
	const data = useSessionWithEntries(sessionId);
	const [sortDesc, setSortDesc] = useState(true);

	if (!data) {
		return null;
	}

	const { session, entries, players } = data;

	if (!session) {
		return (
			<main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center gap-4 px-4">
				<p className="text-muted text-sm">Session not found</p>
				<Link
					className="text-accent text-sm underline underline-offset-4"
					to="/"
				>
					Back to home
				</Link>
			</main>
		);
	}

	const recorded = joinRecorded(players, entries);
	const stats = calcSessionStats(recorded);
	const sorted = [...recorded].sort((a, b) =>
		sortDesc ? b.score - a.score : a.score - b.score
	);

	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-5 px-4 py-6">
			<header className="flex flex-col gap-2">
				<p className="flex items-center gap-2 text-[10px] text-muted uppercase tracking-widest">
					<span className="h-2 w-2 rounded-full bg-accent" />
					Results
				</p>
				<h1 className="font-bold font-display text-3xl uppercase leading-none tracking-tight">
					{session.name}
				</h1>
			</header>

			<section className="grid grid-cols-[1.2fr_1fr] gap-3">
				<div className="flex min-h-28 flex-col justify-between gap-1.5 rounded-2xl border border-line bg-surface px-4 py-4">
					<span className="text-[10px] text-muted uppercase tracking-widest">
						Avg RPE
					</span>
					<span className="font-bold font-display text-5xl text-accent tabular-nums leading-none">
						{recorded.length > 0 ? stats.avg.toFixed(1) : "—"}
					</span>
					<span className="text-[10px] text-muted uppercase tracking-widest">
						{recorded.length > 0 ? rpeBucket(Math.round(stats.avg)) : "no data"}
					</span>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<Stat
						colorClass={
							recorded.length > 0 ? rpeTextClass(stats.hi) : undefined
						}
						label="High"
						value={recorded.length > 0 ? stats.hi : "—"}
					/>
					<Stat
						colorClass={
							recorded.length > 0 ? rpeTextClass(stats.lo) : undefined
						}
						label="Low"
						value={recorded.length > 0 ? stats.lo : "—"}
					/>
					<Stat label="Players" value={recorded.length} />
					<Stat
						colorClass={stats.hard > 0 ? "text-rpe-hard" : undefined}
						label="≥ 8 RPE"
						value={stats.hard}
					/>
				</div>
			</section>

			<section className="flex flex-col gap-3 pb-4">
				<div className="flex items-center justify-between">
					<h2 className="font-medium text-muted text-xs uppercase tracking-widest">
						Individual load
					</h2>
					<button
						className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-muted text-xs uppercase tracking-wider transition-colors hover:text-text"
						onClick={() => setSortDesc(!sortDesc)}
						type="button"
					>
						{sortDesc ? (
							<ArrowDownWideNarrow className="h-4 w-4" />
						) : (
							<ArrowUpNarrowWide className="h-4 w-4" />
						)}
						RPE
					</button>
				</div>

				<div className="flex flex-col divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
					{sorted.map((p) => (
						<div
							className="grid grid-cols-[32px_minmax(0,1.4fr)_minmax(60px,2fr)_32px] items-center gap-2 px-3 py-3"
							key={p.id}
						>
							<span className="text-muted text-xs tabular-nums">
								{isFlagged(p.score) && (
									<span className="mr-0.5 font-bold text-accent">!</span>
								)}
								{String(p.num).padStart(2, "0")}
							</span>
							<span className="truncate font-display font-medium text-base">
								{p.name}
								{p.note && (
									<span
										className="ml-1.5 font-normal font-sans text-muted text-xs"
										title={p.note}
									>
										· {p.note}
									</span>
								)}
							</span>
							<div
								aria-label={`RPE ${p.score} of 10`}
								className="flex gap-0.5"
								role="img"
							>
								{RPE_VALUES.map((seg) => (
									<span
										className={cn(
											"h-2 flex-1 rounded-full",
											seg <= p.score ? rpeBgClass(p.score) : "bg-line"
										)}
										key={seg}
									/>
								))}
							</div>
							<span
								className={cn(
									"text-right font-bold font-display text-xl tabular-nums leading-none",
									rpeTextClass(p.score)
								)}
							>
								{p.score}
							</span>
						</div>
					))}
					{sorted.length === 0 && (
						<p className="px-6 py-10 text-center text-muted text-sm">
							Nobody scored yet
						</p>
					)}
				</div>
			</section>

			<div className="sticky bottom-0 mt-auto flex gap-3 bg-bg pt-2 pb-2">
				<Link
					aria-label="Back to survey"
					className="flex min-h-14 items-center justify-center rounded-xl bg-surface px-5 transition-colors hover:bg-line/40"
					params={{ id: sessionId }}
					to="/sessions/$id/survey"
				>
					<ArrowLeft className="h-4 w-4" />
				</Link>
				<button
					className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-surface px-5 font-bold font-display uppercase tracking-wide transition-colors hover:bg-line/40 disabled:opacity-30"
					disabled={recorded.length === 0}
					onClick={() => exportXlsx(session.name, recorded)}
					type="button"
				>
					<Download className="h-4 w-4" />
					XLSX
				</button>
				<Link
					className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 font-bold font-display text-bg text-lg uppercase tracking-wide transition hover:brightness-110 active:translate-y-px"
					to="/"
				>
					<Home className="h-4 w-4" />
					Home
				</Link>
			</div>
		</main>
	);
}
