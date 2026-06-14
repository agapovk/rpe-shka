import { Download, Upload } from "lucide-react";
import { useState } from "react";
import { parseRoster, serializeRoster } from "../model";
import { exportRoster, importRoster } from "../mutations";

const PLACEHOLDER = "Alex Dominguez, 9\nLeo Silva, 23\n…or paste roster.json";

export function RosterIo() {
	const [open, setOpen] = useState(false);
	const [text, setText] = useState("");
	const [status, setStatus] = useState<string | null>(null);

	const handleExport = async (): Promise<void> => {
		const json = serializeRoster(await exportRoster());
		const url = URL.createObjectURL(
			new Blob([json], { type: "application/json" })
		);
		const a = document.createElement("a");
		a.href = url;
		a.download = "roster.json";
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleFile = async (file: File): Promise<void> => {
		setText(await file.text());
	};

	const handleImport = async (): Promise<void> => {
		const { players, errors } = parseRoster(text);
		if (players.length === 0) {
			setStatus(errors[0] ?? "Nothing to import");
			return;
		}
		const { added, skipped } = await importRoster(players);
		setStatus(
			`Added ${added}${skipped ? `, skipped ${skipped} (number taken)` : ""}`
		);
		setText("");
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-4">
				<button
					className="flex items-center gap-1 py-1 font-medium text-muted text-xs uppercase tracking-widest underline-offset-4 transition-colors hover:text-text hover:underline"
					onClick={() => {
						setOpen((v) => !v);
						setStatus(null);
					}}
					type="button"
				>
					<Upload className="h-3 w-3" />
					Import
				</button>
				<button
					className="flex items-center gap-1 py-1 font-medium text-muted text-xs uppercase tracking-widest underline-offset-4 transition-colors hover:text-text hover:underline"
					onClick={handleExport}
					type="button"
				>
					<Download className="h-3 w-3" />
					Export
				</button>
			</div>

			{open && (
				<div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-3">
					<textarea
						className="min-h-24 resize-y rounded-lg border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
						onChange={(e) => setText(e.target.value)}
						placeholder={PLACEHOLDER}
						value={text}
					/>
					<div className="flex items-center justify-between gap-3">
						<label className="cursor-pointer py-1 font-medium text-accent text-xs uppercase tracking-widest underline-offset-4 hover:underline">
							Choose file
							<input
								accept=".json,.csv,.txt"
								className="hidden"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) {
										handleFile(file);
									}
								}}
								type="file"
							/>
						</label>
						<button
							className="rounded-lg bg-accent/10 px-3 py-1.5 font-medium text-accent text-xs uppercase tracking-widest transition-colors hover:bg-accent/20 disabled:opacity-40"
							disabled={!text.trim()}
							onClick={handleImport}
							type="button"
						>
							Import
						</button>
					</div>
					{status && <p className="text-muted text-xs">{status}</p>}
				</div>
			)}
		</div>
	);
}
