'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useErrorLogger } from '@/hooks/use-error-logger';

/**
 * エラーロガーの動作確認用コンポーネント
 * 本番環境では削除してください
 */
const ErrorLoggingExample = () => {
  const { 
    logComponentError, 
    logComponentWarning, 
    logComponentInfo,
    logComponentCritical,
    withErrorLogging,
    handleApiError
  } = useErrorLogger();
  const [loading, setLoading] = useState(false);

  // 非同期関数でのエラーハンドリングの例
  const simulateAsyncError = withErrorLogging(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('非同期処理でエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, '非同期エラーシミュレーション');

  // 様々なタイプのエラーをログに記録する例
  const logExampleErrors = () => {
    // 情報ログ
    logComponentInfo('これは情報ログのサンプルです', {
      component: 'ErrorLoggingExample',
      action: 'サンプルログ出力'
    });

    // 警告ログ
    logComponentWarning('これは警告ログのサンプルです', {
      component: 'ErrorLoggingExample',
      severity: 'medium'
    });

    // エラーログ
    try {
      const obj = {} as any;
      // 意図的にエラーを発生させる
      obj.nonExistentMethod();
    } catch (error) {
      logComponentError(
        'オブジェクトのメソッド呼び出しエラー', 
        error instanceof Error ? error : new Error(String(error)),
        { component: 'ErrorLoggingExample' }
      );
    }

    // 重大エラーログ
    logComponentCritical(
      'これは重大エラーのサンプルです', 
      new Error('クリティカルエラー'),
      { component: 'ErrorLoggingExample', impact: 'high' }
    );

    // APIエラーのシミュレーション
    handleApiError(
      new Error('API呼び出しに失敗しました'),
      '/api/example',
      { id: '12345', action: 'get' }
    );
  };

  return (
    <div className="hidden">
      {/* このコンポーネントは表示されませんが、開発時にボタンを押すことでエラーログを生成できます */}
      <div className="space-y-4">
        <Button onClick={logExampleErrors} disabled={loading}>
          サンプルエラーをログに記録
        </Button>
        <Button onClick={simulateAsyncError} disabled={loading}>
          {loading ? '処理中...' : '非同期エラーをシミュレート'}
        </Button>
      </div>
    </div>
  );
};

export default ErrorLoggingExample; 