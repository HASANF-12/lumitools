import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onReset={() => this.setState({ hasError: false, error: null, errorInfo: null })} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error: Error | null; onReset: () => void }> = ({ error, onReset }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-md w-full bg-white dark:bg-dark-card rounded-2xl shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
        </div>

        {error && (
          <details className="text-left bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Error Details
            </summary>
            <pre className="text-xs text-zinc-600 dark:text-zinc-400 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          <Button onClick={onReset} variant="primary">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button onClick={() => navigate('/')} variant="outline">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};


