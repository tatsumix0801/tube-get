'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Clock, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ApiErrorHandlerProps {
  errorMessage: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * API エラーメッセージを判別してエラータイプを返す
 */
function getErrorType(message: string): 'quota' | 'auth' | 'network' | 'validation' | 'general' {
  // クォータ超過エラーの検出
  if (
    message.includes('quota') || 
    message.includes('Quota') || 
    message.includes('quotaExceeded') ||
    message.includes('dailyLimitExceeded')
  ) {
    return 'quota';
  }
  
  // 認証エラーの検出
  if (
    message.includes('auth') || 
    message.includes('Auth') || 
    message.includes('invalid_key') ||
    message.includes('APIキーが無効') ||
    message.includes('API key') ||
    message.includes('API Key')
  ) {
    return 'auth';
  }
  
  // 入力バリデーションエラーの検出
  if (
    message.includes('有効なYouTubeチャンネル') ||
    message.includes('URL') ||
    message.includes('入力') ||
    message.includes('channel')
  ) {
    return 'validation';
  }
  
  // ネットワークエラーの検出
  if (
    message.includes('network') || 
    message.includes('timeout') || 
    message.includes('接続') ||
    message.includes('connect')
  ) {
    return 'network';
  }
  
  // それ以外の一般エラー
  return 'general';
}

/**
 * エラーメッセージに基づいてカスタムガイダンスを表示
 */
function getErrorGuidance(error: string): string {
  if (error.includes("API Key")) {
    return "設定画面からAPI Keyを追加してください。";
  }
  if (error.includes("有効なYouTubeチャンネル")) {
    return "例: https://www.youtube.com/@GoogleDevelopers または @GoogleDevelopers";
  }
  if (error.includes("取得に失敗")) {
    return "ネットワーク接続を確認するか、別のチャンネルを試してください。";
  }
  return "もう一度お試しいただくか、入力内容をご確認ください。";
}

/**
 * YouTube API クォータ超過エラー専用のコンポーネント
 */
function QuotaExceededError({ onRetry }: { onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-red-300 bg-red-50 dark:bg-red-950/20 dark:border-red-900">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-700 dark:text-red-400">YouTube API クォータ超過</CardTitle>
          </div>
          <CardDescription className="text-red-500 dark:text-red-400 mt-1">
            YouTube Data API の 1日の利用制限を超えました
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            YouTube API の1日あたりのリクエスト制限（クォータ）を超過しました。
            この制限は毎日太平洋標準時（PST）の午前0時にリセットされます。
          </p>
          
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-800 dark:text-amber-300 text-sm font-medium">対処方法</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400 text-xs mt-1">
              <ul className="list-disc pl-4 space-y-1">
                <li>明日以降に再度お試しください</li>
                <li>別のAPIキーを使用する</li>
                <li>同じAPIキーでのリクエスト数を減らす</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            <span>明日にリセットされます</span>
          </div>
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRetry}
              className="gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              再試行
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

/**
 * 入力バリデーションエラー専用のコンポーネント
 */
function ValidationError({ errorMessage, onRetry }: { errorMessage: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-3 text-sm text-amber-800 dark:text-amber-300">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 shrink-0 mt-0.5 text-amber-500 dark:text-amber-400" />
          <div className="space-y-1.5">
            <p className="font-medium">{errorMessage}</p>
            <p className="text-xs opacity-90">{getErrorGuidance(errorMessage)}</p>
            
            {onRetry && (
              <Button 
                variant="outline"
                size="sm" 
                onClick={onRetry}
                className="mt-1.5 h-8 px-2 text-xs border-amber-300 bg-amber-50/50 hover:bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-900/30"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                再試行
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 一般的なAPIエラー表示コンポーネント
 */
function GeneralApiError({ errorMessage, onRetry }: { errorMessage: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <p className="font-medium">{errorMessage}</p>
            <p className="text-xs opacity-90">{getErrorGuidance(errorMessage)}</p>
            
            {onRetry && (
              <Button 
                variant="outline"
                size="sm" 
                onClick={onRetry}
                className="mt-1.5 h-8 px-2 text-xs bg-background hover:bg-background/80"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                再試行
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * API エラーハンドラーコンポーネント
 * エラーメッセージの内容を解析し、適切なエラー表示を行います
 */
export function ApiErrorHandler({ errorMessage, onRetry, className }: ApiErrorHandlerProps) {
  const [errorType, setErrorType] = useState<'quota' | 'auth' | 'network' | 'validation' | 'general'>('general');
  
  // エラーメッセージからエラータイプを判別
  useEffect(() => {
    if (errorMessage) {
      setErrorType(getErrorType(errorMessage));
    }
  }, [errorMessage]);
  
  // エラーがない場合は何も表示しない
  if (!errorMessage) {
    return null;
  }
  
  // エラータイプに応じたコンポーネントを表示
  switch (errorType) {
    case 'quota':
      return <QuotaExceededError onRetry={onRetry} />;
    case 'validation':
      return <ValidationError errorMessage={errorMessage} onRetry={onRetry} />;
    default:
      return <GeneralApiError errorMessage={errorMessage} onRetry={onRetry} />;
  }
} 