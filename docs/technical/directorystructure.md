# ディレクトリ構成 📁

```
tube-navi/
├── .claude/                 # Claude AI設定
├── .next/                   # Next.jsビルド出力
├── app/                     # Next.js 13+ App Router
│   ├── api/                # APIルート
│   ├── channel/            # チャンネル詳細ページ
│   ├── channel-analysis/   # チャンネル分析ページ
│   ├── dashboard/          # ダッシュボード画面
│   ├── docs/               # ドキュメントページ
│   ├── faq/                # よくある質問ページ
│   ├── login/              # ログイン画面
│   ├── logout/             # ログアウト画面
│   ├── settings/           # 設定画面
│   └── styleguide/         # スタイルガイドページ
├── components/             # 共通コンポーネント
│   ├── ui/                # 基本UIコンポーネント
│   └── shared/            # 共有コンポーネント
├── context/                # React Context（README.mdのみ）
├── docs/                   # プロジェクトドキュメント
│   ├── issues/            # Issue別作業記録
│   ├── planning/          # 計画ドキュメント
│   ├── project/           # プロジェクト管理
│   └── technical/         # 技術ドキュメント
├── hooks/                  # カスタムReactフック
├── lib/                    # ユーティリティ関数
├── public/                 # 静的ファイル
├── reports/                # 分析レポート
├── styles/                 # グローバルスタイル
└── types/                  # TypeScript型定義
```

## 主要ディレクトリの説明

### 📱 `app/`
Next.js 13+のApp Routerを使用したメインのアプリケーションコード
- `(auth)`: ログイン、サインアップなどの認証関連ページ
- `(dashboard)`: ユーザーダッシュボード関連のページ
- `(marketing)`: ランディングページなどのマーケティング関連ページ
- `api`: バックエンドAPIエンドポイント

### 🎨 `components/`
再利用可能なReactコンポーネント
- `ui/`: 基本的なUIコンポーネント（ボタン、フォーム、カードなど）
- `shared/`: 複数のページで共有されるコンポーネント

### 🎣 `hooks/`
カスタムReactフック
- データフェッチング
- フォーム管理
- 状態管理
- その他の再利用可能なロジック

### 🛠️ `lib/`
ユーティリティ関数やヘルパー
- APIクライアント
- データ変換関数
- 共通のロジック

### 📦 `public/`
静的ファイル
- 画像
- フォント
- その他のアセット

### 🎭 `styles/`
グローバルスタイル
- Tailwind CSS設定
- カスタムCSS
- テーマ設定

### 📝 `types/`
TypeScript型定義
- インターフェース
- 型エイリアス
- 列挙型 