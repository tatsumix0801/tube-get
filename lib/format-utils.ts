/**
 * フォーマット用ユーティリティ関数
 */

/**
 * 数値を桁区切りのある文字列に変換
 */
export function formatNumber(num: number | string): string {
  // 文字列の場合、既にフォーマット済みかもしれないのでカンマを除去
  const numValue = typeof num === "string" ? Number.parseFloat(num.replace(/,/g, "")) : num

  // 数値でない場合は元の値を返す
  if (isNaN(numValue)) return String(num)

  // 日本語環境に合わせてフォーマット
  return new Intl.NumberFormat("ja-JP").format(numValue)
} 