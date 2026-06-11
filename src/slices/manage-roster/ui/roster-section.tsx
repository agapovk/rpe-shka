import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Player } from "@/shared/db/dexie";
import { addPlayer, removePlayer, updatePlayer } from "../mutations";
import { usePlayers } from "../queries";
import { RosterEditRow } from "./roster-edit-row";

export function RosterSection() {
	const players = usePlayers();
	const [editingId, setEditingId] = useState<number | null>(null);
	const [confirmingId, setConfirmingId] = useState<number | null>(null);
	const [adding, setAdding] = useState(false);

	if (!players) {
		return null;
	}

	const handleUpdate = (player: Player, name: string, num: number): void => {
		updatePlayer(player.id, { name, num });
		setEditingId(null);
	};

	const handleAdd = (name: string, num: number): void => {
		addPlayer(name, num);
		setAdding(false);
	};

	return (
		<section className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h2 className="font-medium text-muted text-xs uppercase tracking-widest">
					Roster · {players.length}
				</h2>
				<button
					className="flex items-center gap-1 py-1 font-medium text-accent text-xs uppercase tracking-widest underline-offset-4 hover:underline"
					onClick={() => setAdding(true)}
					type="button"
				>
					<Plus className="h-3 w-3" />
					Add player
				</button>
			</div>

			<div className="flex flex-col divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
				{players.map((player) =>
					editingId === player.id ? (
						<RosterEditRow
							initialName={player.name}
							initialNum={String(player.num)}
							key={player.id}
							onCancel={() => setEditingId(null)}
							onSubmit={(name, num) => handleUpdate(player, name, num)}
							takenNums={players
								.filter((p) => p.id !== player.id)
								.map((p) => p.num)}
						/>
					) : (
						<div className="flex items-center gap-3 px-4 py-3" key={player.id}>
							<span className="w-10 shrink-0 text-muted text-sm tabular-nums">
								#{player.num}
							</span>
							<span className="flex-1 truncate text-sm uppercase">
								{player.name}
							</span>
							{confirmingId === player.id ? (
								<>
									<button
										className="rounded-md px-2 py-1 font-medium text-red-500 text-xs uppercase tracking-widest hover:bg-red-500/10"
										onClick={() => removePlayer(player.id)}
										type="button"
									>
										Yes
									</button>
									<button
										className="rounded-md px-2 py-1 font-medium text-muted text-xs uppercase tracking-widest hover:bg-line/40"
										onClick={() => setConfirmingId(null)}
										type="button"
									>
										No
									</button>
								</>
							) : (
								<>
									<button
										aria-label={`Edit ${player.name}`}
										className="p-1 text-muted transition-colors hover:text-text"
										onClick={() => setEditingId(player.id)}
										type="button"
									>
										<Pencil className="h-3.5 w-3.5" />
									</button>
									<button
										aria-label={`Remove ${player.name}`}
										className="p-1 text-muted transition-colors hover:text-red-500"
										onClick={() => setConfirmingId(player.id)}
										type="button"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</>
							)}
						</div>
					)
				)}

				{adding && (
					<RosterEditRow
						onCancel={() => setAdding(false)}
						onSubmit={handleAdd}
						takenNums={players.map((p) => p.num)}
					/>
				)}

				{players.length === 0 && !adding && (
					<p className="px-4 py-8 text-center text-muted text-sm">
						Roster is empty
					</p>
				)}
			</div>
		</section>
	);
}
