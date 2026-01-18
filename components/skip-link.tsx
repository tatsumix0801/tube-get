/**
 * スキップリンクコンポーネント
 * キーボードユーザーがメインコンテンツに直接ジャンプできるようにする
 * WCAG 2.1 ガイドライン対応
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-purple-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 transition-all"
    >
      メインコンテンツへスキップ
    </a>
  )
}
