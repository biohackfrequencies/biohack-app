import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200">
          <div className="max-w-xl w-full text-center p-8 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-red-200 dark:border-red-800">
            <h1 className="text-3xl font-display font-bold text-red-600 dark:text-red-400">Application Error</h1>
            <p className="mt-4 text-base leading-relaxed">
              We're sorry, but something went wrong while loading the application. Please try refreshing the page.
            </p>
            <p className="mt-4 text-xs bg-red-100 dark:bg-red-900/50 p-3 rounded-lg font-mono break-all">
                {this.state.error?.toString()}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}