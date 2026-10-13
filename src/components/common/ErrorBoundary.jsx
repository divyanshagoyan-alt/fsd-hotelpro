import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-state" style={{ minHeight: '50vh' }}>
          <div className="error-state-icon">
            <AlertTriangle size={28} />
          </div>
          <h2 className="page-title">Something went wrong</h2>
          <p className="text-secondary" style={{ maxWidth: '40ch', textAlign: 'center' }}>
            An unexpected error occurred. Please refresh the page or go back to continue.
          </p>
          <div className="d-flex gap-3 mt-4">
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Refresh Page
            </button>
            <button className="btn btn-outline" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
