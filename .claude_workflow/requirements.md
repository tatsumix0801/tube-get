# 要件定義書 - 開発者向けガイドライン & CI/CDパイプライン構築

## 📌 プロジェクト概要

| 項目 | 内容 |
|------|------|
| プロジェクト名 | tube-get |
| 作成日 | 2026-01-18 |
| 対象タスク | 開発者向けガイドライン作成、CI/CDパイプライン構築 |
| 想定読者 | 自分 + AI（Claude）（個人開発継続用） |

---

## 🎯 タスク1: 開発者向けガイドライン作成

### 1.1 目的
- 個人開発の継続性確保
- AIアシスタント（Claude）との効率的な協業
- プロジェクト知識の明文化

### 1.2 成果物

#### 1.2.1 コーディング規約 (`docs/developer/CODING_STANDARDS.md`)

**スコープ:**
- TypeScript/React コーディングスタイル
- ESLint設定の解説と理由
- Tailwind CSS使用ガイドライン
- コンポーネント設計パターン（Atomic Design）
- 命名規則（ファイル、変数、関数、コンポーネント）
- インポート順序

**参照元:**
- `eslint.config.mjs` (Flat Config)
- `tailwind.config.ts`
- 既存コードベースのパターン

#### 1.2.2 アーキテクチャ説明書 (`docs/developer/ARCHITECTURE.md`)

**スコープ:**
- システム全体構成図
- Next.js App Router構造
- データフロー（YouTube API → 表示）
- 認証フロー
- 主要コンポーネント関係図
- lib/ の役割と依存関係

**参照元:**
- `docs/technical/directorystructure.md`（更新必要）
- `docs/technical/000_overview.md`
- 既存コードベース

#### 1.2.3 貢献ガイドライン (`CONTRIBUTING.md`)

**スコープ:**
- 開発環境セットアップ手順
- Git-flowワークフロー（GIT-FLOW.md参照）
- コミットメッセージ規約
- PR作成ガイドライン（個人開発なので簡易版）
- コードレビューチェックリスト
- リリースプロセス

**参照元:**
- `GIT-FLOW.md`
- `README.md`

### 1.3 成功基準
- [ ] 新しいセッションのClaudeが読むだけで開発継続可能
- [ ] 既存ドキュメントとの整合性確保
- [ ] CLAUDE.mdから適切にリンク

---

## 🎯 タスク2: CI/CDパイプライン構築

### 2.1 目的
- コード品質の自動検証
- デプロイプロセスの自動化と明文化
- 障害発生時の復旧手順確立

### 2.2 構成（標準構成）

```
PR作成 → Lint/Test/Build チェック → マージ
                                      ↓
develop → Vercel Preview Deploy（ステージング）
                                      ↓
main → Vercel Production Deploy（本番）
```

### 2.3 成果物

#### 2.3.1 GitHub Actions ワークフロー (`.github/workflows/`)

**ci.yml - PR時チェック:**
```yaml
トリガー: pull_request (develop, main)
ジョブ:
  - ESLint チェック
  - TypeScript 型チェック
  - Vitest ユニットテスト
  - Next.js ビルド確認
```

**備考:**
- Vercel連携は既存のGitHub Integration使用（Actionsからのデプロイ不要）
- E2Eテストは手動実行（Playwright CI設定は将来検討）

#### 2.3.2 ステージング環境設定 (`docs/developer/ENVIRONMENTS.md`)

**スコープ:**
- Vercel Preview Deployments = ステージング環境として定義
- 環境変数の説明（YOUTUBE_API_KEY: ユーザー入力式）
- 各環境のURL構成

#### 2.3.3 本番環境デプロイ手順 (`docs/developer/DEPLOYMENT.md`)

**スコープ:**
- 通常リリースフロー（develop → main → 自動デプロイ）
- 緊急リリース（Hotfix）フロー
- ロールバック手順
- Vercelダッシュボードでの操作

#### 2.3.4 障害復旧手順 (`docs/developer/DISASTER_RECOVERY.md`)

**スコープ:**
- よくある障害パターンと対処法
- Vercelデプロイ失敗時の対応
- 本番環境エラー調査手順
- ロールバック実行手順

### 2.4 成功基準
- [ ] PRマージ時にCI/CDが自動実行
- [ ] develop/mainへのプッシュでVercel自動デプロイ
- [ ] 障害発生時に手順書を見て復旧可能

---

## 🚫 スコープ外

以下は今回のタスクには含めない：

1. **Dependabot設定** - 将来検討
2. **セキュリティスキャン自動化** - npm auditで手動対応
3. **E2EテストのCI統合** - Playwright実行時間が長いため
4. **別プロジェクトでのステージング環境** - Vercel Previewで十分
5. **外部バックアップ** - GitHubで十分

---

## 📁 ファイル構成（予定）

```
tube-get/
├── .github/
│   └── workflows/
│       └── ci.yml                    # 新規作成
├── docs/
│   └── developer/                    # 新規ディレクトリ
│       ├── CODING_STANDARDS.md       # 新規作成
│       ├── ARCHITECTURE.md           # 新規作成
│       ├── ENVIRONMENTS.md           # 新規作成
│       ├── DEPLOYMENT.md             # 新規作成
│       └── DISASTER_RECOVERY.md      # 新規作成
├── CONTRIBUTING.md                   # 新規作成（ルート）
└── CLAUDE.md                         # 更新（リンク追加）
```

---

## ✅ 確認事項

- [x] CI/CDスコープ: 標準構成（PR時チェック + 自動デプロイ）
- [x] ステージング環境: Vercel Preview Deployments使用
- [x] 想定読者: 自分 + AI（個人開発継続用）
- [x] バックアップ: GitHubリポジトリのみ（追加不要）

---

*作成日: 2026-01-18*
*次フェーズ: /sc:design で設計詳細化*
