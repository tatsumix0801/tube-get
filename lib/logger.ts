/**
 * 開発環境専用のログ出力関数
 * 本番環境では何も出力しない
 */
export const debugLog = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args)
  }
}

/**
 * 開発環境専用の警告出力関数
 * 本番環境では何も出力しない
 */
export const debugWarn = (...args: unknown[]): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('[DEBUG WARN]', ...args)
  }
}

/**
 * エラーログ（本番環境でも出力）
 * エラーは本番でもログに残す必要があるため
 */
export const errorLog = (...args: unknown[]): void => {
  console.error('[ERROR]', ...args)
}
