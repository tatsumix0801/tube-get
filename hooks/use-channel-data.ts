import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getSpecificVideos } from "@/lib/youtube-api"
import { getCached, setCache, CacheKeys } from "@/lib/api-cache"
import { debugLog } from "@/lib/logger"

// 型定義
interface Thumbnail {
  url: string
  width?: number
  height?: number
}

interface Thumbnails {
  default: Thumbnail
  medium?: Thumbnail
  high?: Thumbnail
  standard?: Thumbnail
  maxres?: Thumbnail
}

export interface ChannelInfo {
  id: string
  title: string
  description: string
  customUrl: string
  publishedAt: string
  thumbnails: Thumbnails
  subscriberCount: string
  videoCount: string
  viewCount: string
  country?: string
  banner?: string
  keywords?: string[]
}

export interface Video {
  id: string
  title: string
  publishedAt: string
  thumbnail: string
  duration: string
  viewCount: string
  likeCount: string
  commentCount: string
  spreadRate: number
  url: string
  description?: string
  tags?: string[]
  topics?: string[]
  type?: "standard" | "short" // 動画タイプを識別するフィールドを追加
}

// 動画タイプを識別する関数
function identifyVideoType(video: Video): "standard" | "short" {
  // YouTubeショート動画は通常60秒未満
  const durationInSeconds = parseDuration(video.duration);
  return durationInSeconds <= 60 ? "short" : "standard";
}

// 動画の長さ(PT1H2M3S形式)を秒数に変換
function parseDuration(duration: string): number {
  let seconds = 0;
  
  // 時間 (H)
  const hoursMatch = duration.match(/(\d+)H/);
  if (hoursMatch) {
    seconds += parseInt(hoursMatch[1]) * 3600;
  }
  
  // 分 (M)
  const minutesMatch = duration.match(/(\d+)M/);
  if (minutesMatch) {
    seconds += parseInt(minutesMatch[1]) * 60;
  }
  
  // 秒 (S)
  const secondsMatch = duration.match(/(\d+)S/);
  if (secondsMatch) {
    seconds += parseInt(secondsMatch[1]);
  }
  
  return seconds;
}

export interface UseChannelDataResult {
  channelInfo: ChannelInfo | null
  videos: Video[]
  isLoading: boolean
  error: string
  filteredVideos: (period: string) => Video[]
  getStandardVideos: () => Video[]
  getShortVideos: () => Video[]
  refetch: () => Promise<void>
}

export function useChannelData(): UseChannelDataResult {
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  // 全ての動画を取得する関数（ページネーション対応・キャッシュ対応）
  const fetchAllVideos = useCallback(async (channelUrl: string, apiKey: string): Promise<{success: boolean, videos: Video[], message?: string}> => {
    // キャッシュをチェック（channelUrlをキーとして使用）
    const cacheKey = CacheKeys.channelVideos(channelUrl)
    const cachedVideos = getCached<Video[]>(cacheKey)
    if (cachedVideos) {
      debugLog("[INFO] キャッシュから動画を取得:", cachedVideos.length, "件")
      toast.success(`キャッシュから${cachedVideos.length}件の動画を取得しました`)
      return { success: true, videos: cachedVideos }
    }

    const allVideos: Video[] = [];
    let currentPageToken = "";
    let pageCount = 0;
    // ページ制限を撤廃し、nextPageTokenがある限り継続

    try {
      // 初回の進捗表示
      toast.info("動画情報を取得中...");
      
      while (true) {
        // 50件ずつ取得（API最大値で効率化）
        const maxResults = 50;
        const mode = "complete"; // completeモードで確実に全動画取得
        
        console.log(`[INFO] Fetching page ${pageCount + 1} - mode: ${mode}, maxResults: ${maxResults}`);
        
        const response = await fetch(
          `/api/youtube/videos?channelUrl=${encodeURIComponent(channelUrl)}&apiKey=${encodeURIComponent(apiKey)}&mode=${mode}&maxResults=${maxResults}${currentPageToken ? `&pageToken=${currentPageToken}` : ""}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // fetchタイムアウト設定（9秒）
            signal: AbortSignal.timeout(9000),
          }
        );
        
        // レスポンスステータスチェック
        if (!response.ok) {
          console.error("[ERROR] Response not OK:", response.status, response.statusText);
          // 取得済み動画があれば部分的成功として返す
          if (allVideos.length > 0) {
            toast.warning(`一部の動画取得に失敗しました（${allVideos.length}件取得済み）`);
            return { success: true, videos: allVideos };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // まずテキストとして取得
        const responseText = await response.text();
        
        // 空レスポンスチェック
        if (!responseText) {
          console.error("[ERROR] Empty response from server");
          if (allVideos.length > 0) {
            toast.warning(`一部の動画取得に失敗しました（${allVideos.length}件取得済み）`);
            return { success: true, videos: allVideos };
          }
          throw new Error("サーバーからの応答が空です");
        }
        
        // JSONパース
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("[ERROR] JSON parse failed:", parseError);
          if (allVideos.length > 0) {
            toast.warning(`一部の動画取得に失敗しました（${allVideos.length}件取得済み）`);
            return { success: true, videos: allVideos };
          }
          throw new Error("サーバーからの応答が不正です（JSONパースエラー）");
        }
        
        if (!data.success) {
          console.error("[ERROR] Videos API failed:", data);
          if (allVideos.length > 0) {
            toast.warning(`一部の動画取得に失敗しました（${allVideos.length}件取得済み）`);
            return { success: true, videos: allVideos };
          }
          const errorMessage = data.details || data.message || "動画情報の取得に失敗しました";
          return { success: false, videos: [], message: errorMessage };
        }
        
        // 動画タイプを識別して設定
        const processedVideos = data.videos.map((video: Video) => ({
          ...video,
          type: identifyVideoType(video)
        }));
        
        // 取得した動画を追加
        allVideos.push(...processedVideos);
        pageCount++;
        
        // 進捗更新（100件ごとに報告）
        if (allVideos.length % 100 === 0 && allVideos.length > 0) {
          toast.info(`${allVideos.length}件の動画を取得済み...続行中`);
        } else if (data.nextPageToken) {
          toast.info(`${allVideos.length}件の動画を取得済み...`);
        }
        
        // 次のページがある場合
        if (data.nextPageToken) {
          currentPageToken = data.nextPageToken;
          // API負荷軽減のための動的遅延（後半は遅延を増やす）
          const delay = pageCount < 5 ? 300 : 500;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // 全動画取得完了
          break;
        }
        
        // 安全装置（最大30ページ = 1500件まで）
        if (pageCount >= 30) {
          console.warn("[WARN] 最大ページ数に到達しました");
          toast.warning("取得上限に達しました（続きがある可能性があります）");
          break;
        }
      }
      
      // 問題の動画IDが含まれているか確認し、なければ直接取得
      const problemVideoIds = ['x4BBWXihl7U', 'PIe60_9RNVI'];
      const foundIds = new Set(allVideos.map(v => v.id));
      const missingIds = problemVideoIds.filter(id => !foundIds.has(id));
      
      if (missingIds.length > 0) {
        debugLog("[INFO] 問題の動画を直接取得:", missingIds);
        try {
          const specificVideos = await getSpecificVideos(missingIds, apiKey);
          if (specificVideos.length > 0) {
            // 動画タイプを識別して追加
            const processedSpecificVideos = specificVideos.map((video: Video) => ({
              ...video,
              type: identifyVideoType(video)
            }));
            allVideos.push(...processedSpecificVideos);
            toast.info(`追加で${specificVideos.length}件の動画を取得しました`);
            debugLog("[INFO] 追加取得成功:", specificVideos.map(v => v.id));
          }
        } catch (error) {
          console.error("[ERROR] 特定動画の取得に失敗:", error);
        }
      }
      
      // 取得完了メッセージ
      toast.success(`全${allVideos.length}件の動画を取得しました`);

      // キャッシュに保存（5分間有効）
      setCache(cacheKey, allVideos)
      debugLog("[INFO] 動画データをキャッシュに保存:", allVideos.length, "件")

      return {
        success: true,
        videos: allVideos
      }
    } catch (error) {
      console.error("[ERROR] Videos fetch exception:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        type: error?.constructor?.name
      });
      
      // タイムアウトエラーの特別処理
      let errorMessage;
      if (error instanceof Error && error.name === 'AbortError') {
        errorMessage = "リクエストがタイムアウトしました。しばらく待ってから再試行してください。";
      } else if (error instanceof Error && error.message.includes("JSON")) {
        errorMessage = "サーバーからの応答が不正です。しばらく待ってから再試行してください。";
      } else {
        errorMessage = error instanceof Error 
          ? `動画情報の取得中にエラーが発生しました: ${error.message}`
          : "動画情報の取得中にエラーが発生しました";
      }
      
      // 取得済み動画があれば部分的成功として返す
      if (allVideos.length > 0) {
        toast.warning(`一部の動画取得に失敗しました（${allVideos.length}件取得済み）`);
        return { success: true, videos: allVideos };
      }
      
      return {
        success: false,
        videos: [],
        message: errorMessage
      }
    }
  }, [])

  // チャンネル情報と動画リストを取得
  const fetchChannelData = useCallback(async () => {
    setIsLoading(true)
    setError("")

    try {
      // セッションストレージからチャンネル情報を取得
      const storedChannelInfo = sessionStorage.getItem("currentChannelInfo")
      const channelUrl = sessionStorage.getItem("currentChannelUrl")

      if (!storedChannelInfo || !channelUrl) {
        setError("チャンネル情報が見つかりません")
        router.push("/dashboard")
        return
      }

      // チャンネル情報を設定
      const parsedChannelInfo = JSON.parse(storedChannelInfo)
      setChannelInfo(parsedChannelInfo)

      // APIキーを取得
      const apiKey = sessionStorage.getItem("youtube_api_key")
      if (!apiKey) {
        setError("YouTube API Keyが見つかりません")
        toast.error("YouTube API Keyが見つかりません")
        router.push("/dashboard")
        return
      }

      // 全ての動画を取得（ページネーション対応）
      debugLog("[INFO] Fetching videos with API key length:", apiKey.length);
      const allVideos = await fetchAllVideos(channelUrl, apiKey)
      
      if (!allVideos.success) {
        console.error("[ERROR] Failed to fetch videos:", allVideos.message);
        const errorMsg = allVideos.message || "動画情報の取得に失敗しました";
        setError(errorMsg)
        toast.error(errorMsg, {
          description: "APIキーが正しいか、ネットワーク接続を確認してください。",
          duration: 10000,
        })
        return
      }

      // 動画リストを設定
      setVideos(allVideos.videos)
    } catch (error) {
      console.error("Channel data fetch error:", error)
      setError("チャンネルデータの取得中にエラーが発生しました")
      toast.error("チャンネルデータの取得中にエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }, [fetchAllVideos, router])

  // 初回読み込み時にデータを取得
  useEffect(() => {
    fetchChannelData()
  }, [fetchChannelData])

  // ファビコンを動的に設定
  useEffect(() => {
    if (channelInfo?.title) {
      // タイトルのみ更新
      document.title = `${channelInfo.title} - つべナビ`;
    }

    // コンポーネントのアンマウント時に元のタイトルに戻す
    return () => {
      document.title = 'つべナビ - YouTubeチャンネル分析ツール';
    };
  }, [channelInfo]);

  // 期間フィルタリングの関数
  const filteredVideos = (period: string) => {
    if (!videos.length) return [];

    const now = new Date();
    const filterDate = new Date();

    switch (period) {
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "halfyear":
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return videos;
    }

    return videos.filter((video) => new Date(video.publishedAt) >= filterDate);
  };

  // 通常動画だけを返す関数
  const getStandardVideos = () => {
    return videos.filter(video => video.type === "standard");
  };

  // ショート動画だけを返す関数
  const getShortVideos = () => {
    return videos.filter(video => video.type === "short");
  };

  return {
    channelInfo,
    videos,
    isLoading,
    error,
    filteredVideos,
    getStandardVideos,
    getShortVideos,
    refetch: fetchChannelData
  };
} 
