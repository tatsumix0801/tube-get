import { type NextRequest, NextResponse } from "next/server"
import { getChannelId, getChannelImageDownloadUrls } from "@/lib/youtube-api"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const channelUrl = url.searchParams.get("channelUrl")
    const channelId = url.searchParams.get("channelId")
    const apiKey = url.searchParams.get("apiKey")
    const type = url.searchParams.get("type") || "all" // icon, banner, all

    if (!apiKey) {
      return NextResponse.json({ success: false, message: "YouTube API Keyが必要です" }, { status: 400 })
    }

    if (!channelUrl && !channelId) {
      return NextResponse.json({ success: false, message: "チャンネルURLまたはIDが必要です" }, { status: 400 })
    }

    // チャンネルIDの取得
    let resolvedChannelId = channelId
    
    if (!resolvedChannelId && channelUrl) {
      const channelIdResult = await getChannelId(channelUrl, apiKey)
      if (!channelIdResult.success) {
        return NextResponse.json({ success: false, message: channelIdResult.message }, { status: 400 })
      }
      resolvedChannelId = channelIdResult.channelId
    }

    // チャンネル画像情報を取得（ここでnullではなくstring型であることを確認）
    if (!resolvedChannelId) {
      return NextResponse.json({ success: false, message: "有効なチャンネルIDを取得できませんでした" }, { status: 400 })
    }
    
    // apiKeyとresolvedChannelIdが文字列であることを確認
    const imageUrlsResult = await getChannelImageDownloadUrls(
      resolvedChannelId, 
      apiKey
    )

    if (!imageUrlsResult.success || !imageUrlsResult.imageUrls) {
      return NextResponse.json({ 
        success: false, 
        message: imageUrlsResult.message || "チャンネル画像情報が取得できませんでした" 
      }, { status: 400 })
    }

    // リクエストされたタイプに基づいて応答を構築
    let responseImages = imageUrlsResult.imageUrls
    
    if (type === "icon" && imageUrlsResult.imageUrls.icon) {
      responseImages = { icon: imageUrlsResult.imageUrls.icon, banner: null }
    } else if (type === "banner" && imageUrlsResult.imageUrls.banner) {
      responseImages = { icon: null, banner: imageUrlsResult.imageUrls.banner }
    }

    return NextResponse.json({
      success: true,
      images: responseImages
    })
  } catch (error) {
    console.error("Channel images API error:", error)
    return NextResponse.json(
      { success: false, message: "チャンネル画像情報の取得中にエラーが発生しました" },
      { status: 500 },
    )
  }
} 