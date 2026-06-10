import {
	createRouter as createTanStackRouter,
	type ErrorComponentProps,
} from "@tanstack/react-router";
import { Button } from "#/shared/ui/button";
import { routeTree } from "./routeTree.gen";

function ErrorScreen({ error }: ErrorComponentProps) {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
			<p className="text-muted">Что-то пошло не так.</p>
			<p className="text-muted text-sm">{error.message}</p>
			<Button onClick={() => window.location.reload()}>Перезагрузить</Button>
		</main>
	);
}

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultErrorComponent: ErrorScreen,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
