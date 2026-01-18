import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getCached,
  setCache,
  deleteCache,
  deleteCacheByPrefix,
  clearCache,
  getCacheStats,
  CacheKeys,
} from '../api-cache'

describe('api-cache', () => {
  beforeEach(() => {
    clearCache()
  })

  describe('setCache / getCached', () => {
    it('値をキャッシュに設定して取得できる', () => {
      setCache('test-key', { data: 'test-value' })
      const result = getCached<{ data: string }>('test-key')
      expect(result).toEqual({ data: 'test-value' })
    })

    it('存在しないキーはnullを返す', () => {
      const result = getCached('non-existent-key')
      expect(result).toBeNull()
    })

    it('TTL超過後はnullを返す', () => {
      vi.useFakeTimers()

      setCache('expiring-key', 'value')

      // 1分後はまだ有効
      vi.advanceTimersByTime(60 * 1000)
      expect(getCached('expiring-key')).toBe('value')

      // 6分後はTTL超過（デフォルト5分）
      vi.advanceTimersByTime(5 * 60 * 1000)
      expect(getCached('expiring-key')).toBeNull()

      vi.useRealTimers()
    })

    it('カスタムTTLを指定できる', () => {
      vi.useFakeTimers()

      setCache('custom-ttl-key', 'value')

      // 1秒のTTLで取得（1秒後に超過）
      vi.advanceTimersByTime(2000)
      expect(getCached('custom-ttl-key', 1000)).toBeNull()

      vi.useRealTimers()
    })
  })

  describe('deleteCache', () => {
    it('指定したキーのキャッシュを削除する', () => {
      setCache('to-delete', 'value')
      expect(getCached('to-delete')).toBe('value')

      const result = deleteCache('to-delete')
      expect(result).toBe(true)
      expect(getCached('to-delete')).toBeNull()
    })

    it('存在しないキーの削除はfalseを返す', () => {
      const result = deleteCache('non-existent')
      expect(result).toBe(false)
    })
  })

  describe('deleteCacheByPrefix', () => {
    it('指定したプレフィックスで始まるキャッシュを全て削除する', () => {
      setCache('channel:info:123', 'info1')
      setCache('channel:info:456', 'info2')
      setCache('channel:videos:123', 'videos')
      setCache('other:key', 'other')

      const deletedCount = deleteCacheByPrefix('channel:info:')
      expect(deletedCount).toBe(2)

      expect(getCached('channel:info:123')).toBeNull()
      expect(getCached('channel:info:456')).toBeNull()
      expect(getCached('channel:videos:123')).toBe('videos')
      expect(getCached('other:key')).toBe('other')
    })

    it('マッチしない場合は0を返す', () => {
      setCache('key1', 'value1')
      const deletedCount = deleteCacheByPrefix('no-match:')
      expect(deletedCount).toBe(0)
    })
  })

  describe('clearCache', () => {
    it('全てのキャッシュをクリアする', () => {
      setCache('key1', 'value1')
      setCache('key2', 'value2')
      setCache('key3', 'value3')

      clearCache()

      expect(getCached('key1')).toBeNull()
      expect(getCached('key2')).toBeNull()
      expect(getCached('key3')).toBeNull()
    })
  })

  describe('getCacheStats', () => {
    it('キャッシュの統計情報を取得する', () => {
      setCache('key1', 'value1')
      setCache('key2', 'value2')

      const stats = getCacheStats()
      expect(stats.size).toBe(2)
      expect(stats.keys).toContain('key1')
      expect(stats.keys).toContain('key2')
    })

    it('空のキャッシュでも動作する', () => {
      const stats = getCacheStats()
      expect(stats.size).toBe(0)
      expect(stats.keys).toEqual([])
    })
  })

  describe('CacheKeys', () => {
    it('channelInfoキーを生成する', () => {
      expect(CacheKeys.channelInfo('abc123')).toBe('channel:info:abc123')
    })

    it('channelVideosキーを生成する', () => {
      expect(CacheKeys.channelVideos('abc123')).toBe('channel:videos:abc123')
      expect(CacheKeys.channelVideos('abc123', 'token')).toBe('channel:videos:abc123:token')
    })

    it('channelStatsキーを生成する', () => {
      expect(CacheKeys.channelStats('abc123')).toBe('channel:stats:abc123')
    })
  })
})
