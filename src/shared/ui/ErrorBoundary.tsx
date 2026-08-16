import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };

class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default ErrorBoundary;
