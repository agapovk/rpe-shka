import { createFileRoute } from "@tanstack/react-router";
import { ResultsScreen } from "@/slices/view-results";

export const Route = createFileRoute("/sessions/$id/results")({
	component: ResultsPage,
});

function ResultsPage() {
	const { id } = Route.useParams();
	return <ResultsScreen sessionId={id} />;
}
