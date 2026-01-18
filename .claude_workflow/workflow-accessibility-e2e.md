# 実装ワークフロー: アクセシビリティ改善 & E2Eテスト導入

## 概要

design-accessibility-e2e.md に基づき、段階的に実装を進める。

---

## 実装フェーズ

### Phase 1: アクセシビリティ基盤（所要時間: 30分）

#### Step 1.1: スキップリンク実装
- [ ] `components/skip-link.tsx` 新規作成
- [ ] `app/layout.tsx` にSkipLink追加
- [ ] メインコンテンツに `id="main-content"` 追加

#### Step 1.2: コントラスト比調整
- [ ] 動画時間バッジ: `bg-black/70` → `bg-black/85`
- [ ] `text-muted-foreground` の確認と調整

#### Step 1.3: 基本的なaria属性追加
- [ ] video-table.tsx に `role="grid"` 追加
- [ ] 各行に `role="row"` 追加
- [ ] 各セルに `role="gridcell"` 追加

### Phase 2: キーボードナビゲーション（所要時間: 45分）

#### Step 2.1: video-table.tsx キーボード操作
- [ ] `useRef` でテーブル行への参照作成
- [ ] `handleKeyDown` イベントハンドラ実装
- [ ] フォーカス管理ロジック追加
- [ ] `tabIndex={0}` 追加

#### Step 2.2: video-analysis-tab.tsx キーボード操作
- [ ] タブパネルにキーボードナビゲーション追加
- [ ] ←→キーでタブ切り替え
- [ ] フォーカストラップ実装

### Phase 3: E2Eテスト基盤（所要時間: 20分）

#### Step 3.1: Playwright導入
- [ ] `npm install -D @playwright/test`
- [ ] `npx playwright install chromium`
- [ ] `playwright.config.ts` 作成

#### Step 3.2: ディレクトリ構成
- [ ] `e2e/tests/` ディレクトリ作成
- [ ] `e2e/fixtures/` ディレクトリ作成

### Phase 4: E2Eテスト実装（所要時間: 30分）

#### Step 4.1: スモークテスト
- [ ] `e2e/tests/smoke.spec.ts` 作成
- [ ] ダッシュボード表示テスト
- [ ] 設定ページ表示テスト
- [ ] FAQページ表示テスト

#### Step 4.2: アクセシビリティテスト
- [ ] `npm install -D @axe-core/playwright`
- [ ] `e2e/tests/accessibility.spec.ts` 作成
- [ ] 主要ページのaxe-coreチェック

---

## 検証チェックリスト

### アクセシビリティ検証
- [ ] スキップリンクが機能する（Tab→Enter）
- [ ] video-tableで↑↓キー操作可能
- [ ] フォーカスが視覚的に明確
- [ ] コントラスト比4.5:1以上（Chrome DevToolsで確認）

### E2Eテスト検証
- [ ] `npx playwright test` が成功
- [ ] スモークテスト全パス
- [ ] アクセシビリティテスト全パス

---

## 実行コマンド

```bash
# Phase 3: Playwright導入
npm install -D @playwright/test @axe-core/playwright
npx playwright install chromium

# テスト実行
npx playwright test

# テストレポート表示
npx playwright show-report
```

---

## 実装順序（推奨）

1. **Phase 1.1**: スキップリンク（最も簡単、即効果あり）
2. **Phase 1.2**: コントラスト比調整（CSS変更のみ）
3. **Phase 3**: Playwright導入（E2E基盤）
4. **Phase 4.1**: スモークテスト（基本テスト）
5. **Phase 2.1**: video-tableキーボード操作（メイン機能）
6. **Phase 4.2**: アクセシビリティテスト（自動チェック）
7. **Phase 2.2**: video-analysis-tabキーボード操作（追加機能）

---

## 注意事項

- 各Phase完了後にテスト実行して確認
- アクセシビリティ改善はChrome DevToolsのLighthouseで確認可能
- E2Eテストは開発サーバー起動が必要

---

作成日: 2026-01-18
作成者: Claude Opus 4.5
