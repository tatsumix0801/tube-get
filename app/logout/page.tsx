"use client"

import { useEffect } from "react"

export default function LogoutPage() {
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window !== 'undefined') {
      // ストレージをクリア
      sessionStorage.clear()
      localStorage.removeItem("youtube_api_key")
      localStorage.removeItem("channelData")
      localStorage.removeItem("videoData")
      localStorage.removeItem("analyticsData")
      
      // ログアウトAPIを呼び出し
      fetch("/api/logout", {
        method: "POST",
        credentials: "include"
      })
      .finally(() => {
        // 処理完了後、ログインページへリダイレクト
        window.location.href = "/"
      })
    }
  }, [])

  // ローディング表示
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">ログアウト中...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
} 