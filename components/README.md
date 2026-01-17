# コンポーネントディレクトリ 🧩

このディレクトリはアプリケーション全体で再利用可能なReactコンポーネントを含んでいます。

## 📑 コンポーネント分類

- `ui/` - 汎用UIコンポーネント（ボタン、カード、モーダルなど）
- フォームコンポーネント（login-form.tsx, channel-info-form.tsxなど）
- レイアウトコンポーネント（layout.tsx, header.tsxなど）
- 機能コンポーネント（video-table.tsx, channel-tags.tsxなど）
- ユーティリティコンポーネント（error-boundary.tsx, theme-provider.tsxなど）

## 🔑 主要コンポーネント

- `layout.tsx` - アプリケーションの基本レイアウト
- `header.tsx` - グローバルナビゲーションヘッダー
- `video-table.tsx` - 動画一覧表示テーブル
- `login-form.tsx` - ユーザー認証フォーム
- `error-boundary.tsx` - エラーハンドリング

## 🎨 設計原則

- コンポーネントは単一責任の原則に従う
- Props経由で依存関係を注入する
- スタイリングはTailwind CSSを使用
- 状態管理はReact Hooksで実装
- アクセシビリティに配慮する

## 📌 注意点

- 新しいコンポーネントを作成する際は既存のデザインシステムに準拠してください
- 複雑なコンポーネントはより小さなサブコンポーネントに分割してください
- すべてのコンポーネントは適切な型定義（TypeScript）を持つようにしてください
- UIコンポーネントは`ui/`ディレクトリに配置してください 