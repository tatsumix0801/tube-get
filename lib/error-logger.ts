/**
 * エラーログ管理クラス
 * サイト上に表示せずにエラー情報を管理するためのユーティリティ
 */

export interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  message: string;
  stackTrace?: string;
  context?: Record<string, unknown>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLogEntry[] = [];
  private maxLogSize: number = 100;
  private isProduction: boolean = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';
  private isInitialized: boolean = false;

  private constructor() {
    // シングルトンパターン
  }

  private initializeClient() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    // クライアントサイドでのみ実行
    window.addEventListener('error', this.handleWindowError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    this.isInitialized = true;
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private handleWindowError(event: ErrorEvent): void {
    this.logError({
      message: event.message,
      stackTrace: event.error?.stack,
      severity: 'error',
    });
  }

  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    this.logError({
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stackTrace: event.reason?.stack,
      severity: 'error',
    });
  }

  public logError({
    message,
    stackTrace,
    context = {},
    severity = 'error',
  }: {
    message: string;
    stackTrace?: string;
    context?: Record<string, unknown>;
    severity?: 'info' | 'warning' | 'error' | 'critical';
  }): void {
    // クライアントサイドで初期化されていなければ初期化
    if (typeof window !== 'undefined') {
      this.initializeClient();
    }

    const errorLog: ErrorLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      message,
      stackTrace,
      context,
      severity,
    };

    this.logs.unshift(errorLog);
    
    // ログの数が最大値を超えたら古いものを削除
    if (this.logs.length > this.maxLogSize) {
      this.logs = this.logs.slice(0, this.maxLogSize);
    }

    if (!this.isProduction && typeof console !== 'undefined') {
      // 開発環境のみコンソールに出力（本番環境では表示しない）
      console.group('エラーロガー');
      console.error(`[${severity.toUpperCase()}] ${message}`);
      if (stackTrace) console.error(stackTrace);
      if (Object.keys(context).length > 0) console.table(context);
      console.groupEnd();
    }
  }

  public getAllLogs(): ErrorLogEntry[] {
    // クライアントサイドで初期化されていなければ初期化
    if (typeof window !== 'undefined') {
      this.initializeClient();
    }
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public setMaxLogSize(size: number): void {
    this.maxLogSize = size;
    // サイズを変更した後、ログの数が最大値を超えていたら古いものを削除
    if (this.logs.length > this.maxLogSize) {
      this.logs = this.logs.slice(0, this.maxLogSize);
    }
  }

  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}

// シングルトンインスタンスをエクスポート
export const errorLogger = ErrorLogger.getInstance();

// エラーログ記録用の便利なヘルパー関数
export function logError(message: string, error?: Error, context?: Record<string, unknown>): void {
  errorLogger.logError({
    message,
    stackTrace: error?.stack,
    context,
    severity: 'error',
  });
}

export function logWarning(message: string, context?: Record<string, unknown>): void {
  errorLogger.logError({
    message,
    context,
    severity: 'warning',
  });
}

export function logInfo(message: string, context?: Record<string, unknown>): void {
  errorLogger.logError({
    message,
    context,
    severity: 'info',
  });
}

export function logCritical(message: string, error?: Error, context?: Record<string, unknown>): void {
  errorLogger.logError({
    message,
    stackTrace: error?.stack,
    context,
    severity: 'critical',
  });
} 
