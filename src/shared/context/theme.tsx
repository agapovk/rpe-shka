import type { ReactNode } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export type Theme = "dark" | "light" | "system";

const STORAGE_KEY = "rpe-theme";
const DEFAULT_THEME: Theme = "dark";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveApplied(theme: Theme): "dark" | "light" {
	if (theme === "system") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}
	return theme;
}

function applyClass(applied: "dark" | "light"): void {
	document.documentElement.classList.toggle("dark", applied === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window === "undefined") return DEFAULT_THEME;
		const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
		return stored ?? DEFAULT_THEME;
	});

	useEffect(() => {
		applyClass(resolveApplied(theme));
	}, [theme]);

	// Keep system theme in sync when prefers-color-scheme changes
	useEffect(() => {
		if (theme !== "system") return;
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => applyClass(resolveApplied("system"));
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => {
		localStorage.setItem(STORAGE_KEY, next);
		setThemeState(next);
	}, []);

	return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
	return ctx;
}
