# アーキテクチャ説明書

このドキュメントは、tube-getプロジェクトのシステムアーキテクチャを説明します。

## 📌 概要

tube-getは、Next.js 15 App Routerをベースとしたモダンなフルスタックアプリケーションです。YouTube Data API v3を活用し、チャンネル情報の取得・分析・レポート生成機能を提供します。

---

## 1. システム全体構成

```
┌─────────────────────────────────────────────────────────┐
│                      ユーザー                           │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│               Vercel Edge Network                       │
│                    (CDN)                                │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│               Next.js 15 App Router                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Pages     │  │   API       │  │  Components │    │
│  │  /login     │  │  /api/auth  │  │  /ui        │    │
│  │  /dashboard │  │  /api/docs  │  │  /channel-* │    │
│  │  /channel   │  │  /api/export│  │  /video-*   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  YouTube Data API v3                    │
│              (ユーザー提供APIキー使用)                   │
└─────────────────────────────────────────────────────────┘
```

### 1.1 技術スタック

| レイヤー | 技術 | バージョン |
|----------|------|------------|
| フロントエンド | Next.js | 15.5.9 |
| 言語 | TypeScript | 5.x |
| スタイリング | Tailwind CSS | 3.x |
| UIライブラリ | shadcn/ui | latest |
| 状態管理 | React Context API | - |
| テスト（Unit） | Vitest | latest |
| テスト（E2E） | Playwright | latest |
| デプロイ | Vercel | - |
| API | YouTube Data API v3 | - |

---

## 2. Next.js App Router構造

### 2.1 ディレクトリ構成

```
app/
├── (auth)/                 # 認証ルートグループ
│   ├── login/
│   │   └── page.tsx       # ログインページ
│   └── logout/
│       └── page.tsx       # ログアウトページ
├── (main)/                 # メインコンテンツルートグループ
│   ├── dashboard/
│   │   └── page.tsx       # ダッシュボード（ホーム）
│   ├── channel/
│   │   └── page.tsx       # チャンネル分析ページ
│   ├── settings/
│   │   └── page.tsx       # 設定ページ
│   ├── docs/
│   │   └── page.tsx       # ドキュメントページ
│   ├── faq/
│   │   └── page.tsx       # FAQページ
│   └── styleguide/
│       └── page.tsx       # スタイルガイド（開発用）
├── api/                    # APIルート
│   ├── auth/
│   │   └── route.ts       # 認証API（ログイン/検証）
│   ├── docs/
│   │   └── route.ts       # ドキュメント取得API
│   └── export/
│       └── route.ts       # エクスポート機能API
├── layout.tsx              # ルートレイアウト
├── globals.css             # グローバルスタイル
├── not-found.tsx           # 404ページ
└── error.tsx               # エラーページ
```

### 2.2 ルートグループ

#### `(auth)` グループ
- 認証関連ページ
- レイアウトなし（フルスクリーン）
- middleware.tsで未認証時のリダイレクト制御

#### `(main)` グループ
- 認証必須のメインコンテンツ
- AppLayoutコンポーネントでラップ（サイドバー/ヘッダー）
- middleware.tsで認証チェック

---

## 3. データフロー

### 3.1 チャンネルデータ取得フロー

```
[ユーザー入力]
    │
    ▼
[use-channel-data.ts]
    │
    ├─→ [api-cache.ts] キャッシュ確認
    │       │
    │       ├─ HIT → キャッシュデータ返却
    │       │
    │       └─ MISS
    │           │
    │           ▼
    └─→ [youtube-api.ts]
            │
            ▼
        [YouTube Data API v3]
            │
            ▼
        [channels.list]
            │
            ▼
        [レスポンス]
            │
            ├─→ [api-cache.ts] キャッシュ保存（TTL: 5分）
            │
            └─→ [use-channel-data.ts] 状態更新
                    │
                    ▼
                [Reactコンポーネント] 再レンダリング
```

#### フロー詳細

1. **ユーザーがチャンネルURL入力**
   - `/channel` ページでURL入力フォーム送信

2. **`use-channel-data.ts` がAPIキャッシュ確認**
   - `api-cache.ts` の `CacheKeys.channelData(channelId)` でキャッシュ確認
   - キャッシュヒット → そのまま返却（API呼び出しスキップ）

3. **キャッシュミス時、YouTube Data API呼び出し**
   - `youtube-api.ts` の `getChannelData()` 実行
   - YouTube Data API v3 `channels.list` エンドポイント呼び出し

4. **レスポンスをキャッシュに保存（TTL: 5分）**
   - `api-cache.ts` の `set()` でキャッシュ保存
   - 5分後に自動削除

5. **Reactコンポーネントに状態反映**
   - `use-channel-data.ts` が `useState` でデータ保持
   - コンポーネント再レンダリング

### 3.2 認証フロー

```
[ユーザー]
    │
    ▼
[/login ページ]
    │
    ├─ パスワード入力
    │
    ▼
[POST /api/auth]
    │
    ▼
[lib/auth.ts]
    │
    ├─ verifyPassword() でパスワード検証
    │       │
    │       ├─ 成功 → セッションCookie設定（24時間有効）
    │       │           │
    │       │           └─ secure: NODE_ENV === 'production'
    │       │
    │       └─ 失敗 → 401 Unauthorized
    │
    ▼
[middleware.ts]
    │
    ├─ すべてのリクエストでセッションチェック
    │       │
    │       ├─ Cookie有効 → ページアクセス許可
    │       │
    │       └─ Cookie無効 → /login へリダイレクト
    │
    ▼
[保護されたページ]
```

#### フロー詳細

1. **ユーザーがパスワード入力（/login）**
   - `app/(auth)/login/page.tsx` でフォーム送信

2. **`/api/auth` にPOST**
   - `app/api/auth/route.ts` がリクエスト受信

3. **`lib/auth.ts` でパスワード検証**
   - `verifyPassword()` で環境変数 `PASSWORD` と比較
   - 成功時: `createSession()` でCookie設定

4. **セッションCookie設定（24時間有効）**
   ```typescript
   {
     name: 'session',
     value: sessionToken,
     httpOnly: true,
     secure: NODE_ENV === 'production', // 本番のみHTTPS強制
     sameSite: 'lax',
     maxAge: 60 * 60 * 24, // 24時間
     path: '/'
   }
   ```

5. **`middleware.ts` でルート保護**
   - すべてのリクエストでセッションCookie確認
   - 未認証時: `/login` へリダイレクト
   - 認証済み: Next.js App Routerへパス

---

## 4. lib/ モジュール構成

### 4.1 主要モジュール

```
lib/
├── auth.ts              # 認証ロジック
├── youtube-api.ts       # YouTube API クライアント
├── api-cache.ts         # APIレスポンスキャッシュ（5分TTL）
├── request-dedup.ts     # リクエスト重複排除
├── utils.ts             # ユーティリティ関数（cn, isGoodChannel）
├── format-utils.ts      # フォーマット関数（formatNumber, formatDate）
├── logger.ts            # ロギング（debugLog）
├── pdf-generator.ts     # PDF生成（jsPDF）
└── __tests__/           # ユニットテスト（Vitest）
    ├── utils.test.ts
    ├── format-utils.test.ts
    └── api-cache.test.ts
```

### 4.2 モジュール依存関係

```
youtube-api.ts
    │
    ├─→ logger.ts (debugLog)
    └─→ env: NEXT_PUBLIC_YOUTUBE_API_KEY

api-cache.ts
    │
    └─→ Map<string, CacheEntry<T>> (インメモリキャッシュ)

use-channel-data.ts
    │
    ├─→ youtube-api.ts (getChannelData)
    ├─→ api-cache.ts (キャッシュ管理)
    └─→ request-dedup.ts (重複リクエスト防止)

auth.ts
    │
    └─→ cookies() from 'next/headers' (Next.js 15 async cookies)

pdf-generator.ts
    │
    └─→ jsPDF v4.0.0
```

---

## 5. コンポーネント関係図

### 5.1 コンポーネントツリー

```
AppLayout (app-layout.tsx)
    │
    ├─→ Sidebar
    │     ├─→ Logo
    │     └─→ Navigation Links
    │
    ├─→ Header
    │     ├─→ Breadcrumbs
    │     └─→ User Menu
    │
    └─→ Main Content
          │
          └─→ {children} (Page Component)

Page: /channel
    │
    ├─→ ChannelProfile (channel-profile/)
    │     ├─→ ProfileHeader
    │     │     ├─→ Avatar (next/image)
    │     │     └─→ Channel Info
    │     │
    │     ├─→ ProfileActions
    │     │     ├─→ Export Buttons
    │     │     └─→ Share Button
    │     │
    │     └─→ ProfileMetrics
    │           ├─→ Subscriber Count
    │           ├─→ Video Count
    │           └─→ View Count
    │
    ├─→ ChannelDetails (channel-details/)
    │     ├─→ DetailsStats
    │     │     ├─→ Charts
    │     │     └─→ Statistics
    │     │
    │     └─→ DetailsTagCloud
    │           └─→ Tag Visualization
    │
    └─→ VideoAnalysisTab (video-analysis-tab.tsx)
          │
          ├─→ Filter Controls
          │
          └─→ VideoTable (video-table.tsx) ← React.memo
                │
                └─→ VideoRow (memoized)
                      ├─→ Thumbnail (next/image + blur)
                      ├─→ Title
                      ├─→ Stats (views, likes, etc.)
                      └─→ Published Date
```

### 5.2 主要コンポーネント

#### `components/ui/` (shadcn/ui ベース)
- `button.tsx` - ボタンコンポーネント
- `card.tsx` - カードコンポーネント
- `input.tsx` - 入力フィールド
- `dialog.tsx` - ダイアログ/モーダル
- `dropdown-menu.tsx` - ドロップダウンメニュー
- `tabs.tsx` - タブUI
- `toast.tsx` - 通知トースト

#### `components/channel-profile/`
- `ProfileHeader.tsx` - チャンネルヘッダー（アバター、名前、説明）
- `ProfileActions.tsx` - アクションボタン（エクスポート、共有）
- `ProfileMetrics.tsx` - メトリクス表示（登録者数、動画数など）

#### `components/channel-details/`
- `DetailsStats.tsx` - 統計情報表示
- `DetailsTagCloud.tsx` - タグクラウド可視化

#### 単一コンポーネント
- `video-table.tsx` - 動画一覧テーブル（React.memo + useMemo最適化）
- `video-analysis-tab.tsx` - 動画分析タブ（フィルター + 統計）
- `app-layout.tsx` - アプリケーション全体レイアウト
- `skip-link.tsx` - アクセシビリティ用スキップリンク

---

## 6. パフォーマンス最適化

### 6.1 レンダリング最適化

```typescript
// video-analysis-tab.tsx
const filteredVideos = useMemo(() => {
  return videos.filter(/* ... */).sort(/* ... */);
}, [videos, filterState]);

const stats = useMemo(() => {
  return calculateStats(filteredVideos);
}, [filteredVideos]);
```

```typescript
// video-table.tsx
export const VideoRow = React.memo(function VideoRow({ video }: Props) {
  return <tr>{/* ... */}</tr>;
});
```

**期待効果**:
- レンダリング時間: 60-80%削減
- 大量データ（500+動画）でも滑らかなUI

### 6.2 APIキャッシュ機構

```typescript
// lib/api-cache.ts
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<T>>();
const TTL = 5 * 60 * 1000; // 5分
```

**効果**:
- API呼び出し重複排除: 100%削減
- レスポンス時間: キャッシュヒット時 < 1ms

### 6.3 画像最適化

```tsx
<Image
  src={thumbnail}
  alt={title}
  width={320}
  height={180}
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..." // 4箇所で実装
/>
```

**効果**:
- LCP（Largest Contentful Paint）改善
- ユーザー体験向上（スムーズなローディング）

---

## 7. セキュリティ

### 7.1 認証・認可

- **認証方式**: パスワードベース（シンプル認証）
- **セッション管理**: HttpOnly Cookie（24時間有効）
- **ルート保護**: `middleware.ts` で全ルート監視
- **HTTPS強制**: 本番環境で `secure: true` 設定

### 7.2 APIキー管理

- **YouTube API Key**: ユーザー入力式
  - サーバー側環境変数に保存せず
  - セッションストレージで管理
  - リロード時に再入力必要（セキュリティ優先）

### 7.3 脆弱性対応

- **依存関係**: npm audit で定期チェック
- **現在の状態**: 脆弱性 0件達成（2026-01-18時点）
- **主な対応履歴**:
  - jsPDF v3.0.1 → v4.0.0 (DoS, Path Traversal修正)
  - Next.js ^15.1.0 → v15.5.9 (CVE-2025-66478 RCE修正)
  - xlsx削除 → CSV移行 (High脆弱性解消)

---

## 8. テスト戦略

### 8.1 ユニットテスト（Vitest）

- **対象**: `lib/`、`hooks/`、ユーティリティ関数
- **現在のカバレッジ**: 53テスト、主要関数100%
- **実行**: `npm run test`

### 8.2 E2Eテスト（Playwright）

- **対象**: クリティカルユーザーフロー
- **テスト種別**:
  - スモークテスト（18テスト）
  - アクセシビリティテスト（@axe-core/playwright）
- **実行**: `npx playwright test`

### 8.3 CI/CD統合

- **GitHub Actions**: PR時に自動実行
  - ESLint
  - TypeScript型チェック
  - Vitest
  - Next.js Build

---

## 9. デプロイアーキテクチャ

### 9.1 Vercel Edge Network

```
[GitHub Repository]
    │
    ├─ push to develop → Vercel Preview Deploy
    │
    └─ push to main → Vercel Production Deploy
            │
            ▼
    [Vercel Edge Network (CDN)]
            │
            ├─→ Static Assets（キャッシュ）
            │
            └─→ Server Components（Dynamic）
```

### 9.2 環境別URL

| 環境 | URL | ブランチ | 用途 |
|------|-----|---------|------|
| 本番 | https://tube-get-red.vercel.app | main | 公開環境 |
| ステージング | `*.vercel.app` (Preview) | develop, feature/* | 確認環境 |
| ローカル | http://localhost:3000 | - | 開発環境 |

---

## 10. 今後の拡張ポイント

### 10.1 スケーラビリティ

- **現在**: シングルユーザー、インメモリキャッシュ
- **将来**: マルチユーザー対応時
  - Redis導入（キャッシュ共有）
  - データベース導入（PostgreSQL/Supabase）

### 10.2 機能拡張

- Googleスプレッドシート出力
- アナリティクスダッシュボード
- ユーザーフィードバックシステム
- チャンネル比較機能

---

*最終更新: 2026-01-18*
*参照: [CODING_STANDARDS.md](./CODING_STANDARDS.md), [ENVIRONMENTS.md](./ENVIRONMENTS.md)*
