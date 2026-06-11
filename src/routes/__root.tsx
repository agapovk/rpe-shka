import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

import { ThemeProvider } from "@/shared/context/theme";
import { db } from "@/shared/db/dexie";

export const Route = createRootRoute({ component: RootApp });

function RootApp() {
	useEffect(() => {
		// открытие создаёт БД и запускает populate-сид при первом запуске
		db.open();
		// единственная копия данных — запрещаем браузеру выселять IndexedDB
		navigator.storage?.persist?.();
	}, []);

	return (
		<ThemeProvider>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
		</ThemeProvider>
	);
}
