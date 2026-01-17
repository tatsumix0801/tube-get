"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Search, Youtube, TrendingUp, BarChart3, FileSpreadsheet } from "lucide-react"
import Image from "next/image"
import { ApiErrorHandler } from "@/components/ApiErrorHandler"

export default function DashboardPage() {
  const [channelUrl, setChannelUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const [iconUrl, setIconUrl] = useState("/assets/branding/icon-top.png")

  // API Keyチェック
  useEffect(() => {
    // ローカルストレージからAPI Keyを取得
    const apiKey = localStorage.getItem("youtube_api_key")
    if (!apiKey) {
      toast({
        title: "API Keyが設定されていません",
        description: "設定画面からYouTube Data API Keyを設定してください",
        variant: "destructive",
      })
    }
    setIconUrl(`/assets/branding/icon-top.png?v=${new Date().getTime()}`)
  }, [toast])

  const handleChannelSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // API Keyのチェック
    const apiKey = localStorage.getItem("youtube_api_key")
    if (!apiKey) {
      toast({
        title: "API Keyが設定されていません",
        description: "設定画面からYouTube Data API Keyを設定してください",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // チャンネルURLのバリデーション
    if (!channelUrl.includes("youtube.com/") && !channelUrl.includes("@")) {
      setError("有効なYouTubeチャンネルURLを入力してください")
      setIsLoading(false)
      return
    }

    try {
      // チャンネル情報を取得（APIキーをクエリパラメータとして渡す）
      const response = await fetch(`/api/youtube/channel?url=${encodeURIComponent(channelUrl)}&apiKey=${encodeURIComponent(apiKey)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.message || "チャンネル情報の取得に失敗しました")
        toast({
          title: "エラー",
          description: data.message || "チャンネル情報の取得に失敗しました",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // チャンネル情報をセッションストレージに保存
      sessionStorage.setItem("currentChannelInfo", JSON.stringify(data.channelInfo))
      sessionStorage.setItem("currentChannelUrl", channelUrl)
      sessionStorage.setItem("youtube_api_key", apiKey) // APIキーもセッションに保存

      toast({
        title: "チャンネル情報取得成功",
        description: `${data.channelInfo.title}の情報を取得しました`,
      })

      router.push("/channel")
    } catch (error) {
      console.error("Channel search error:", error)
      setError("チャンネル情報の取得中にエラーが発生しました")
      toast({
        title: "エラー",
        description: "チャンネル情報の取得中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="flex flex-col items-center justify-center space-y-6 max-w-3xl mx-auto text-center">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-pattern-analytics bg-gradient-to-r from-brand-pink/20 to-brand-blue/20 blur-xl"></div>
          <div className="relative p-4 rounded-2xl shadow-lg bg-card">
            <Image 
              src={iconUrl}
              alt="つべナビ アイコン" 
              width={80} 
              height={80}
              className="animate-float hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-pink to-brand-blue text-transparent bg-clip-text font-montserrat leading-tight">
            つべナビ
          </h1>
          <p className="text-muted-foreground font-medium font-inter">
            YouTube チャンネル分析ツール
          </p>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl font-inter">
          指定したYouTubeチャンネルの情報を数十秒で一括取得！<br/>データに基づいたチャンネル運営を強力にサポートします！
        </p>
      </div>

      <Card className="max-w-2xl mx-auto border shadow-xl bg-gradient-to-br from-card to-muted/30 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink to-brand-blue"></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold font-montserrat flex items-center gap-2">
            <Youtube className="h-5 w-5 text-brand-pink" />
            チャンネル分析
          </CardTitle>
          <CardDescription className="font-inter">
            調べたいYouTubeチャンネルのURLを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChannelSearch} className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="https://www.youtube.com/channelname"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    className="flex-1 h-12 pl-10 pr-4 rounded-lg border-input focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all font-inter"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </div>
                  
                  {channelUrl && !channelUrl.includes("youtube.com/") && !channelUrl.includes("@") && (
                    <div className="text-xs text-muted-foreground mt-1 ml-1">
                      ヒント: 「@channelname」または完全なYouTube URLを入力してください
                    </div>
                  )}
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-6 rounded-lg font-medium bg-gradient-to-r from-brand-pink to-brand-blue hover:from-brand-pink/90 hover:to-brand-blue/90 active:from-brand-pink/80 active:to-brand-blue/80 transition-all duration-300 shadow-md hover:shadow-lg font-montserrat"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                      分析中...
                    </div>
                  ) : (
                    <>
                      分析する
                      <TrendingUp className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              
              <ApiErrorHandler 
                errorMessage={error} 
                onRetry={isLoading ? undefined : () => {
                  if (channelUrl) {
                    const formElement = document.querySelector('form');
                    if (formElement) formElement.dispatchEvent(new Event('submit', { bubbles: true }));
                  }
                }} 
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink to-brand-pink/70 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-brand-pink/10 text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-all duration-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold font-montserrat">チャンネル統計</CardTitle>
                <CardDescription className="text-xs font-inter">チャンネルの基本情報を確認</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground font-inter">
              登録者数、総再生回数、投稿本数など、チャンネルの基本的な情報をまとめて確認できます。競合チャンネルの状況がひと目で把握可能に。
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue to-brand-blue/70 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-brand-blue/10 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold font-montserrat">動画データ</CardTitle>
                <CardDescription className="text-xs font-inter">個別の動画情報を分析</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground font-inter">
              動画ごとの再生回数、高評価数、コメント数などの情報を一覧で見ることができます。
              人気のある動画の特徴がわかります。
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-300 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold font-montserrat">データ保存</CardTitle>
                <CardDescription className="text-xs font-inter">分析結果をファイルに保存</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground font-inter">
              分析したデータをExcel形式で保存できます。
              保存したデータを使って、さらに詳しい分析ができます。
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto mt-16">
        <div className="relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur"></div>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold">つべナビの特徴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-300 h-fit">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1">競合分析</h3>
                    <p className="text-sm text-muted-foreground">
                      対象チャンネルの投稿ペースや成績を一括で取得し、ジャンル調査や企画案のリサーチを強力にサポート。
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-300 h-fit">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1">パフォーマンス指標</h3>
                    <p className="text-sm text-muted-foreground">
                      動画ごとの拡散率や高評価率を計算し、最も効果的なコンテンツを特定します。
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

