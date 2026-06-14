import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { StorageSection } from "@/shared/ui/storage-section";
import { ThemeSection } from "@/shared/ui/theme-section";
import { CategoriesSection } from "@/slices/manage-categories";
import { RosterSection } from "@/slices/manage-roster";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
	return (
		<main className="mx-auto flex max-w-xl flex-col gap-8 px-4 py-5">
			<header className="flex items-center gap-3">
				<Link
					aria-label="Back to home"
					className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-text"
					to="/"
				>
					<ArrowLeft className="h-4 w-4" />
				</Link>
				<h1 className="font-bold font-display text-3xl uppercase tracking-tight">
					Settings
				</h1>
			</header>
			<ThemeSection />
			<CategoriesSection />
			<RosterSection />
			<StorageSection />
		</main>
	);
}
