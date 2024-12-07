import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('3D viewer error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="absolute top-4 left-4 right-4 z-20 bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-lg">
          {this.state.error?.message || 'Failed to load 3D model'}
        </div>
      );
    }

    return this.props.children;
  }
}