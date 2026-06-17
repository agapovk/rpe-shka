import { cn } from "@/shared/lib/cn";
import { RPE_VALUES, rpeBgClass, rpeTextClass } from "@/shared/lib/rpe";

interface RpeScaleProps {
	onSelect: (n: number) => void;
	value: number | null;
}

export function RpeScale({ onSelect, value }: RpeScaleProps) {
	return (
		<div className="grid flex-1 grid-cols-3 grid-rows-4 gap-2">
			{RPE_VALUES.map((n) => (
				<button
					aria-pressed={value === n}
					className={cn(
						"flex min-h-12 items-center justify-center rounded-xl border font-bold font-display text-2xl tabular-nums transition active:scale-95",
						n === 10 && "col-start-2",
						value === n
							? cn("border-transparent text-bg", rpeBgClass(n))
							: cn("border-line bg-surface hover:border-muted", rpeTextClass(n))
					)}
					key={n}
					onClick={() => onSelect(n)}
					type="button"
				>
					{n}
				</button>
			))}
		</div>
	);
}
