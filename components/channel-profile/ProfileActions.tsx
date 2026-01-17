"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadIcon, ImageIcon, Layers, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProfileActionsProps {
  channelId: string
  apiKey: string
}

export function ProfileActions({ channelId, apiKey }: ProfileActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState({
    icon: false,
    banner: false,
    all: false
  })
  const { toast } = useToast()

  const handleDownload = async (type: "icon" | "banner" | "all") => {
    if (!channelId || !apiKey) {
      toast({
        title: "エラー",
        description: "チャンネル情報が不足しています",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setDownloadStatus(prev => ({ ...prev, [type]: true }))

    try {
      // チャンネル画像情報を取得
      const response = await fetch(
        `/api/youtube/channel/images?channelId=${encodeURIComponent(channelId)}&apiKey=${encodeURIComponent(apiKey)}&type=${type}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const data = await response.json()

      if (!data.success) {
        toast({
          title: "エラー",
          description: data.message || "画像の取得に失敗しました",
          variant: "destructive",
        })
        setDownloadStatus(prev => ({ ...prev, [type]: false }))
        setIsLoading(false)
        return
      }

      // ダウンロードする画像URLがあるか確認
      if (
        (type === "icon" && !data.images.icon) ||
        (type === "banner" && !data.images.banner) ||
        (type === "all" && !data.images.icon && !data.images.banner)
      ) {
        toast({
          title: "エラー",
          description: "ダウンロードできる画像がありません",
          variant: "destructive",
        })
        setDownloadStatus(prev => ({ ...prev, [type]: false }))
        setIsLoading(false)
        return
      }

      // アイコンをダウンロード
      if ((type === "icon" || type === "all") && data.images.icon) {
        await downloadImage(data.images.icon.url, data.images.icon.filename)
      }

      // バナーをダウンロード
      if ((type === "banner" || type === "all") && data.images.banner) {
        await downloadImage(data.images.banner.url, data.images.banner.filename)
      }

      // 成功メッセージの表示
      const successMessage = type === "icon" 
        ? "アイコン画像をダウンロードしました" 
        : type === "banner" 
          ? "バナー画像をダウンロードしました" 
          : "チャンネル画像をダウンロードしました";

      toast({
        title: "ダウンロード完了",
        description: successMessage,
      })
      
      // 5秒後にダウンロードステータスをリセット
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [type]: false }))
      }, 5000)
    } catch (error) {
      console.error("Image download error:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "画像ダウンロード中にエラーが発生しました",
        variant: "destructive",
      })
      setDownloadStatus(prev => ({ ...prev, [type]: false }))
    } finally {
      setIsLoading(false)
    }
  }

  // 画像をダウンロードする関数
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`画像の取得に失敗しました (${response.status})`)
      }
      
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
      
      return true
    } catch (error) {
      console.error("Image download error:", error)
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "画像ダウンロード中にエラーが発生しました",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <DownloadIcon className="h-4 w-4 text-purple-500" />
          チャンネル素材ダウンロード
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground mb-3">チャンネルのプロフィール画像やバナーをダウンロードできます。</p>
        
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload("icon")}
                  disabled={isLoading}
                  className={`border-purple-200 dark:border-purple-900/50 transition-all ${
                    downloadStatus.icon 
                      ? "bg-purple-50 dark:bg-purple-900/20" 
                      : "hover:border-purple-300 hover:bg-purple-50 dark:hover:border-purple-800 dark:hover:bg-purple-900/20"
                  }`}
                  data-download-type="icon"
                >
                  {downloadStatus.icon ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <ImageIcon className="mr-2 h-4 w-4 text-purple-500" />
                  )}
                  アイコン
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>チャンネルのプロフィール画像をダウンロード</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload("banner")}
                  disabled={isLoading}
                  className={`border-indigo-200 dark:border-indigo-900/50 transition-all ${
                    downloadStatus.banner 
                      ? "bg-indigo-50 dark:bg-indigo-900/20" 
                      : "hover:border-indigo-300 hover:bg-indigo-50 dark:hover:border-indigo-800 dark:hover:bg-indigo-900/20"
                  }`}
                  data-download-type="banner"
                >
                  {downloadStatus.banner ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <ImageIcon className="mr-2 h-4 w-4 text-indigo-500" />
                  )}
                  バナー
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>チャンネルのバナー画像をダウンロード</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload("all")}
                  disabled={isLoading}
                  className={`border-blue-200 dark:border-blue-900/50 transition-all ${
                    downloadStatus.all 
                      ? "bg-blue-50 dark:bg-blue-900/20" 
                      : "hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-800 dark:hover:bg-blue-900/20"
                  }`}
                  data-download-type="all"
                >
                  {downloadStatus.all ? (
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Layers className="mr-2 h-4 w-4 text-blue-500" />
                  )}
                  すべての画像
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>チャンネルの全画像をダウンロード</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
} 