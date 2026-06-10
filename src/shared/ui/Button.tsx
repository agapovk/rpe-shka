import type { ButtonHTMLAttributes } from "react";
import { cn } from "#/shared/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
}

export function Button({
	variant = "primary",
	size = "md",
	className,
	...props
}: ButtonProps) {
	return (
		<button
			type="button"
			className={cn(
				"inline-flex items-center justify-center font-medium transition-all disabled:opacity-40",
				variant === "primary" && "bg-accent text-bg hover:opacity-90",
				variant === "ghost" &&
					"bg-transparent text-tx-2 hover:text-tx hover:bg-bg-2",
				variant === "danger" &&
					"bg-transparent text-red-500 hover:bg-red-500/10",
				size === "sm" && "h-7 px-3 rounded-md text-sm",
				size === "md" && "h-9 px-4 rounded-lg text-sm",
				size === "lg" && "h-11 px-6 rounded-lg text-base",
				className,
			)}
			{...props}
		/>
	);
}
