import React from 'react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Something went wrong.' };
  }

  componentDidCatch(error: Error) {
    console.error('Application Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FCEEEE] dark:bg-[#0A0405] text-[#1F0B0D] dark:text-white">
          <div className="max-w-md w-full rounded-2xl border border-red-500/20 bg-white dark:bg-[#1A080B] p-6 text-center shadow-xl">
            <h2 className="text-xl font-bold mb-2">Unable to display this view</h2>
            <p className="text-sm text-red-900/70 dark:text-red-200/70 mb-5">
              Please refresh the page to continue ordering from DANNY PIZZA.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
