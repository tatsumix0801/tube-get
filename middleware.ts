import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Cookieからセッションを取得
  const sessionId = request.cookies.get("session_id")?.value
  const { pathname } = request.nextUrl

  // 保護されたルートのリスト
  const protectedRoutes = ["/dashboard", "/channel", "/settings"]

  // ログインページへのアクセスで既にログイン済みの場合はダッシュボードへリダイレクト
  if (pathname === "/" && sessionId) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 保護されたルートへのアクセスでログインしていない場合はログインページへリダイレクト
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  if (isProtectedRoute && !sessionId) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // APIルートを完全に除外する
  matcher: ["/((?!api|_next|favicon.ico).*)"],
}

