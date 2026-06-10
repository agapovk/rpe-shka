import { Moon, Sun, SunMoon } from "lucide-react";
import { type Theme, useTheme } from "#/shared/context/theme";
import { cn } from "#/shared/lib/cn";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
	{ value: "light", icon: Sun, label: "Светлая" },
	{ value: "system", icon: SunMoon, label: "Системная" },
	{ value: "dark", icon: Moon, label: "Тёмная" },
];

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex gap-1 rounded-lg border border-line bg-surface p-1">
			{OPTIONS.map(({ value, icon: Icon, label }) => (
				<button
					aria-label={label}
					aria-pressed={theme === value}
					className={cn(
						"flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
						theme === value
							? "bg-bg text-text shadow-sm"
							: "text-muted hover:text-text"
					)}
					key={value}
					onClick={() => setTheme(value)}
					type="button"
				>
					<Icon size={14} />
					<span>{label}</span>
				</button>
			))}
		</div>
	);
}
