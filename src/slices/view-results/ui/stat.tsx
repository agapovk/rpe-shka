import { cn } from "@/shared/lib/cn";

interface StatProps {
	colorClass?: string;
	label: string;
	value: number | string;
}

export function Stat({ colorClass, label, value }: StatProps) {
	return (
		<div className="flex flex-col gap-1 rounded-2xl border border-line bg-surface px-3 py-2.5">
			<span className="text-[10px] text-muted uppercase tracking-widest">
				{label}
			</span>
			<span
				className={cn(
					"font-bold font-display text-3xl tabular-nums leading-none",
					colorClass
				)}
			>
				{value}
			</span>
		</div>
	);
}
