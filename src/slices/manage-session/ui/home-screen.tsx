import { Link } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/shared/ui/logo";
import { calcHomeStats, calcSessionSummary } from "../model";
import { useAllEntries, useCategories, useSessions } from "../queries";
import { NewSessionButton } from "./new-session-button";
import { SessionCard } from "./session-card";
import { StatStrip } from "./stat-strip";

export function HomeScreen() {
	const sessions = useSessions();
	const entries = useAllEntries();
	const categories = useCategories();
	const [editing, setEditing] = useState(false);

	if (!(sessions && entries && categories)) {
		return null;
	}

	const stats = calcHomeStats(sessions, entries);
	const categoryNames = new Map(categories.map((c) => [c.id, c.name]));

	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-4 pt-5">
			<header className="flex items-center justify-between pb-4">
				<div className="flex h-8 items-center gap-2">
					<Logo className="h-8 w-8" />
					<span className="font-bold font-display text-3xl leading-none tracking-tight">
						RPE
					</span>
				</div>
				<Link
					aria-label="Settings"
					className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text active:bg-line/40"
					to="/settings"
				>
					<Settings2 className="h-4 w-4" />
				</Link>
			</header>

			<StatStrip stats={stats} />

			<div className="mt-5 flex flex-col gap-2.5 pb-4">
				<div className="flex items-baseline justify-between">
					<h2 className="font-medium text-muted text-xs uppercase tracking-widest">
						Recent sessions
					</h2>
					{sessions.length > 0 && (
						<button
							className="py-1 font-medium text-accent text-xs uppercase tracking-widest underline-offset-4 hover:underline"
							onClick={() => setEditing(!editing)}
							type="button"
						>
							{editing ? "Done" : "Edit"}
						</button>
					)}
				</div>

				{sessions.length === 0 ? (
					<p className="py-16 text-center text-muted text-sm">
						No sessions yet
					</p>
				) : (
					<div className="flex flex-col gap-2">
						{sessions.map((session) => (
							<SessionCard
								categoryName={
									session.categoryId
										? categoryNames.get(session.categoryId)
										: undefined
								}
								editing={editing}
								key={session.id}
								session={session}
								summary={calcSessionSummary(session, entries)}
							/>
						))}
					</div>
				)}
			</div>

			<div className="sticky bottom-0 mt-auto bg-bg pt-2 pb-5">
				<NewSessionButton />
			</div>
		</main>
	);
}
