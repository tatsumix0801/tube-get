# パフォーマンス最適化設計書

## 概要

tube-getアプリケーションのパフォーマンス最適化を4つの領域で実施する設計。

## 現状分析

### 1. video-analysis-tab.tsx（401行）- 改善必要

**問題点**:
- `getFilteredVideos()` が毎レンダリングで再計算される（メモ化なし）
- 統計データ（totalViews, avgViews, totalLikes, avgLikes, avgComments, avgSpreadRate）が毎レンダリングで再計算
- `<VideoTable videos={videos} />` に毎回同じ参照が渡されてもVideoTable内部で再計算される

### 2. video-table.tsx（653行）- 改善必要

**問題点**:
- `sortedVideos` が `[...videos].sort()` で毎レンダリング再計算
- コンポーネント自体がmemo化されていない
- サムネイル画像のlazyロードは設定済み（next/image）だが最適化の余地あり

### 3. channel-overview-tab.tsx（85行）- 良好

**良い点**:
- 既にサブコンポーネントを `React.memo` でメモ化済み
- 開発時デバッグログ実装済み

### 4. lib/youtube-api.ts（897行）- 改善必要

**問題点**:
- APIレスポンスのキャッシュ機構なし
- 同じチャンネルへの重複リクエストが発生する可能性
- 大量のconsole.log（本番環境でのパフォーマンス影響）

---

## 最適化設計

### Phase 1: コンポーネントのメモ化（高優先度）

#### 1-1. video-analysis-tab.tsx の最適化

```typescript
// Before: 毎レンダリングで再計算
const filteredVideos = getFilteredVideos()

// After: useMemoでメモ化
const filteredVideos = useMemo(() => {
  if (!videos.length) return []

  const now = new Date()
  const filterDate = new Date()

  switch (activeTab) {
    case "week":
      filterDate.setDate(now.getDate() - 7)
      break
    // ... その他のケース
  }

  return videos.filter((video) => new Date(video.publishedAt) >= filterDate)
}, [videos, activeTab])
```

```typescript
// 統計データの計算をuseMemoで最適化
const { totalViews, avgViews, totalLikes, avgLikes, totalComments, avgComments, avgSpreadRate } = useMemo(() => {
  if (!filteredVideos.length) {
    return { totalViews: 0, avgViews: 0, totalLikes: 0, avgLikes: 0, totalComments: 0, avgComments: 0, avgSpreadRate: 0 }
  }

  const totalViews = filteredVideos.reduce(
    (sum, video) => sum + Number.parseInt(video.viewCount.replace(/,/g, ""), 10),
    0
  )
  // ... 他の計算

  return { totalViews, avgViews, totalLikes, avgLikes, totalComments, avgComments, avgSpreadRate }
}, [filteredVideos])
```

#### 1-2. video-table.tsx の最適化

```typescript
// Before: 毎レンダリングで再計算
const sortedVideos = [...videos].sort((a, b) => { ... })

// After: useMemoでメモ化
const sortedVideos = useMemo(() => {
  return [...videos].sort((a, b) => {
    // ソートロジック
  })
}, [videos, sortConfig])
```

```typescript
// VideoTableコンポーネント自体をmemo化
export const VideoTable = memo(function VideoTable({ videos }: VideoTableProps) {
  // ...
})
```

### Phase 2: 画像の遅延読み込み最適化（中優先度）

#### 2-1. サムネイル画像の最適化

現状: next/Image使用済み（デフォルトでlazy）

追加最適化:
```typescript
// video-table.tsx内のサムネイル
<Image
  src={video.thumbnail}
  alt={video.title}
  width={120}
  height={68}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABQODxIPDRQSEBIXFRQdHx..."
  className="rounded"
/>
```

#### 2-2. Intersection Observerによる仮想スクロール検討

動画数が多い場合（100件以上）、仮想スクロールを検討:
- react-window または react-virtualized の導入
- 現時点では50件/ページのため優先度低

### Phase 3: APIレスポンスのキャッシュ（高優先度）

#### 3-1. シンプルなメモリキャッシュの実装

```typescript
// lib/api-cache.ts
interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<unknown>>()
const CACHE_TTL = 5 * 60 * 1000 // 5分

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null

  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}
```

#### 3-2. use-channel-data.tsでのキャッシュ活用

```typescript
// hooks/use-channel-data.ts
const fetchChannelData = async (channelUrl: string) => {
  const cacheKey = `channel:${channelUrl}`
  const cached = getCached<ChannelData>(cacheKey)

  if (cached) {
    setChannelInfo(cached.info)
    setVideos(cached.videos)
    return
  }

  // APIフェッチ
  const result = await fetchFromApi(channelUrl)
  setCache(cacheKey, result)
  // ...
}
```

### Phase 4: データフェッチング最適化（中優先度）

#### 4-1. 重複リクエスト防止

```typescript
// lib/request-dedup.ts
const pendingRequests = new Map<string, Promise<unknown>>()

export async function dedupedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const pending = pendingRequests.get(key)
  if (pending) {
    return pending as Promise<T>
  }

  const promise = fetcher()
  pendingRequests.set(key, promise)

  try {
    const result = await promise
    return result
  } finally {
    pendingRequests.delete(key)
  }
}
```

#### 4-2. console.logの本番環境削除

```typescript
// lib/logger.ts
export const debugLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DEBUG]', ...args)
  }
}
```

youtube-api.tsの全`console.log`を`debugLog`に置換。

---

## 実装タスク一覧

| # | タスク | ファイル | 優先度 |
|---|--------|---------|-------|
| 1 | filteredVideosのuseMemo化 | video-analysis-tab.tsx | 高 |
| 2 | 統計データ計算のuseMemo化 | video-analysis-tab.tsx | 高 |
| 3 | sortedVideosのuseMemo化 | video-table.tsx | 高 |
| 4 | VideoTableのReact.memo化 | video-table.tsx | 高 |
| 5 | APIキャッシュ機構の実装 | lib/api-cache.ts (新規) | 高 |
| 6 | use-channel-dataでのキャッシュ活用 | hooks/use-channel-data.ts | 高 |
| 7 | 画像placeholder追加 | video-table.tsx | 中 |
| 8 | 重複リクエスト防止 | lib/request-dedup.ts (新規) | 中 |
| 9 | debugLog関数実装とconsole.log置換 | lib/youtube-api.ts | 低 |

---

## 期待される効果

1. **レンダリング最適化**: 不要な再計算を60-80%削減
2. **APIコール削減**: キャッシュにより同一チャンネルへの重複リクエスト排除
3. **メモリ効率**: 大量動画表示時のメモリ使用量安定化
4. **UX向上**: 画面遷移・タブ切り替え時の体感速度向上

---

## 注意事項

- React.memoの過剰使用は逆にパフォーマンス低下の原因となるため、実際にボトルネックとなっている箇所のみに適用
- キャッシュTTLは5分に設定（YouTubeデータの更新頻度を考慮）
- 本番環境でのconsole.log除去は必須（パフォーマンスとセキュリティ両面）

---

作成日: 2026-01-18
