const BOLT = "300,60 155,275 245,275 212,452 357,237 267,237";

export function Logo({ className }: { className?: string }) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			viewBox="0 0 512 512"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<clipPath id="bolt-clip">
					<polygon points={BOLT} />
				</clipPath>
				<linearGradient id="bolt-glint" x1="0" x2="0" y1="0" y2="1">
					<stop offset="0" stopColor="#fff" stopOpacity="0" />
					<stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
					<stop offset="1" stopColor="#fff" stopOpacity="0" />
				</linearGradient>
			</defs>
			<rect fill="#0f172a" height="512" rx="96" width="512" />
			<polygon fill="#f97316" points={BOLT} />
			<g clipPath="url(#bolt-clip)">
				<rect
					className="animate-bolt-flash"
					fill="url(#bolt-glint)"
					height="180"
					width="512"
					x="0"
					y="0"
				/>
			</g>
		</svg>
	);
}
