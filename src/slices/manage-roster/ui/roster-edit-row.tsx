import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
	const nameRef = useRef<HTMLInputElement>(null);
	const numRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		nameRef.current?.focus();
	}, []);

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

	const handleKeyDown = (
		e: React.KeyboardEvent,
		other: React.RefObject<HTMLInputElement | null>
	): void => {
		if (e.key === "Enter") {
			commit();
		}
		if (e.key === "Escape") {
			onCancel();
		}
		if (e.key === "Tab") {
			e.preventDefault();
			other.current?.focus();
		}
	};

	return (
		<div className="flex items-center gap-3 px-4 py-3">
			<input
				className="w-10 shrink-0 bg-transparent text-muted text-sm tabular-nums outline-none placeholder:text-muted/50"
				inputMode="numeric"
				onChange={(e) => setNum(e.target.value)}
				onKeyDown={(e) => handleKeyDown(e, nameRef)}
				placeholder="#"
				ref={numRef}
				value={num}
			/>
			<input
				className="min-w-0 flex-1 bg-transparent font-display font-medium text-lg outline-none placeholder:font-normal placeholder:font-sans placeholder:text-muted/50 placeholder:text-sm"
				onChange={(e) => setName(e.target.value)}
				onKeyDown={(e) => handleKeyDown(e, numRef)}
				placeholder="Player name"
				ref={nameRef}
				value={name}
			/>
			<button
				aria-label="Save"
				className="p-1 text-accent transition-colors hover:text-accent/70"
				onClick={commit}
				type="button"
			>
				<Check className="h-3.5 w-3.5" />
			</button>
			<button
				aria-label="Cancel"
				className="p-1 text-muted transition-colors hover:text-text"
				onClick={onCancel}
				type="button"
			>
				<X className="h-3.5 w-3.5" />
			</button>
		</div>
	);
}
