import { ThemeToggle } from "./theme-toggle";

export function ThemeSection() {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="font-medium text-muted text-xs uppercase tracking-widest">
				Theme
			</h2>
			<ThemeToggle />
		</section>
	);
}
