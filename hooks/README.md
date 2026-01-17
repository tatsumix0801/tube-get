# Hooksディレクトリ 🪝

このディレクトリはアプリケーション全体で再利用可能なReact Hooksを含んでいます。

## 📑 主要Hooks

- `use-error-logger.ts` - エラーロギングフック
- `use-mobile.tsx` - モバイルデバイス検出フック
- `use-toast.ts` - トースト通知管理フック

## 🔑 使用方法

```tsx
import { useErrorLogger } from "@/hooks/use-error-logger";
import { useMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

export function MyComponent() {
  const logger = useErrorLogger();
  const isMobile = useMobile();
  const { toast } = useToast();
  
  const handleAction = () => {
    try {
      // アクション実行
      toast({
        title: "成功",
        description: "アクションが完了しました",
      });
    } catch (error) {
      logger.logError(error);
    }
  };
  
  return (
    <div>
      {isMobile ? "モバイル表示" : "デスクトップ表示"}
    </div>
  );
}
```

## 🧩 設計原則

- フックは単一責任の原則に従う
- 再利用可能で汎用的な機能を提供する
- 適切なメモ化を実装してパフォーマンスを最適化する
- 明確なインターフェースと型定義を持つ

## 📌 注意点

- カスタムフックは`use`プレフィックスで始める必要があります
- ロジックと表示の分離を意識してフックを設計してください
- 複雑な状態管理ロジックはフックに抽出するのが望ましいです
- 副作用を適切に処理するためにクリーンアップ関数を実装してください 