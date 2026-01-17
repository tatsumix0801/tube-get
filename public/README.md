# 公開アセットディレクトリ 🌐

このディレクトリはWebサーバーから直接アクセス可能な静的ファイルを含んでいます。

## 📑 主要ファイル

- `placeholder-logo.png` - デフォルトロゴ画像
- `placeholder-logo.svg` - デフォルトロゴSVG
- `placeholder-user.jpg` - デフォルトユーザーアバター
- `placeholder.jpg` - デフォルトプレースホルダー画像
- `placeholder.svg` - デフォルトプレースホルダーSVG
- `noise.svg` - 背景ノイズテクスチャ
- `no-cache.js` - キャッシュ制御スクリプト

## 🔑 使用方法

```tsx
// 画像の使用例
import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/placeholder-logo.svg"
      alt="ロゴ"
      width={120}
      height={40}
    />
  );
}

// 公開JSファイルの利用例
<script src="/no-cache.js"></script>
```

## 📌 注意点

- このディレクトリに配置されたファイルはパブリックアクセス可能なため、機密情報を含めないでください
- 可能な限り画像の最適化を行ってください（WebP形式の採用、適切な圧縮など）
- SVGファイルを優先的に使用し、高解像度ディスプレイ対応を考慮してください
- ファイル名は明確で一貫性のある命名規則に従ってください
- Next.jsの画像最適化機能を使用してパフォーマンスを向上させてください 