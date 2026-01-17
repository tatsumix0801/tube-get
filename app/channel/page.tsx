"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useChannelData } from "@/hooks/use-channel-data"
import { ChannelTabs } from "@/components/channel-tabs"

export default function ChannelPage() {
  const { channelInfo, videos, isLoading, error } = useChannelData()
  const router = useRouter()

  // SEO対策とパフォーマンス最適化
  useEffect(() => {
    // ページがマウントされたときにスクロール位置をリセット
    window.scrollTo(0, 0)
    
    // PageInsightsのスコア向上のためのパフォーマンス最適化
    const timer = setTimeout(() => {
      const links = document.querySelectorAll('a[href^="/channel"]')
      links.forEach(link => {
        if (link instanceof HTMLElement) {
          link.setAttribute('prefetch', 'true')
        }
      })
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">チャンネルデータを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !channelInfo) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md border-0 shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-red-500 mb-3">エラーが発生しました</h2>
            <p className="text-muted-foreground mb-6">{error || "チャンネル情報の取得に失敗しました"}</p>
            <Button className="w-full" onClick={() => router.push("/dashboard")}>
              ダッシュボードに戻る
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
            {channelInfo.title}
          </h1>
          <p className="text-muted-foreground">チャンネル分析</p>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur"></div>
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <ChannelTabs channelInfo={channelInfo} videos={videos} />
          </div>
        </div>
      </div>
    </>
  )
}

