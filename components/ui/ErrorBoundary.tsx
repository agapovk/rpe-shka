"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// biome-ignore lint/style/useReactFunctionComponents: error boundaries require class components
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3">
          <p className="font-mono text-[11px] text-text-3 uppercase tracking-widest">
            Something went wrong
          </p>
          <button
            className="font-mono text-[11px] text-accent uppercase tracking-widest underline-offset-4 hover:underline"
            onClick={() => this.setState({ error: null })}
            type="button"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
