# コーディング規約

このドキュメントは、tube-getプロジェクトにおけるコーディング規約を定義します。

## 📌 概要

本規約は、コードの一貫性、可読性、保守性を保つために定められています。新規コード作成時およびレビュー時の基準として使用してください。

---

## 1. TypeScript

### 1.1 型定義ルール

#### `any`使用禁止
```typescript
// ❌ 悪い例
const data: any = fetchData();

// ✅ 良い例
interface DataResponse {
  id: string;
  name: string;
}
const data: DataResponse = fetchData();
```

**理由**: `any`は型安全性を損ない、TypeScriptの恩恵を失います。ESLintで`@typescript-eslint/no-explicit-any`ルールにより強制されています。

#### `interface` vs `type` の使い分け

```typescript
// ✅ オブジェクト形状の定義には interface を使用
interface User {
  id: string;
  name: string;
}

// ✅ ユニオン型、タプル、プリミティブのエイリアスには type を使用
type Status = "active" | "inactive" | "pending";
type Coordinates = [number, number];
type ID = string | number;
```

**ガイドライン**:
- オブジェクトの形状定義: `interface` を優先
- ユニオン型・交差型: `type` を使用
- 拡張性が必要: `interface` を優先（`extends`が可能）

#### ジェネリクス命名規則

```typescript
// ✅ 良い例: 意味のある名前を使用
interface ApiResponse<TData> {
  data: TData;
  status: number;
}

function fetchData<TResponse>(url: string): Promise<TResponse> {
  // ...
}

// ❌ 避ける: 単一文字（複雑な場合）
// 単純なケースでは T, U, V も可
```

### 1.2 コーディングスタイル

#### async/awaitの使用

```typescript
// ✅ 良い例: async/await を優先
async function fetchChannelData(channelId: string) {
  const response = await fetch(`/api/channel/${channelId}`);
  const data = await response.json();
  return data;
}

// ❌ 避ける: .then() チェーン（簡潔なケースを除く）
```

#### エラーハンドリングパターン

```typescript
// ✅ 良い例: try-catch で適切にハンドリング
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error; // 必要に応じて再スロー
  }
}

// ✅ カスタムエラークラスの使用も推奨
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

#### null/undefined処理

```typescript
// ✅ 良い例: オプショナルチェーンとnullish coalescing
const userName = user?.profile?.name ?? 'Anonymous';

// ✅ 良い例: 型ガードの使用
if (data !== null && data !== undefined) {
  processData(data);
}

// ❌ 避ける: 曖昧な真偽値チェック
if (data) { // data が 0 や '' の場合も false になる
  processData(data);
}
```

---

## 2. React/Next.js

### 2.1 コンポーネント規約

#### 関数コンポーネント必須

```typescript
// ✅ 良い例: 関数コンポーネント
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ 避ける: クラスコンポーネント（レガシーコードを除く）
```

#### Props型定義必須

```typescript
// ✅ 良い例: インラインまたは interface で型定義
interface VideoCardProps {
  videoId: string;
  title: string;
  thumbnail: string;
  viewCount: number;
  publishedAt: string;
}

export function VideoCard({
  videoId,
  title,
  thumbnail,
  viewCount,
  publishedAt,
}: VideoCardProps) {
  // ...
}
```

#### メモ化ガイドライン

```typescript
// ✅ useMemo: 計算コストの高い処理
const filteredVideos = useMemo(() => {
  return videos.filter(v => v.viewCount > 1000)
    .sort((a, b) => b.viewCount - a.viewCount);
}, [videos]);

// ✅ React.memo: 純粋なコンポーネント（props変更時のみ再レンダリング）
export const VideoRow = React.memo(function VideoRow({ video }: Props) {
  return <tr>{/* ... */}</tr>;
});

// ✅ useCallback: 子コンポーネントに渡すコールバック
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

**ガイドライン**:
- レンダリングコストが高い処理: `useMemo`
- 子コンポーネントへの関数: `useCallback`
- 純粋なコンポーネント: `React.memo`

### 2.2 ファイル構成

#### 命名規則

```
✅ コンポーネントファイル: PascalCase.tsx
   - VideoTable.tsx
   - ChannelProfile.tsx

✅ ユーティリティ/フック: kebab-case.ts
   - use-channel-data.ts
   - format-utils.ts
   - api-cache.ts

✅ ページ（App Router）: kebab-case
   - app/dashboard/page.tsx
   - app/(main)/channel/page.tsx
```

#### ディレクトリ配置ルール

```
app/                    # Next.js App Router ページ
├── (auth)/            # ルートグループ（認証）
├── (main)/            # ルートグループ（メイン）
└── api/               # APIルート

components/            # Reactコンポーネント
├── ui/               # shadcn/ui ベースコンポーネント
├── channel-profile/  # 機能別グループ
└── video-table.tsx   # 単一コンポーネント

lib/                  # ユーティリティ・ロジック
├── auth.ts
├── youtube-api.ts
└── utils.ts

hooks/                # カスタムフック
└── use-channel-data.ts

types/                # 型定義
└── youtube.ts
```

---

## 3. Tailwind CSS

### 3.1 クラス順序

推奨順序: **レイアウト → サイズ → 色 → その他**

```tsx
// ✅ 良い例
<div className="flex items-center gap-4 w-full h-20 bg-black text-white rounded-lg shadow-md hover:bg-gray-800">
  {/* レイアウト → サイズ → 色 → ボーダー・シャドウ → ホバー */}
</div>

// ❌ 避ける: ランダムな順序
<div className="shadow-md text-white gap-4 flex rounded-lg bg-black w-full hover:bg-gray-800 h-20 items-center">
</div>
```

### 3.2 カスタムカラー

#### CSS変数使用（shadcn/ui準拠）

```tsx
// ✅ 良い例: CSS変数ベースのカラー
<div className="bg-background text-foreground border-border">
  <button className="bg-primary text-primary-foreground">Click</button>
</div>
```

CSS変数は `app/globals.css` で定義:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}
```

#### brand/youtube カラーパレット

```tsx
// ✅ YouTube ブランドカラー
<div className="bg-youtube-red text-youtube-white">
  YouTube Red Theme
</div>

// ✅ プロジェクトブランドカラー
<button className="bg-brand-pink hover:bg-brand-purple">
  Brand Button
</button>
```

定義（`tailwind.config.ts`）:
```typescript
colors: {
  youtube: {
    red: "#FF0000",
    black: "#282828",
    white: "#FFFFFF",
  },
  brand: {
    pink: "#FF3366",
    blue: "#3A86FF",
    yellow: "#FFD60A",
    purple: "#9B51E0",
    turquoise: "#0CC08E",
  },
}
```

---

## 4. インポート順序

```typescript
// 1. React/Next.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 2. 外部ライブラリ
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// 3. 内部コンポーネント（@/components）
import { Button } from '@/components/ui/button';
import { VideoTable } from '@/components/video-table';

// 4. 内部ユーティリティ（@/lib）
import { formatNumber } from '@/lib/format-utils';
import { useChannelData } from '@/hooks/use-channel-data';

// 5. 型定義（@/types）
import type { YouTubeVideo } from '@/types/youtube';

// 6. スタイル
import './styles.css';
```

---

## 5. ESLint設定解説

### 5.1 使用ルールセット

プロジェクトでは以下のESLintルールセットを使用（`eslint.config.mjs`）:

```javascript
...compat.extends("next/core-web-vitals", "next/typescript")
```

#### `next/core-web-vitals`
- Core Web Vitals（LCP, FID, CLS）の最適化ルール
- `<Image>` 必須、`alt` 属性必須など

#### `next/typescript`
- TypeScript固有のルール
- `any` 禁止、未使用変数禁止など

### 5.2 無視ディレクトリ

```javascript
ignores: [
  ".next/**",           // Next.jsビルド出力
  "node_modules/**",    // 依存関係
  "coverage/**",        // テストカバレッジ
  "playwright-report/**", // E2Eテストレポート
  "test-results/**",    // テスト結果
  "reports/**",         // 各種レポート
  "next-env.d.ts",      // Next.js型定義
]
```

### 5.3 実行コマンド

```bash
# Lint実行
npm run lint

# Lint + 自動修正
npm run lint -- --fix
```

---

## 6. ベストプラクティス

### 6.1 パフォーマンス最適化

```typescript
// ✅ next/image を使用
import Image from 'next/image';

<Image
  src={thumbnail}
  alt={title}
  width={320}
  height={180}
  placeholder="blur"
  blurDataURL="data:image/..." // 推奨
/>

// ✅ 動的インポート（コード分割）
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### 6.2 アクセシビリティ

```tsx
// ✅ aria-label を適切に使用
<button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</button>

// ✅ キーボード操作対応
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Clickable Div
</div>
```

### 6.3 セキュリティ

```typescript
// ✅ ユーザー入力のサニタイズ
import DOMPurify from 'isomorphic-dompurify';

const sanitized = DOMPurify.sanitize(userInput);

// ✅ 環境変数の使用
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

// ❌ 機密情報をコードにハードコードしない
```

---

## 7. テストコーディング規約

```typescript
// ✅ describe/it でテストを構造化
describe('formatNumber', () => {
  it('should format large numbers with commas', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

// ✅ テストファイル命名: *.test.ts または *.spec.ts
// lib/__tests__/utils.test.ts
// e2e/tests/smoke.spec.ts
```

---

## 8. コミット前チェックリスト

コミット前に以下を確認してください:

- [ ] `npm run lint` がエラーなく完了する
- [ ] `npx tsc --noEmit` が型エラーなく完了する
- [ ] `npm run test` がすべてパスする
- [ ] `npm run build` がビルドエラーなく完了する
- [ ] 新規機能にはテストを追加した
- [ ] コミットメッセージがConventional Commits形式に従っている

---

*最終更新: 2026-01-18*
*参照: [GIT-FLOW.md](../../GIT-FLOW.md), [ARCHITECTURE.md](./ARCHITECTURE.md)*
