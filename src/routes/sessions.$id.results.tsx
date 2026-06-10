import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/$id/results")({
	component: ResultsPage,
});

function ResultsPage() {
	const { id } = Route.useParams();
	return (
		<main className="mx-auto max-w-xl px-4 py-8">
			<p className="text-muted">Результаты — сессия {id}</p>
		</main>
	);
}
