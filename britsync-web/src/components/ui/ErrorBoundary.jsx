import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    background: '#0a0a0a',
                    color: '#ff4444',
                    border: '1px solid #333',
                    borderRadius: '20px',
                    margin: '2rem',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Services Page Error</h2>
                    <p style={{ color: '#aaa', marginBottom: '1rem' }}>We've encountered a rendering issue. Please see the details below:</p>
                    <div style={{
                        background: '#1a1a1a',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        overflow: 'auto',
                        maxHeight: '400px',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                    }}>
                        <strong>Error:</strong> {this.state.error && this.state.error.toString()}
                        <br /><br />
                        <strong>Component Stack:</strong>
                        <pre style={{ opacity: 0.7 }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '1.5rem',
                            padding: '0.8rem 1.5rem',
                            background: 'var(--color-blue, #0072ff)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
