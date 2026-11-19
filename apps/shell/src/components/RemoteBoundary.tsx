import React, { Component, ReactNode, Suspense } from 'react';

interface ErrorBoundaryProps {
  remoteName: string;
  fallback?: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[MFE ErrorBoundary] Failed to load remote "${this.props.remoteName}":`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={errorContainerStyle}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#b91c1c' }}>
            Micro-App Unavailable: {this.props.remoteName}
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#7f1d1d' }}>
            The remote component failed to load. The remote server might be starting up or temporarily offline.
          </p>
          <button onClick={this.handleRetry} style={retryButtonStyle}>
            Retry Loading
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const RemoteBoundary: React.FC<ErrorBoundaryProps> = ({ remoteName, fallback, children }) => {
  return (
    <ErrorBoundary remoteName={remoteName} fallback={fallback}>
      <Suspense
        fallback={
          <div style={loadingContainerStyle}>
            <div style={spinnerStyle} />
            <span style={{ fontSize: '14px', color: '#64748b' }}>Loading {remoteName}...</span>
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default RemoteBoundary;

const errorContainerStyle: React.CSSProperties = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '12px',
  padding: '32px 24px',
  textAlign: 'center',
  maxWidth: '600px',
  margin: '32px auto',
};

const retryButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc2626',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
};

const loadingContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  gap: '12px',
};

const spinnerStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  border: '3px solid #e2e8f0',
  borderTopColor: '#2563eb',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};
