import { type NextRequest, NextResponse } from "next/server"
import { getChannelId, getChannelInfo } from "@/lib/youtube-api"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const channelUrl = url.searchParams.get("url")
    const apiKey = url.searchParams.get("apiKey")

    if (!apiKey) {
      return NextResponse.json({ success: false, message: "YouTube API Keyが必要です" }, { status: 400 })
    }

    if (!channelUrl) {
      return NextResponse.json({ success: false, message: "チャンネルURLが必要です" }, { status: 400 })
    }

    // この時点でapiKeyとchannelUrlはstring型であることが確定
    
    // チャンネルIDを取得
    const channelIdResult = await getChannelId(channelUrl, apiKey)

    if (!channelIdResult.success) {
      return NextResponse.json({ success: false, message: channelIdResult.message }, { status: 400 })
    }

    // チャンネル情報を取得
    const channelInfoResult = await getChannelInfo(channelIdResult.channelId as string, apiKey)

    if (!channelInfoResult.success) {
      return NextResponse.json({ success: false, message: channelInfoResult.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      channelInfo: channelInfoResult.channelInfo,
    })
  } catch (error) {
    console.error("Channel info API error:", error)
    return NextResponse.json(
      { success: false, message: "チャンネル情報の取得中にエラーが発生しました" },
      { status: 500 },
    )
  }
}

