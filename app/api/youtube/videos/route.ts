import { type NextRequest, NextResponse } from "next/server"
import { getChannelId, getChannelVideosComplete, calculateChannelStats } from "@/lib/youtube-api"

// Vercelのタイムアウト対策（Freeプランは10秒まで）
export const maxDuration = 10;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const channelUrl = url.searchParams.get("channelUrl")
    const apiKey = url.searchParams.get("apiKey")
    const pageToken = url.searchParams.get("pageToken") || ""
    const maxResults = url.searchParams.get("maxResults") || "50"

    if (!apiKey) {
      return NextResponse.json({ success: false, message: "YouTube API Keyが必要です" }, { status: 400 })
    }

    if (!channelUrl) {
      return NextResponse.json({ success: false, message: "チャンネルURLが必要です" }, { status: 400 })
    }

    // チャンネルIDを取得
    const channelIdResult = await getChannelId(channelUrl, apiKey)

    if (!channelIdResult.success) {
      return NextResponse.json({ success: false, message: channelIdResult.message }, { status: 400 })
    }

    // 動画リストを取得（completeモードのみ使用）
    const videosResult = await getChannelVideosComplete(
      channelIdResult.channelId as string,
      apiKey,
      pageToken,
      {
        maxVideos: Number.parseInt(maxResults, 10) || 20,
        includeDeleted: false
      }
    );
    
    if (!videosResult.success) {
      return NextResponse.json({ success: false, message: videosResult.message }, { status: 400 })
    }

    // 統計情報を計算
    const statsResult = await calculateChannelStats(videosResult.videos!)

    return NextResponse.json({
      success: true,
      videos: videosResult.videos,
      nextPageToken: videosResult.nextPageToken,
      totalResults: videosResult.totalResults,
      stats: statsResult.success ? statsResult.stats : null,
    })
  } catch {
    return NextResponse.json(
      { 
        success: false, 
        message: "動画情報の取得中にエラーが発生しました"
      }, 
      { status: 500 }
    )
  }
}
