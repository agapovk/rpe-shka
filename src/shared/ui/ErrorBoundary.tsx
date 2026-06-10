import { Component, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false };

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<div className="flex min-h-screen items-center justify-center p-8">
						<p className="text-muted">Что-то пошло не так.</p>
					</div>
				)
			);
		}
		return this.props.children;
	}
}
