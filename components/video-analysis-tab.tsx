"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Eye, ThumbsUp, MessageSquare, TrendingUp, Image, Award } from "lucide-react"
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
}

export function VideoAnalysisTab({ videos }: VideoAnalysisTabProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingThumbnails, setIsExportingThumbnails] = useState(false)

  // 良いチャンネル判定フックを使用
  const isGood = useGoodChannel(videos)

  // 期間フィルタリング（useMemoでメモ化）
  const filteredVideos = useMemo(() => {
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
  }, [videos, activeTab])

  // CSV形式でエクスポート
  const handleExportCSV = async () => {
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
      
      const response = await fetch("/api/export/csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelInfo,
          videos: filteredVideos,
          exportOptions: userSettings.exportOptions
        }),
      })

      const data = await response.json()

      if (!data.success) {
        toast.error(data.message || "CSVエクスポートに失敗しました")
        setIsExporting(false)
        return
      }

      // Base64データをBlobに変換
      const binaryString = window.atob(data.data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: "text/csv" })

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
      console.error("CSV export error:", error)
      toast.error("CSVエクスポート中にエラーが発生しました")
    } finally {
      setIsExporting(false)
    }
  }

  // サムネイル画像をZIPでエクスポート
  const handleExportThumbnails = async () => {
    if (!videos.length) return
    
    setIsExportingThumbnails(true)
    
    try {
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
        const img = document.createElement('img');
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

  // 統計データの計算（useMemoでメモ化）
  const { avgViews, avgLikes, avgComments, avgSpreadRate } = useMemo(() => {
    if (!filteredVideos.length) {
      return { avgViews: 0, avgLikes: 0, avgComments: 0, avgSpreadRate: 0 }
    }

    const totalViews = filteredVideos.reduce(
      (sum, video) => sum + Number.parseInt(video.viewCount.replace(/,/g, ""), 10),
      0
    )
    const avgViews = Math.round(totalViews / filteredVideos.length)

    const totalLikes = filteredVideos.reduce(
      (sum, video) => sum + Number.parseInt(video.likeCount.replace(/,/g, ""), 10),
      0
    )
    const avgLikes = Math.round(totalLikes / filteredVideos.length)

    const totalComments = filteredVideos.reduce(
      (sum, video) => sum + Number.parseInt(video.commentCount.replace(/,/g, ""), 10),
      0
    )
    const avgComments = Math.round(totalComments / filteredVideos.length)

    const avgSpreadRate = filteredVideos.reduce((sum, video) => sum + video.spreadRate, 0) / filteredVideos.length

    return { avgViews, avgLikes, avgComments, avgSpreadRate }
  }, [filteredVideos])

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
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">サムネイル画像</span>
                  <span className="inline sm:hidden">画像</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex items-center gap-1"
            >
              {isExporting ? (
                "処理中..."
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">CSV形式で</span>
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
