'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { logError } from '@/lib/error-logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * エラーバウンダリーコンポーネント
 * React コンポーネントツリー内で発生したエラーをキャッチし、
 * エラーロガーに記録します。サイト上には表示せず、代替UIを表示します。
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // エラーが発生したことを示すステートを更新
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // エラーをログに記録
    logError('コンポーネントでエラーが発生しました', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // エラーが発生した場合は代替UIを表示するか、何も表示しない
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 