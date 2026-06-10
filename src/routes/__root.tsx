import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeProvider } from "#/shared/context/theme";

export const Route = createRootRoute({ component: RootApp });

function RootApp() {
	return (
		<ThemeProvider>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
		</ThemeProvider>
	);
}
