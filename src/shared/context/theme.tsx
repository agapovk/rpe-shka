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

const isTheme = (value: unknown): value is Theme =>
	value === "dark" || value === "light" || value === "system";

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// data-theme выбирает color-scheme в CSS (light-dark() токены);
// без атрибута действует дефолт "light dark" — браузер следует системе
function applyTheme(theme: Theme): void {
	if (theme === "system") {
		delete document.documentElement.dataset.theme;
		return;
	}
	document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		return isTheme(stored) ? stored : "system";
	});

	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => {
		localStorage.setItem(STORAGE_KEY, next);
		setThemeState(next);
	}, []);

	return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used inside ThemeProvider");
	}
	return ctx;
}
