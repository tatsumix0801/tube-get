# 技術スタック

## フロントエンド

### コアフレームワーク
- **Next.js 15.1.0** - Reactベースのフルスタックフレームワーク
  - App Routerによるファイルベースルーティング
  - Server Componentsによるパフォーマンス最適化
  - APIルートによるバックエンド統合
- **React 18** - UIライブラリ
  - Concurrent Mode対応
  - Hooks APIによる状態管理
- **TypeScript** - 静的型付け言語
  - 型安全な開発環境
  - インテリセンスとコード補完

### UIコンポーネント
- **Radix UI** - アクセシビリティに優れたヘッドレスUIコンポーネント
  - Accordion - 折りたたみパネル
  - Alert Dialog - 警告ダイアログ
  - Avatar - ユーザーアバター
  - Checkbox - チェックボックス
  - Dialog - モーダルダイアログ
  - Dropdown Menu - ドロップダウンメニュー
  - その他のコンポーネント
- **Lucide React** - モダンなアイコンライブラリ
- **Sonner** - トースト通知システム
- **embla-carousel-react** - カルーセルコンポーネント
- **Vaul** - モーダルUI

### スタイリング
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
  - JIT (Just-In-Time) コンパイラによる高速な開発体験
  - レスポンシブデザインのサポート
  - ダークモード対応
- **class-variance-authority** - コンポーネントのバリエーション管理
- **clsx** - 条件付きクラス名の結合ユーティリティ
- **tailwind-merge** - Tailwindクラスの競合解決

### データ可視化
- **Recharts** - Reactベースのチャートライブラリ
  - レスポンシブなグラフ表示
  - アニメーション効果
  - カスタマイズ可能なデザイン

### フォーム管理
- **React Hook Form** - パフォーマンスに優れたフォーム管理ライブラリ
  - 非制御コンポーネントによる効率的なレンダリング
  - バリデーション統合
- **Zod** - TypeScriptファーストのスキーマバリデーションライブラリ
  - 型推論との連携
  - エラーメッセージのカスタマイズ
- **@hookform/resolvers** - フォームバリデーション統合ライブラリ

## バックエンド

### API・データ処理
- **Next.js API Routes** - サーバーサイドAPIエンドポイント
- **YouTube Data API v3** - YouTube動画・チャンネルデータ取得

### 認証
- **NextAuth.js** - Next.js用認証ライブラリ
  - JWTベースの認証
  - OAuth連携

### データエクスポート
- **jspdf** - PDF生成ライブラリ
- **jspdf-autotable** - PDFテーブル生成ライブラリ
- **xlsx** - Excelファイル処理ライブラリ

## 開発ツール

### ビルド・開発環境
- **npm/pnpm** - パッケージマネージャ
- **ESLint** - コード品質管理ツール
- **PostCSS** - CSS変換ツール
- **Tailwind CSS** - ユーティリティCSSフレームワーク

### その他のユーティリティ
- **next-themes** - Next.jsのテーマ管理（ダークモード対応）
- **date-fns** - 日付操作ライブラリ
- **react-day-picker** - カレンダーUIコンポーネント

## デプロイ・インフラ

### ホスティング・デプロイ
- **Vercel** - Next.js最適化されたホスティングプラットフォーム
  - 自動デプロイ
  - エッジキャッシュ
  - サーバーレス関数

### 環境変数管理
- **dotenv** - 環境変数管理
- **Vercel環境変数** - 本番環境の環境変数管理

## バージョン管理・CI/CD

### バージョン管理
- **Git** - ソースコード管理
- **GitHub** - コード共有・コラボレーション

### CI/CD
- **GitHub Actions** - 自動テスト・デプロイ (予定)
- **Vercel CI/CD** - プレビュー環境・本番環境デプロイ 