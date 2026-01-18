import { describe, it, expect } from 'vitest'
import { cn, isGoodChannel } from '../utils'
import type { Video } from '@/hooks/use-channel-data'

describe('cn', () => {
  it('単一のクラス名を返す', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('複数のクラス名を結合する', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('条件付きクラス名を処理する', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz')
  })

  it('Tailwindの重複クラスをマージする', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('配列形式のクラス名を処理する', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('オブジェクト形式のクラス名を処理する', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
  })

  it('空の入力でも動作する', () => {
    expect(cn()).toBe('')
    expect(cn('')).toBe('')
    expect(cn(null, undefined)).toBe('')
  })
})

describe('isGoodChannel', () => {
  const createVideo = (daysAgo: number, spreadRate: number): Video => {
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)
    return {
      id: 'test-id',
      title: 'Test Video',
      publishedAt: date.toISOString(),
      viewCount: '1000',
      likeCount: '100',
      commentCount: '10',
      duration: 'PT10M',
      thumbnail: 'https://example.com/thumb.jpg',
      url: 'https://youtube.com/watch?v=test-id',
      spreadRate,
    }
  }

  it('空の配列の場合falseを返す', () => {
    expect(isGoodChannel([])).toBe(false)
  })

  it('undefinedの場合falseを返す', () => {
    expect(isGoodChannel(undefined as unknown as Video[])).toBe(false)
  })

  it('直近1ヶ月以内で拡散率100%以上の動画があればtrueを返す', () => {
    const videos = [createVideo(15, 150)] // 15日前、拡散率150%
    expect(isGoodChannel(videos)).toBe(true)
  })

  it('直近1ヶ月以内でも拡散率100%未満ならfalseを返す', () => {
    const videos = [createVideo(15, 50)] // 15日前、拡散率50%
    expect(isGoodChannel(videos)).toBe(false)
  })

  it('1ヶ月以上前の動画は対象外', () => {
    const videos = [createVideo(45, 200)] // 45日前、拡散率200%
    expect(isGoodChannel(videos)).toBe(false)
  })

  it('条件を満たす動画が1つでもあればtrueを返す', () => {
    const videos = [
      createVideo(45, 200), // 対象外（古い）
      createVideo(15, 50),  // 対象外（拡散率不足）
      createVideo(10, 100), // 対象（条件満たす）
    ]
    expect(isGoodChannel(videos)).toBe(true)
  })
})
