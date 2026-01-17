"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ChannelAnalysisRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // チャンネル分析ページが訪問されたら、統合ページにリダイレクト
    const redirectToIntegratedPage = () => {
      // sessionStorageからチャンネル情報を確認
      const hasChannelInfo = sessionStorage.getItem("currentChannelInfo")
      
      if (hasChannelInfo) {
        // チャンネル情報がある場合は統合ページに転送
        router.push("/channel")
      } else {
        // チャンネル情報がない場合はダッシュボードに転送
        router.push("/dashboard")
      }
    }

    // わずかな遅延を入れてリダイレクト（画面がちらつくのを防ぐため）
    const timeout = setTimeout(redirectToIntegratedPage, 100)
    return () => clearTimeout(timeout)
  }, [router])

  // リダイレクト中の表示
  return (
    <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        <p className="text-muted-foreground">リダイレクト中...</p>
      </div>
    </div>
  )
} 