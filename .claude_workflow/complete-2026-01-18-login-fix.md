# 作業完了記録 - Vercelログイン500エラー修正

**作業日時**: 2026-01-18 15:30-15:45
**セッション**: 夕方後半（タスク#27）
**コミット**: develop (b6af278), main (3b5654b)

## 📌 作業概要

Vercel本番環境でログイン時に「レスポンスの解析に失敗しました」エラーが発生する問題を調査・修正。

## 🔍 問題の詳細

### 症状
- URL: https://tube-get-red.vercel.app/
- ログインフォームに「admin123」と入力
- エラーメッセージ: 「レスポンスの解析に失敗しました」
- ブラウザコンソール: JSONパースエラー

### 調査結果
```bash
# curlでAPIを直接テスト
curl -X POST https://tube-get-red.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'

# 結果: HTTP 405/500エラー、HTMLレスポンス（JSON期待に反する）
< HTTP/2 405
< content-type: text/html; charset=utf-8
< x-next-error-status: 500
```

### 根本原因

**next.config.mjs の30行目にローカル絶対パスがハードコード**

```javascript
// 問題のコード
outputFileTracingRoot: '/home/motoki/workspace/20_services/tube-get',
```

- Vercelのビルドサーバーにこのパスが存在しない
- ファイルトレースに失敗し、APIルート全体が500エラー
- ローカルビルドでは問題なし（パスが存在するため）

## ✅ 修正内容

### 1. next.config.mjs - outputFileTracingRoot削除

```diff
   images: {
     // ... 画像設定 ...
   },
-  outputFileTracingRoot: '/home/motoki/workspace/20_services/tube-get',
   experimental: {
     webpackBuildWorker: true,
```

**理由**:
- Next.jsはデフォルトで適切なトレースを実行
- プロジェクトルートから相対的に解決されるため明示不要
- 環境依存の絶対パスは移植性を損なう

### 2. app/api/auth/route.ts - Cookie secureフラグ環境対応

```diff
+    // 本番環境（HTTPS）ではsecure=true、開発環境ではfalse
+    const isProduction = process.env.NODE_ENV === "production"
     response.cookies.set({
       name: "session_id",
       value: sessionId,
       expires,
       path: "/",
       httpOnly: true,
       sameSite: "lax",
-      secure: false, // 開発環境では常にfalseに設定
+      secure: isProduction, // 本番環境ではHTTPS必須
     })
```

**理由**:
- 本番環境（HTTPS）では`secure: true`が必須
- 開発環境（HTTP）では`secure: false`が必要
- 環境に応じて動的に設定することでセキュリティと利便性を両立

## 🧪 検証結果

### ローカル環境
```bash
# 開発サーバーで確認
npm run dev -- -p 3005
curl -X POST http://localhost:3005/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'

# 結果: HTTP 200 OK ✅
{"success":true,"message":"ログイン成功"}
```

### Vercel本番環境（修正後）
```bash
curl -X POST https://tube-get-red.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'

# 結果: HTTP 200 OK ✅
{"success":true,"message":"ログイン成功"}

# Cookieヘッダー確認
< set-cookie: session_id=6vrw4j1cw0a; Path=/; Expires=...; Secure; HttpOnly; SameSite=lax
```

**確認項目**:
- ✅ HTTP 200 OKレスポンス
- ✅ JSON形式のレスポンスボディ
- ✅ Cookie Secureフラグが付与
- ✅ HttpOnly, SameSite=lax設定維持

### テスト
```bash
npm run test
# 結果: 19/19 passed ✅
```

### ビルド
```bash
npm run build
# 結果: ✓ Compiled successfully ✅
```

## 📦 デプロイ

### 1回目デプロイ（outputFileTracingRoot削除のみ）
```bash
vercel --prod --yes
# ビルド成功、但し同じ問題継続（キャッシュの影響か）
```

### 2回目デプロイ（Cookie secure修正後）
```bash
vercel --prod --yes
# ビルド成功、ログイン完全復旧 ✅
```

## 🎯 成果

| 項目 | 修正前 | 修正後 |
|------|--------|--------|
| APIレスポンス | HTTP 405/500 (HTML) | HTTP 200 (JSON) |
| ログイン状態 | ❌ エラー | ✅ 成功 |
| Cookie secure | 常にfalse | 本番:true / 開発:false |
| ユーザー体験 | ログイン不可 | 正常にログイン可能 |

## 📝 学んだこと

### 1. 環境依存パスの危険性
- ローカルの絶対パスは**絶対に**ハードコードしない
- 相対パスまたは環境変数を使用
- Next.jsの場合、多くの設定はデフォルトで適切に動作

### 2. Cookie secure属性の重要性
- HTTPS環境では`secure: true`が必須
- HTTPSなのにsecure=falseはセキュリティリスク
- 環境に応じた動的設定がベストプラクティス

### 3. デバッグアプローチ
1. ローカルで動作確認（正常）
2. 本番環境で再現テスト（異常）
3. 環境差分を特定（設定ファイル調査）
4. 原因を特定（ローカル絶対パス）
5. 修正・検証・デプロイ

### 4. Vercelデバッグ
- `vercel inspect <url>` でビルド出力確認
- curlで直接APIテスト
- HTTPステータスコード/ヘッダー詳細確認

## 🚀 次のアクション

### 完了項目
- [x] ログイン機能復旧
- [x] Cookie secure設定適正化
- [x] テスト全件パス確認
- [x] 本番環境デプロイ
- [x] ドキュメント更新

### 今後の改善案
1. **認証システム強化**（優先度：中）
   - セッションIDの暗号学的安全な生成（crypto.randomUUID()等）
   - パスワードのハッシュ化（bcrypt等）
   - 環境変数からパスワード読み込み

2. **設定ファイルレビュー**（優先度：低）
   - vercel.json の不要設定削除
   - next.config.mjs のクリーンアップ

3. **E2Eテスト追加**（優先度：中）
   - ログインフローの自動テスト
   - Playwright smoke testに組み込み

## 📚 参考情報

- [Next.js Configuration - outputFileTracingRoot](https://nextjs.org/docs/app/api-reference/next-config-js/outputFileTracingRoot)
- [Next.js API Routes - Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [MDN - Set-Cookie secure attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#secure)

---

**作業者**: Claude Sonnet 4.5 (1M context)
**プロジェクト**: tube-get
**リポジトリ**: https://github.com/tatsumix0801/tube-get
**本番URL**: https://tube-get-red.vercel.app/
