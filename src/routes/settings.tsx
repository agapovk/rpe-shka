import { createFileRoute } from "@tanstack/react-router";
import { ThemeToggle } from "@/shared/ui/theme-toggle";
import { RosterSection } from "@/slices/manage-roster";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
	return (
		<main className="mx-auto flex max-w-xl flex-col gap-8 px-4 py-8">
			<h1 className="font-bold font-display text-3xl uppercase">Settings</h1>
			<section className="flex flex-col gap-3">
				<h2 className="font-medium text-muted text-xs uppercase tracking-widest">
					Theme
				</h2>
				<ThemeToggle />
			</section>
			<RosterSection />
		</main>
	);
}
