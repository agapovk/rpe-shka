import { createFileRoute } from "@tanstack/react-router";
import { CaptureScreen } from "@/slices/record-rpe";

export const Route = createFileRoute("/sessions/$id/survey")({
	component: SurveyPage,
});

function SurveyPage() {
	const { id } = Route.useParams();
	return <CaptureScreen sessionId={id} />;
}
