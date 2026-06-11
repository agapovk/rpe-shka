import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import type { Player } from "@/shared/db/dexie";
import { cn } from "@/shared/lib/cn";
import type { ScoreFilter } from "../model";
import {
	clearScore,
	setScore,
	setSessionCategory,
	toggleSessionPlayer,
	updateSessionName,
} from "../mutations";
import {
	useAllPlayers,
	useCategories,
	useSession,
	useSessionEntries,
} from "../queries";
import { RosterScoreRow } from "./roster-score-row";
import { ScoreSheet } from "./score-sheet";
import { SessionRosterRow } from "./session-roster-row";

const FILTERS: readonly ScoreFilter[] = ["all", "pending", "done"];

const EMPTY_MESSAGES: Record<ScoreFilter, string> = {
	all: "No players in this session",
	done: "Nobody scored yet",
	pending: "All players scored 🎯",
};

interface CaptureScreenProps {
	sessionId: string;
}

export function CaptureScreen({ sessionId }: CaptureScreenProps) {
	const navigate = useNavigate();
	const session = useSession(sessionId);
	const entries = useSessionEntries(sessionId);
	const players = useAllPlayers();
	const categories = useCategories();
	const [filter, setFilter] = useState<ScoreFilter>("all");
	const [editingRoster, setEditingRoster] = useState(false);
	const [openPlayerId, setOpenPlayerId] = useState<number | null>(null);

	if (!(entries && players)) {
		return null;
	}

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

	const roster = players.filter((p) => session.rosterIds.includes(p.id));
	const scoreByPlayer = new Map(entries.map((e) => [e.playerId, e]));
	const done = roster.filter((p) => scoreByPlayer.has(p.id)).length;
	const total = roster.length;
	const allScored = done === total && total > 0;

	const filtered: Player[] = roster.filter((p) => {
		if (filter === "done") {
			return scoreByPlayer.has(p.id);
		}
		if (filter === "pending") {
			return !scoreByPlayer.has(p.id);
		}
		return true;
	});

	const filterCounts: Record<ScoreFilter, number> = {
		all: total,
		done,
		pending: total - done,
	};

	const openPlayer = openPlayerId
		? (players.find((p) => p.id === openPlayerId) ?? null)
		: null;
	const openEntry = openPlayerId ? scoreByPlayer.get(openPlayerId) : undefined;

	const handlePick = (score: number, note: string): void => {
		if (openPlayerId === null) {
			return;
		}
		if (openEntry?.score === score) {
			clearScore(sessionId, openPlayerId);
		} else {
			setScore(sessionId, openPlayerId, score, note);
		}
		setOpenPlayerId(null);
	};

	const handleClose = (note: string): void => {
		// без кнопки Save заметка коммитится при закрытии шита
		if (openEntry && note.trim() !== (openEntry.note ?? "")) {
			setScore(sessionId, openEntry.playerId, openEntry.score, note);
		}
		setOpenPlayerId(null);
	};

	const handleAbsent = (): void => {
		if (openPlayerId !== null) {
			toggleSessionPlayer(sessionId, openPlayerId);
		}
		setOpenPlayerId(null);
	};

	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-5 px-4 py-6">
			<header className="flex flex-col gap-2">
				<p className="flex items-center gap-2 text-[10px] text-muted uppercase tracking-widest">
					<span className="h-2 w-2 rounded-full bg-accent" />
					Session · {allScored ? "Ready" : "In progress"}
				</p>
				<input
					className="w-full border-transparent border-b bg-transparent py-0.5 font-bold font-display text-3xl uppercase leading-none tracking-tight outline-none transition-colors hover:border-line focus:border-accent"
					defaultValue={session.name}
					onBlur={(e) => {
						const trimmed = e.target.value.trim();
						if (trimmed) {
							updateSessionName(sessionId, trimmed);
						} else {
							e.target.value = session.name;
						}
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.currentTarget.blur();
						}
					}}
				/>
				{categories && categories.length > 0 && (
					<div className="flex flex-wrap gap-1.5 pt-1">
						{categories.map((cat) => {
							const selected = session.categoryId === cat.id;
							return (
								<button
									aria-pressed={selected}
									className={cn(
										"rounded-full border px-2.5 py-1 font-medium text-[10px] uppercase tracking-wider transition-colors",
										selected
											? "border-accent/30 bg-accent/10 text-accent"
											: "border-line text-muted hover:text-text"
									)}
									key={cat.id}
									onClick={() =>
										setSessionCategory(sessionId, selected ? undefined : cat.id)
									}
									type="button"
								>
									{cat.name}
								</button>
							);
						})}
					</div>
				)}
			</header>

			<section className="flex flex-col gap-3 border-line border-y py-4">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-baseline gap-1.5 font-display">
						<span
							className={cn(
								"font-bold text-3xl tabular-nums leading-none",
								allScored && "text-accent"
							)}
						>
							{done}
						</span>
						<span className="font-medium text-lg text-muted">/ {total}</span>
						<span className="ml-1 font-sans text-[10px] text-muted uppercase tracking-widest">
							Scored
						</span>
					</div>
					<div className="flex gap-0.5 rounded-lg border border-line bg-surface p-0.5">
						{FILTERS.map((f) => (
							<button
								className={cn(
									"rounded-md px-2.5 py-1.5 font-medium text-[10px] uppercase tracking-wider transition-colors",
									filter === f
										? "bg-line/50 text-text"
										: "text-muted hover:text-text"
								)}
								key={f}
								onClick={() => setFilter(f)}
								type="button"
							>
								{f} · {filterCounts[f]}
							</button>
						))}
					</div>
				</div>
				{total > 0 && (
					<div
						aria-label={`${done} of ${total} players scored`}
						className="flex gap-0.5"
						role="img"
					>
						{roster.map((p) => (
							<span
								className={cn(
									"h-1.5 flex-1 rounded-full",
									scoreByPlayer.has(p.id) ? "bg-accent" : "bg-line"
								)}
								key={p.id}
							/>
						))}
					</div>
				)}
			</section>

			<section className="flex flex-col gap-3 pb-4">
				<div className="flex items-center justify-between">
					<h2 className="font-medium text-muted text-xs uppercase tracking-widest">
						{editingRoster ? "Select players" : "Tap a player to score"}
					</h2>
					<button
						className="py-1 font-medium text-accent text-xs uppercase tracking-widest underline-offset-4 hover:underline"
						onClick={() => setEditingRoster(!editingRoster)}
						type="button"
					>
						{editingRoster ? "Done editing" : "Edit roster"}
					</button>
				</div>

				<div className="flex flex-col divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
					{editingRoster
						? players.map((p) => (
								<SessionRosterRow
									inSession={session.rosterIds.includes(p.id)}
									key={p.id}
									onToggle={(id) => toggleSessionPlayer(sessionId, id)}
									player={p}
									score={scoreByPlayer.get(p.id)?.score}
								/>
							))
						: filtered.map((p) => (
								<RosterScoreRow
									key={p.id}
									note={scoreByPlayer.get(p.id)?.note}
									onOpen={setOpenPlayerId}
									player={p}
									score={scoreByPlayer.get(p.id)?.score}
								/>
							))}
					{!editingRoster && filtered.length === 0 && (
						<p className="px-6 py-10 text-center text-muted text-sm">
							{EMPTY_MESSAGES[filter]}
						</p>
					)}
				</div>
			</section>

			<div className="sticky bottom-0 mt-auto flex gap-3 bg-bg pt-2 pb-2">
				<Link
					aria-label="Back to home"
					className="flex min-h-14 items-center justify-center rounded-xl bg-surface px-5 transition-colors hover:bg-line/40"
					to="/"
				>
					<ArrowLeft className="h-4 w-4" />
				</Link>
				<button
					className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 font-bold font-display text-bg text-lg uppercase tracking-wide transition hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-30"
					disabled={done === 0}
					onClick={() =>
						navigate({ to: "/sessions/$id/results", params: { id: sessionId } })
					}
					type="button"
				>
					{allScored ? "View results" : "Finish & view results"}
					<ArrowRight className="h-4 w-4" />
				</button>
			</div>

			{openPlayer && (
				<ScoreSheet
					initialNote={openEntry?.note ?? ""}
					initialScore={openEntry?.score ?? null}
					key={openPlayer.id}
					onAbsent={handleAbsent}
					onClose={handleClose}
					onPick={handlePick}
					player={openPlayer}
				/>
			)}
		</main>
	);
}
