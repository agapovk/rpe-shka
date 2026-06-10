import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/$id/survey")({
	component: SurveyPage,
});

function SurveyPage() {
	const { id } = Route.useParams();
	return (
		<main className="mx-auto max-w-xl px-4 py-8">
			<p className="text-(--tx-2)">Опрос — сессия {id}</p>
		</main>
	);
}
