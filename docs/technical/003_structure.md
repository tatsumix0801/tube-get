# コードベース構造

## ディレクトリ構成

```
tube-navi/
├── .next/                   # Next.jsビルド出力
├── app/                     # Next.js 13+ App Router
│   ├── api/                # APIルート
│   │   └── youtube/        # YouTube API連携
│   ├── channel/            # チャンネル詳細ページ
│   │   └── page.tsx        # チャンネル詳細画面
│   ├── channel-analysis/   # チャンネル分析ページ
│   │   └── page.tsx        # チャンネル分析画面
│   ├── dashboard/          # ダッシュボード画面
│   │   └── page.tsx        # ダッシュボードメインページ
│   ├── docs/               # ドキュメントページ
│   │   └── page.tsx        # ドキュメント画面
│   ├── faq/                # よくある質問ページ
│   │   └── page.tsx        # FAQページ
│   ├── login/              # ログイン画面
│   │   └── page.tsx        # ログインページ
│   ├── logout/             # ログアウト画面
│   │   └── page.tsx        # ログアウトページ
│   ├── settings/           # 設定画面
│   │   └── page.tsx        # ユーザー設定ページ
│   ├── styleguide/         # スタイルガイドページ
│   │   └── page.tsx        # スタイルガイド画面
│   └── layout.tsx          # ルートレイアウト
├── components/             # 共通コンポーネント
│   ├── ui/                # 基本UIコンポーネント
│   │   ├── button.tsx     # ボタンコンポーネント
│   │   ├── card.tsx       # カードコンポーネント
│   │   ├── dialog.tsx     # ダイアログコンポーネント
│   │   ├── form.tsx       # フォームコンポーネント
│   │   └── ...            # その他のUIコンポーネント
│   └── shared/            # 共有コンポーネント
│       ├── header.tsx     # ヘッダーコンポーネント
│       ├── footer.tsx     # フッターコンポーネント
│       ├── sidebar.tsx    # サイドバーコンポーネント
│       ├── charts/        # チャート関連コンポーネント
│       └── ...            # その他の共有コンポーネント
├── hooks/                  # カスタムReactフック
│   ├── use-auth.ts        # 認証関連フック
│   ├── use-youtube.ts     # YouTube API連携フック
│   ├── use-analytics.ts   # 分析データ取得フック
│   └── ...                # その他のカスタムフック
├── lib/                    # ユーティリティ関数
│   ├── api-client.ts      # APIクライアント
│   ├── auth.ts            # 認証ユーティリティ
│   ├── youtube-api.ts     # YouTube API接続ユーティリティ
│   ├── validation.ts      # バリデーションスキーマ
│   ├── date-utils.ts      # 日付操作ユーティリティ
│   └── ...                # その他のユーティリティ
├── public/                 # 静的ファイル
│   ├── images/            # 画像ファイル
│   ├── fonts/             # フォントファイル
│   └── ...                # その他の静的アセット
└── styles/                 # グローバルスタイル
    ├── globals.css        # グローバルCSS
    └── ...                # その他のスタイル定義
```

## コア機能の配置

### 認証システム
- **場所**: `app/api/auth/`, `lib/auth.ts`, `hooks/use-auth.ts`
- **説明**: Next.jsのApp Routerを利用した認証システム。JWTを使用したAPI認証とセッション管理を行う。

### YouTube API連携
- **場所**: `app/api/youtube/`, `lib/youtube-api.ts`, `hooks/use-youtube.ts`
- **説明**: YouTube Data APIとの連携機能。OAuthフローの管理、チャンネルデータの取得、動画情報の処理を行う。

### 分析エンジン
- **場所**: `app/api/analytics/`, `lib/analytics.ts`, `hooks/use-analytics.ts`
- **説明**: YouTubeから取得したデータの分析処理。成長率計算、エンゲージメント分析、トレンド検出などを行う。

### レポート生成
- **場所**: `app/api/reports/`, `lib/report-generator.ts`
- **説明**: 分析データを基にしたレポート生成機能。PDF/Excel形式での出力をサポート。

### UIコンポーネントライブラリ
- **場所**: `components/ui/`
- **説明**: アプリケーション全体で使用される基本的なUIコンポーネント。Radix UIベースのアクセシビリティに優れたコンポーネント群。

## ファイル命名規則

- **React Components**: PascalCase (`Button.tsx`, `ChannelCard.tsx`)
- **Utilities/Hooks**: camelCase (`useAuth.ts`, `formatDate.ts`)
- **Page Components**: `page.tsx` (Next.js規約に準拠)
- **Layout Components**: `layout.tsx` (Next.js規約に準拠)
- **API Routes**: `route.ts` (Next.js規約に準拠)

## 重要な設計パターン

### Atomic Design
コンポーネント設計に原子設計手法を採用。
- **Atoms**: 基本的なUIパーツ (`Button`, `Input`, `Icon`)
- **Molecules**: 複数のアトムを組み合わせた機能 (`SearchBox`, `FormField`)
- **Organisms**: 複雑な機能を持つ独立したコンポーネント (`Header`, `VideoCard`)
- **Templates**: ページのレイアウト構造 (`DashboardLayout`, `MarketingLayout`)
- **Pages**: 完全なページ実装 (`app/(dashboard)/channel/page.tsx`)

### データフェッチング
Server ComponentsとClient Componentsを適切に分離し、パフォーマンスを最適化。
- サーバーでのデータ取得: `app/(dashboard)/channel/page.tsx`
- クライアントでの状態管理: `hooks/use-channel-data.ts`

### 状態管理
React Hooksを中心とした状態管理を採用。
- グローバル状態: Context API + useReducer
- フォーム状態: React Hook Form + Zod
- サーバー状態: SWR/React Query (検討中) 