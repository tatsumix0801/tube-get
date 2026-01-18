# 貢献ガイドライン

tube-getプロジェクトへの貢献に興味を持っていただき、ありがとうございます！

このドキュメントは、開発環境のセットアップから、コード貢献、リリースプロセスまでをガイドします。

---

## 📌 はじめに

tube-getは個人開発プロジェクトですが、将来的な拡張やAIアシスタント（Claude）との協業を想定して、標準的な開発プロセスを採用しています。

---

## 1. 開発環境セットアップ

### 1.1 必要条件

開発を始める前に、以下のツールをインストールしてください：

| ツール | バージョン | ダウンロード |
|--------|------------|--------------|
| **Node.js** | 20.x LTS | https://nodejs.org/ |
| **npm** | 10.x | Node.jsに同梱 |
| **Git** | 最新版 | https://git-scm.com/ |

#### バージョン確認コマンド

```bash
node -v    # v20.x.x が表示されればOK
npm -v     # 10.x.x が表示されればOK
git --version  # git version 2.x.x が表示されればOK
```

### 1.2 セットアップ手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/tatsumix0801/tube-get.git
cd tube-get

# 2. developブランチにチェックアウト（開発のベースブランチ）
git checkout develop

# 3. 依存関係をインストール
npm install

# 4. 開発サーバーを起動
npm run dev

# 5. ブラウザで確認
# http://localhost:3000 にアクセス
```

#### 正常に起動できた場合

- ブラウザでログインページが表示される
- ターミナルに `Ready in XXXms` と表示される

#### トラブルシューティング

**問題: `npm install` でエラー**
```bash
# node_modules と package-lock.json を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

**問題: ポート3000が使用中**
```bash
# ポートを変更して起動
PORT=3001 npm run dev
```

---

## 2. ブランチ戦略

tube-getは、**Git-flow** ブランチ戦略を採用しています。

詳細は [GIT-FLOW.md](./GIT-FLOW.md) を参照してください。

### 2.1 基本ルール

#### ✅ DO（推奨）

- **developブランチから作業開始**
  ```bash
  git checkout develop
  git pull origin develop
  ```

- **機能開発時はfeatureブランチ作成**
  ```bash
  git checkout -b feature/YYYYMMDD-機能名
  ```

- **マージ時は --no-ff を使用**
  ```bash
  git merge --no-ff feature/YYYYMMDD-機能名
  ```

#### ❌ DON'T（禁止）

- **mainブランチへの直接コミット禁止**
  ```bash
  # ❌ これはしない
  git checkout main
  git commit -m "..."
  git push origin main
  ```

- **force pushの使用禁止**
  ```bash
  # ❌ これはしない
  git push --force origin main
  ```

### 2.2 ブランチ命名規則

```
feature/YYYYMMDD-機能名    # 新機能開発
hotfix/YYYYMMDD-修正内容   # 緊急修正
```

**例**:
```bash
feature/20260118-video-filter
hotfix/20260118-login-bug
```

---

## 3. コミットメッセージ

### 3.1 Conventional Commits形式

コミットメッセージは、以下の形式で記述してください：

```
<type>: <description>

[optional body]

[optional footer]
```

#### Type（種別）

| Type | 説明 | 例 |
|------|------|-----|
| `feat` | 新機能追加 | `feat: 動画フィルター機能を追加` |
| `fix` | バグ修正 | `fix: ログインエラーを修正` |
| `docs` | ドキュメント変更 | `docs: READMEを更新` |
| `style` | コードフォーマット | `style: ESLint警告を修正` |
| `refactor` | リファクタリング | `refactor: API呼び出しを最適化` |
| `test` | テスト追加/修正 | `test: ユニットテストを追加` |
| `chore` | その他の変更 | `chore: 依存関係を更新` |

### 3.2 コミットメッセージの例

#### ✅ 良い例

```bash
feat: 動画フィルター機能を追加

視聴回数、公開日、タイトルでフィルタリング可能にした。
ユーザーインターフェースにフィルタードロップダウンを追加。

Closes #42
```

```bash
fix: ログインAPI 500エラーを修正

Cookieのsecureフラグを環境に応じて動的に設定するよう修正。
本番環境でのログイン問題を解決。
```

#### ❌ 悪い例

```bash
# ❌ 種別がない
Update files

# ❌ 説明が不明確
fix: bug

# ❌ 日本語と英語が混在
feat: add 動画フィルター
```

---

## 4. コードレビューチェックリスト

コミット前に、以下をチェックしてください：

### 4.1 コード品質

- [ ] **TypeScript型エラーなし**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **ESLintエラーなし**
  ```bash
  npm run lint
  ```

- [ ] **テストが全てパス**
  ```bash
  npm run test
  ```

- [ ] **ビルドが成功する**
  ```bash
  npm run build
  ```

### 4.2 コーディング規約

- [ ] [CODING_STANDARDS.md](./docs/developer/CODING_STANDARDS.md) に従っている
- [ ] `any` 型を使用していない
- [ ] コンポーネントにProps型定義がある
- [ ] インポート順序が正しい

### 4.3 パフォーマンス

- [ ] 不要な再レンダリングを防ぐため、`useMemo`/`useCallback`/`React.memo` を適切に使用
- [ ] `<Image>` コンポーネントを使用（`<img>` ではなく）
- [ ] 大量データの処理時、適切にメモ化している

### 4.4 アクセシビリティ

- [ ] すべての画像に `alt` 属性がある
- [ ] ボタンに適切な `aria-label` がある（アイコンのみの場合）
- [ ] キーボード操作が可能

---

## 5. リリースプロセス

### 5.1 通常リリース（develop → main）

```bash
# Step 1: developで開発完了
git checkout develop
git add .
git commit -m "feat: 新機能完成"
git push origin develop

# Step 2: Vercel Previewで動作確認
# → https://vercel.com/dashboard で Preview URL確認

# Step 3: mainにマージ
git checkout main
git pull origin main
git merge --no-ff develop
git push origin main

# Step 4: 本番環境で動作確認
# → https://tube-get-red.vercel.app で確認

# Step 5: タグ付け（オプション）
git tag -a v1.2.0 -m "Release v1.2.0: 新機能追加"
git push origin v1.2.0
```

### 5.2 Hotfixリリース（緊急修正）

```bash
# Step 1: mainから分岐
git checkout main
git checkout -b hotfix/20260118-critical-fix

# Step 2: 修正
# ... ファイル編集 ...
git add .
git commit -m "fix: 緊急バグを修正"
git push origin hotfix/20260118-critical-fix

# Step 3: mainにマージ
git checkout main
git merge --no-ff hotfix/20260118-critical-fix
git tag -a v1.1.1 -m "Hotfix v1.1.1"
git push origin main --tags

# Step 4: developにも反映（重要）
git checkout develop
git merge --no-ff main
git push origin develop
```

詳細は [DEPLOYMENT.md](./docs/developer/DEPLOYMENT.md) を参照。

---

## 6. プルリクエスト（個人開発では通常不要）

tube-getは個人開発プロジェクトのため、通常はPRを作成せず、直接developにマージします。

ただし、大規模な変更や実験的な機能の場合、PRを作成して記録を残すことも可能です。

### 6.1 PR作成手順（オプション）

```bash
# featureブランチをプッシュ
git push origin feature/20260118-experimental

# GitHubでPR作成
# Base: develop ← Compare: feature/20260118-experimental
```

#### PRテンプレート

```markdown
## 概要
この変更の目的を簡潔に説明

## 変更内容
- 変更1
- 変更2

## テスト
- [ ] ローカルでビルド成功
- [ ] ユニットテスト追加
- [ ] 手動テスト完了

## スクリーンショット（UI変更の場合）
![スクリーンショット](URL)
```

---

## 7. 開発ワークフロー

### 7.1 日常的な開発フロー

```bash
# 1. 最新のdevelopを取得
git checkout develop
git pull origin develop

# 2. 機能開発ブランチ作成
git checkout -b feature/20260118-new-feature

# 3. 開発
npm run dev
# コード編集...

# 4. 品質チェック
npm run lint
npx tsc --noEmit
npm run test
npm run build

# 5. コミット
git add .
git commit -m "feat: 新機能を追加"

# 6. リモートにプッシュ
git push origin feature/20260118-new-feature

# 7. developにマージ
git checkout develop
git merge --no-ff feature/20260118-new-feature
git push origin develop

# 8. featureブランチ削除
git branch -d feature/20260118-new-feature
git push origin --delete feature/20260118-new-feature
```

### 7.2 コマンド一覧

```bash
# 開発サーバー起動
npm run dev

# Lint実行
npm run lint

# Lint自動修正
npm run lint -- --fix

# TypeScript型チェック
npx tsc --noEmit

# ユニットテスト実行
npm run test

# E2Eテスト実行
npx playwright test

# ビルド
npm run build

# ビルド成果物で起動
npm run start
```

---

## 8. よくある質問（FAQ）

### Q1: developとmainの違いは？

**A**:
- **develop**: 開発中の最新コード（不安定な可能性あり）
- **main**: 本番環境用の安定版コード

### Q2: featureブランチはいつ作る？

**A**:
- 小さな変更（typo修正など）: developに直接コミットOK
- 大きな変更（新機能追加など）: featureブランチ作成を推奨

### Q3: コミットメッセージは日本語でもいい？

**A**:
- 個人開発なので日本語でもOK
- ただし、`type:` 部分は英語（`feat:`, `fix:` など）を推奨

### Q4: 本番環境にデプロイするには？

**A**:
- mainブランチにプッシュするだけで、Vercelが自動デプロイします

---

## 9. サポート

### ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [GIT-FLOW.md](./GIT-FLOW.md) - Git-flow詳細
- [docs/developer/](./docs/developer/) - 開発者向けドキュメント
  - [CODING_STANDARDS.md](./docs/developer/CODING_STANDARDS.md)
  - [ARCHITECTURE.md](./docs/developer/ARCHITECTURE.md)
  - [ENVIRONMENTS.md](./docs/developer/ENVIRONMENTS.md)
  - [DEPLOYMENT.md](./docs/developer/DEPLOYMENT.md)
  - [DISASTER_RECOVERY.md](./docs/developer/DISASTER_RECOVERY.md)

### 問題報告

バグや改善提案は、GitHub Issuesで報告してください：
- https://github.com/tatsumix0801/tube-get/issues

---

*最終更新: 2026-01-18*
*プロジェクト: tube-get v1.0.0*
