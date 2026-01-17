# Git-flow ブランチ戦略（個人開発版）

このプロジェクトでは、Git-flow（A successful Git branching model）を個人開発向けに最適化したブランチ戦略を採用しています。

## 📌 ブランチ構成

### 永続ブランチ

#### 🔵 main
- **用途**: 本番環境用のブランチ
- **特徴**: 
  - 常に安定した状態を維持
  - 直接コミット禁止
  - タグ付けでバージョン管理（例: v1.0.0）
  - リリース履歴の保存

#### 🟢 develop  
- **用途**: 開発用統合ブランチ
- **特徴**:
  - 日常の開発作業のベースブランチ
  - featureブランチの統合先
  - 次リリースの準備状態を表現
  - デフォルトの作業ブランチ

### サポートブランチ（一時的）

#### 🔨 feature/YYYYMMDD-機能名
- **分岐元**: develop
- **マージ先**: develop
- **命名例**: `feature/20250122-add-export-pdf`
- **用途**:
  - 新機能の開発
  - 既存機能の改善
  - リファクタリング

#### 🚨 hotfix/YYYYMMDD-修正内容
- **分岐元**: main
- **マージ先**: main, develop
- **命名例**: `hotfix/20250122-fix-api-error`
- **用途**:
  - 本番環境の緊急バグ修正
  - セキュリティパッチ
  - クリティカルな問題の対応

#### 📦 release/v*.* （オプション）
- **分岐元**: develop
- **マージ先**: main, develop
- **命名例**: `release/v1.2.0`
- **用途**: 大規模リリースの準備（通常は省略）

## 🔄 ワークフロー

### 1. 新機能開発

```bash
# developから新機能ブランチを作成
git checkout develop
git checkout -b feature/20250122-add-export-pdf

# 開発作業...
git add .
git commit -m "feat: PDFエクスポート機能を追加"

# developにマージ（--no-ffで履歴保持）
git checkout develop
git merge --no-ff feature/20250122-add-export-pdf

# ブランチを削除
git branch -d feature/20250122-add-export-pdf
```

### 2. リリース

```bash
# developからmainへマージ
git checkout main
git merge --no-ff develop

# バージョンタグを付与
git tag -a v1.1.0 -m "Release version 1.1.0"

# リモートにプッシュ
git push origin main --tags
```

### 3. 緊急修正（Hotfix）

```bash
# mainから修正ブランチを作成
git checkout main
git checkout -b hotfix/20250122-fix-critical-bug

# 修正作業...
git add .
git commit -m "fix: APIエラーを修正"

# mainにマージしてタグ付け
git checkout main
git merge --no-ff hotfix/20250122-fix-critical-bug
git tag -a v1.0.1 -m "Hotfix version 1.0.1"

# developにも反映
git checkout develop
git merge --no-ff hotfix/20250122-fix-critical-bug

# ブランチを削除
git branch -d hotfix/20250122-fix-critical-bug

# リモートにプッシュ
git push origin main develop --tags
```

## 📝 コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/)に従います：

- **feat**: 新機能
- **fix**: バグ修正
- **docs**: ドキュメントのみの変更
- **style**: コードの意味に影響しない変更（空白、フォーマット等）
- **refactor**: バグ修正や機能追加を伴わないコード変更
- **test**: テストの追加や修正
- **chore**: ビルドプロセスやツールの変更

例：
```
feat: ユーザー認証機能を追加
fix: ログイン時のセッションエラーを修正
docs: README.mdを更新
```

## 🏷️ バージョニング

[セマンティックバージョニング](https://semver.org/lang/ja/)を採用：

- **MAJOR.MINOR.PATCH** 形式（例: v1.2.3）
  - **MAJOR**: 後方互換性のない変更
  - **MINOR**: 後方互換性のある機能追加
  - **PATCH**: 後方互換性のあるバグ修正

## ⚙️ Git設定（推奨）

```bash
# マージ時に常に履歴を保持
git config merge.ff false

# プル時はリベースを使用
git config pull.rebase true

# 便利なエイリアス設定
git config alias.feat "checkout -b feature/$(date +%Y%m%d)-"
git config alias.hotfix "checkout -b hotfix/$(date +%Y%m%d)-"
git config alias.publish "push -u origin HEAD"
```

## 🎯 個人開発向けの最適化ポイント

1. **プルリクエスト不要**: 直接マージで効率化
2. **releaseブランチ省略**: 小規模リリースはdevelop→mainで直接
3. **日付付き命名**: 作業履歴の可視化
4. **シンプルな構造**: 2階層で管理の簡素化
5. **--no-ffマージ**: 作業履歴の明確な保持

## 📊 ブランチ状態の確認

```bash
# ローカルブランチ一覧
git branch

# リモートも含む全ブランチ
git branch -a

# マージ済みブランチの確認
git branch --merged

# 未マージブランチの確認
git branch --no-merged
```

## 🔍 トラブルシューティング

### developとmainが乖離した場合
```bash
git checkout develop
git merge main
```

### 作業中のブランチを最新化
```bash
git checkout feature/your-feature
git merge develop
```

### 間違えてmainにコミットした場合
```bash
# コミットを取り消し
git reset --soft HEAD~1

# developに移動してコミット
git checkout develop
git commit -m "your message"
```