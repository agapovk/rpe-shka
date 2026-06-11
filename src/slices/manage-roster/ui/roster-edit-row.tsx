import { Check, X } from "lucide-react";
import { useState } from "react";

const NUM_MIN = 1;
const NUM_MAX = 99;

interface RosterEditRowProps {
	initialName?: string;
	initialNum?: string;
	onCancel: () => void;
	onSubmit: (name: string, num: number) => void;
	takenNums: number[];
}

export function RosterEditRow({
	initialName = "",
	initialNum = "",
	onCancel,
	onSubmit,
	takenNums,
}: RosterEditRowProps) {
	const [name, setName] = useState(initialName);
	const [num, setNum] = useState(initialNum);

	const commit = (): void => {
		const trimmed = name.trim();
		const parsed = Number.parseInt(num, 10);
		const numValid =
			!Number.isNaN(parsed) &&
			parsed >= NUM_MIN &&
			parsed <= NUM_MAX &&
			!takenNums.includes(parsed);
		if (!(trimmed && numValid)) {
			return;
		}
		onSubmit(trimmed, parsed);
	};

	const handleKeyDown = (e: React.KeyboardEvent): void => {
		if (e.key === "Enter") {
			commit();
		}
		if (e.key === "Escape") {
			onCancel();
		}
	};

	return (
		<div className="flex items-center gap-3 px-4 py-3">
			<input
				className="w-10 shrink-0 bg-transparent text-muted text-sm tabular-nums outline-none placeholder:text-muted/50"
				inputMode="numeric"
				onChange={(e) => setNum(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="#"
				value={num}
			/>
			<input
				className="min-w-0 flex-1 bg-transparent font-display font-medium text-lg outline-none placeholder:font-normal placeholder:font-sans placeholder:text-muted/50 placeholder:text-sm"
				onChange={(e) => setName(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Player name"
				value={name}
			/>
			<button
				aria-label="Save"
				className="text-accent"
				onClick={commit}
				type="button"
			>
				<Check className="h-4 w-4" />
			</button>
			<button
				aria-label="Cancel"
				className="text-muted"
				onClick={onCancel}
				type="button"
			>
				<X className="h-4 w-4" />
			</button>
		</div>
	);
}
