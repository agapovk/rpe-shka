import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/shared/db/dexie";

const BYTES_PER_MB = 1024 * 1024;

const fmtMb = (bytes: number): string =>
	`${(bytes / BYTES_PER_MB).toFixed(1)} MB`;

export function StorageSection() {
	const [usage, setUsage] = useState<number | null>(null);
	const [persisted, setPersisted] = useState<boolean | null>(null);
	const [confirming, setConfirming] = useState(false);

	useEffect(() => {
		navigator.storage
			?.estimate?.()
			.then((estimate) => setUsage(estimate.usage ?? null));
		navigator.storage?.persisted?.().then(setPersisted);
	}, []);

	const handleClear = async (): Promise<void> => {
		await db.delete();
		// перезагрузка пересоздаёт БД и сеет дефолты через populate
		window.location.assign("/");
	};

	return (
		<section className="flex flex-col gap-3">
			<h2 className="font-medium text-muted text-xs uppercase tracking-widest">
				Storage
			</h2>
			<div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-4">
				<div className="flex flex-col gap-0.5">
					<span className="text-sm">All sessions & roster</span>
					<span className="text-muted text-xs">
						{usage === null ? "—" : `${fmtMb(usage)} used`}
						{persisted !== null &&
							` · ${persisted ? "persistent" : "best-effort"}`}
					</span>
				</div>
				{confirming ? (
					<div className="flex items-center gap-2">
						<button
							className="rounded-lg bg-red-500/10 px-3 py-1.5 font-medium text-red-500 text-xs uppercase tracking-widest transition-colors hover:bg-red-500/20"
							onClick={handleClear}
							type="button"
						>
							Yes, clear
						</button>
						<button
							className="rounded-lg px-3 py-1.5 font-medium text-muted text-xs uppercase tracking-widest transition-colors hover:bg-line/40"
							onClick={() => setConfirming(false)}
							type="button"
						>
							Cancel
						</button>
					</div>
				) : (
					<button
						className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 font-medium text-red-500 text-xs uppercase tracking-widest transition-colors hover:bg-red-500/20"
						onClick={() => setConfirming(true)}
						type="button"
					>
						<Trash2 className="h-3.5 w-3.5" />
						Clear all
					</button>
				)}
			</div>
		</section>
	);
}
