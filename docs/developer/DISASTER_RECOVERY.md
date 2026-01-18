# 障害復旧手順

このドキュメントは、tube-getプロジェクトで障害が発生した際の復旧手順を説明します。

## 📌 概要

tube-getで障害が発生した場合、迅速な復旧が最優先です。本ドキュメントでは、よくある障害パターンと対処法をまとめています。

---

## 1. よくある障害パターン

### パターンA: ビルド失敗

#### 症状
- Vercelデプロイが失敗する
- "Build failed" または "Error during build" 表示

#### 対処手順

**Step 1: Vercelデプロイログ確認**

```bash
# Vercelダッシュボードにアクセス
open https://vercel.com/dashboard

# tube-get プロジェクト → Deployments → 失敗デプロイをクリック
# "View Function Logs" または "Build Logs" でエラー詳細確認
```

**Step 2: エラー原因特定**

よくあるエラー:
- **TypeScript型エラー**: `Type 'X' is not assignable to type 'Y'`
- **依存関係エラー**: `Cannot find module 'xxx'`
- **ビルドスクリプトエラー**: `npm ERR! code ELIFECYCLE`

**Step 3: ローカルで再現確認**

```bash
# クリーンインストール
npm ci

# ビルド実行
npm run build

# エラーが再現するか確認
```

**Step 4: 修正してプッシュ**

```bash
# エラー修正...

# 変更をコミット
git add .
git commit -m "fix: ビルドエラーを修正"

# プッシュして再デプロイ
git push origin develop  # または main
```

#### 緊急時の対応（即座ロールバック）

修正に時間がかかる場合、先にロールバックして復旧:

```bash
# Vercelダッシュボード → tube-get → Deployments
# 正常動作していたデプロイ → "..." → "Promote to Production"
```

---

### パターンB: ランタイムエラー（500エラー）

#### 症状
- 本番環境でページアクセス時に500エラー
- "Internal Server Error" または白い画面

#### 対処手順

**Step 1: Vercel Function Logsでエラー確認**

```bash
# Vercelダッシュボードにアクセス
open https://vercel.com/dashboard

# tube-get プロジェクト → Functions → Logs
# エラースタックトレースを確認
```

**典型的なエラー例**:
```
Error: Cannot read property 'xxx' of undefined
  at /var/task/app/api/auth/route.js:42
```

**Step 2: 問題のAPIルート特定**

エラースタックトレースから問題のファイルを特定:
- `/app/api/auth/route.ts` → 認証APIエラー
- `/app/api/docs/route.ts` → ドキュメントAPIエラー
- `/lib/youtube-api.ts` → YouTube API呼び出しエラー

**Step 3: ローカルで再現確認**

```bash
# 開発サーバー起動
npm run dev

# ブラウザで問題のルートにアクセス
open http://localhost:3000/api/auth

# コンソールでエラー確認
```

**Step 4: 修正 or ロールバック**

即座修正可能な場合:
```bash
# Hotfixブランチで修正
git checkout main
git checkout -b hotfix/20260118-500-error

# 修正...
git add .
git commit -m "fix: 500エラーを修正"
git push origin hotfix/20260118-500-error

# mainにマージ → 自動デプロイ
git checkout main
git merge --no-ff hotfix/20260118-500-error
git push origin main
```

時間がかかる場合:
```bash
# Vercelダッシュボードから即座ロールバック
# （パターンA参照）
```

---

### パターンC: 認証エラー

#### 症状
- ログインできない
- ログイン後すぐにログアウトされる
- 無限リダイレクトループ

#### 対処手順

**Step 1: lib/auth.ts のCookie設定確認**

```bash
# lib/auth.ts を開く
# secure フラグが環境に応じて正しく設定されているか確認
```

正しい設定:
```typescript
{
  name: 'session',
  value: sessionToken,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // ← ここ重要
  sameSite: 'lax',
  maxAge: 60 * 60 * 24, // 24時間
  path: '/'
}
```

**よくある問題**:
- `secure: true` がローカル開発でも設定されている → ローカルでログイン不可
- `secure: false` が本番でも設定されている → セキュリティリスク

**Step 2: NODE_ENV環境確認**

```bash
# Vercelダッシュボード → tube-get → Settings → Environment Variables
# NODE_ENV が "production" に設定されているか確認
```

**Step 3: Cookie設定のデバッグ**

ブラウザの開発者ツールで確認:
1. F12 → Application タブ → Cookies
2. `session` Cookieの属性確認:
   - `Secure`: 本番では `✓`、ローカルでは空白
   - `HttpOnly`: `✓`
   - `SameSite`: `Lax`

**Step 4: 修正してデプロイ**

```bash
# lib/auth.ts を修正
git add lib/auth.ts
git commit -m "fix: Cookie secure フラグを環境に応じて設定"
git push origin main
```

---

### パターンD: YouTube API呼び出しエラー

#### 症状
- チャンネル検索時にエラー
- "Failed to fetch channel data" メッセージ表示

#### 対処手順

**Step 1: APIキーの確認**

```bash
# ユーザーに再入力を促す
# Settings ページ → YouTube API Key フィールド
```

**Step 2: YouTube Data API v3のクォータ確認**

```bash
# Google Cloud Consoleでクォータ確認
open https://console.cloud.google.com/apis/api/youtube.googleapis.com/quotas
```

**クォータ超過の場合**:
- 日次クォータリセットまで待つ（UTC 0:00）
- 一時的にキャッシュのみで対応

**Step 3: APIレスポンスのデバッグ**

```bash
# lib/youtube-api.ts に debugLog 追加
# レスポンスを確認
npm run dev
```

**Step 4: エラーハンドリング改善**

```typescript
// lib/youtube-api.ts
try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }
  return await response.json();
} catch (error) {
  console.error('YouTube API call failed:', error);
  throw error;
}
```

---

### パターンE: デプロイタイムアウト

#### 症状
- Vercelデプロイが "Building" のまま進まない
- 10分以上経過してもデプロイ完了しない

#### 対処手順

**Step 1: デプロイキャンセル**

```bash
# Vercelダッシュボード → tube-get → Deployments
# 該当デプロイ → "..." → "Cancel Deployment"
```

**Step 2: 原因特定**

よくある原因:
- **大量の依存関係**: `node_modules` が巨大
- **重い処理**: ビルド時に大量のデータ処理
- **Vercelの一時的障害**: https://www.vercel-status.com/ で確認

**Step 3: 対処**

依存関係が原因の場合:
```bash
# package.json から不要な依存関係を削除
npm uninstall <package-name>

# package-lock.json 再生成
rm package-lock.json
npm install

# コミットしてプッシュ
git add .
git commit -m "chore: 不要な依存関係を削除"
git push origin develop
```

Vercel障害の場合:
- ステータスページで復旧を待つ
- 復旧後、Redeployを実行

---

## 2. 復旧優先順位

障害発生時の対応優先順位:

### 優先度1: 最優先（即座復旧）

**対象**: 本番環境が完全にダウンしている状態
- 500エラーで全ページアクセス不可
- ビルド失敗で本番デプロイが止まっている

**対応**: ロールバックで即座復旧
```bash
# Vercelダッシュボードから前バージョンをPromote to Production
# 所要時間: 1-2分
```

### 優先度2: 高（Hotfixで修正）

**対象**: 一部機能が使えない状態
- ログイン機能が動作しない
- 特定のAPIエンドポイントがエラー

**対応**: Hotfixブランチで修正し、即座デプロイ
```bash
# 所要時間: 10-30分（修正内容による）
```

### 優先度3: 中（調査してから対応）

**対象**: パフォーマンス低下、軽微なバグ
- ページ読み込みが遅い
- 一部のデータ表示が不正確

**対応**: 原因調査後、通常のリリースフローで修正
```bash
# 所要時間: 数時間〜1日
```

---

## 3. 連絡先・エスカレーション

### 3.1 外部サービスのステータスページ

#### Vercel Status
- URL: https://www.vercel-status.com/
- 確認内容: Vercelプラットフォームの障害情報

#### GitHub Status
- URL: https://www.githubstatus.com/
- 確認内容: GitHubサービスの障害情報

#### YouTube Data API Status
- URL: https://status.cloud.google.com/
- 確認内容: Google Cloud Platformの障害情報

### 3.2 エスカレーション手順

#### Level 1: 自己解決（10分以内）
- 本ドキュメントの対処手順を実行
- ロールバックで即座復旧

#### Level 2: 調査・修正（30分以内）
- ログ詳細確認
- Hotfixブランチで修正

#### Level 3: 外部サポート（1時間以上）
- Vercelサポートに問い合わせ
- GitHub/Google Cloudサポートに問い合わせ

---

## 4. 事前準備（障害発生前）

### 4.1 定期的なバックアップ確認

```bash
# GitHubリポジトリが最新状態か確認
git status
git log --oneline -5

# すべての変更がプッシュされているか確認
```

### 4.2 デプロイ履歴の確認

```bash
# Vercelダッシュボードで過去のデプロイ履歴確認
# 正常動作するバージョンを特定しておく
```

### 4.3 ローカル環境の整備

```bash
# ローカルで最新コードをビルド可能な状態に保つ
git pull origin develop
npm ci
npm run build
```

---

## 5. 障害発生時のチェックリスト

### 発生直後（0-5分）

- [ ] 障害の影響範囲を特定（全ページ or 一部機能）
- [ ] Vercelデプロイログを確認
- [ ] 外部サービスのステータスページを確認

### 初動対応（5-15分）

- [ ] ロールバックで即座復旧（可能であれば）
- [ ] エラーログを保存（後の調査用）
- [ ] 問題のコミットを特定

### 根本対応（15分〜）

- [ ] 原因を特定
- [ ] Hotfixブランチで修正
- [ ] ローカルで動作確認
- [ ] 本番環境にデプロイ
- [ ] 復旧確認

### 事後対応（障害復旧後）

- [ ] 障害報告ドキュメント作成
- [ ] 再発防止策の検討
- [ ] 本ドキュメントの更新（必要に応じて）

---

## 6. 障害報告テンプレート

障害発生時、以下のテンプレートで記録を残すことを推奨します。

```markdown
## 障害報告

### 基本情報
- **発生日時**: 2026-01-18 15:30 JST
- **影響範囲**: 本番環境全体 / 一部機能
- **復旧日時**: 2026-01-18 15:45 JST

### 症状
- どのような障害が発生したか
- ユーザーへの影響

### 原因
- エラーログ
- 問題のコミット/コード

### 対処
- 実施した復旧手順
- ロールバック or Hotfix修正

### 再発防止策
- 今後の対策
- モニタリング強化など

### 参考リンク
- Vercelデプロイログ: <URL>
- GitHubコミット: <URL>
```

---

*最終更新: 2026-01-18*
*参照: [DEPLOYMENT.md](./DEPLOYMENT.md), [ENVIRONMENTS.md](./ENVIRONMENTS.md)*
