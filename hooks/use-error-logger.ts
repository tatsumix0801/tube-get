import { useCallback } from 'react';
import { errorLogger, logError, logWarning, logInfo, logCritical } from '@/lib/error-logger';

/**
 * エラーロギング用のカスタムフック
 * コンポーネント内でエラーを記録するための便利なメソッドを提供します
 */
export const useErrorLogger = () => {
  // エラーの記録
  const logComponentError = useCallback((message: string, error: Error, context?: Record<string, any>) => {
    logError(message, error, { ...context, source: 'component' });
  }, []);

  // 警告の記録
  const logComponentWarning = useCallback((message: string, context?: Record<string, any>) => {
    logWarning(message, { ...context, source: 'component' });
  }, []);

  // 情報の記録
  const logComponentInfo = useCallback((message: string, context?: Record<string, any>) => {
    logInfo(message, { ...context, source: 'component' });
  }, []);

  // 重大エラーの記録
  const logComponentCritical = useCallback((message: string, error: Error, context?: Record<string, any>) => {
    logCritical(message, error, { ...context, source: 'component' });
  }, []);

  // 非同期関数のエラーをキャッチするためのラッパー
  const withErrorLogging = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    errorMessage: string = 'エラーが発生しました',
    context?: Record<string, any>
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        logComponentError(errorMessage, error instanceof Error ? error : new Error(String(error)), context);
        throw error;
      }
    };
  }, [logComponentError]);

  // APIリクエストのエラーを処理するためのヘルパー
  const handleApiError = useCallback((error: unknown, endpoint: string, params?: Record<string, any>) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logComponentError(`API呼び出しに失敗しました: ${endpoint}`, 
      error instanceof Error ? error : new Error(errorMessage),
      { endpoint, params }
    );
  }, [logComponentError]);

  // すべてのログの取得
  const getAllLogs = useCallback(() => {
    return errorLogger.getAllLogs();
  }, []);

  // ログのクリア
  const clearLogs = useCallback(() => {
    errorLogger.clearLogs();
  }, []);

  // ログのエクスポート（JSONとして）
  const exportLogs = useCallback(() => {
    return errorLogger.exportLogs();
  }, []);

  return {
    logComponentError,
    logComponentWarning,
    logComponentInfo,
    logComponentCritical,
    withErrorLogging,
    handleApiError,
    getAllLogs,
    clearLogs,
    exportLogs
  };
}; 