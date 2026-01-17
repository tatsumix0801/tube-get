✨💖 **実装計画書：動画パフォーマンス分析ページ「良いチャンネル」判定機能** 💖✨  
（ver.1.0 / 2025-05-22）

---

## 1. 目的 & ゴール
| # | 内容 |
|---|---|
| 1 | 動画パフォーマンス分析ページに「良いチャンネル」列（指標）を追加する |
| 2 | 「投稿日が 1 ヶ月以内」かつ「拡散率 ≥ 100 %」の動画が 1 本でも存在する場合 → `◯` を表示 |
| 3 | 上記条件を満たす動画が 0 本の場合 → 空欄を表示 |
| 4 | 既存 UI／データ構造への影響を最小限に抑え、パフォーマンスを劣化させない |

---

## 2. 要件整理
| 区分 | 要件 |
|---|---|
| ビジネス | 直近 1 ヶ月でバズり動画を出しているかを瞬時に判定し、提案機能の布石にする |
| UX/UI | ・既存カードの KPI 群と同じサイズ感で「良いチャンネル」を配置<br>・数値ではなく `◯` or 空欄表示で一目瞭然 |
| ロジック | 1. API 取得済み動画一覧（投稿日, 拡散率など）を走査<br>2. `投稿日 ≥ (today - 30days)` かつ `拡散率 ≥ 100` を満たす動画があればフラグ ON |
| パフォーマンス | ・フロント側のみで算出（追加クエリ無し）<br>・メモ化や `useMemo` で再レンダリング最適化 |
| テスト | 単体：ロジック関数の true/false 判定<br>E2E：UI に `◯` が描画される／されないケース |

---

## 3. 影響範囲
1. UI  
   - `src/pages/analytics/video/index.tsx`（例）  
   - KPI カードコンポーネント `components/KpiCard.tsx`
2. 型定義  
   - `types/video.ts` など（`diffusionRate` が number／null を保障）
3. テスト  
   - Jest + React Testing Library  
   - Cypress (E2E) ※導入済みの場合

---

## 4. 実装ステップ
| 順 | タスク | 担当 | 完了条件 |
|---|---|---|---|
| 1 | 既存 Video 型に `uploadedAt: string`（ISO）`diffusionRate: number` があるか確認 | 👀 | フィールド重複なし |
| 2 | 判定ヘルパー `isGoodChannel(videos: Video[]): boolean` を `utils/video.ts` に追加 | 💻 | 単体テスト green |
| 3 | `useGoodChannel` カスタム Hook を実装（`useMemo` で計算） | 💻 | Return 値の再計算が最小 |
| 4 | KPI カード一覧に `<KpiCard title="良いチャンネル" value={goodChannel ? "◯" : ""} />` を追加 | 💻 | レイアウト崩れ無し |
| 5 | CSS / Chakra / MUI など UI フレームワークで余白微調整 | 🎨 | 他カードと高さ統一 |
| 6 | 単体テスト：<br>　a. 1 ヶ月以内 & 拡散率 120 → true<br>　b. 45 日前 & 拡散率 150 → false | 🔍 | PASS |
| 7 | E2E テスト：モック API 差し替えで `◯` 表示を確認 | 🔍 | PASS |
| 8 | PR → Code Review → Merge | 🙌 | main ブランチ |

---

## 5. データ仕様
```ts
type Video = {
  id: string;
  title: string;
  uploadedAt: string;      // ISO 8601
  diffusionRate: number;   // 例：465.68
  // ...既存プロパティ
}
```
判定ロジック  
```ts
export const isGoodChannel = (videos: Video[]): boolean =>
  videos.some(v => {
    const oneMonthAgo = dayjs().subtract(1, 'month');
    return dayjs(v.uploadedAt).isAfter(oneMonthAgo) && v.diffusionRate >= 100;
  });
```

---

## 6. テスト計画
1. Unit (Jest)  
   - `isGoodChannel` の真偽テーブル網羅
2. Component  
   - `<KpiCard />` が `◯` or 空文字を描画
3. E2E (Cypress)  
   - API fixture 切替で UI 反映を確認
4. Regression  
   - 既存 KPI 値に影響なし

---

## 7. スケジュール（目安）
| Day | 作業 |
|---|---|
| 1 | 調査・環境セットアップ、ヘルパー/Hook 実装 |
| 2 | UI 組み込み・スタイル調整 |
| 3 | テスト実装・Fix |
| 4 | Code Review・リリース準備 |

---

## 8. リスク & 対策
| リスク | 対策 |
|---|---|
| 日付タイムゾーン差異で 1 ヶ月判定ズレ | dayjs などで UTC 揃え |
| diffusionRate 欠損 | null 合体演算子で 0 扱い & UI 空欄 |
| レイアウト崩れ | Storybook or 各解像度で確認 |

---

## 9. 完了判定
- [ ] UI に「良いチャンネル」列が表示される  
- [ ] 条件を満たす場合 `◯` がレンダリング  
- [ ] 条件を満たさない場合は空欄  
- [ ] 既存機能に副作用なし（テスト green）  

---

## 10. まとめ 🌟
以上で「良いチャンネル」判定機能の実装フローはバッチリ！うますぎやろがい🔥  
チーム友達として一緒に突き進もうね！💪✨ 