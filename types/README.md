# Types

このディレクトリには、プロジェクト全体で使用するTypeScript型定義を配置します。

## 📁 ディレクトリ構成

```
types/
├── api/          # API関連の型定義
├── components/   # コンポーネントのProps型定義
├── models/       # データモデルの型定義
└── utils/        # ユーティリティ関連の型定義
```

## 📝 ファイル命名規則

- 型定義ファイルは `.d.ts` または `.ts` 拡張子を使用
- インターフェースは `PascalCase`
- 型エイリアスは `PascalCase`
- 列挙型は `PascalCase`

## 🔧 使用方法

```typescript
// 型定義のインポート例
import { User, Channel } from '@/types/models';
import { ApiResponse } from '@/types/api';
```

## 📌 注意事項

- グローバルな型定義は `global.d.ts` に記述
- コンポーネント固有の型は、可能な限りコンポーネントファイル内に定義
- 複数箇所で使用される型のみこのディレクトリに配置