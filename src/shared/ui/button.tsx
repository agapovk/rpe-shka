import type { ButtonHTMLAttributes } from "react";
import { cn } from "#/shared/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	size?: "sm" | "md" | "lg";
	variant?: "primary" | "ghost" | "danger";
}

export function Button({
	variant = "primary",
	size = "md",
	className,
	...props
}: ButtonProps) {
	return (
		<button
			className={cn(
				"inline-flex items-center justify-center font-medium transition-colors disabled:opacity-40",
				variant === "primary" && "bg-accent text-bg hover:opacity-90",
				variant === "ghost" && "text-muted hover:bg-surface hover:text-text",
				variant === "danger" && "text-red-500 hover:bg-red-500/10",
				size === "sm" && "h-7 rounded-md px-3 text-sm",
				size === "md" && "h-9 rounded-lg px-4 text-sm",
				size === "lg" && "h-11 rounded-lg px-6 text-base",
				className
			)}
			type="button"
			{...props}
		/>
	);
}
