/**
 * APIレスポンスのシンプルなメモリキャッシュ機構
 * 同一チャンネルへの重複リクエストを防止し、パフォーマンスを向上
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
}

// インメモリキャッシュ
const cache = new Map<string, CacheEntry<unknown>>()

// デフォルトのTTL: 5分
const DEFAULT_CACHE_TTL = 5 * 60 * 1000

/**
 * キャッシュから値を取得
 * TTLを超過している場合はnullを返す
 */
export function getCached<T>(key: string, ttl: number = DEFAULT_CACHE_TTL): T | null {
  const entry = cache.get(key)
  if (!entry) return null

  // TTLチェック
  if (Date.now() - entry.timestamp > ttl) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

/**
 * キャッシュに値を設定
 */
export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

/**
 * 特定のキーのキャッシュを削除
 */
export function deleteCache(key: string): boolean {
  return cache.delete(key)
}

/**
 * 指定したプレフィックスで始まるキャッシュを全て削除
 */
export function deleteCacheByPrefix(prefix: string): number {
  let deletedCount = 0
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key)
      deletedCount++
    }
  }
  return deletedCount
}

/**
 * 全てのキャッシュをクリア
 */
export function clearCache(): void {
  cache.clear()
}

/**
 * キャッシュの統計情報を取得
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  }
}

// キャッシュキー生成ヘルパー
export const CacheKeys = {
  channelInfo: (channelId: string) => `channel:info:${channelId}`,
  channelVideos: (channelId: string, pageToken?: string) =>
    pageToken ? `channel:videos:${channelId}:${pageToken}` : `channel:videos:${channelId}`,
  channelStats: (channelId: string) => `channel:stats:${channelId}`,
}
