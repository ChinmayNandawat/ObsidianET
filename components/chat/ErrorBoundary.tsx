'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChatContainer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Chat Interface Error</h3>
          <p className="text-gray-400 mb-6 max-w-md">
            The chat interface encountered an error. This has been logged and our team will investigate.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-primary/90 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 text-left">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                Error Details (Development)
              </summary>
              <pre className="mt-2 text-xs text-red-400 bg-black/50 p-4 rounded overflow-auto max-h-40">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
