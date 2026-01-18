/**
 * リクエスト重複排除機構
 * 同じキーのリクエストが同時に発生した場合、最初のリクエストの結果を共有する
 */

const pendingRequests = new Map<string, Promise<unknown>>()

/**
 * 重複リクエストを排除してフェッチを実行
 * @param key - リクエストを識別するユニークキー
 * @param fetcher - 実際のフェッチ処理を行う関数
 * @returns フェッチ結果
 */
export async function dedupedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  // 同じキーのリクエストが進行中なら、その結果を待つ
  const pending = pendingRequests.get(key)
  if (pending) {
    return pending as Promise<T>
  }

  // 新しいリクエストを開始
  const promise = fetcher()
  pendingRequests.set(key, promise)

  try {
    const result = await promise
    return result
  } finally {
    // 完了したらマップから削除（成功・失敗に関わらず）
    pendingRequests.delete(key)
  }
}

/**
 * 進行中のリクエストをキャンセル（テスト用）
 */
export function clearPendingRequests(): void {
  pendingRequests.clear()
}

/**
 * 進行中のリクエスト数を取得（デバッグ用）
 */
export function getPendingRequestCount(): number {
  return pendingRequests.size
}
