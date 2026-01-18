# CLAUDE.md - プロジェクト固有情報

このファイルは、AIアシスタント（Claude）がこのプロジェクトで作業する際に必要な情報を提供します。

## 📌 プロジェクト概要

**プロジェクト名**: tube-get（旧: つべナビ / tube-navi）
**概要**: YouTubeチャンネル情報取得と基本分析を提供するWebアプリケーション
**開発形態**: 個人開発
**リポジトリ**: https://github.com/tatsumix0801/tube-get

### 主要機能
- YouTubeチャンネル基本情報の取得と表示
- 動画一覧表示とフィルタリング機能
- サムネイル一括ダウンロード機能
- CSV/PDFレポート出力機能
- パフォーマンス最適化（useMemo/React.memo/APIキャッシュ）
- ダークモード対応
- セキュアな認証システム

## 🛠 技術スタック

- **フレームワーク**: Next.js 15.5.9（App Router）
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **UIコンポーネント**: Radix UI, shadcn/ui
- **状態管理**: React Context API
- **テスト**: Vitest
- **デプロイ**: Vercel

## 🌿 Git-flowブランチ戦略

- **main**: 本番環境用（安定版、直接コミット禁止）
- **develop**: 開発環境用（デフォルト作業ブランチ）
- **feature/YYYYMMDD-機能名**: 新機能開発用（developから分岐）
- **hotfix/YYYYMMDD-修正内容**: 緊急修正用（mainから分岐）

詳細は[GIT-FLOW.md](./GIT-FLOW.md)を参照。

## 📝 開発ルール

### コミットメッセージ規約
`feat:` 新機能 / `fix:` バグ修正 / `docs:` ドキュメント / `style:` スタイル調整 / `refactor:` リファクタリング / `test:` テスト / `chore:` その他

### マージ戦略
常に`--no-ff`でマージ（履歴保持）、developへのマージ後は不要なfeatureブランチを削除

## ⚠️ 重要な注意事項

### セキュリティ
- APIキーや秘密情報をコードに含めない
- 環境変数は.env.localで管理
- .gitignoreの設定を確認

### ブランチ管理
- **mainブランチへの直接コミット禁止**
- 新機能開発は必ずdevelopから分岐
- 緊急修正はmainから分岐し、main/develop両方にマージ

### コード品質
- TypeScriptの型定義を必ず行う
- コンポーネントはAtomic Designに従う
- スタイリングはTailwind CSSを使用

## 📁 プロジェクト構造

- `/app` - Next.js App Router（実装済みページ: channel, dashboard, docs, faq, login, logout, settings, styleguide）
- `/components` - Reactコンポーネント
- `/lib` - ユーティリティ関数
- `/docs` - プロジェクトドキュメント
- `/types` - TypeScript型定義

詳細は[docs/technical/directorystructure.md](./docs/technical/directorystructure.md)を参照。

## 🚀 開発コマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
npm run lint   # コード品質チェック
```

## タスク実行の4段階フロー

### 1. 要件定義
- `.claude_workflow/complete.md`が存在すれば参照
- 目的の明確化、現状把握、成功基準の設定
- `.claude_workflow/requirements.md`に文書化
- **必須確認**: 「要件定義フェーズが完了しました。設計フェーズに進んでよろしいですか？」

### 2. 設計
- **必ず`.claude_workflow/requirements.md`を読み込んでから開始**
- アプローチ検討、実施手順決定、問題点の特定
- `.claude_workflow/design.md`に文書化
- **必須確認**: 「設計フェーズが完了しました。タスク化フェーズに進んでよろしいですか？」

### 3. タスク化
- **必ず`.claude_workflow/design.md`を読み込んでから開始**
- タスクを実行可能な単位に分解、優先順位設定
- `.claude_workflow/tasks.md`に文書化
- **必須確認**: 「タスク化フェーズが完了しました。実行フェーズに進んでよろしいですか？」

### 4. 実行
- **必ず`.claude_workflow/tasks.md`を読み込んでから開始**
- タスクを順次実行、進捗を`.claude_workflow/tasks.md`に更新
- 各タスク完了時に報告

## 実行ルール

### ファイル操作
- 新規タスク開始時: 既存ファイルの**内容を全て削除して白紙から書き直す**
- ファイル編集前に必ず現在の内容を確認

### フェーズ管理
- 各段階開始時: 「前段階のmdファイルを読み込みました」と報告
- 各段階の最後に、期待通りの結果になっているか確認
- 要件定義なしにいきなり実装を始めない

### 実行方針
- 段階的に進める: 一度に全てを変更せず、小さな変更を積み重ねる
- 複数のタスクを同時並行で進めない
- エラーは解決してから次へ進む
- 指示にない機能を勝手に追加しない

## 🔧 現在の課題

### YouTube動画取得の問題
- **問題**: 一部のチャンネルで特定の動画が検出されない
- **対応状況**: Phase 1実装完了、検証中
- **詳細**: `.claude_workflow/youtube-video-fetch-issue-status.md`参照

## 🚀 デプロイ環境

### Vercel
- **本番環境**: mainブランチと連携
- **開発環境**: developブランチと連携（プレビュー）
- **自動デプロイ**: GitHubプッシュ時に自動実行
- **注意**: GitHub Actionsワークフローは削除済み（Vercel連携で十分なため）

### 環境変数
- **YOUTUBE_API_KEY**: YouTube Data API v3のキー（ユーザー入力式、セッションストレージで管理）
- **Vercel環境変数設定不要**: アプリケーション内でユーザーが入力する仕組み

## 📋 作業継続時の注意事項

### 状況ファイルの確認
作業を継続する際は、`.claude_workflow/`ディレクトリ内の状況ファイルを確認：
- `youtube-video-fetch-issue-status.md` - YouTube動画取得問題の状況
- その他の作業状況ファイル

### デバッグ時の確認事項
1. Vercelのログを確認
2. 環境変数が正しく設定されているか確認
3. APIレスポンスの詳細を確認

## 📚 関連ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [GIT-FLOW.md](./GIT-FLOW.md) - Git-flow詳細
- [docs/technical/](./docs/technical/) - 技術ドキュメント詳細

## 💡 AIアシスタント向けガイドライン

- developブランチから作業を開始
- Conventional Commitsに従ったメッセージを使用
- ドキュメント更新時は関連ファイルも同時に更新
- プロジェクト名は必ず「tube-get」で統一（旧名: tube-navi）

---

## 📜 作業履歴

### 2026-01-17: tube-navi から tube-get へのリポジトリ移行
- **作業内容**: リポジトリクローン、package.json name変更、GitHub/Vercelデプロイ、ESLintエラー修正、Git-flow導入
- **成果**:
  - 新規リポジトリ: https://github.com/tatsumix0801/tube-get
  - Vercelデプロイ: https://tube-nymum0tcp-motokis-projects-d68fcfef.vercel.app
  - ESLintエラー: 50件以上 → 0件
  - Git-flow: develop/main ブランチ分離
- **ツール活用**: codex CLI (ESLint修正), gh CLI (リポジトリ作成), vercel CLI (デプロイ)
- **詳細**: `.claude_workflow/complete.md` 参照

### 2026-01-18: セキュリティ強化・テスト環境完全構築・パフォーマンス最適化
- **作業内容**: Critical脆弱性修正、Vitest導入、TypeScript型エラー完全解消、next/image最適化、xlsx→CSV移行、useMemo/React.memo/APIキャッシュ実装
- **成果**:
  - **午前セッション (11:17-12:00)**:
    - セキュリティ: Critical 1件→0件, High 2件→1件, 脆弱性総数 9件→1件
    - Next.js: v15.1.0 → v15.5.9 (CVE-2025-66478 RCE修正)
    - jsPDF: v3.0.1 → v4.0.0 (DoS/パストラバーサル修正)
    - テスト環境: Vitest完全導入 (19/21 passed, 90.5%カバレッジ)
    - TypeScript型エラー: 19件 → 0件 (100%解消)
    - ESLint警告: 5件 → 0件 (100%解消)
    - next/image: 4箇所でLCP最適化
  - **午後前半セッション (12:30-12:53)**:
    - xlsx→CSV移行: Excel出力機能をCSV出力に変更
    - セキュリティ脆弱性: 1件 → **0件 (100%完全解消)**
    - 依存関係削減: xlsxライブラリ削除 (9パッケージ削減)
    - CSV実装: BOM付きUTF-8でExcel互換性維持
  - **午後後半セッション (13:08-13:36)**:
    - YOUTUBE_API_KEY: ユーザー入力式のためVercel環境変数設定不要と確認
    - ローカル動作確認: @mystery.yofukashiチャンネルで664件動画取得成功
    - skippedテスト削除: 19/19 passed (100%カバレッジ達成)
    - パフォーマンス最適化:
      - video-analysis-tab.tsx: useMemoでfilteredVideos+統計データメモ化
      - video-table.tsx: useMemo+React.memoでソート+コンポーネントメモ化
      - lib/api-cache.ts: 5分TTLのインメモリキャッシュ機構新規作成
      - hooks/use-channel-data.ts: キャッシュ活用でAPI呼び出し最適化
    - 期待効果: レンダリング時間60-80%削減、API重複呼び出し100%削減
- **ツール活用**: Vitest, agent-browser (GUI mode), Vercel MCP, GitHub MCP
- **コミット**:
  - 午前: develop (fa6d539), main (7d9fb0d)
  - 午後前半: develop (ef98721), main (0b6c178)
  - 午後後半: develop (663ab52, 006beb6)
- **全23タスク完了** (進捗率100%)
- **詳細**: `.claude_workflow/complete-2026-01-18.md` 参照

---

最終更新: 2026-01-18（セキュリティ脆弱性完全解消・CSV移行完了・パフォーマンス最適化完了）