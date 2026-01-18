# 設計書 - UI/UXリニューアル & サイト名変更

## 1. 概要

本設計書は `.claude_workflow/requirements-ui-redesign.md` に基づき、UI/UXリニューアルとサイト名変更の詳細設計を定義する。

---

## 2. globals.css 詳細設計

### 2.1 追加するCSS変数（:root）

```css
@layer base {
  :root {
    /* 既存変数は維持 */

    /* SF風カラーパレット（新規追加） */
    --sf-bg-primary: 240 10% 4%;      /* #0a0a0f */
    --sf-bg-secondary: 215 28% 7%;    /* #0d1117 */
    --sf-bg-tertiary: 215 21% 11%;    /* #161b22 */

    --sf-text-primary: 0 0% 100%;
    --sf-text-secondary: 210 14% 83%;
    --sf-text-muted: 212 12% 58%;

    --sf-cyan: 180 100% 50%;           /* #00ffff */
    --sf-cyan-dark: 180 100% 40%;      /* #00cccc */
    --sf-magenta: 300 100% 50%;        /* #ff00ff */
    --sf-green: 150 100% 50%;          /* #00ff88 */
    --sf-orange: 25 100% 50%;          /* #ff6b00 */
    --sf-purple: 263 100% 63%;         /* #9945ff */

    --neon-pink: 306 100% 53%;         /* #FF10F0 */
    --neon-blue: 191 100% 50%;         /* #00D4FF */
    --neon-green: 108 100% 54%;        /* #39FF14 */
  }
}
```

### 2.2 追加するコンポーネントスタイル

```css
@layer components {
  /* グローエフェクト */
  .sf-glow {
    box-shadow:
      0 0 20px rgba(0, 255, 255, 0.3),
      inset 0 0 10px rgba(0, 255, 255, 0.1);
  }

  .sf-glow-intense {
    box-shadow:
      0 0 30px rgba(0, 255, 255, 0.5),
      0 0 60px rgba(0, 255, 255, 0.3),
      inset 0 0 15px rgba(0, 255, 255, 0.2);
  }

  .sf-text-glow {
    text-shadow:
      0 0 10px currentColor,
      0 0 20px currentColor;
  }

  /* グラスモーフィズム */
  .sf-glass {
    background: rgba(13, 17, 23, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 255, 255, 0.2);
  }

  .sf-glass-dark {
    background: rgba(10, 10, 15, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 255, 255, 0.1);
  }

  /* 背景グリッド */
  .sf-grid-bg {
    background-image:
      linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  /* ホログラフィックカード */
  .holographic-card {
    position: relative;
    background: rgba(13, 17, 23, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .holographic-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    background: linear-gradient(
      45deg,
      #FF10F0,
      #00D4FF,
      #39FF14,
      #00D4FF,
      #FF10F0
    );
    background-size: 300% 300%;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: holo-shift 3s ease-in-out infinite;
    pointer-events: none;
  }

  /* ネオンボタン */
  .neon-button {
    position: relative;
    background: transparent;
    border: 2px solid hsl(var(--sf-cyan));
    color: hsl(var(--sf-cyan));
    transition: all 0.3s ease;
  }

  .neon-button:hover {
    background: hsl(var(--sf-cyan) / 0.1);
    box-shadow:
      0 0 20px hsl(var(--sf-cyan) / 0.5),
      inset 0 0 10px hsl(var(--sf-cyan) / 0.2);
  }
}
```

### 2.3 追加するユーティリティ

```css
@layer utilities {
  /* SF風アニメーション */
  .animate-sf-pulse {
    animation: sf-pulse 2s ease-in-out infinite;
  }

  .animate-sf-glitch {
    animation: sf-glitch 0.3s ease-in-out infinite;
  }

  .animate-holo-shift {
    animation: holo-shift 3s ease-in-out infinite;
  }

  .animate-neon-pulse {
    animation: neon-pulse 2s ease-in-out infinite;
  }

  /* ネオンテキスト */
  .neon-text {
    text-shadow:
      0 0 10px currentColor,
      0 0 20px currentColor,
      0 0 30px currentColor;
  }

  /* カード3D効果 */
  .card-3d {
    transform-style: preserve-3d;
    transition: transform 0.3s ease-out;
  }

  .card-3d:hover {
    transform: perspective(1000px) rotateY(5deg) rotateX(-5deg);
  }
}
```

### 2.4 追加するキーフレーム

```css
@keyframes sf-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes sf-glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-1px, 1px); }
  40% { transform: translate(-1px, -1px); }
  60% { transform: translate(1px, 1px); }
  80% { transform: translate(1px, -1px); }
}

@keyframes holo-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes neon-pulse {
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.8; filter: brightness(1.2); }
}

@keyframes sf-grid-move {
  0% { background-position: -1px -1px; }
  100% { background-position: 49px 49px; }
}
```

### 2.5 レスポンシブ・アクセシビリティ対応

```css
/* モーション軽減（アクセシビリティ） */
@media (prefers-reduced-motion: reduce) {
  .animate-sf-pulse,
  .animate-sf-glitch,
  .animate-holo-shift,
  .animate-neon-pulse {
    animation: none;
  }

  .sf-grid-bg {
    animation: none;
  }

  .holographic-card::before {
    animation: none;
  }
}

/* 小画面でのグロー効果軽減 */
@media (max-width: 640px) {
  .sf-glow,
  .sf-glow-intense {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
  }

  .card-3d:hover {
    transform: none;
  }

  .neon-text {
    text-shadow: 0 0 5px currentColor;
  }
}
```

### 2.6 カスタムスクロールバー

```css
/* SF風カスタムスクロールバー */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--sf-bg-secondary));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--sf-cyan));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--sf-cyan-dark));
}

/* SF風フォーカススタイル */
*:focus-visible {
  outline: 2px solid hsl(var(--sf-cyan));
  outline-offset: 2px;
}
```

---

## 3. tailwind.config.ts 詳細設計

### 3.1 追加するカラー

```typescript
colors: {
  // 既存カラーは維持

  // SF風カラーパレット（新規追加）
  'sf-bg': {
    primary: '#0a0a0f',
    secondary: '#0d1117',
    tertiary: '#161b22',
  },
  'sf-text': {
    primary: '#ffffff',
    secondary: '#c9d1d9',
    muted: '#8b949e',
  },
  'sf-cyan': {
    DEFAULT: '#00ffff',
    dark: '#00cccc',
  },
  'sf-green': {
    DEFAULT: '#00ff88',
    dark: '#00cc6a',
  },
  'sf-magenta': '#ff00ff',
  'sf-orange': '#ff6b00',
  'sf-purple': '#9945ff',
  'sf-error': '#ff4444',
  'sf-warning': '#ffaa00',

  // ネオンカラー
  'neon-pink': '#FF10F0',
  'neon-blue': '#00D4FF',
  'neon-green': '#39FF14',
  'neon-purple': '#B026FF',
  'neon-orange': '#FF6B35',
}
```

### 3.2 追加するboxShadow

```typescript
boxShadow: {
  // 既存shadow維持

  // SF風グローエフェクト
  'sf-glow': '0 0 20px rgba(0, 255, 255, 0.3)',
  'sf-glow-sm': '0 0 10px rgba(0, 255, 255, 0.2)',
  'sf-glow-lg': '0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)',
  'sf-glow-green': '0 0 20px rgba(0, 255, 136, 0.3)',
  'sf-glow-magenta': '0 0 20px rgba(255, 0, 255, 0.3)',
  'sf-glow-orange': '0 0 20px rgba(255, 107, 0, 0.3)',
  'sf-glow-purple': '0 0 20px rgba(153, 69, 255, 0.3)',
  'sf-inner': 'inset 0 0 20px rgba(0, 255, 255, 0.1)',

  // ネオングロー
  'neon-glow-pink': '0 0 20px rgba(255, 16, 240, 0.5), 0 0 40px rgba(255, 16, 240, 0.3)',
  'neon-glow-blue': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
  'neon-glow-green': '0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.3)',
  'holographic': '0 0 30px rgba(255, 16, 240, 0.3), 0 0 60px rgba(0, 212, 255, 0.2)',
}
```

### 3.3 追加するanimation/keyframes

```typescript
keyframes: {
  // 既存keyframes維持

  'sf-pulse': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
  'sf-glitch': {
    '0%, 100%': { transform: 'translate(0)' },
    '20%': { transform: 'translate(-1px, 1px)' },
    '40%': { transform: 'translate(-1px, -1px)' },
    '60%': { transform: 'translate(1px, 1px)' },
    '80%': { transform: 'translate(1px, -1px)' },
  },
  'holo-shift': {
    '0%, 100%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
  },
  'neon-pulse': {
    '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
    '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
  },
  'sf-grid-move': {
    '0%': { backgroundPosition: '-1px -1px' },
    '100%': { backgroundPosition: '49px 49px' },
  },
},
animation: {
  // 既存animation維持

  'sf-pulse': 'sf-pulse 2s ease-in-out infinite',
  'sf-glitch': 'sf-glitch 0.3s ease-in-out infinite',
  'holo-shift': 'holo-shift 3s ease-in-out infinite',
  'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
  'sf-grid': 'sf-grid-move 20s linear infinite',
}
```

### 3.4 追加するfontFamily

```typescript
fontFamily: {
  // 既存font維持
  mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'monospace'],
}
```

---

## 4. サイト名変更詳細設計

### 4.1 変更対象ファイルと具体的変更内容

| # | ファイル | 変更前 | 変更後 |
|---|----------|--------|--------|
| 1 | `app/layout.tsx` | `title: "つべナビ \| YouTube動画分析ツール"` | `title: "TubeVision \| YouTube動画分析ツール"` |
| 2 | `app/layout.tsx` | `description: "YouTubeチャンネルおよび動画の..."` | `description: "YouTubeチャンネルおよび動画の..."` (変更なし) |
| 3 | `components/app-layout.tsx` | `© {year} つべナビ. All rights reserved.` | `© {year} TubeVision. All rights reserved.` |
| 4 | `components/header.tsx` | `alt="つべナビ"` | `alt="TubeVision"` |
| 5 | `components/header.tsx` | `つべナビ` (テキスト) | `TubeVision` |
| 6 | `components/layout.tsx` | `alt="つべナビ"` (複数箇所) | `alt="TubeVision"` |
| 7 | `components/layout.tsx` | `つべナビ` (複数箇所) | `TubeVision` |
| 8 | `components/layout.tsx` | `© 2025 つべナビ` | `© 2025 TubeVision` |
| 9 | `components/main-nav.tsx` | `"つべナビの使い方に関するFAQ"` | `"TubeVisionの使い方に関するFAQ"` |
| 10 | `app/styleguide/page.tsx` | `"つべナビ スタイルガイド"` | `"TubeVision スタイルガイド"` |
| 11 | `app/styleguide/page.tsx` | `"つべナビの公式ロゴと使用例"` | `"TubeVisionの公式ロゴと使用例"` |
| 12 | `app/styleguide/page.tsx` | `alt="つべナビ ロゴ"` | `alt="TubeVision ロゴ"` |
| 13 | `README.md` | `# つべナビ 🎥` | `# TubeVision 🎥` |

### 4.2 変更しないもの

- `CLAUDE.md` 内の「tube-get」表記（内部リポジトリ名として維持）
- `package.json` の `name: "tube-get"`
- GitHubリポジトリ名

---

## 5. コンポーネント別スタイル変更設計

### 5.1 Header コンポーネント

```tsx
// 変更前
<header className="bg-background border-b border-border">

// 変更後（ダークモード時SF効果適用）
<header className="bg-background border-b border-border dark:bg-sf-bg-secondary dark:border-sf-cyan/20">
```

### 5.2 Card コンポーネント（shadcn/ui）

SF効果はオプションで適用可能にするため、新しいvariantを追加：

```tsx
// globals.css に追加（Card用）
.card-sf {
  @apply dark:bg-sf-bg-tertiary/80 dark:border-sf-cyan/20 dark:backdrop-blur-sm;
}

.card-sf-glow {
  @apply card-sf dark:shadow-sf-glow;
}

.card-holographic {
  @apply holographic-card;
}
```

### 5.3 Button コンポーネント

新しいvariant追加（既存は維持）：

```tsx
// globals.css に追加
.btn-neon {
  @apply neon-button rounded-md px-4 py-2 font-medium;
}

.btn-neon-pink {
  @apply btn-neon border-neon-pink text-neon-pink hover:bg-neon-pink/10 hover:shadow-neon-glow-pink;
}

.btn-neon-blue {
  @apply btn-neon border-neon-blue text-neon-blue hover:bg-neon-blue/10 hover:shadow-neon-glow-blue;
}
```

### 5.4 背景パターン

```tsx
// app/layout.tsx または components/app-layout.tsx
<div className="min-h-screen dark:sf-grid-bg">
  {children}
</div>
```

---

## 6. 実装順序

### Phase 1: スタイル基盤（エラー最小化）
1. `tailwind.config.ts` にカラー・shadow・animation追加
2. `globals.css` にCSS変数・コンポーネント・ユーティリティ追加
3. ビルド確認（`npm run build`）

### Phase 2: サイト名変更
4. 全13箇所のサイト名を「TubeVision」に一括変更
5. ビルド確認

### Phase 3: コンポーネントスタイル適用
6. Header にSF効果適用
7. 背景グリッド適用
8. Card/Button のSF variant追加（オプション）

### Phase 4: 検証
9. ESLint チェック
10. TypeScript 型チェック
11. Vitest テスト実行
12. 本番ビルド確認
13. ローカル動作確認

---

## 7. リスク対策

| リスク | 対策 |
|--------|------|
| 既存CSS変数との競合 | HSL形式で新変数を追加、既存変数は変更しない |
| tailwindcss-animate競合 | keyframes名を`sf-`プレフィックス付きで命名 |
| ダークモード非対応 | `dark:`プレフィックスで条件適用 |
| パフォーマンス低下 | backdrop-filter使用は限定的、モバイルでは軽減 |
| アクセシビリティ低下 | `prefers-reduced-motion`対応、フォーカス可視性維持 |

---

## 8. 成果物チェックリスト

- [ ] `app/globals.css` 更新
- [ ] `tailwind.config.ts` 更新
- [ ] サイト名13箇所変更
- [ ] ESLint 0エラー
- [ ] TypeScript 0エラー
- [ ] Vitest 全パス
- [ ] ビルド成功
- [ ] ローカル動作確認

---

作成日: 2026-01-18
ステータス: 設計完了（ユーザー承認待ち）
次フェーズ: /sc:workflow でタスク分解
