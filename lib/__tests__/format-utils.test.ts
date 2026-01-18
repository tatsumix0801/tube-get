import { describe, it, expect } from 'vitest'
import { formatNumber } from '../format-utils'

describe('formatNumber', () => {
  it('整数を桁区切りでフォーマットする', () => {
    expect(formatNumber(1000)).toBe('1,000')
    expect(formatNumber(1000000)).toBe('1,000,000')
    expect(formatNumber(123456789)).toBe('123,456,789')
  })

  it('小数を含む数値をフォーマットする', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56')
  })

  it('ゼロを正しく処理する', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('負の数を正しく処理する', () => {
    expect(formatNumber(-1000)).toBe('-1,000')
  })

  it('文字列形式の数値を処理する', () => {
    expect(formatNumber('1000')).toBe('1,000')
    expect(formatNumber('1,000,000')).toBe('1,000,000') // 既にフォーマット済み
  })

  it('数値でない文字列はそのまま返す', () => {
    expect(formatNumber('abc')).toBe('abc')
    expect(formatNumber('not a number')).toBe('not a number')
  })

  it('小さい数値はそのまま返す', () => {
    expect(formatNumber(1)).toBe('1')
    expect(formatNumber(999)).toBe('999')
  })
})
