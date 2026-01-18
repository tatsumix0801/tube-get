# 環境設定

このドキュメントは、tube-getプロジェクトの環境構成と設定方法を説明します。

## 📌 概要

tube-getは3つの環境で動作します：本番環境（Production）、ステージング環境（Staging/Preview）、ローカル開発環境（Local）。

---

## 1. 環境一覧

| 環境 | URL | ブランチ | 用途 | デプロイ方法 |
|------|-----|---------|------|--------------|
| **本番** | https://tube-get-red.vercel.app | `main` | 公開環境 | Vercel自動デプロイ |
| **ステージング** | `tube-get-<hash>-<team>.vercel.app` | `develop`, `feature/*` | 確認環境 | Vercel Preview Deploy |
| **ローカル** | http://localhost:3000 | - | 開発環境 | `npm run dev` |

---

## 2. 環境変数

### 2.1 本番/ステージング（Vercel）

**重要**: tube-getでは、YouTube API Keyをサーバー側の環境変数として設定していません。

#### 理由
- **ユーザー入力式**: APIキーはユーザーが設定ページ（`/settings`）で入力
- **セッションストレージ**: ブラウザのセッションストレージで管理
- **セキュリティ**: サーバー側に保存せず、リロード時に再入力が必要

#### Vercel環境変数設定（必要な場合）

将来的にサーバー側APIキーが必要になった場合の設定手順:

1. Vercelダッシュボードにアクセス
   ```
   https://vercel.com/dashboard
   ```

2. `tube-get` プロジェクトを選択

3. **Settings** → **Environment Variables**

4. 以下の変数を追加:
   ```
   Name: YOUTUBE_API_KEY
   Value: <あなたのYouTube Data API v3キー>
   Environment: Production, Preview, Development
   ```

5. **Save** して、**Redeploy** 実行

### 2.2 ローカル開発

#### `.env.local` ファイル（任意）

ローカル開発環境では、`.env.local` ファイルで環境変数を設定できます（gitignore対象）。

**ファイルパス**: `/tube-get/.env.local`

```bash
# 開発用設定（任意）
NODE_ENV=development

# YouTube API Key（ユーザー入力式のため通常不要）
# NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
```

#### `.env.local` 作成手順

```bash
# プロジェクトルートで実行
cd /path/to/tube-get

# .env.localファイル作成
touch .env.local

# エディタで開いて変数を追加
nano .env.local
```

**注意**: `.env.local` は `.gitignore` に含まれており、Gitにコミットされません。

---

## 3. Vercel Preview Deployments（ステージング環境）

### 3.1 自動デプロイトリガー

Vercelは、GitHubリポジトリと連携しており、特定のブランチへのプッシュで自動デプロイされます。

```
develop ブランチへプッシュ → Vercel Preview Deploy
feature/* ブランチへプッシュ → Vercel Preview Deploy
main ブランチへプッシュ → Vercel Production Deploy
```

### 3.2 Preview URL形式

```
https://tube-get-<hash>-<team>.vercel.app
```

**例**:
```
https://tube-get-abc123def-motokis-projects-d68fcfef.vercel.app
```

### 3.3 Preview Deploymentの確認方法

#### 方法1: GitHubのPRコメントから

1. Pull Request作成時、VercelボットがコメントにPreview URLを投稿
2. URLをクリックして確認

#### 方法2: Vercelダッシュボードから

1. https://vercel.com/dashboard にアクセス
2. `tube-get` プロジェクトを選択
3. **Deployments** タブで最新のPreviewデプロイを確認
4. URLをクリックして開く

### 3.4 Preview環境の特徴

- **独立した環境**: 本番環境に影響を与えない
- **自動削除**: マージ後、一定期間経過で自動削除
- **完全なNext.js環境**: 本番と同じ設定で動作

---

## 4. ローカル開発環境セットアップ

### 4.1 必要な環境

| ツール | バージョン | 確認コマンド |
|--------|------------|--------------|
| Node.js | 20.x LTS | `node -v` |
| npm | 10.x | `npm -v` |
| Git | 最新 | `git --version` |

### 4.2 セットアップ手順

```bash
# 1. リポジトリクローン
git clone https://github.com/tatsumix0801/tube-get.git
cd tube-get

# 2. developブランチにチェックアウト
git checkout develop

# 3. 依存関係インストール
npm install

# 4. 開発サーバー起動
npm run dev
```

### 4.3 開発サーバー起動確認

ブラウザで http://localhost:3000 にアクセス

- ログインページが表示されればOK
- パスワード: `admin123`（デフォルト）

### 4.4 ローカルでの動作確認

```bash
# Lint実行
npm run lint

# TypeScript型チェック
npx tsc --noEmit

# ユニットテスト実行
npm run test

# ビルド確認
npm run build
```

---

## 5. 環境別の動作確認

### 5.1 本番環境確認

```bash
# 本番URLにアクセス
open https://tube-get-red.vercel.app

# curlで確認
curl -I https://tube-get-red.vercel.app
```

**期待結果**:
- HTTP 200 OK（または302リダイレクト）
- ログインページが表示される

### 5.2 ステージング環境確認

```bash
# developブランチにプッシュ
git checkout develop
git add .
git commit -m "test: Verify Preview Deploy"
git push origin develop

# Vercelダッシュボードで確認
# https://vercel.com/dashboard → tube-get → Deployments
```

### 5.3 ローカル環境確認

```bash
# 開発サーバー起動
npm run dev

# ブラウザで確認
open http://localhost:3000
```

---

## 6. トラブルシューティング

### 6.1 問題: ローカルでビルドエラー

**症状**:
```
Error: Cannot find module 'next'
```

**対処**:
```bash
# node_modules削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### 6.2 問題: Vercel Preview Deployが失敗

**症状**:
- Vercelダッシュボードで "Failed" 表示

**対処**:
1. Vercelデプロイログ確認
   ```
   https://vercel.com/dashboard → tube-get → Deployments → 失敗デプロイ
   ```

2. ローカルでビルド確認
   ```bash
   npm run build
   ```

3. エラー修正後、再プッシュ
   ```bash
   git add .
   git commit -m "fix: Build error"
   git push origin develop
   ```

### 6.3 問題: 本番環境でログインできない

**症状**:
- パスワード入力後、500エラーまたはリダイレクトループ

**対処**:
1. Vercelログ確認
   ```
   https://vercel.com/dashboard → tube-get → Functions → ログ確認
   ```

2. `lib/auth.ts` のCookie設定確認
   - `secure: NODE_ENV === 'production'` が正しいか確認

3. ロールバック（緊急時）
   ```
   Vercel Dashboard → Deployments → 正常動作版 → "..." → Promote to Production
   ```

---

## 7. 環境変数リファレンス

### 7.1 Next.js標準環境変数

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `NODE_ENV` | `development` \| `production` | 実行環境 |
| `NEXT_PUBLIC_VERCEL_ENV` | `production` \| `preview` \| `development` | Vercel環境種別 |

### 7.2 カスタム環境変数（将来用）

| 変数名 | 必須 | 説明 | 現在の状態 |
|--------|------|------|-----------|
| `YOUTUBE_API_KEY` | No | YouTube Data API v3キー | ユーザー入力式 |
| `PASSWORD` | No | 管理者パスワード | コード内ハードコード（要改善） |

---

## 8. 本番環境への反映フロー

```
[ローカル開発]
    │
    ├─ feature/YYYYMMDD-feature ブランチで開発
    │
    ▼
[developブランチへマージ]
    │
    ├─ Vercel Preview Deploy 自動実行
    │
    ▼
[Preview環境で確認]
    │
    ├─ 問題なければ main へマージ
    │
    ▼
[mainブランチへマージ]
    │
    ├─ Vercel Production Deploy 自動実行
    │
    ▼
[本番環境反映]
    │
    └─ https://tube-get-red.vercel.app で確認
```

詳細は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照。

---

*最終更新: 2026-01-18*
*参照: [DEPLOYMENT.md](./DEPLOYMENT.md), [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)*
