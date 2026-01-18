# 設計書: アクセシビリティ改善 & E2Eテスト導入

## 概要

tube-getアプリケーションの次フェーズとして、アクセシビリティ改善とE2Eテスト導入を実施する。

---

## Phase 1: アクセシビリティ改善

### 1.1 現状分析

**良い点**:
- shadcn/uiコンポーネントは基本的なaria属性を持つ
- focus-visible スタイルが多くのコンポーネントに適用済み
- 一部カスタムコンポーネントにaria-label設定済み

**改善が必要な点**:
- カスタムコンポーネント（video-table, video-analysis-tab）のキーボード操作
- コントラスト比の確認と調整
- スキップリンクの未実装
- フォーカス管理の改善

### 1.2 コントラスト比改善

#### 対象箇所と改善内容

| 箇所 | 現状 | 改善後 | WCAG基準 |
|------|------|--------|----------|
| テキスト/背景 | text-muted-foreground | 4.5:1以上確保 | AA |
| 動画時間バッジ | bg-black/70 | bg-black/80 | AA |
| 統計カード数値 | text-purple-600 | コントラスト確認 | AA |

#### 実装方法

```typescript
// tailwind.config.ts に追加
// アクセシビリティ用カラー変数
colors: {
  accessible: {
    muted: 'hsl(var(--accessible-muted))',
    'muted-foreground': 'hsl(var(--accessible-muted-foreground))',
  }
}
```

### 1.3 キーボードナビゲーション改善

#### 対象コンポーネント

1. **video-table.tsx**
   - テーブル行のキーボード選択（↑↓キー）
   - Enter/Spaceでダイアログオープン
   - Escapeでダイアログクローズ

2. **video-analysis-tab.tsx**
   - タブ切り替えのキーボード操作（←→キー）
   - フォーカストラップの実装

3. **dashboard ページ**
   - スキップリンクの追加
   - ランドマーク（main, nav, aside）の設定

#### 実装例: video-table.tsx

```typescript
// キーボードナビゲーション追加
const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      focusRow(index + 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      focusRow(index - 1)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      openDialog(index)
      break
  }
}

// テーブル行に適用
<tr
  tabIndex={0}
  role="row"
  onKeyDown={(e) => handleKeyDown(e, index)}
  className="focus:outline-none focus:ring-2 focus:ring-purple-500"
>
```

### 1.4 スキップリンク実装

```typescript
// components/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-purple-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
    >
      メインコンテンツへスキップ
    </a>
  )
}
```

---

## Phase 2: E2Eテスト導入（Playwright）

### 2.1 テスト戦略

| テストタイプ | カバー範囲 | 優先度 |
|-------------|-----------|--------|
| スモークテスト | 主要ページ表示 | 高 |
| 機能テスト | チャンネル分析フロー | 高 |
| アクセシビリティテスト | axe-core統合 | 中 |
| ビジュアルリグレッション | 主要UI | 低 |

### 2.2 ディレクトリ構造

```
e2e/
├── fixtures/
│   └── test-data.ts
├── pages/
│   ├── dashboard.page.ts
│   ├── settings.page.ts
│   └── channel.page.ts
├── tests/
│   ├── smoke.spec.ts
│   ├── channel-analysis.spec.ts
│   └── accessibility.spec.ts
└── playwright.config.ts
```

### 2.3 主要テストケース

#### スモークテスト

```typescript
// e2e/tests/smoke.spec.ts
import { test, expect } from '@playwright/test'

test.describe('スモークテスト', () => {
  test('ダッシュボードが表示される', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'つべナビ' })).toBeVisible()
  })

  test('設定ページが表示される', async ({ page }) => {
    await page.goto('/settings')
    await expect(page.getByText('YouTube Data API Key')).toBeVisible()
  })
})
```

#### チャンネル分析フローテスト

```typescript
// e2e/tests/channel-analysis.spec.ts
test.describe('チャンネル分析フロー', () => {
  test('APIキー設定→チャンネル分析→結果表示', async ({ page }) => {
    // 1. 設定ページでAPIキー入力
    await page.goto('/settings')
    await page.fill('[name="apiKey"]', process.env.TEST_API_KEY!)
    await page.click('text=保存')

    // 2. ダッシュボードでチャンネルURL入力
    await page.goto('/dashboard')
    await page.fill('input[placeholder*="channel"]', 'https://www.youtube.com/@test')
    await page.click('text=分析する')

    // 3. 結果表示を確認
    await expect(page.getByText('動画一覧')).toBeVisible({ timeout: 30000 })
  })
})
```

#### アクセシビリティテスト

```typescript
// e2e/tests/accessibility.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('アクセシビリティ', () => {
  test('ダッシュボードにa11y違反がない', async ({ page }) => {
    await page.goto('/dashboard')
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
})
```

### 2.4 Playwright設定

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## 実装タスク一覧

| # | タスク | ファイル | 優先度 | 工数 |
|---|--------|---------|-------|------|
| 1 | スキップリンク実装 | components/skip-link.tsx | 高 | 小 |
| 2 | コントラスト比調整 | globals.css, tailwind.config.ts | 高 | 小 |
| 3 | video-tableキーボード操作 | components/video-table.tsx | 高 | 中 |
| 4 | video-analysis-tabキーボード操作 | components/video-analysis-tab.tsx | 中 | 中 |
| 5 | Playwright導入 | playwright.config.ts, package.json | 高 | 小 |
| 6 | スモークテスト作成 | e2e/tests/smoke.spec.ts | 高 | 小 |
| 7 | チャンネル分析フローテスト | e2e/tests/channel-analysis.spec.ts | 中 | 中 |
| 8 | axe-core統合 | e2e/tests/accessibility.spec.ts | 中 | 小 |

---

## 期待される効果

### アクセシビリティ改善
- WCAG 2.1 AA準拠達成
- スクリーンリーダー対応向上
- キーボードユーザーのUX向上

### E2Eテスト導入
- リグレッション防止
- 主要フローの自動検証
- CI/CD統合の基盤構築

---

## 注意事項

- アクセシビリティ改善は段階的に実施（まずコントラスト比、次にキーボード操作）
- E2Eテストは主要フローのみカバー（全網羅は不要）
- axe-coreでの自動チェックはWCAG 2.1 AAレベルを目標

---

作成日: 2026-01-18
作成者: Claude Opus 4.5
