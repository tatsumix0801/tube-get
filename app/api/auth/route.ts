import { type NextRequest, NextResponse } from "next/server"

// 実際の環境では、環境変数から取得するか、データベースに保存されたハッシュ値と比較するべきです
const ADMIN_PASSWORD = "admin123"

// セッションの有効期限（24時間）
const SESSION_EXPIRY = 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    // リクエストボディを直接解析
    let password = ""

    try {
      const body = await request.json()
      password = body.password || ""
    } catch (e) {
      console.error("JSON parse error:", e)
      return NextResponse.json(
        {
          success: false,
          message: "リクエストボディの解析に失敗しました",
        },
        { status: 400 },
      )
    }

    if (!password) {
      return NextResponse.json({ success: false, message: "パスワードが必要です" }, { status: 400 })
    }

    // パスワードの検証
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: "パスワードが正しくありません" }, { status: 401 })
    }

    // セッションIDを生成（実際の環境ではより安全な方法を使用すべきです）
    const sessionId = Math.random().toString(36).substring(2, 15)
    const expires = new Date(Date.now() + SESSION_EXPIRY)

    // レスポンスオブジェクトを作成
    const response = NextResponse.json({ success: true, message: "ログイン成功" })

    // レスポンスにCookieを設定
    // 本番環境（HTTPS）ではsecure=true、開発環境ではfalse
    const isProduction = process.env.NODE_ENV === "production"
    response.cookies.set({
      name: "session_id",
      value: sessionId,
      expires,
      path: "/",
      httpOnly: true,
      sameSite: "lax", // strictからlaxに変更して互換性を向上
      secure: isProduction, // 本番環境ではHTTPS必須
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "ログイン処理中にエラーが発生しました",
      },
      { status: 500 },
    )
  }
}

