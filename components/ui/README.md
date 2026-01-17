# UIコンポーネントディレクトリ 🎨

このディレクトリは再利用可能な基本UIコンポーネントを含んでいます。これらのコンポーネントはshadcn/uiをベースにしたデザインシステムに準拠しています。

## 📑 コンポーネント一覧

- 入力系: `button.tsx`, `input.tsx`, `checkbox.tsx`, `select.tsx`, `textarea.tsx`
- ナビゲーション系: `breadcrumb.tsx`, `tabs.tsx`, `menubar.tsx`, `navigation-menu.tsx`
- コンテナ系: `card.tsx`, `dialog.tsx`, `sheet.tsx`, `accordion.tsx`, `collapsible.tsx`
- フィードバック系: `alert.tsx`, `toast.tsx`, `progress.tsx`, `skeleton.tsx`
- データ表示系: `table.tsx`, `avatar.tsx`, `badge.tsx`, `calendar.tsx`
- レイアウト系: `separator.tsx`, `aspect-ratio.tsx`, `resizable.tsx`, `scroll-area.tsx`

## 🔑 使用方法

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  return (
    <form>
      <Input placeholder="メールアドレス" />
      <Button>ログイン</Button>
    </form>
  );
}
```

## 🎨 設計原則

- コンポーネントはRadix UIをベースに構築
- 一貫したデザイン言語の維持
- 高いアクセシビリティの確保
- Tailwind CSSによるスタイリング
- 拡張性と柔軟性の両立

## 📌 注意点

- コンポーネントのカスタマイズは`tailwind-merge`と`clsx`を使用してください
- 新しいUIコンポーネントを作成する際は、既存のデザインシステムとの一貫性を保つようにしてください
- コンポーネントはRadix UI primitives、Tailwind CSS、その他必要最小限の依存関係のみを使用してください 