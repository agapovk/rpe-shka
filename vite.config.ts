import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		tanstackRouter({ target: "react", autoCodeSplitting: true }),
		viteReact(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "script-defer",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
				runtimeCaching: [],
			},
			manifest: {
				name: "RPE Tracker",
				short_name: "RPE",
				description: "Офлайн-инструмент тренера для сбора RPE после тренировки",
				theme_color: "#0f172a",
				background_color: "#0f172a",
				display: "standalone",
				orientation: "portrait",
				start_url: "/",
				scope: "/",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "pwa-maskable-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
});

export default config;
