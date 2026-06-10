import { createFileRoute } from "@tanstack/react-router";
import { ThemeToggle } from "#/shared/ui/ThemeToggle";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
	return (
		<main className="mx-auto max-w-xl px-4 py-8">
			<h1
				className="mb-6 font-display text-3xl font-bold"
				style={{ fontFamily: "var(--font-display)" }}
			>
				Настройки
			</h1>
			<section className="space-y-4">
				<h2 className="text-sm font-medium text-tx-2 uppercase tracking-widest">
					Тема
				</h2>
				<ThemeToggle />
			</section>
		</main>
	);
}
