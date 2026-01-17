import { type NextRequest, NextResponse } from "next/server"
import { validateApiKey } from "@/lib/youtube-api"

// GETメソッドは不要になるため削除

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ success: false, message: "API Keyが必要です" }, { status: 400 })
    }

    const result = await validateApiKey(apiKey)

    if (!result.valid) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 })
    }

    // 検証成功したAPIキーを返す - クライアント側で保存するため
    return NextResponse.json({ success: true, apiKey: result.apiKey })
  } catch (error) {
    console.error("API Key validation error:", error)
    return NextResponse.json({ success: false, message: "API Keyの検証中にエラーが発生しました" }, { status: 500 })
  }
}

