import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { createSession } from "../mutations";

export function NewSessionButton() {
	const navigate = useNavigate();

	const handleClick = async (): Promise<void> => {
		const id = await createSession();
		navigate({ to: "/sessions/$id/survey", params: { id } });
	};

	return (
		<button
			className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-bold font-display text-bg text-lg uppercase tracking-wide transition hover:brightness-110 active:translate-y-px"
			onClick={handleClick}
			type="button"
		>
			<Plus className="h-5 w-5" />
			New session
		</button>
	);
}
