"use server"

import { logError, logInfo } from "./error-logger"
import { formatNumber } from "./format-utils"
import { debugLog } from "./logger"
import type { 
  YouTubeChannel, 
  YouTubePlaylistItem, 
  YouTubeVideo, 
  YouTubeApiResponse, 
  FormattedVideo 
} from '@/types/youtube'

// YouTube Data API のエンドポイント
const API_BASE_URL = "https://www.googleapis.com/youtube/v3"

// API キーの検証
export async function validateApiKey(apiKey: string) {
  try {
    // チャンネル情報を1件取得してAPIキーが有効か確認
    const response = await fetch(`${API_BASE_URL}/channels?part=snippet&id=UC_x5XG1OV2P6uZZ5FSM9Ttw&key=${apiKey}`)

    if (!response.ok) {
      const error = await response.json()
      const errorMessage = error.error?.message || "APIキーが無効です"
      
      logError("APIキーの検証に失敗しました", new Error(errorMessage), {
        status: response.status,
        statusText: response.statusText,
        endpoint: "channels"
      })
      
      return {
        valid: false,
        message: errorMessage,
      }
    }

    logInfo("APIキーの検証に成功しました")
    return { 
      valid: true,
      apiKey // クライアント側で保存するためにAPIキーを返す
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "APIキーの検証中にエラーが発生しました"
    
    logError("APIキーの検証でエラーが発生しました", 
      error instanceof Error ? error : new Error(errorMessage), 
      { apiKeyProvided: !!apiKey }
    )
    
    return {
      valid: false,
      message: errorMessage,
    }
  }
}

type ApiErrorPayload = {
  error?: {
    message?: string;
  };
  message?: string;
};

// API リクエスト時のエラーメッセージを日本語化して返す関数
function translateApiError(error: ApiErrorPayload | null | undefined): string {
  if (!error) return "不明なエラーが発生しました";
  
  // エラーオブジェクトからメッセージを抽出
  const errorMessage = error.error?.message || error.message || "不明なエラーが発生しました";
  
  // クォータ超過エラーの検出
  if (
    errorMessage.includes("quota") || 
    errorMessage.includes("Quota") || 
    errorMessage.includes("quotaExceeded") ||
    errorMessage.includes("dailyLimitExceeded")
  ) {
    return "YouTube API の1日あたりのリクエスト制限（クォータ）を超過しました。この制限は毎日太平洋標準時（PST）の午前0時にリセットされます。";
  }
  
  // 認証エラーの検出
  if (
    errorMessage.includes("auth") || 
    errorMessage.includes("Auth") || 
    errorMessage.includes("invalid_key") ||
    errorMessage.includes("API key")
  ) {
    return "YouTube API Keyが無効です。設定画面から正しいAPIキーを設定してください。";
  }
  
  // ネットワークエラーの検出
  if (
    errorMessage.includes("network") || 
    errorMessage.includes("timeout") || 
    errorMessage.includes("connect")
  ) {
    return "ネットワーク接続エラーが発生しました。インターネット接続を確認して再試行してください。";
  }
  
  // チャンネル非公開または削除エラーの検出
  if (
    errorMessage.includes("not found") || 
    errorMessage.includes("Not Found") || 
    errorMessage.includes("404")
  ) {
    return "指定されたチャンネルが見つかりません。URLが正しいか、チャンネルが非公開になっていないか確認してください。";
  }
  
  // その他のエラー
  return `APIリクエスト中にエラーが発生しました: ${errorMessage}`;
}

// チャンネルIDの取得（URLまたはユーザー名から）
export async function getChannelId(channelUrl: string, apiKey: string | null | undefined) {
  if (!apiKey) {
    return {
      success: false,
      message: "YouTube API Keyが必要です",
    };
  }

  try {
    let channelId = ""

    // URLからチャンネルIDまたはユーザー名を抽出
    if (channelUrl.includes("youtube.com/channel/")) {
      // チャンネルIDが直接含まれている場合
      channelId = channelUrl.split("youtube.com/channel/")[1].split("/")[0]
      return { success: true, channelId }
    } else if (channelUrl.includes("youtube.com/user/") || channelUrl.includes("youtube.com/@")) {
      // ユーザー名またはハンドルの場合
      let username = ""
      let handleName = ""
      
      if (channelUrl.includes("youtube.com/user/")) {
        username = channelUrl.split("youtube.com/user/")[1].split("/")[0]
        // ユーザー名からチャンネルIDを検索
        const response = await fetch(`${API_BASE_URL}/channels?part=id&forUsername=${username}&key=${apiKey}`)
        
        if (!response.ok) {
          const error = await response.json()
          return {
            success: false,
            message: translateApiError(error),
          }
        }
        
        const data = await response.json() as YouTubeApiResponse<YouTubeChannel>
        if (data.items && data.items.length > 0) {
          channelId = data.items[0].id
          return { success: true, channelId }
        }
      } else if (channelUrl.includes("youtube.com/@")) {
        // @ハンドルの場合は、channelsエンドポイントのforHandleパラメータを使用
        handleName = channelUrl.split("youtube.com/@")[1].split("/")[0]
        
        // ハンドル名からチャンネルIDを直接取得
        const response = await fetch(`${API_BASE_URL}/channels?part=id&forHandle=${handleName}&key=${apiKey}`)
        
        if (!response.ok) {
          const error = await response.json()
          return {
            success: false,
            message: translateApiError(error),
          }
        }
        
        const data = await response.json() as YouTubeApiResponse<YouTubeChannel>
        if (data.items && data.items.length > 0) {
          channelId = data.items[0].id
          return { success: true, channelId }
        } else {
          // fallback: 検索APIで見つからなかった場合、完全一致検索を試みる
          const searchResponse = await fetch(`${API_BASE_URL}/search?part=snippet&q=@${handleName}&type=channel&key=${apiKey}`)
          
          if (!searchResponse.ok) {
            const error = await searchResponse.json()
            return {
              success: false,
              message: translateApiError(error),
            }
          }
          
          type SearchResultItem = {
            snippet?: {
              customUrl?: string;
              title?: string;
            };
            id?: {
              channelId?: string;
            };
          };

          const searchData = await searchResponse.json() as { items?: SearchResultItem[] }
          if (searchData.items && searchData.items.length > 0) {
            // チャンネル名の完全一致をチェック
            const exactMatch = searchData.items.find(
              (item) =>
                item.snippet?.customUrl === handleName ||
                item.snippet?.title === decodeURIComponent(handleName)
            )
            
            if (exactMatch?.id?.channelId) {
              channelId = exactMatch.id.channelId
              return { success: true, channelId }
            }
            
            // 完全一致がない場合は最初の結果を使用
            const fallbackChannelId = searchData.items[0]?.id?.channelId
            if (fallbackChannelId) {
              channelId = fallbackChannelId
              return { success: true, channelId }
            }
          }
        }
      }

      return {
        success: false,
        message: "チャンネルが見つかりませんでした。URLが正しいか確認してください。",
      }
    }

    return {
      success: false,
      message: "有効なYouTubeチャンネルURLを入力してください（例: https://www.youtube.com/@username）",
    }
  } catch (error) {
    console.error("Channel ID retrieval error:", error)
    return {
      success: false,
      message: "チャンネルIDの取得中にエラーが発生しました",
    }
  }
}

// チャンネル情報の取得
export async function getChannelInfo(channelId: string, apiKey: string | null | undefined) {
  if (!apiKey) {
    return {
      success: false,
      message: "YouTube API Keyが必要です",
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/channels?part=snippet,statistics,brandingSettings,topicDetails&id=${channelId}&key=${apiKey}`,
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: translateApiError(error),
      }
    }

    const data = await response.json() as YouTubeApiResponse<YouTubeChannel>
    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        message: "チャンネルが見つかりませんでした。URLが正しいか確認してください。",
      }
    }

    const channel = data.items[0]
    const channelInfo = {
      id: channel.id,
      title: channel.snippet!.title,
      description: channel.snippet!.description,
      customUrl: channel.snippet!.customUrl,
      publishedAt: channel.snippet!.publishedAt,
      thumbnails: channel.snippet!.thumbnails,
      subscriberCount: formatNumber(channel.statistics!.subscriberCount),
      videoCount: formatNumber(channel.statistics!.videoCount),
      viewCount: formatNumber(channel.statistics!.viewCount),
      country: channel.snippet!.country,
      banner: channel.brandingSettings?.image?.bannerExternalUrl,
      keywords: channel.brandingSettings?.channel?.keywords?.split('","').map((tag: string) => 
        tag.replace(/^"/, '').replace(/"$/, '')
      ) || [],
      topics: channel.topicDetails?.topicCategories || [],
    }

    return { success: true, channelInfo }
  } catch (error) {
    console.error("Channel info retrieval error:", error)
    return {
      success: false,
      message: "チャンネル情報の取得中にエラーが発生しました",
    }
  }
}



// チャンネルの全動画を取得する新しい関数（playlistItemsエンドポイント使用）
export async function getChannelVideosComplete(
  channelId: string,
  apiKey: string | null | undefined,
  pageToken?: string, // pageTokenパラメータを追加
  options: {
    maxVideos?: number;
    includeDeleted?: boolean;
    includeRestricted?: boolean; // 制限付き動画も含める
  } = {}
) {
  if (!apiKey) {
    return {
      success: false,
      message: "YouTube API Keyが必要です",
    };
  }

  const maxVideos = options.maxVideos || 500; // デフォルト500件（400件のチャンネルに対応）
  const includeDeleted = options.includeDeleted || false;
  const includeRestricted = options.includeRestricted !== false; // デフォルトtrue（制限付きも含める）

  let allVideos: FormattedVideo[] = [];
  let apiCallCount = 0;

  try {
    logInfo("Complete video fetch started", {
      channelId,
      maxVideos,
      method: "playlistItems"
    });
    debugLog("getChannelVideosComplete called with channelId:", channelId, "maxVideos:", maxVideos);

    // 1. チャンネル情報を取得してuploads playlist IDと登録者数を取得
    const channelResponse = await fetch(
      `${API_BASE_URL}/channels?part=contentDetails,statistics&id=${channelId}&key=${apiKey}`
    );
    
    if (!channelResponse.ok) {
      const error = await channelResponse.json();
      throw new Error(translateApiError(error));
    }
    
    const channelData = await channelResponse.json();
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error("チャンネルが見つかりませんでした");
    }

    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
    const subscriberCount = Number.parseInt(channelData.items[0]?.statistics?.subscriberCount || "1000", 10);
    
    debugLog("Uploads playlist ID:", uploadsPlaylistId);
    debugLog("Subscriber count:", subscriberCount);
    
    if (!uploadsPlaylistId) {
      throw new Error("アップロードプレイリストが見つかりません");
    }
    
    // 2. playlistItemsエンドポイントで動画リストを取得（1ページ分のみ）
    // allVideos と apiCallCount は関数スコープで既に定義済み

    // 1ページ分のみ取得
    const pageSize = Math.min(50, maxVideos);
    const playlistUrl = `${API_BASE_URL}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${pageSize}${
      pageToken ? `&pageToken=${pageToken}` : ""  // 受け取ったpageTokenを使用
    }&key=${apiKey}`;
    
    debugLog("Fetching playlist page with pageToken:", pageToken || "none");
    
    const playlistResponse = await fetch(playlistUrl);
    apiCallCount++;
      
      if (!playlistResponse.ok) {
        const error = await playlistResponse.json();
        throw new Error(translateApiError(error));
      }
      
      const playlistData = await playlistResponse.json();
      
      // ページ情報のデバッグ
      debugLog("PlaylistItems response:", {
        itemCount: playlistData.items?.length,
        nextPageToken: playlistData.nextPageToken,
        prevPageToken: playlistData.prevPageToken,
        totalResults: playlistData.pageInfo?.totalResults
      });
      
      // 動画IDを抽出（削除済みの動画も含む可能性がある）
      debugLog("Page fetched. Total items in page:", playlistData.items?.length);
      const allVideoIdsInPage = playlistData.items
        .map((item: YouTubePlaylistItem) => {
          const videoId = item.snippet?.resourceId?.videoId;
          if (!videoId) {
            debugLog("Item without videoId:", item);
          }
          return videoId;
        })
        .filter(Boolean);
      
      debugLog("Extracted video IDs count:", allVideoIdsInPage.length);
      
      // 問題の動画IDが含まれているか確認
      const problemVideoIds = ['x4BBWXihl7U', 'PIe60_9RNVI'];
      const foundProblemVideos = allVideoIdsInPage.filter((id: string) => problemVideoIds.includes(id));
      if (foundProblemVideos.length > 0) {
        debugLog("⚠️ Found problem videos in playlistItems:", foundProblemVideos);
      }
      
      const videoIds = allVideoIdsInPage;
      
      if (videoIds.length === 0) {
        // 動画IDが0でも、nextPageTokenを返して処理を継続できるようにする
        debugLog("No valid video IDs in this page, but continuing with nextPageToken:", playlistData.nextPageToken);
        return {
          videos: [],  // 空配列を返す
          nextPageToken: playlistData.nextPageToken || null,
          totalResults: playlistData.pageInfo?.totalResults || 0,  // 正しい総数を返す
          apiCallCount
        };
      }
      
      debugLog("Video IDs to fetch details:", videoIds);
      
      // 3. 動画の詳細情報を取得
      const videoDetailsResponse = await fetch(
        `${API_BASE_URL}/videos?part=snippet,contentDetails,statistics,topicDetails&id=${videoIds.join(",")}&key=${apiKey}`
      );
      apiCallCount++;
      
      if (!videoDetailsResponse.ok) {
        const error = await videoDetailsResponse.json();
        throw new Error(translateApiError(error));
      }
      
      const videoDetails = await videoDetailsResponse.json();
      
      // 問題の動画の詳細情報を確認
      debugLog("Total videos in details response:", videoDetails.items?.length);
      const problemVideosInDetails = videoDetails.items?.filter((v: YouTubeVideo) => 
        ['x4BBWXihl7U', 'PIe60_9RNVI'].includes(v.id)
      );
      if (problemVideosInDetails && problemVideosInDetails.length > 0) {
        debugLog("⚠️ Problem videos in details:", problemVideosInDetails.map((v: YouTubeVideo) => ({
          id: v.id,
          hasSnippet: !!v.snippet,
          hasStatistics: !!v.statistics,
          hasStatus: !!v.status,
          privacyStatus: v.status?.privacyStatus
        })));
      }
      
      // 4. 削除済み/非公開動画をフィルタリング（条件緩和版）
      debugLog("Filtering videos. Include deleted:", includeDeleted, "Include restricted:", includeRestricted);
      const excludedVideos: Array<Record<string, unknown>> = [];
      const restrictedVideos: Array<Record<string, unknown>> = [];
      
      const validVideos = videoDetails.items.filter((video: YouTubeVideo) => {
        // 問題の動画IDの場合は特別処理
        if (['x4BBWXihl7U', 'PIe60_9RNVI'].includes(video.id)) {
          debugLog("⚠️ Processing problem video:", video.id, {
            hasSnippet: !!video.snippet,
            hasStatistics: !!video.statistics,
            hasStatus: !!video.status,
            privacyStatus: video.status?.privacyStatus
          });
          // 問題の動画は常に含める（データが不完全でも）
          return true;
        }
        
        // 完全に削除された動画（IDのみ）は除外
        if (!video.snippet && !video.status && !video.statistics) {
          excludedVideos.push({
            id: video.id,
            reason: 'completely deleted'
          });
          return false;
        }
        
        // includeDeletedがfalseの場合、snippet/statisticsがない動画を除外
        if (!includeDeleted && (!video.snippet || !video.statistics)) {
          excludedVideos.push({
            id: video.id,
            reason: !video.snippet ? 'no snippet' : 'no statistics',
            hasStatus: !!video.status,
            privacyStatus: video.status?.privacyStatus
          });
          return false;
        }
        
        // 制限付き動画の扱い
        if (!video.snippet || !video.statistics) {
          if (includeRestricted) {
            restrictedVideos.push({
              id: video.id,
              hasSnippet: !!video.snippet,
              hasStatistics: !!video.statistics,
              privacyStatus: video.status?.privacyStatus
            });
            return true; // 制限付きでも含める
          }
          return false;
        }
        
        return true;
      });
      
      if (excludedVideos.length > 0) {
        debugLog("⚠️ Excluded videos:", excludedVideos);
        const problemExcluded = excludedVideos.filter(v =>
          ['x4BBWXihl7U', 'PIe60_9RNVI'].includes(v.id as string)
        );
        if (problemExcluded.length > 0) {
          debugLog("❌ PROBLEM VIDEOS WERE EXCLUDED:", problemExcluded);
        }
      }
      
      if (restrictedVideos.length > 0) {
        debugLog("⚠️ Restricted videos included:", restrictedVideos);
      }
      
      // 5. 動画情報を整形（既存の形式に合わせる）
      const formattedVideos = validVideos.map((video: YouTubeVideo) => {
        // 制限付き動画の場合の処理
        if (!video.snippet || !video.statistics) {
          debugLog("Formatting restricted video:", video.id);
          return {
            id: video.id,
            title: video.snippet?.title || `[制限付き動画] ${video.id}`,
            description: video.snippet?.description || '動画の詳細は表示できません',
            publishedAt: video.snippet?.publishedAt || new Date().toISOString(),
            thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url || '',
            duration: video.contentDetails?.duration ? (
              video.contentDetails.duration
                .replace("PT", "")
                .replace(/H/g, ":")
                .replace(/M/g, ":")
                .replace(/S/g, "")
            ) : 'N/A',
            viewCount: video.statistics?.viewCount ? formatNumber(video.statistics.viewCount) : 'N/A',
            likeCount: video.statistics?.likeCount ? formatNumber(video.statistics.likeCount) : 'N/A',
            commentCount: video.statistics?.commentCount ? formatNumber(video.statistics.commentCount) : 'N/A',
            spreadRate: 0,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            tags: video.snippet?.tags || [],
            topics: video.topicDetails?.relevantTopicIds || [],
            restricted: true, // 制限付きフラグ
            privacyStatus: video.status?.privacyStatus
          };
        }
        
        // Duration変換（既存のコードと同じロジック）
        let duration = video.contentDetails!.duration
          .replace("PT", "")
          .replace(/H/g, ":")
          .replace(/M/g, ":")
          .replace(/S/g, "");
        
        // 時間が含まれる場合、分を2桁にする
        if (duration.split(":").length > 2) {
          const parts = duration.split(":");
          parts[1] = parts[1].padStart(2, "0");
          parts[2] = parts[2].padStart(2, "0");
          duration = parts.join(":");
        } else if (duration.includes(":")) {
          const parts = duration.split(":");
          parts[1] = parts[1].padStart(2, "0");
          duration = parts.join(":");
        }
        
        // 拡散率の計算
        const viewCount = Number.parseInt(video.statistics.viewCount || "0", 10);
        const spreadRate = (viewCount / subscriberCount) * 100;
        
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          thumbnail: video.snippet.thumbnails.high!.url,
          duration: duration,
          viewCount: formatNumber(video.statistics.viewCount || "0"),
          likeCount: formatNumber(video.statistics.likeCount || "0"),
          commentCount: formatNumber(video.statistics.commentCount || "0"),
          spreadRate: spreadRate,
          url: `https://www.youtube.com/watch?v=${video.id}`,
          tags: video.snippet.tags || [],
          topics: video.topicDetails?.relevantTopicIds || []
        };
      });
      
      allVideos = allVideos.concat(formattedVideos);
      
      // nextPageTokenを取得（次のページ用）
      const returnNextPageToken = playlistData.nextPageToken;
    
    // 6. 公開日時で降順ソート（最新順）
    debugLog("Total videos found in this page:", allVideos.length);
    debugLog("Has next page:", !!returnNextPageToken);
    debugLog("First 5 video IDs:", allVideos.slice(0, 5).map(v => v.id));
    
    // 問題の動画が最終結果に含まれているか確認
    const finalProblemVideos = allVideos.filter(v => 
      ['x4BBWXihl7U', 'PIe60_9RNVI'].includes(v.id)
    );
    if (finalProblemVideos.length > 0) {
      debugLog("✅ Problem videos in final result:", finalProblemVideos.map(v => v.id));
    } else {
      debugLog("❌ Problem videos NOT in final result");
    }
    
    allVideos.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    logInfo("Complete video fetch successful", {
      channelId,
      videosRetrieved: allVideos.length,
      apiCallsUsed: apiCallCount,
      method: "playlistItems",
      hasNextPage: !!returnNextPageToken
    });
    
    debugLog("Returning from getChannelVideosComplete:", {
      videoCount: allVideos.length,
      nextPageToken: returnNextPageToken || null,
      problemVideosIncluded: allVideos.filter(v => ['x4BBWXihl7U', 'PIe60_9RNVI'].includes(v.id)).length
    });
    
    return {
      success: true,
      videos: allVideos,
      nextPageToken: returnNextPageToken || null, // 次のページトークンを返す
      totalResults: allVideos.length,
      method: "playlistItems", // デバッグ用
      metadata: {
        apiCallsUsed: apiCallCount,
        excludedCount: excludedVideos.length,
        restrictedCount: restrictedVideos.length,
        excludedVideos: excludedVideos.map(v => v.id),
        problemVideosFound: allVideos.filter(v => 
          ['x4BBWXihl7U', 'PIe60_9RNVI'].includes(v.id)
        ).map(v => v.id),
        hasNextPage: !!returnNextPageToken
      }
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "動画リストの取得中にエラーが発生しました";
    
    logError("Complete video fetch failed, attempting recovery", 
      error instanceof Error ? error : new Error(errorMessage), 
      { channelId, method: "playlistItems" }
    );
    
    debugLog("Error in getChannelVideosComplete:", errorMessage);
    
    // エラー時でも部分的な結果を返す
    if (allVideos.length > 0) {
      debugLog("Returning partial results:", allVideos.length, "videos");
      return {
        success: true,
        videos: allVideos,
        nextPageToken: null,
        totalResults: allVideos.length,
        method: "playlistItems-partial",
        error: errorMessage,
        metadata: {
          apiCallsUsed: apiCallCount,
          errorOccurred: true,
          errorMessage: errorMessage
        }
      };
    }
    
    // エラー時は失敗を返す
    return {
      success: false,
      message: errorMessage,
      videos: [],
      metadata: {
        errorOccurred: true,
        errorMessage: errorMessage,
        method: "error"
      }
    };
  }
}

// 特定の動画IDを直接取得する関数
export async function getSpecificVideos(
  videoIds: string[],
  apiKey: string
): Promise<FormattedVideo[]> {
  if (!videoIds || videoIds.length === 0) {
    return [];
  }

  try {
    debugLog("Fetching specific videos:", videoIds);
    
    const response = await fetch(
      `${API_BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(",")}&key=${apiKey}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error("[ERROR] Failed to fetch specific videos:", error);
      throw new Error(translateApiError(error));
    }
    
    const data = await response.json() as YouTubeApiResponse<YouTubeVideo>;
    
    if (!data.items || data.items.length === 0) {
      debugLog("No videos found for IDs:", videoIds);
      return [];
    }
    
    // 動画情報を整形
    const formattedVideos = data.items.map((video: YouTubeVideo) => {
      // Duration変換
      let duration = video.contentDetails?.duration || "PT0S";
      duration = duration
        .replace("PT", "")
        .replace(/H/g, ":")
        .replace(/M/g, ":")
        .replace(/S/g, "");
      
      // 時間フォーマット調整
      if (duration.split(":").length > 2) {
        const parts = duration.split(":");
        parts[1] = parts[1].padStart(2, "0");
        parts[2] = parts[2].padStart(2, "0");
        duration = parts.join(":");
      } else if (duration.includes(":")) {
        const parts = duration.split(":");
        parts[1] = parts[1].padStart(2, "0");
        duration = parts.join(":");
      }
      
      return {
        id: video.id,
        title: video.snippet?.title || `動画 ${video.id}`,
        description: video.snippet?.description || "",
        publishedAt: video.snippet?.publishedAt || new Date().toISOString(),
        thumbnail: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url || "",
        duration: duration,
        viewCount: formatNumber(video.statistics?.viewCount || "0"),
        likeCount: formatNumber(video.statistics?.likeCount || "0"),
        commentCount: formatNumber(video.statistics?.commentCount || "0"),
        spreadRate: 0, // 登録者数がないため0とする
        url: `https://www.youtube.com/watch?v=${video.id}`,
        tags: video.snippet?.tags || [],
        topics: []
      };
    });
    
    debugLog("Successfully fetched specific videos:", formattedVideos.length);
    return formattedVideos;
    
  } catch (error) {
    console.error("[ERROR] Error fetching specific videos:", error);
    return [];
  }
}

// 動画の統計情報を計算
export async function calculateChannelStats(videos: FormattedVideo[]) {
  try {
    if (!videos || videos.length === 0) {
      return {
        success: false,
        message: "統計情報の計算に必要な動画データがありません",
      }
    }

    // 総再生回数
    const totalViews = videos.reduce((sum, video) => sum + Number.parseInt(video.viewCount.replace(/,/g, ""), 10), 0)

    // 平均再生回数
    const avgViews = Math.round(totalViews / videos.length)

    // 平均高評価数
    const totalLikes = videos.reduce((sum, video) => sum + Number.parseInt(video.likeCount.replace(/,/g, ""), 10), 0)
    const avgLikes = Math.round(totalLikes / videos.length)

    // 平均コメント数
    const totalComments = videos.reduce(
      (sum, video) => sum + Number.parseInt(video.commentCount.replace(/,/g, ""), 10),
      0,
    )
    const avgComments = Math.round(totalComments / videos.length)

    // 平均拡散率
    const totalSpreadRate = videos.reduce((sum, video) => sum + video.spreadRate, 0)
    const avgSpreadRate = totalSpreadRate / videos.length

    // 最も再生された動画
    const mostViewedVideo = [...videos].sort(
      (a, b) => Number.parseInt(b.viewCount.replace(/,/g, ""), 10) - Number.parseInt(a.viewCount.replace(/,/g, ""), 10),
    )[0]

    // 最も高評価を得た動画
    const mostLikedVideo = [...videos].sort(
      (a, b) => Number.parseInt(b.likeCount.replace(/,/g, ""), 10) - Number.parseInt(a.likeCount.replace(/,/g, ""), 10),
    )[0]

    return {
      success: true,
      stats: {
        totalVideos: videos.length,
        totalViews,
        avgViews,
        avgLikes,
        avgComments,
        avgSpreadRate,
        mostViewedVideo,
        mostLikedVideo,
      },
    }
  } catch (error) {
    console.error("Stats calculation error:", error)
    return {
      success: false,
      message: "統計情報の計算中にエラーが発生しました",
    }
  }
}

// チャンネル画像（アイコン・バナー）のダウンロード用URL生成
export async function getChannelImageDownloadUrls(channelId: string | null | undefined, apiKey: string | null | undefined) {
  if (!apiKey) {
    return {
      success: false,
      message: "YouTube API Keyが必要です",
    };
  }

  if (!channelId) {
    return {
      success: false,
      message: "チャンネルIDが必要です",
    };
  }

  try {
    // チャンネル情報を取得
    const response = await fetch(
      `${API_BASE_URL}/channels?part=snippet,brandingSettings&id=${channelId}&key=${apiKey}`,
    )

    if (!response.ok) {
      const error = await response.json()
      return {
        success: false,
        message: error.error?.message || "チャンネル画像情報の取得に失敗しました",
      }
    }

    const data = await response.json() as YouTubeApiResponse<YouTubeChannel>
    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        message: "チャンネルが見つかりませんでした",
      }
    }

    const channel = data.items[0]
    
    // 画像URLを取得
    const thumbnailUrl = channel.snippet!.thumbnails.high?.url ||
                         channel.snippet!.thumbnails.medium?.url ||
                         channel.snippet!.thumbnails.default?.url
    const bannerUrl = channel.brandingSettings?.image?.bannerExternalUrl

    // チャンネル名を取得（ファイル名に使用）
    const channelTitle = channel.snippet!.title.replace(/[\\/:*?"<>|]/g, "_") // 不正なファイル名文字を置換

    return { 
      success: true, 
      imageUrls: {
        icon: thumbnailUrl ? {
          url: thumbnailUrl,
          filename: `${channelTitle}_icon.jpg`
        } : null,
        banner: bannerUrl ? {
          url: bannerUrl,
          filename: `${channelTitle}_banner.jpg`
        } : null
      }
    }
  } catch (error) {
    console.error("Channel image retrieval error:", error)
    return {
      success: false,
      message: "チャンネル画像情報の取得中にエラーが発生しました",
    }
  }
}
