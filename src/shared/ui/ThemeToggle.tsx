import { Moon, Sun, SunMoon } from "lucide-react";
import { type Theme, useTheme } from "#/shared/context/theme";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
	{ value: "light", icon: Sun, label: "Светлая" },
	{ value: "system", icon: SunMoon, label: "Системная" },
	{ value: "dark", icon: Moon, label: "Тёмная" },
];

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex gap-1 rounded-lg bg-[var(--bg-2)] p-1">
			{OPTIONS.map(({ value, icon: Icon, label }) => (
				<button
					key={value}
					type="button"
					aria-label={label}
					aria-pressed={theme === value}
					onClick={() => setTheme(value)}
					className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-all ${
						theme === value
							? "bg-[var(--bg)] text-[var(--tx)] shadow-sm"
							: "text-[var(--tx-2)] hover:text-[var(--tx)]"
					}`}
				>
					<Icon size={14} />
					<span>{label}</span>
				</button>
			))}
		</div>
	);
}
