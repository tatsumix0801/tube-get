# TubeVision 🎥

YouTubeチャンネル情報取得と基本分析を提供するWebアプリケーション

## ✨ 特徴

- 📊 チャンネル基本情報の取得と表示
- 📹 動画一覧表示とフィルタリング機能
- 🖼️ サムネイル一括ダウンロード機能
- 📈 Excelレポート出力機能
- 📱 モダンでレスポンシブなUI
- 🌙 ダークモード対応
- 🔒 セキュアな認証システム
- 📤 PDF/Excelレポート出力機能

## 🚀 技術スタック

詳細は[技術スタック](./docs/technical/technologystack.md)を参照してください。

## 📁 プロジェクト構成

詳細は[ディレクトリ構成](./docs/technical/directorystructure.md)を参照してください。

## 🛠️ セットアップ

### 必要条件

- Node.js 18.0.0以上
- npm または pnpm

### インストール

```bash
# 依存パッケージのインストール
npm install
# または
pnpm install

# 開発サーバーの起動
npm run dev
# または
pnpm dev
```

### 環境変数

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```env
# YouTube API設定
YOUTUBE_API_KEY=your_api_key_here
```

> 注: 現在のバージョンではYouTube API Keyをクライアントサイドのローカルストレージにて管理しています。

## 💻 開発

### コーディング規約

- TypeScriptの型定義を必ず行う
- コンポーネントはAtomic Designに従う
- スタイリングはTailwind CSSを使用
- コミットメッセージは[Conventional Commits](https://www.conventionalcommits.org/)に従う

### ブランチ戦略

[Git-flow（個人開発版）](./GIT-FLOW.md)を採用しています。

#### 主要ブランチ
- `main`: 本番環境用（安定版）
- `develop`: 開発環境用（統合ブランチ）

#### サポートブランチ
- `feature/YYYYMMDD-*`: 新機能開発用
- `hotfix/YYYYMMDD-*`: 緊急修正用
- `release/v*.*`: リリース準備用（オプション）

詳細は[GIT-FLOW.md](./GIT-FLOW.md)を参照してください。

## 📦 ビルド

```bash
# プロダクションビルド
npm run build
# または
pnpm build

# ビルドしたアプリケーションの起動
npm run start
# または
pnpm start
```



## 📝 ライセンス

このプロジェクトは[MITライセンス](LICENSE)の下で公開されています。

## 👥 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/yourusername/tubenavi-app/issues)を作成してください。

## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- その他、このプロジェクトで使用している全てのオープンソースライブラリの作者の皆様 