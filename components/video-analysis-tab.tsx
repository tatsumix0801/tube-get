"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileSpreadsheet, BarChart, Eye, ThumbsUp, MessageSquare, TrendingUp, Image, Award } from "lucide-react"
import { VideoTable } from "@/components/video-table"
import { Video } from "@/hooks/use-channel-data"
import { formatNumber } from "@/lib/format-utils"
import { toast } from "sonner"
import { loadSettings } from "@/lib/user-settings"
import JSZip from "jszip"
import { KpiCard } from "@/components/ui/kpi-card"
import { useGoodChannel } from "@/hooks/use-good-channel"

interface VideoAnalysisTabProps {
  videos: Video[]
  videoTypeLabel?: string
}

export function VideoAnalysisTab({ videos, videoTypeLabel = "通常動画" }: VideoAnalysisTabProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingThumbnails, setIsExportingThumbnails] = useState(false)

  // 良いチャンネル判定フックを使用
  const isGood = useGoodChannel(videos)

  // 期間フィルタリング
  const getFilteredVideos = () => {
    if (!videos.length) return []

    const now = new Date()
    const filterDate = new Date()

    switch (activeTab) {
      case "week":
        filterDate.setDate(now.getDate() - 7)
        break
      case "month":
        filterDate.setMonth(now.getMonth() - 1)
        break
      case "quarter":
        filterDate.setMonth(now.getMonth() - 3)
        break
      case "halfyear":
        filterDate.setMonth(now.getMonth() - 6)
        break
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        return videos
    }

    return videos.filter((video) => new Date(video.publishedAt) >= filterDate)
  }

  // Excel形式でエクスポート
  const handleExportExcel = async () => {
    if (!videos.length) return

    setIsExporting(true)

    try {
      // セッションストレージからチャンネル情報を取得
      const storedChannelInfo = sessionStorage.getItem("currentChannelInfo")
      if (!storedChannelInfo) {
        toast.error("チャンネル情報が見つかりません")
        setIsExporting(false)
        return
      }
      
      const channelInfo = JSON.parse(storedChannelInfo)
      
      // ユーザー設定を読み込む
      const userSettings = loadSettings()
      
      const response = await fetch("/api/export/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelInfo,
          videos: getFilteredVideos(),
          exportOptions: userSettings.exportOptions
        }),
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.message || "Excelエクスポートに失敗しました")
        setIsExporting(false)
        return
      }

      // Base64データをBlobに変換
      const binaryString = window.atob(data.data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

      // ダウンロードリンクを作成
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = data.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`${data.filename} をダウンロードしました`)
    } catch (error) {
      console.error("Excel export error:", error)
      toast.error("Excelエクスポート中にエラーが発生しました")
    } finally {
      setIsExporting(false)
    }
  }

  // サムネイル画像をZIPでエクスポート
  const handleExportThumbnails = async () => {
    if (!videos.length) return
    
    setIsExportingThumbnails(true)
    
    try {
      const filteredVideos = getFilteredVideos()
      const zip = new JSZip()
      let completedCount = 0
      const totalVideos = filteredVideos.length
      
      // セッションストレージからチャンネル情報を取得
      const storedChannelInfo = sessionStorage.getItem("currentChannelInfo")
      if (!storedChannelInfo) {
        toast.error("チャンネル情報が見つかりません")
        setIsExportingThumbnails(false)
        return
      }
      
      const channelInfo = JSON.parse(storedChannelInfo)
      const channelName = channelInfo.title.replace(/[/\\?%*:|"<>]/g, '-')
      
      // 処理開始の通知
      toast.info(`${totalVideos}件のサムネイル画像をダウンロード中...`, {
        duration: 3000,
      })
      
      // すべての画像をダウンロードするための非同期処理
      await Promise.all(
        filteredVideos.map(async (video, index) => {
          if (!video.thumbnail) return
          
          try {
            // CORS対応のための処理
            const imgBlob = await fetchImageAsBlob(video.thumbnail)
            
            // ファイル名を作成（インデックス付きで並び順を保持）
            const fileName = `${(index + 1).toString().padStart(3, '0')}_${video.title.replace(/[/\\?%*:|"<>]/g, '-')}.jpg`
            
            // ZIPファイルに追加
            zip.file(fileName, imgBlob)
            
            completedCount++
            if (completedCount % 10 === 0 || completedCount === totalVideos) {
              toast.info(`${completedCount}/${totalVideos} の画像を処理中...`, {
                duration: 1000,
                id: 'thumbnail-progress'
              })
            }
          } catch (error) {
            console.error(`Failed to process thumbnail for video ${video.id}:`, error)
          }
        })
      )
      
      // ZIPファイルの生成
      const zipBlob = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6
        }
      })
      
      // 日付を取得してファイル名に追加
      const now = new Date()
      const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`
      
      // ZIPファイルをダウンロード
      const url = window.URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      
      let periodName = "全期間"
      switch (activeTab) {
        case "week": periodName = "1週間"; break
        case "month": periodName = "1か月"; break
        case "quarter": periodName = "3か月"; break
        case "halfyear": periodName = "半年"; break
        case "year": periodName = "1年"; break
      }
      
      a.download = `${channelName}_サムネイル_${periodName}_${dateStr}.zip`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success(`${filteredVideos.length}件のサムネイル画像をダウンロードしました`)
    } catch (error) {
      console.error("Thumbnail export error:", error)
      toast.error("サムネイル画像のエクスポート中にエラーが発生しました")
    } finally {
      setIsExportingThumbnails(false)
    }
  }
  
  // CORS問題を回避するためBlobとして画像を取得
  const fetchImageAsBlob = async (imageUrl: string): Promise<Blob> => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      return await response.blob();
    } catch (fetchError) {
      console.warn("Direct fetch failed, trying canvas approach:", fetchError);
      // 直接フェッチが失敗した場合、Canvas経由でのアプローチを試みる
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.alt = "サムネイル画像";
        img.src = imageUrl;
        
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Could not create blob from canvas"));
              }
            },
            "image/jpeg",
            0.95
          );
        };
        
        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
      });
    }
  };

  const filteredVideos = getFilteredVideos()

  // 統計データの計算
  const totalViews = filteredVideos.reduce(
    (sum, video) => sum + Number.parseInt(video.viewCount.replace(/,/g, ""), 10),
    0
  )
  const avgViews = filteredVideos.length > 0 ? Math.round(totalViews / filteredVideos.length) : 0
  
  const totalLikes = filteredVideos.reduce(
    (sum, video) => sum + Number.parseInt(video.likeCount.replace(/,/g, ""), 10),
    0
  )
  const avgLikes = filteredVideos.length > 0 ? Math.round(totalLikes / filteredVideos.length) : 0
  
  const totalComments = filteredVideos.reduce(
    (sum, video) => sum + Number.parseInt(video.commentCount.replace(/,/g, ""), 10),
    0
  )
  const avgComments = filteredVideos.length > 0 ? Math.round(totalComments / filteredVideos.length) : 0

  // フィルタリングで絞り込まれた動画の割合
  const filteredPercent = videos.length > 0 ? Math.round((filteredVideos.length / videos.length) * 100) : 0
  
  // スプレッドレートの計算
  const avgSpreadRate = filteredVideos.length > 0
    ? filteredVideos.reduce((sum, video) => sum + video.spreadRate, 0) / filteredVideos.length
    : 0

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <KpiCard
          title="平均再生回数"
          value={formatNumber(avgViews)}
          icon={<Eye className="h-4 w-4" />}
        />
        <KpiCard
          title="平均高評価数"
          value={formatNumber(avgLikes)}
          icon={<ThumbsUp className="h-4 w-4" />}
        />
        <KpiCard
          title="平均コメント数"
          value={formatNumber(avgComments)}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <KpiCard
          title="平均拡散率"
          value={avgSpreadRate.toFixed(2)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiCard
          title="良いチャンネル"
          value={isGood ? "◯" : "✕"}
          icon={<Award className="h-4 w-4" />}
          description="直近1ヶ月で拡散率100%以上の動画あり"
        />
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <TabsList>
            <TabsTrigger value="all">全期間</TabsTrigger>
            <TabsTrigger value="week">1週間</TabsTrigger>
            <TabsTrigger value="month">1ヶ月</TabsTrigger>
            <TabsTrigger value="quarter">3ヶ月</TabsTrigger>
            <TabsTrigger value="halfyear">半年</TabsTrigger>
            <TabsTrigger value="year">1年</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportThumbnails}
              disabled={isExportingThumbnails}
              className="flex items-center gap-1"
            >
              {isExportingThumbnails ? (
                "処理中..."
              ) : (
                <>
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">サムネイル画像</span>
                  <span className="inline sm:hidden">画像</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={isExporting}
              className="flex items-center gap-1"
            >
              {isExporting ? (
                "処理中..."
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="hidden sm:inline">Excel形式で</span>
                  エクスポート
                </>
              )}
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <VideoTable videos={videos} />
        </TabsContent>
        <TabsContent value="week" className="mt-0">
          <VideoTable videos={filteredVideos} />
        </TabsContent>
        <TabsContent value="month" className="mt-0">
          <VideoTable videos={filteredVideos} />
        </TabsContent>
        <TabsContent value="quarter" className="mt-0">
          <VideoTable videos={filteredVideos} />
        </TabsContent>
        <TabsContent value="halfyear" className="mt-0">
          <VideoTable videos={filteredVideos} />
        </TabsContent>
        <TabsContent value="year" className="mt-0">
          <VideoTable videos={filteredVideos} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 