import { type NextRequest, NextResponse } from "next/server"
import { exportToExcel, exportToExcelWithTemplate } from "@/lib/export"

export async function POST(request: NextRequest) {
  try {
    const { channelInfo, videos, exportOptions } = await request.json()

    if (!channelInfo || !videos) {
      return NextResponse.json({ success: false, message: "チャンネル情報と動画データが必要です" }, { status: 400 })
    }

    // エクスポートオプションがある場合は拡張関数を使用
    const result = exportOptions 
      ? await exportToExcelWithTemplate(channelInfo, videos, exportOptions)
      : await exportToExcel(channelInfo, videos)

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      filename: result.filename,
    })
  } catch (error) {
    console.error("Excel export API error:", error)
    return NextResponse.json({ success: false, message: "Excelエクスポート中にエラーが発生しました" }, { status: 500 })
  }
}

