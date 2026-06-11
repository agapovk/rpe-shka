import { cn } from "@/shared/lib/cn";
import { type HomeStats, rpeTextClass } from "../model";

interface StatStripProps {
	stats: HomeStats;
}

export function StatStrip({ stats }: StatStripProps) {
	const { sessionsLast30d, sevenDayAvg } = stats;

	return (
		<div className="grid grid-cols-2 items-center border-line border-y px-1 py-4">
			<div className="flex flex-col gap-1 px-3">
				<span className="font-bold font-display text-3xl tabular-nums leading-none">
					{sessionsLast30d}
				</span>
				<span className="text-[10px] text-muted uppercase tracking-widest">
					Sessions 30d
				</span>
			</div>
			<div className="flex flex-col items-end gap-1 px-3">
				<span
					className={cn(
						"font-bold font-display text-3xl tabular-nums leading-none",
						sevenDayAvg > 0 && rpeTextClass(Math.round(sevenDayAvg))
					)}
				>
					{sevenDayAvg > 0 ? sevenDayAvg.toFixed(1) : "—"}
				</span>
				<span className="text-[10px] text-muted uppercase tracking-widest">
					7-day avg
				</span>
			</div>
		</div>
	);
}
