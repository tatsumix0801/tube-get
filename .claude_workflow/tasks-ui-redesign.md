# タスク一覧 - UI/UXリニューアル & サイト名変更

## 概要

本ドキュメントは `.claude_workflow/design-ui-redesign.md` に基づき、実装タスクを分解したものである。

---

## Phase 1: スタイル基盤構築

### Task 1.1: tailwind.config.ts 更新
- **優先度**: 最高
- **依存**: なし
- **作業内容**:
  - `colors`にSF風カラーパレット追加（sf-bg, sf-text, sf-cyan, sf-green, neon-*）
  - `boxShadow`にグローエフェクト追加（sf-glow-*, neon-glow-*）
  - `keyframes`にアニメーション定義追加（sf-pulse, sf-glitch, holo-shift, neon-pulse, sf-grid-move）
  - `animation`にショートハンド追加
  - `fontFamily.mono`にモノスペースフォント追加
- **検証**: `npm run build` 成功
- **ステータス**: [ ] 未着手

### Task 1.2: globals.css CSS変数追加
- **優先度**: 最高
- **依存**: Task 1.1
- **作業内容**:
  - `:root`にSF風CSS変数追加（--sf-bg-*, --sf-text-*, --sf-cyan, --neon-*）
- **検証**: `npm run build` 成功
- **ステータス**: [ ] 未着手

### Task 1.3: globals.css コンポーネントスタイル追加
- **優先度**: 高
- **依存**: Task 1.2
- **作業内容**:
  - `@layer components`に追加:
    - `.sf-glow`, `.sf-glow-intense`, `.sf-text-glow`（グローエフェクト）
    - `.sf-glass`, `.sf-glass-dark`（グラスモーフィズム）
    - `.sf-grid-bg`（背景グリッド）
    - `.holographic-card`（ホログラフィックカード）
    - `.neon-button`（ネオンボタン）
- **検証**: `npm run build` 成功
- **ステータス**: [ ] 未着手

### Task 1.4: globals.css ユーティリティ追加
- **優先度**: 高
- **依存**: Task 1.3
- **作業内容**:
  - `@layer utilities`に追加:
    - `.animate-sf-pulse`, `.animate-sf-glitch`, `.animate-holo-shift`, `.animate-neon-pulse`
    - `.neon-text`
    - `.card-3d`
- **検証**: `npm run build` 成功
- **ステータス**: [ ] 未着手

### Task 1.5: globals.css キーフレーム追加
- **優先度**: 高
- **依存**: Task 1.4
- **作業内容**:
  - `@keyframes`追加:
    - `sf-pulse`, `sf-glitch`, `holo-shift`, `neon-pulse`, `sf-grid-move`
- **検証**: `npm run build` 成功
- **ステータス**: [ ] 未着手

### Task 1.6: globals.css アクセシビリティ・レスポンシブ対応
- **優先度**: 中
- **依存**: Task 1.5
- **作業内容**:
  - `@media (prefers-reduced-motion: reduce)` 追加
  - `@media (max-width: 640px)` グロー効果軽減
  - カスタムスクロールバースタイル追加
  - `*:focus-visible` スタイル追加
- **検証**: `npm run build` 成功
- **ステータス**: [ ] 未着手

### Task 1.7: Phase 1 ビルド検証
- **優先度**: 最高
- **依存**: Task 1.1〜1.6
- **作業内容**:
  - `npm run build` 実行
  - エラーがあれば修正
- **検証**: ビルド成功、エラー0件
- **ステータス**: [ ] 未着手

---

## Phase 2: サイト名変更

### Task 2.1: app/layout.tsx サイト名変更
- **優先度**: 高
- **依存**: Phase 1完了
- **作業内容**:
  - `title: "つべナビ | YouTube動画分析ツール"` → `title: "TubeVision | YouTube動画分析ツール"`
- **ステータス**: [ ] 未着手

### Task 2.2: components/app-layout.tsx サイト名変更
- **優先度**: 高
- **依存**: Phase 1完了
- **作業内容**:
  - `© {year} つべナビ. All rights reserved.` → `© {year} TubeVision. All rights reserved.`
- **ステータス**: [ ] 未着手

### Task 2.3: components/header.tsx サイト名変更
- **優先度**: 高
- **依存**: Phase 1完了
- **作業内容**:
  - `alt="つべナビ"` → `alt="TubeVision"`
  - `つべナビ`（テキスト）→ `TubeVision`
- **ステータス**: [ ] 未着手

### Task 2.4: components/layout.tsx サイト名変更
- **優先度**: 高
- **依存**: Phase 1完了
- **作業内容**:
  - 複数箇所の`alt="つべナビ"` → `alt="TubeVision"`
  - 複数箇所の`つべナビ`テキスト → `TubeVision`
  - `© 2025 つべナビ` → `© 2025 TubeVision`
- **ステータス**: [ ] 未着手

### Task 2.5: components/main-nav.tsx サイト名変更
- **優先度**: 高
- **依存**: Phase 1完了
- **作業内容**:
  - `"つべナビの使い方に関するFAQ"` → `"TubeVisionの使い方に関するFAQ"`
- **ステータス**: [ ] 未着手

### Task 2.6: app/styleguide/page.tsx サイト名変更
- **優先度**: 高
- **依存**: Phase 1完了
- **作業内容**:
  - `"つべナビ スタイルガイド"` → `"TubeVision スタイルガイド"`
  - `"つべナビの公式ロゴと使用例"` → `"TubeVisionの公式ロゴと使用例"`
  - `alt="つべナビ ロゴ"` → `alt="TubeVision ロゴ"`
- **ステータス**: [ ] 未着手

### Task 2.7: README.md サイト名変更
- **優先度**: 高
- **依存**: Phase 1完了
- **作業内容**:
  - `# つべナビ 🎥` → `# TubeVision 🎥`
- **ステータス**: [ ] 未着手

### Task 2.8: Phase 2 ビルド検証
- **優先度**: 最高
- **依存**: Task 2.1〜2.7
- **作業内容**:
  - `npm run build` 実行
  - エラーがあれば修正
- **検証**: ビルド成功、エラー0件
- **ステータス**: [ ] 未着手

---

## Phase 3: コンポーネントスタイル適用

### Task 3.1: globals.css Card用スタイル追加
- **優先度**: 中
- **依存**: Phase 2完了
- **作業内容**:
  - `.card-sf`, `.card-sf-glow`, `.card-holographic` 追加
- **ステータス**: [ ] 未着手

### Task 3.2: globals.css Button用スタイル追加
- **優先度**: 中
- **依存**: Phase 2完了
- **作業内容**:
  - `.btn-neon`, `.btn-neon-pink`, `.btn-neon-blue` 追加
- **ステータス**: [ ] 未着手

### Task 3.3: Header コンポーネント SF効果適用
- **優先度**: 中
- **依存**: Task 3.1, 3.2
- **作業内容**:
  - ダークモード時に`dark:bg-sf-bg-secondary dark:border-sf-cyan/20`適用
- **ステータス**: [ ] 未着手

### Task 3.4: 背景グリッドパターン適用
- **優先度**: 中
- **依存**: Task 3.3
- **作業内容**:
  - `app/layout.tsx`または`components/app-layout.tsx`に`dark:sf-grid-bg`追加
- **ステータス**: [ ] 未着手

### Task 3.5: Phase 3 ビルド検証
- **優先度**: 最高
- **依存**: Task 3.1〜3.4
- **作業内容**:
  - `npm run build` 実行
  - エラーがあれば修正
- **検証**: ビルド成功、エラー0件
- **ステータス**: [ ] 未着手

---

## Phase 4: 最終検証

### Task 4.1: ESLint チェック
- **優先度**: 最高
- **依存**: Phase 3完了
- **作業内容**:
  - `npm run lint` 実行
  - エラーがあれば修正
- **検証**: ESLintエラー 0件
- **ステータス**: [ ] 未着手

### Task 4.2: TypeScript 型チェック
- **優先度**: 最高
- **依存**: Task 4.1
- **作業内容**:
  - `npx tsc --noEmit` 実行
  - 型エラーがあれば修正
- **検証**: TypeScriptエラー 0件
- **ステータス**: [ ] 未着手

### Task 4.3: Vitest テスト実行
- **優先度**: 最高
- **依存**: Task 4.2
- **作業内容**:
  - `npm run test` 実行
  - 失敗テストがあれば修正
- **検証**: 全テストパス
- **ステータス**: [ ] 未着手

### Task 4.4: 本番ビルド最終確認
- **優先度**: 最高
- **依存**: Task 4.3
- **作業内容**:
  - `npm run build` 実行
  - ビルド成功確認
- **検証**: ビルド成功
- **ステータス**: [ ] 未着手

### Task 4.5: ローカル動作確認
- **優先度**: 高
- **依存**: Task 4.4
- **作業内容**:
  - `npm run dev` でローカルサーバー起動
  - 主要ページの表示確認
  - ダークモード切り替え確認
  - SF効果の表示確認
  - サイト名「TubeVision」表示確認
- **検証**: 全ページ正常動作
- **ステータス**: [ ] 未着手

---

## タスクサマリー

| Phase | タスク数 | 内容 |
|-------|---------|------|
| Phase 1 | 7 | スタイル基盤構築（tailwind.config.ts, globals.css） |
| Phase 2 | 8 | サイト名変更（13箇所→7ファイル） |
| Phase 3 | 5 | コンポーネントスタイル適用 |
| Phase 4 | 5 | 最終検証（ESLint, TypeScript, Vitest, ビルド, 動作確認） |
| **合計** | **25** | |

---

## 実行時の注意事項

1. **Phase順序厳守**: Phase 1 → 2 → 3 → 4 の順序で実行
2. **各Phaseビルド検証必須**: Phase終了時に必ず`npm run build`で確認
3. **エラー即時対応**: エラー発生時は次タスクに進まず修正
4. **既存機能維持**: 既存のスタイル・機能は変更しない（追加のみ）
5. **dark:プレフィックス活用**: SF効果はダークモード時のみ適用

---

作成日: 2026-01-18
ステータス: タスク分解完了（ユーザー承認待ち）
次フェーズ: /sc:implement で実装開始
