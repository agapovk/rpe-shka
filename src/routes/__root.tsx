import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeProvider } from "#/shared/context/theme";
import { ErrorBoundary } from "#/shared/ui/ErrorBoundary";

export const Route = createRootRoute({ component: RootApp });

function RootApp() {
	return (
		<ThemeProvider>
			<ErrorBoundary>
				<Outlet />
			</ErrorBoundary>
			<TanStackRouterDevtools position="bottom-right" />
		</ThemeProvider>
	);
}
