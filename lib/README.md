# ライブラリディレクトリ 📚

このディレクトリはアプリケーション全体で使用されるユーティリティ関数、ヘルパー、サービスを含んでいます。

## 📑 主要ファイル

- `auth.ts` - 認証関連の機能
- `error-logger.ts` - エラーロギングサービス
- `export.ts` - データエクスポート機能
- `format-utils.ts` - フォーマット関連のユーティリティ
- `pdf-generator.ts` - PDF生成機能
- `user-settings.ts` - ユーザー設定管理
- `utils.ts` - 汎用ユーティリティ関数
- `youtube-api.ts` - YouTube API連携機能

## 🔑 使用方法

```tsx
import { generatePDF } from "@/lib/pdf-generator";
import { formatDate } from "@/lib/format-utils";
import { fetchChannelData } from "@/lib/youtube-api";

export async function exportChannelReport(channelId: string) {
  const channelData = await fetchChannelData(channelId);
  const date = formatDate(new Date());
  await generatePDF({
    title: `${channelData.title} - レポート`,
    date,
    data: channelData,
  });
}
```

## 🧩 設計原則

- 純粋関数を優先し、副作用を最小限に抑える
- 適切な型定義でタイプセーフティを確保する
- モジュール化されたコードで再利用性を高める
- テスト可能なコードを心がける

## 📌 注意点

- 外部APIの呼び出しは適切なキャッシュとエラーハンドリングを実装してください
- センシティブな情報（APIキーなど）はコード内に直接記述せず、環境変数を使用してください
- パフォーマンスに影響する処理は最適化を検討してください
- 非同期処理は一貫したパターンで実装してください（Promiseまたはasync/await） 