# デプロイ手順

このドキュメントは、tube-getプロジェクトのデプロイ手順を説明します。

## 📌 概要

tube-getは、Git-flow戦略に基づき、developブランチで開発し、mainブランチへマージすることで本番環境にデプロイされます。Vercelの自動デプロイ機能により、プッシュするだけでデプロイが完了します。

---

## 1. 通常リリースフロー

### Step 1: developブランチで開発

```bash
# developブランチにチェックアウト
git checkout develop

# 最新のコードを取得
git pull origin develop

# 機能開発（必要に応じてfeatureブランチ作成）
git checkout -b feature/20260118-new-feature

# 開発作業...
# ファイル編集、テスト実行など

# 変更をステージング
git add .

# コミット（Conventional Commits形式）
git commit -m "feat: 新機能を追加"

# featureブランチをリモートにプッシュ
git push origin feature/20260118-new-feature
```

### Step 2: developブランチへマージ

```bash
# developブランチに切り替え
git checkout develop

# featureブランチをマージ（no-ff でマージコミット作成）
git merge --no-ff feature/20260118-new-feature

# リモートdevelopにプッシュ
git push origin develop
```

**結果**:
- Vercel Preview Deploy が自動実行される
- Preview URLがGitHubコミットステータスに表示される

### Step 3: Preview環境で動作確認

```bash
# Vercelダッシュボードでデプロイ確認
open https://vercel.com/dashboard
```

#### 確認項目チェックリスト

- [ ] ページが正常に表示される
- [ ] 新機能が意図通り動作する
- [ ] 既存機能が壊れていない
- [ ] レスポンスタイムが許容範囲内
- [ ] コンソールエラーがない

#### Preview URLの確認方法

1. **GitHubのCommit Statusから**
   - GitHubリポジトリの最新コミットを表示
   - Vercelボットのチェックステータスから Preview URLクリック

2. **Vercelダッシュボードから**
   - https://vercel.com/dashboard → `tube-get` プロジェクト
   - Deployments タブ → 最新のPreview Deployment
   - "Visit" ボタンをクリック

### Step 4: mainブランチへマージ（本番リリース）

```bash
# mainブランチに切り替え
git checkout main

# 最新のmainを取得
git pull origin main

# developブランチをマージ（no-ff でマージコミット作成）
git merge --no-ff develop

# リモートmainにプッシュ
git push origin main
```

**結果**:
- Vercel Production Deploy が自動実行される
- 本番環境 https://tube-get-red.vercel.app に反映される

### Step 5: 本番環境で動作確認

```bash
# 本番URLにアクセス
open https://tube-get-red.vercel.app
```

#### 本番確認チェックリスト

- [ ] 本番URLでページが正常に表示される
- [ ] 新機能が動作する
- [ ] 認証（ログイン/ログアウト）が動作する
- [ ] APIレスポンスが正常
- [ ] パフォーマンスが許容範囲内

### Step 6: タグ付け（オプション）

重要なリリースには、バージョンタグを付けることを推奨します。

```bash
# mainブランチでタグ作成（Semantic Versioning）
git tag -a v1.2.0 -m "Release v1.2.0: 新機能追加"

# タグをリモートにプッシュ
git push origin v1.2.0

# すべてのタグをプッシュ（複数タグ作成時）
git push origin --tags
```

**Semantic Versioning（セマンティックバージョニング）**:
- `v1.0.0` → メジャーリリース（破壊的変更）
- `v1.1.0` → マイナーリリース（新機能追加）
- `v1.1.1` → パッチリリース（バグ修正）

---

## 2. Hotfixフロー（緊急修正）

本番環境で緊急のバグが発見された場合、Hotfixブランチで修正します。

### Step 1: mainブランチから分岐

```bash
# mainブランチに切り替え
git checkout main

# 最新のmainを取得
git pull origin main

# Hotfixブランチ作成（日付付き命名）
git checkout -b hotfix/20260118-login-fix
```

### Step 2: 修正作業

```bash
# バグ修正...
# ファイル編集

# ローカルで動作確認
npm run dev
npm run test
npm run build

# 変更をステージング
git add .

# コミット
git commit -m "fix: ログインエラーを修正"

# Hotfixブランチをリモートにプッシュ
git push origin hotfix/20260118-login-fix
```

**結果**:
- Vercel Preview Deploy が自動実行される
- Preview環境で修正内容を確認可能

### Step 3: mainブランチへマージ

```bash
# mainブランチに切り替え
git checkout main

# Hotfixブランチをマージ（no-ff）
git merge --no-ff hotfix/20260118-login-fix

# タグ付け（パッチバージョンアップ）
git tag -a v1.1.1 -m "Hotfix v1.1.1: ログインエラー修正"

# mainブランチとタグをリモートにプッシュ
git push origin main --tags
```

**結果**:
- Vercel Production Deploy が自動実行される
- 本番環境に緊急修正が反映される

### Step 4: developブランチにも反映（重要）

```bash
# developブランチに切り替え
git checkout develop

# mainブランチの変更をマージ
git merge --no-ff main

# リモートdevelopにプッシュ
git push origin develop
```

**理由**: developブランチにも修正を反映しないと、次回のリリース時に修正が失われてしまいます。

### Step 5: Hotfixブランチ削除

```bash
# ローカルブランチ削除
git branch -d hotfix/20260118-login-fix

# リモートブランチ削除
git push origin --delete hotfix/20260118-login-fix
```

---

## 3. ロールバック手順

デプロイ後に問題が発見された場合、Vercelダッシュボードから即座にロールバックできます。

### 方法1: Vercelダッシュボードから（推奨）

#### Step 1: Vercelダッシュボードにアクセス

```bash
open https://vercel.com/dashboard
```

#### Step 2: tube-getプロジェクトを選択

ダッシュボードから `tube-get` プロジェクトをクリック

#### Step 3: Deploymentsタブを開く

左サイドバーから **Deployments** タブをクリック

#### Step 4: 正常動作していたデプロイを選択

デプロイ一覧から、問題が発生する前の正常なデプロイを選択

#### Step 5: "Promote to Production" 実行

1. 右上の "..." メニューをクリック
2. **Promote to Production** を選択
3. 確認ダイアログで **Promote** をクリック

**結果**:
- 選択したデプロイが本番環境に即座に反映される
- 数秒でロールバック完了

### 方法2: Gitでロールバック（非推奨）

緊急時のみ使用。通常はVercelダッシュボードからのロールバックを推奨。

```bash
# mainブランチで以前のコミットに戻す
git checkout main
git revert HEAD
git push origin main
```

**注意**: `git revert` は新しいコミットを作成するため、履歴が残ります（推奨）。`git reset --hard` は履歴を削除するため、チーム開発では使用しないでください。

---

## 4. デプロイ確認コマンド

### 4.1 ローカルでビルド確認（デプロイ前）

```bash
# 依存関係インストール（clean install）
npm ci

# Lint実行
npm run lint

# TypeScript型チェック
npx tsc --noEmit

# ユニットテスト実行
npm run test

# プロダクションビルド
npm run build

# ビルド成果物確認
npm run start
```

すべてのコマンドがエラーなく完了すれば、デプロイ準備完了です。

### 4.2 デプロイステータス確認

```bash
# GitHub Actionsワークフロー確認
open https://github.com/tatsumix0801/tube-get/actions

# Vercelデプロイログ確認
open https://vercel.com/dashboard
```

### 4.3 本番環境ヘルスチェック

```bash
# HTTPステータス確認
curl -I https://tube-get-red.vercel.app

# 期待結果: HTTP/2 200 または 302
```

```bash
# JSONレスポンス確認（APIエンドポイント）
curl https://tube-get-red.vercel.app/api/docs

# 期待結果: JSON形式のレスポンス
```

---

## 5. CI/CDパイプライン

### 5.1 GitHub Actionsワークフロー

tube-getでは、GitHub Actionsで自動チェックを実行します（`.github/workflows/ci.yml`）。

```yaml
トリガー:
  - pull_request (develop, main へのPR)
  - push (develop, main へのプッシュ)

ジョブ（並列実行）:
  1. lint: ESLint実行
  2. typecheck: TypeScript型チェック
  3. test: Vitest実行

ジョブ（直列実行）:
  4. build: Next.js ビルド（全チェック完了後）
```

### 5.2 CI/CDフロー図

```
[コミット]
    │
    ├─ GitHub Actions CI
    │   ├─ ESLint ✓
    │   ├─ TypeScript ✓
    │   ├─ Vitest ✓
    │   └─ Build ✓
    │
    ├─ CI成功
    │
    ▼
[developプッシュ] → Vercel Preview Deploy
    │
    ▼
[Preview確認]
    │
    ▼
[mainマージ] → Vercel Production Deploy
    │
    ▼
[本番環境反映]
```

---

## 6. デプロイ時の注意事項

### 6.1 破壊的変更を含むリリース

APIの変更や、データベーススキーマ変更など、破壊的変更を含む場合:

1. **事前告知**: ユーザーに変更内容を通知
2. **マイグレーション**: データベーススキーマ変更の場合、マイグレーションスクリプト実行
3. **段階的リリース**: 可能であれば、機能フラグで段階的にリリース
4. **ロールバック準備**: 問題発生時のロールバック手順を事前確認

### 6.2 依存関係の更新

`package.json` の依存関係を更新した場合:

```bash
# package-lock.jsonも含めてコミット
git add package.json package-lock.json
git commit -m "chore: 依存関係を更新"
```

### 6.3 環境変数の追加

新しい環境変数を追加した場合:

1. Vercelダッシュボードで環境変数を設定
2. Redeployを実行（Settings → Environment Variables → Save後）

---

## 7. トラブルシューティング

### 7.1 問題: デプロイが失敗する

**症状**:
- Vercelダッシュボードで "Failed" 表示

**対処**:

1. **デプロイログ確認**
   ```
   Vercel Dashboard → tube-get → Deployments → 失敗デプロイ → View Function Logs
   ```

2. **ローカルでビルド確認**
   ```bash
   npm ci
   npm run build
   ```

3. **エラー内容に応じて修正**
   - TypeScriptエラー → 型定義修正
   - 依存関係エラー → `npm ci` 再実行
   - 環境変数エラー → Vercel設定確認

4. **修正後、再デプロイ**
   ```bash
   git add .
   git commit -m "fix: ビルドエラーを修正"
   git push origin develop
   ```

### 7.2 問題: 本番環境で500エラー

**症状**:
- デプロイは成功したが、ページアクセス時に500エラー

**対処**:

1. **Vercel Function Logs確認**
   ```
   Vercel Dashboard → tube-get → Functions → Logs
   ```

2. **エラースタックトレース確認**
   - どのAPIルートでエラーが発生しているか特定

3. **ローカルで再現確認**
   ```bash
   npm run dev
   # エラーが再現するか確認
   ```

4. **修正 or ロールバック**
   - 即座修正可能 → Hotfixブランチで修正
   - 時間がかかる → Vercelダッシュボードからロールバック

### 7.3 問題: Preview Deployが反映されない

**症状**:
- developにプッシュしたが、Preview URLが更新されない

**対処**:

1. **Vercelデプロイ状態確認**
   ```
   Vercel Dashboard → tube-get → Deployments
   ```

2. **GitHub連携確認**
   - Vercel Dashboard → tube-get → Settings → Git
   - Production Branch: `main`
   - Connected Branches: `develop`, `feature/*`

3. **手動Redeploy**
   ```
   Vercel Dashboard → tube-get → Deployments → 最新deploy → "..." → Redeploy
   ```

---

## 8. デプロイチェックリスト

### リリース前

- [ ] ローカルで `npm run build` が成功する
- [ ] すべてのテストがパスする (`npm run test`)
- [ ] ESLintエラーがない (`npm run lint`)
- [ ] TypeScript型エラーがない (`npx tsc --noEmit`)
- [ ] コミットメッセージがConventional Commits形式
- [ ] developブランチで動作確認済み

### リリース後

- [ ] 本番URLでページが正常に表示される
- [ ] 主要機能が動作する（ログイン、チャンネル検索など）
- [ ] Vercelデプロイログにエラーがない
- [ ] パフォーマンスが許容範囲内
- [ ] 必要に応じてタグ付け完了

---

*最終更新: 2026-01-18*
*参照: [GIT-FLOW.md](../../GIT-FLOW.md), [ENVIRONMENTS.md](./ENVIRONMENTS.md), [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md)*
