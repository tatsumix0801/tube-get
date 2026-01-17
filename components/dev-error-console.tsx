'use client';

import { useEffect, useState, useCallback } from 'react';
import { ErrorLogEntry, errorLogger } from '@/lib/error-logger';

/**
 * エラーログのエクスポート処理を行う関数
 */
const exportErrorLogs = () => {
  const json = errorLogger.exportLogs();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // URL作成後に非同期でダウンロード処理を実行
  setTimeout(() => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${new Date().toISOString()}.json`;
    a.click();
    
    // メモリリークを防ぐためURLを解放
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }, 0);
};

/**
 * 開発環境専用のエラーコンソールコンポーネント
 * 本番環境ではビルドされません
 */
const DevErrorConsole = () => {
  const [logs, setLogs] = useState<ErrorLogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isProduction, setIsProduction] = useState(false);

  // 初期化時に環境チェック
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      setIsProduction(true);
    }
  }, []);

  // エクスポート処理をuseCallbackでメモ化
  const handleExport = useCallback(exportErrorLogs, []);

  // 1秒ごとにログを更新
  useEffect(() => {
    // 本番環境では実行しない
    if (isProduction) return;

    const intervalId = setInterval(() => {
      setLogs(errorLogger.getAllLogs());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isProduction]);

  // キーボードショートカットでコンソール表示を切り替え (Ctrl+Shift+E)
  useEffect(() => {
    // 本番環境では実行しない
    if (isProduction) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProduction]);

  // 本番環境の場合は何も表示しない
  if (isProduction) {
    return null;
  }

  if (!isVisible) {
    return (
      <button 
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white p-2 rounded-full shadow-lg z-50 text-xs opacity-50 hover:opacity-100"
        style={{ width: '30px', height: '30px' }}
        title="エラーコンソールを開く (Ctrl+Shift+E)"
      >
        !
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-1/2 lg:w-1/3 h-64 bg-slate-900 text-white shadow-lg z-50 flex flex-col">
      <div className="flex justify-between items-center bg-slate-800 p-2">
        <h3 className="text-sm font-bold">開発用エラーコンソール ({logs.length}件)</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => errorLogger.clearLogs()}
            className="text-xs bg-red-600 px-2 py-1 rounded"
          >
            クリア
          </button>
          <button 
            onClick={handleExport}
            className="text-xs bg-blue-600 px-2 py-1 rounded"
          >
            エクスポート
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-xs bg-slate-600 px-2 py-1 rounded"
          >
            閉じる
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {logs.length === 0 ? (
          <div className="text-slate-400 text-sm p-4 text-center">
            エラーログはありません
          </div>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className="text-xs border-l-4 pl-2 pr-1" style={{
                borderColor: 
                  log.severity === 'critical' ? 'red' : 
                  log.severity === 'error' ? 'orange' :
                  log.severity === 'warning' ? 'yellow' : 'blue'
              }}>
                <div className="flex justify-between">
                  <span className="font-bold">[{log.severity.toUpperCase()}]</span>
                  <span className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-white">{log.message}</div>
                {log.stackTrace && (
                  <details>
                    <summary className="cursor-pointer text-slate-400">スタックトレース</summary>
                    <pre className="text-slate-300 text-xs mt-1 whitespace-pre-wrap bg-slate-800 p-1 rounded">
                      {log.stackTrace}
                    </pre>
                  </details>
                )}
                {log.context && Object.keys(log.context).length > 0 && (
                  <details>
                    <summary className="cursor-pointer text-slate-400">コンテキスト</summary>
                    <pre className="text-slate-300 text-xs mt-1 whitespace-pre-wrap bg-slate-800 p-1 rounded">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DevErrorConsole; 