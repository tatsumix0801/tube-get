import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // リダイレクトURLを準備
    const redirectUrl = new URL("/", request.url)
    
    // リダイレクトレスポンスを作成
    const response = NextResponse.redirect(redirectUrl, { status: 303 })

    // Cookieを削除
    response.cookies.set({
      name: "session_id",
      value: "",
      expires: new Date(0),
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    // エラーが発生しても、ログインページにリダイレクトする
    return NextResponse.redirect(new URL("/", request.url), { status: 303 })
  }
}

