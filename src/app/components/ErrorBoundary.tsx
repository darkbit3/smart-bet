import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-4">
          <div className="max-w-lg text-center bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-6">Sorry, an unexpected error happened. Please refresh or try again later.</p>
            <pre className="text-xs bg-[#111] text-[#f4f4f4] p-3 rounded overflow-x-auto">{this.state.error?.message}</pre>
            <button className="mt-5 px-4 py-2 rounded bg-[#FFD700] text-[#121212] font-bold" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
