import { type NextRequest, NextResponse } from "next/server"
import { preparePdfExportData } from "@/lib/export"

export async function POST(request: NextRequest) {
  try {
    const { channelInfo, videos } = await request.json()

    if (!channelInfo || !videos) {
      return NextResponse.json({ success: false, message: "チャンネル情報と動画データが必要です" }, { status: 400 })
    }

    const result = await preparePdfExportData(channelInfo, videos)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    // PDFデータを生成するためのデータを返す
    return NextResponse.json({
      success: true,
      channelInfo: result.channelInfo,
      videos: result.videos,
      filename: result.filename,
    })
  } catch (error) {
    console.error("PDF export API error:", error)
    return NextResponse.json({ success: false, message: "PDFエクスポート中にエラーが発生しました" }, { status: 500 })
  }
}

