import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
	return (
		<main className="mx-auto max-w-xl px-4 py-8">
			<h1
				className="mb-2 text-4xl font-bold"
				style={{ fontFamily: "var(--font-display)" }}
			>
				RPE Tracker
			</h1>
			<p className="text-(--tx-2)">Сессии появятся здесь.</p>
		</main>
	);
}
