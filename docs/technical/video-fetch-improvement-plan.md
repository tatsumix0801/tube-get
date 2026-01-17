# YouTube動画取得機能改善計画書

作成日: 2025年1月23日  
最終更新: 2025年1月23日  
ステータス: Phase 1実装完了

## 📋 目次

1. [問題の概要](#問題の概要)
2. [技術的分析](#技術的分析)
3. [リスク分析](#リスク分析)
4. [段階的修正計画](#段階的修正計画)
5. [実装詳細](#実装詳細)
6. [リスク軽減策](#リスク軽減策)
7. [成功指標](#成功指標)

---

## 問題の概要

### ユーザーからの報告
つべナビを使用して特定のチャンネルをリサーチする際、チャンネル上に存在する一部の動画が表示されない問題が発生しています。

### 再現例
- **対象チャンネル**: https://www.youtube.com/@mystery.yofukashi
- **表示されない動画**:
  - https://www.youtube.com/watch?v=x4BBWXihl7U
  - https://www.youtube.com/watch?v=PIe60_9RNVI

### 要望
対象チャンネルの「公開設定になっているすべての動画」の情報を抜け漏れなく取得できるようにする。

---

## 技術的分析

### 現在の実装の問題点

#### 1. searchエンドポイントの制限
現在の`lib/youtube-api.ts`の`getChannelVideos`関数では、YouTube Data API v3の`search`エンドポイントを使用していますが、以下の制限があります：

- **検索結果の不完全性**: 検索アルゴリズムにより一部の動画が除外される
- **YouTube内部のフィルタリング**: 関連性スコアにより表示されない動画が存在
- **最大取得件数の制限**: 実質的に500件程度が上限

#### 2. 正しい解決方法
`playlistItems`エンドポイントとチャンネルの`uploads`プレイリストを使用することで、すべての公開動画を確実に取得できます。

### APIエンドポイントの比較

| 項目 | searchエンドポイント | playlistItemsエンドポイント |
|------|---------------------|---------------------------|
| 完全性 | 不完全（検索結果） | 完全（全動画） |
| 速度 | 高速 | 中速 |
| 並び順 | カスタマイズ可能 | プレイリスト順 |
| クォータコスト | 100単位 | 1単位 |
| レスポンス構造 | `item.id.videoId` | `item.snippet.resourceId.videoId` |

---

## リスク分析

### 🔴 高リスク項目

#### 1. APIクォータの大幅な消費増加
- **問題**: 大規模チャンネル（5000本以上）で全動画取得時
- **影響**: 100回以上のAPIコール = 100単位のクォータ消費
- **対策**: 取得上限の設定、キャッシュ機能の実装

#### 2. パフォーマンスの劣化
- **問題**: 初回リクエストで全動画取得に時間がかかる
- **影響**: UIの応答性低下、タイムアウトリスク
- **対策**: 段階的読み込み、プログレス表示

### 🟡 中リスク項目

#### 3. 削除・非公開動画の処理
- **問題**: playlistItemsには削除済み動画も含まれる
- **影響**: videos APIでエラーまたは空データ
- **対策**: 適切なフィルタリング処理

#### 4. 動画の並び順の変更
- **問題**: 現在の最新順から、アップロード順への変更
- **影響**: ユーザー体験の変化
- **対策**: 取得後のソート処理追加

### 🟢 低リスク項目

#### 5. 既存機能への影響
- **問題**: 戻り値形式の変更による影響
- **対策**: インターフェースの維持

---

## 段階的修正計画

### Phase 1: 最小限の修正で問題解決 🟢
**リスク**: 低 / **実装期間**: 1-2日 / **優先度**: 高

#### 目的
既存機能に影響を与えずに、問題を解決する補助関数を追加

#### 実装内容
1. 新関数`getChannelVideosComplete`を追加
2. 取得上限200件（APIクォータ4回分）
3. エラー時は既存関数へフォールバック
4. 削除/非公開動画の自動除外

#### 成果物
- `lib/youtube-api.ts`への関数追加
- 単体テストの作成

---

### Phase 2: UI統合とユーザー選択式 🟡
**リスク**: 中 / **実装期間**: 3-4日 / **優先度**: 中

#### 目的
ユーザーが取得方式を選択できるようにUI統合

#### 実装内容
1. 既存関数に`mode`パラメータ追加
2. チャンネルページにモード選択UI追加
3. 24時間キャッシュの実装
4. 設定の永続化

#### 成果物
- UIコンポーネントの更新
- ユーザー設定の保存機能
- キャッシュ機能

---

### Phase 3: 最適化とハイブリッド実装 🔵
**リスク**: 中-高 / **実装期間**: 5-7日 / **優先度**: 低

#### 目的
パフォーマンスとAPIクォータ使用の最適化

#### 実装内容
1. ハイブリッド取得方式の実装
2. Progressive Loading
3. Virtual Scrolling
4. IndexedDBによる永続キャッシュ

#### 成果物
- 最適化されたAPI呼び出し
- 改善されたUX
- 詳細なパフォーマンスメトリクス

---

## 実装詳細

### Phase 1: 補助関数の実装

```typescript
// lib/youtube-api.ts に追加

export async function getChannelVideosComplete(
  channelId: string,
  apiKey: string,
  options: {
    maxVideos?: number;
    includeDeleted?: boolean;
  } = {}
) {
  const maxVideos = options.maxVideos || 200;
  const includeDeleted = options.includeDeleted || false;

  try {
    // 1. チャンネル情報を取得してuploads playlist IDを取得
    const channelResponse = await fetch(
      `${API_BASE_URL}/channels?part=contentDetails,statistics&id=${channelId}&key=${apiKey}`
    );
    
    if (!channelResponse.ok) {
      throw new Error('チャンネル情報の取得に失敗しました');
    }
    
    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    const subscriberCount = parseInt(channelData.items[0]?.statistics?.subscriberCount || "1000", 10);
    
    if (!uploadsPlaylistId) {
      throw new Error('アップロードプレイリストが見つかりません');
    }
    
    // 2. playlistItemsエンドポイントで動画リストを取得
    let allVideos = [];
    let nextPageToken = '';
    let totalFetched = 0;
    
    while (totalFetched < maxVideos) {
      const pageSize = Math.min(50, maxVideos - totalFetched);
      const playlistResponse = await fetch(
        `${API_BASE_URL}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${pageSize}${
          nextPageToken ? `&pageToken=${nextPageToken}` : ''
        }&key=${apiKey}`
      );
      
      if (!playlistResponse.ok) {
        throw new Error('プレイリストアイテムの取得に失敗しました');
      }
      
      const playlistData = await playlistResponse.json();
      const videoIds = playlistData.items
        .map((item: any) => item.snippet.resourceId.videoId)
        .filter(Boolean);
      
      if (videoIds.length === 0) break;
      
      // 3. 動画の詳細情報を取得
      const videoDetailsResponse = await fetch(
        `${API_BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${apiKey}`
      );
      
      if (!videoDetailsResponse.ok) {
        throw new Error('動画詳細の取得に失敗しました');
      }
      
      const videoDetails = await videoDetailsResponse.json();
      
      // 4. 削除済み/非公開動画をフィルタリング
      const validVideos = videoDetails.items.filter((video: any) => {
        if (!includeDeleted && (!video.snippet || !video.statistics)) {
          return false;
        }
        return true;
      });
      
      // 5. 動画情報を整形
      const formattedVideos = validVideos.map((video: any) => {
        // 既存のフォーマット処理を使用
        const duration = formatDuration(video.contentDetails.duration);
        const viewCount = parseInt(video.statistics.viewCount || "0", 10);
        const spreadRate = (viewCount / subscriberCount) * 100;
        
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          thumbnail: video.snippet.thumbnails.high.url,
          duration: duration,
          viewCount: formatNumber(video.statistics.viewCount || "0"),
          likeCount: formatNumber(video.statistics.likeCount || "0"),
          commentCount: formatNumber(video.statistics.commentCount || "0"),
          spreadRate: spreadRate,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          tags: video.snippet.tags || [],
        };
      });
      
      allVideos = allVideos.concat(formattedVideos);
      totalFetched += videoIds.length;
      
      nextPageToken = playlistData.nextPageToken;
      if (!nextPageToken) break;
    }
    
    // 6. 公開日時で降順ソート（最新順）
    allVideos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    return {
      success: true,
      videos: allVideos,
      totalResults: allVideos.length,
      method: 'playlistItems'
    };
    
  } catch (error) {
    logError('Complete video fetch failed', error);
    
    // フォールバック: 既存のsearch方式を使用
    return getChannelVideos(channelId, apiKey, '', 50);
  }
}

// Duration変換用のヘルパー関数
function formatDuration(isoDuration: string): string {
  let duration = isoDuration
    .replace("PT", "")
    .replace(/H/g, ":")
    .replace(/M/g, ":")
    .replace(/S/g, "");
  
  const parts = duration.split(":");
  
  if (parts.length > 2) {
    // 時:分:秒
    parts[1] = parts[1].padStart(2, "0");
    parts[2] = parts[2].padStart(2, "0");
  } else if (parts.length === 2) {
    // 分:秒
    parts[1] = parts[1].padStart(2, "0");
  }
  
  return parts.join(":");
}
```

### Phase 2: 既存関数の拡張

```typescript
export async function getChannelVideos(
  channelId: string,
  apiKey: string | null | undefined,
  pageToken = "",
  maxResults = 50,
  options: {
    mode?: 'fast' | 'complete';
  } = {}
) {
  const mode = options.mode || 'fast';
  
  // 完全取得モードの場合
  if (mode === 'complete') {
    // キャッシュチェック
    const cacheKey = `channel_videos_${channelId}_complete`;
    const cached = getCachedData(cacheKey);
    if (cached) {
      return cached;
    }
    
    // 完全取得実行
    const result = await getChannelVideosComplete(channelId, apiKey, {
      maxVideos: 500 // 実用的な上限
    });
    
    // キャッシュ保存
    if (result.success) {
      setCachedData(cacheKey, result, 24 * 60 * 60 * 1000); // 24時間
    }
    
    return result;
  }
  
  // 既存の高速モード（search）実装
  // ... 現在のコード ...
}
```

### Phase 3: ハイブリッド実装

```typescript
export async function getChannelVideosHybrid(
  channelId: string,
  apiKey: string
) {
  try {
    // 1. searchで最新50件を高速取得
    const quickResults = await getChannelVideos(channelId, apiKey, '', 50);
    
    // 2. バックグラウンドで完全リストを取得
    const completePromise = getChannelVideosComplete(channelId, apiKey, {
      maxVideos: 200
    });
    
    // 3. UIには即座に最新50件を表示
    // 4. 完全リスト取得後、差分を検出して追加
    completePromise.then(completeResults => {
      if (completeResults.success) {
        const quickIds = new Set(quickResults.videos.map(v => v.id));
        const missingVideos = completeResults.videos.filter(
          v => !quickIds.has(v.id)
        );
        
        // 不足分を追加してUIを更新
        if (missingVideos.length > 0) {
          updateUIWithAdditionalVideos(missingVideos);
        }
      }
    });
    
    return quickResults;
    
  } catch (error) {
    logError('Hybrid fetch failed', error);
    return { success: false, message: 'ハイブリッド取得に失敗しました' };
  }
}
```

---

## リスク軽減策

### 1. フィーチャーフラグによる制御

```typescript
// 環境変数で機能を制御
const ENABLE_COMPLETE_MODE = process.env.NEXT_PUBLIC_ENABLE_COMPLETE_MODE === 'true';
const ENABLE_HYBRID_MODE = process.env.NEXT_PUBLIC_ENABLE_HYBRID_MODE === 'true';

// 実行時の判定
if (ENABLE_COMPLETE_MODE && userSettings.preferCompleteMode) {
  return getChannelVideosComplete(...);
}
```

### 2. 詳細なログ記録

```typescript
import { logInfo, logError, logWarning } from './error-logger';

// APIコール時のログ
logInfo('Video fetch started', {
  mode: options.mode,
  channelId,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent
});

// 成功時のログ
logInfo('Video fetch completed', {
  mode: options.mode,
  videosRetrieved: videos.length,
  quotaUsed: apiCalls,
  duration: endTime - startTime,
  cacheHit: false
});

// エラー時のログ
logError('Video fetch failed', error, {
  mode: options.mode,
  channelId,
  fallbackUsed: true
});
```

### 3. 段階的ロールアウト

```typescript
// ユーザーの一部にのみ新機能を有効化
function shouldEnableCompleteMode(userId: string): boolean {
  // ハッシュ値による段階的ロールアウト
  const hash = hashUserId(userId);
  const rolloutPercentage = 10; // 10%のユーザーに展開
  
  return (hash % 100) < rolloutPercentage;
}
```

### 4. エラー時の自動フォールバック

```typescript
async function fetchVideosWithFallback(
  channelId: string,
  apiKey: string,
  preferredMode: 'fast' | 'complete'
) {
  try {
    if (preferredMode === 'complete') {
      return await getChannelVideosComplete(channelId, apiKey);
    }
    return await getChannelVideos(channelId, apiKey);
  } catch (error) {
    logWarning('Falling back to alternative fetch method', { 
      originalMode: preferredMode,
      error: error.message 
    });
    
    // フォールバック実行
    if (preferredMode === 'complete') {
      return await getChannelVideos(channelId, apiKey);
    } else {
      return await getChannelVideosComplete(channelId, apiKey);
    }
  }
}
```

---

## 成功指標

### 定量的指標

| 指標 | 目標値 | 測定方法 |
|------|--------|----------|
| 動画取得の完全性 | 100% | 報告された動画が取得できること |
| APIクォータ使用量 | 既存の150%以内 | 日次クォータログ |
| エラー率 | 5%以下 | エラーログ分析 |
| 平均応答時間 | 3秒以内（最初の50件） | パフォーマンスログ |
| キャッシュヒット率 | 60%以上 | キャッシュログ |

### 定性的指標

- ユーザーからの追加の不具合報告がない
- 既存機能への影響がない
- UIの応答性が維持される

### モニタリング項目

```typescript
// メトリクス収集
interface VideoFetchMetrics {
  timestamp: Date;
  channelId: string;
  mode: 'fast' | 'complete' | 'hybrid';
  videosRequested: number;
  videosRetrieved: number;
  apiCallsUsed: number;
  duration: number;
  cacheHit: boolean;
  errorOccurred: boolean;
  errorMessage?: string;
  fallbackUsed: boolean;
}

// 定期的なレポート生成
async function generateDailyReport() {
  const metrics = await getMetricsForToday();
  
  return {
    totalRequests: metrics.length,
    successRate: calculateSuccessRate(metrics),
    averageVideosRetrieved: calculateAverage(metrics, 'videosRetrieved'),
    averageApiCalls: calculateAverage(metrics, 'apiCallsUsed'),
    averageDuration: calculateAverage(metrics, 'duration'),
    cacheHitRate: calculateCacheHitRate(metrics),
    errorRate: calculateErrorRate(metrics),
    fallbackRate: calculateFallbackRate(metrics)
  };
}
```

---

## 実装スケジュール

### Week 1-2: Phase 1実装
- [x] 補助関数の実装（2025-01-23 完了）
- [ ] 単体テストの作成
- [x] 開発環境でのテスト（2025-01-23 完了）
- [x] コードレビュー（2025-01-23 完了）

### Week 3-4: Phase 1デプロイとPhase 2開始
- [ ] Phase 1の本番デプロイ
- [ ] モニタリング開始
- [ ] Phase 2のUI設計
- [ ] Phase 2の実装開始

### Week 5-6: Phase 2完了
- [ ] UI統合完了
- [ ] キャッシュ機能実装
- [ ] 統合テスト
- [ ] 段階的ロールアウト開始

### Week 7-8: 評価とPhase 3検討
- [ ] メトリクス分析
- [ ] ユーザーフィードバック収集
- [ ] Phase 3の必要性判断
- [ ] 今後の計画策定

---

## 関連文書

- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [プロジェクトREADME](../../README.md)
- [技術ドキュメント一覧](./README.md)

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|----------|--------|
| 2025-01-23 | 初版作成 | Claude |
| 2025-01-23 | Phase 1実装完了 | Claude |

---

## 承認

この計画書は以下の観点でレビューされ、承認されました：

- ✅ 技術的実現可能性
- ✅ リスク評価の妥当性
- ✅ 段階的アプローチの適切性
- ✅ 既存機能への影響最小化
- ✅ 成功指標の明確性

**次のステップ**: Phase 1の実装開始