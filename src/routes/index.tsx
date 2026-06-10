import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<main className="mx-auto max-w-xl px-4 py-8">
			<h1 className="mb-2 font-bold font-display text-4xl">RPE Tracker</h1>
			<p className="text-muted">Сессии появятся здесь.</p>
		</main>
	);
}
