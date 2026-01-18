"use client"

import { useState, useEffect, useMemo, memo, useRef, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Eye,
  LayoutList,
  LayoutGrid,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import { formatNumber } from "@/lib/format-utils"
import { VideoTags } from "@/components/video-tags"
import { DisplaySettings } from "@/components/display-settings"
import { loadSettings } from "@/lib/user-settings"
import { cn } from "@/lib/utils"
import { DescriptionAccordion } from "@/components/description-accordion"
import Image from "next/image"

interface Video {
  id: string
  title: string
  publishedAt: string
  thumbnail: string
  duration: string
  viewCount: string
  likeCount: string
  commentCount: string
  spreadRate: number
  url: string
  description?: string
  tags?: string[]
  topics?: string[]
}

interface VideoTableProps {
  videos: Video[]
}

// React.memoでコンポーネントをメモ化
export const VideoTable = memo(function VideoTable({ videos }: VideoTableProps) {
  const [sortField, setSortField] = useState<keyof Video | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string>("")
  const [viewMode, setViewMode] = useState<"table" | "list" | "card">("table")
  const [displaySettings, setDisplaySettings] = useState({
    showDuration: true,
    showViewCount: true,
    showSpreadRate: true,
    showLikeCount: true,
    showCommentCount: true,
    showTags: true,
    showDescription: true,
    showThumbnails: true,
  })
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([])

  // 設定の読み込み
  useEffect(() => {
    const settings = loadSettings()
    setDisplaySettings(settings.displayOptions)
    
    // モバイルの場合はリスト表示をデフォルトに
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewMode("list")
    }
  }, [])

  // 画面サイズ変更時の処理
  useEffect(() => {
    const handleResize = () => {
      // モバイルではリスト表示を推奨
      if (window.innerWidth < 768 && viewMode === "table") {
        setViewMode("list")
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [viewMode])

  // 設定更新時の処理
  const handleSettingsChange = () => {
    const settings = loadSettings()
    setDisplaySettings(settings.displayOptions)
  }

  const handleSort = (field: keyof Video) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // ソート済み動画リスト（useMemoでメモ化）
  const sortedVideos = useMemo(() => {
    return [...videos].sort((a, b) => {
      if (!sortField) return 0

      const normalizeValue = (value: Video[keyof Video] | undefined): string | number => {
        if (value === undefined) return ""
        if (typeof value === "number") return value
        if (Array.isArray(value)) return value.join(",")
        if (typeof value === "string") {
          const numericValue = Number(value.replace(/,/g, ""))
          return Number.isNaN(numericValue) ? value : numericValue
        }
        return ""
      }

      const valueA = normalizeValue(a[sortField])
      const valueB = normalizeValue(b[sortField])

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [videos, sortField, sortDirection])

  const getSortIcon = (field: keyof Video) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-4 w-4 text-purple-500" />
    ) : (
      <ArrowDown className="ml-1 h-4 w-4 text-purple-500" />
    )
  }

  // フォーカス管理関数
  const focusRow = useCallback((index: number) => {
    if (index >= 0 && index < sortedVideos.length && rowRefs.current[index]) {
      rowRefs.current[index]?.focus()
    }
  }, [sortedVideos.length])

  // キーボードナビゲーション
  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        focusRow(index + 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        focusRow(index - 1)
        break
      case 'Home':
        e.preventDefault()
        focusRow(0)
        break
      case 'End':
        e.preventDefault()
        focusRow(sortedVideos.length - 1)
        break
    }
  }, [focusRow, sortedVideos.length])

  if (videos.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
        <p className="text-muted-foreground">この期間の動画データはありません</p>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("table")}
            className={cn(
              "h-9 w-9 p-0",
              viewMode === "table" && "bg-primary/10 text-primary"
            )}
            aria-label="テーブル表示"
            title="テーブル表示"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode("list")}
            className={cn(
              "h-9 w-9 p-0", 
              viewMode === "list" && "bg-primary/10 text-primary"
            )}
            aria-label="リスト表示"
            title="リスト表示"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <span className="ml-2 text-xs text-muted-foreground hidden md:inline-block">
            {videos.length}件の動画
          </span>
        </div>
        <DisplaySettings onChange={handleSettingsChange} />
      </div>

      {/* テーブル表示 */}
      {viewMode === "table" && (
        <div className="overflow-x-auto w-full scrollbar-thin">
          <Table className="border-collapse w-full table-fixed min-w-[900px] [&_th]:py-2 [&_td]:py-2 [&_th]:px-2 [&_td]:px-2">
            <TableHeader className="bg-gray-50 dark:bg-gray-900">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-medium -ml-3 flex items-center text-muted-foreground hover:text-foreground"
                    onClick={() => handleSort("publishedAt")}
                  >
                    投稿日
                    {getSortIcon("publishedAt")}
                  </Button>
                </TableHead>
                
                {displaySettings.showThumbnails && (
                  <TableHead className="w-[180px] min-w-[180px]">サムネイル</TableHead>
                )}
                
                {displaySettings.showDuration && (
                  <TableHead className="w-[80px] min-w-[80px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort("duration")}
                    >
                      動画尺
                      {getSortIcon("duration")}
                    </Button>
                  </TableHead>
                )}
                
                <TableHead className="w-[270px] min-w-[270px]">タイトル</TableHead>
                
                {displaySettings.showDescription && (
                  <TableHead className="w-[300px] min-w-[300px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      説明欄
                    </Button>
                  </TableHead>
                )}
                
                {displaySettings.showTags && (
                  <TableHead className="w-[170px] min-w-[170px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-3 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      タグ
                    </Button>
                  </TableHead>
                )}
                
                {displaySettings.showViewCount && (
                  <TableHead className="text-right w-[100px] min-w-[100px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort("viewCount")}
                    >
                      再生回数
                      {getSortIcon("viewCount")}
                    </Button>
                  </TableHead>
                )}
                
                {displaySettings.showSpreadRate && (
                  <TableHead className="text-right w-[90px] min-w-[90px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort("spreadRate")}
                    >
                      拡散率
                      {getSortIcon("spreadRate")}
                    </Button>
                  </TableHead>
                )}
                
                {displaySettings.showLikeCount && (
                  <TableHead className="text-right w-[90px] min-w-[90px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort("likeCount")}
                    >
                      高評価
                      {getSortIcon("likeCount")}
                    </Button>
                  </TableHead>
                )}
                
                {displaySettings.showCommentCount && (
                  <TableHead className="text-right w-[90px] min-w-[90px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium -ml-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => handleSort("commentCount")}
                    >
                      コメント
                      {getSortIcon("commentCount")}
                    </Button>
                  </TableHead>
                )}
                
                <TableHead className="w-[60px] min-w-[60px]">URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVideos.map((video, index) => (
                <TableRow
                  key={`${video.id}-${index}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-purple-50 dark:focus:bg-purple-900/20"
                  tabIndex={0}
                  ref={(el) => { rowRefs.current[index] = el }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  role="row"
                  aria-rowindex={index + 1}
                >
                  <TableCell className="font-medium">
                    {new Date(video.publishedAt).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(video.publishedAt), {
                        addSuffix: true,
                        locale: ja,
                      })}
                    </div>
                    <div className="text-xs font-medium mt-1 text-purple-500">
                      {new Date(video.publishedAt).toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false
                      })}
                    </div>
                  </TableCell>
                  
                  {displaySettings.showThumbnails && (
                    <TableCell className="py-3 text-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div
                            className="relative group cursor-pointer w-[180px] h-[101px] mx-auto"
                            onClick={() => {
                              setSelectedThumbnail(video.thumbnail || "/placeholder.svg")
                              setSelectedTitle(video.title)
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Image
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              fill
                              className="object-cover rounded-md shadow-sm group-hover:shadow-md transition-all"
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAgICAQQDAAAAAAAAAAAAAQIDBAAFESExQVFhcYH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzOra+e3J6VWtFcmjiMzxo/CqvHOCfoHIwwH/2Q=="
                            />
                            <div className="absolute bottom-2 right-2 bg-black/85 text-white text-xs px-1 py-0.5 rounded">
                              {video.duration.includes(':') 
                                ? video.duration.replace(/(\d+):(\d)$/, '$1:0$2') 
                                : `00:${video.duration.padStart(2, '0')}`}
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-lg">{video.title}</DialogTitle>
                          </DialogHeader>
                          <div className="mt-2 flex flex-col items-center">
                            <Image
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.title}
                              width={1280}
                              height={720}
                              className="max-w-full max-h-[70vh] object-contain rounded-md shadow-md"
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAgICAQQDAAAAAAAAAAAAAQIDBAAFESExQVFhcYH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzOra+e3J6VWtFcmjiMzxo/CqvHOCfoHIwwH/2Q=="
                            />
                            <Button 
                              variant="outline" 
                              className="mt-4 border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-900 dark:hover:border-purple-800 dark:hover:bg-purple-900/20 transition-all"
                              onClick={() => {
                                // 画像のCORS問題を回避するためにCanvas経由でダウンロード
                                const image = document.createElement('img');
                                image.crossOrigin = "anonymous";
                                image.src = video.thumbnail || "/placeholder.svg";
                                
                                image.onload = () => {
                                  // キャンバスを作成し、画像を描画
                                  const canvas = document.createElement("canvas");
                                  canvas.width = image.width;
                                  canvas.height = image.height;
                                  const ctx = canvas.getContext("2d");
                                  if (!ctx) return;
                                  
                                  ctx.drawImage(image, 0, 0);
                                  
                                  // キャンバスからデータURLを取得（jpg形式）
                                  try {
                                    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
                                    
                                    // ファイル名を設定（特殊文字を除去）
                                    const fileName = `${video.title.replace(/[/\\?%*:|"<>]/g, '-')}.jpg`;
                                    
                                    // ダウンロードリンクを作成
                                    const link = document.createElement('a');
                                    link.href = dataUrl;
                                    link.download = fileName;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  } catch (error) {
                                    console.error("画像のダウンロードに失敗しました", error);
                                    // 直接のアプローチを試みる（フォールバック）
                                    const link = document.createElement('a');
                                    link.href = video.thumbnail || "/placeholder.svg";
                                    link.download = `${video.title.replace(/[/\\?%*:|"<>]/g, '-')}.jpg`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }
                                };
                                
                                // エラー処理
                                image.onerror = () => {
                                  console.error("画像の読み込みに失敗しました");
                                  // 直接のアプローチを試みる（フォールバック）
                                  const link = document.createElement('a');
                                  link.href = video.thumbnail || "/placeholder.svg";
                                  link.download = `${video.title.replace(/[/\\?%*:|"<>]/g, '-')}.jpg`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                };
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-purple-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                              ダウンロード
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  )}
                  
                  {displaySettings.showDuration && (
                    <TableCell className="font-mono text-sm text-center">
                      {video.duration.includes(':') 
                        ? video.duration
                        : `00:${video.duration.padStart(2, '0')}`}
                    </TableCell>
                  )}
                  
                  <TableCell className="font-medium break-words whitespace-normal py-3 leading-snug">
                    <div className="max-w-full overflow-hidden text-ellipsis">
                      {video.title}
                    </div>
                  </TableCell>
                  
                  {displaySettings.showDescription && (
                    <TableCell className="break-words whitespace-normal text-xs text-muted-foreground">
                      {video.description ? (
                        <DescriptionAccordion 
                          text={video.description} 
                          maxHeight={50}
                          maxPreviewLength={30}
                        />
                      ) : '-'}
                    </TableCell>
                  )}
                  
                  {displaySettings.showTags && (
                    <TableCell className="break-words whitespace-normal text-xs text-muted-foreground">
                      <div className="max-w-full overflow-hidden">
                        {video.tags && video.tags.length > 0 ? 
                          video.tags.join(', ') : 
                          '-'}
                      </div>
                    </TableCell>
                  )}
                  
                  {displaySettings.showViewCount && (
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {formatNumber(video.viewCount)}
                    </TableCell>
                  )}
                  
                  {displaySettings.showSpreadRate && (
                    <TableCell className="text-right whitespace-nowrap">
                      <span
                        className={`font-medium ${
                          video.spreadRate > 100
                            ? "text-green-600 dark:text-green-400"
                            : video.spreadRate < 30
                              ? "text-red-600 dark:text-red-400"
                              : ""
                        }`}
                      >
                        {video.spreadRate.toFixed(2)}%
                      </span>
                    </TableCell>
                  )}
                  
                  {displaySettings.showLikeCount && (
                    <TableCell className="text-right font-medium whitespace-nowrap">{formatNumber(video.likeCount)}</TableCell>
                  )}
                  
                  {displaySettings.showCommentCount && (
                    <TableCell className="text-right font-medium whitespace-nowrap">{formatNumber(video.commentCount)}</TableCell>
                  )}
                  
                  <TableCell className="text-center">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-500 dark:text-purple-300 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">動画を開く</span>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* リスト表示 (モバイル向け) */}
      {viewMode === "list" && (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {sortedVideos.map((video) => (
            <div key={video.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <div className="flex flex-col md:flex-row gap-4">
                {/* サムネイル */}
                {displaySettings.showThumbnails && (
                  <div className="flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="p-0 h-auto w-full md:w-auto rounded-md overflow-hidden" onClick={() => {
                          setSelectedThumbnail(video.thumbnail);
                          setSelectedTitle(video.title);
                        }}>
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            width={160}
                            height={90}
                            className="w-full md:w-[160px] aspect-video object-cover rounded"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAgICAQQDAAAAAAAAAAAAAQIDBAAFESExQVFhcYH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzOra+e3J6VWtFcmjiMzxo/CqvHOCfoHIwwH/2Q=="
                          />
                          {displaySettings.showDuration && (
                            <div className="absolute bottom-1 right-1 bg-black/85 text-white text-xs px-1 rounded">
                              {video.duration}
                            </div>
                          )}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{selectedTitle}</DialogTitle>
                        </DialogHeader>
                        {selectedThumbnail && (
                          <Image
                            src={selectedThumbnail}
                            alt={selectedTitle}
                            width={1280}
                            height={720}
                            className="w-full rounded-md"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAgICAQQDAAAAAAAAAAAAAQIDBAAFESExQVFhcYH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AzOra+e3J6VWtFcmjiMzxo/CqvHOCfoHIwwH/2Q=="
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
                
                {/* 動画情報 */}
                <div className="flex-1 flex flex-col">
                  <div className="text-sm text-muted-foreground mb-1 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(video.publishedAt)}
                    
                    {displaySettings.showDuration && !displaySettings.showThumbnails && (
                      <span className="ml-3 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {video.duration}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-base font-medium line-clamp-2 mb-2">
                    <a 
                      href={video.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {video.title}
                    </a>
                  </h3>
                  
                  {displaySettings.showDescription && video.description && (
                    <div className="mb-2 text-xs text-muted-foreground">
                      <DescriptionAccordion 
                        text={video.description} 
                        maxLines={1}
                        maxPreviewLength={20}
                      />
                    </div>
                  )}
                  
                  {displaySettings.showTags && video.tags && video.tags.length > 0 && (
                    <div className="mb-2">
                      <VideoTags tags={video.tags} truncateAt={3} />
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-auto">
                    {displaySettings.showViewCount && (
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {video.viewCount}
                      </div>
                    )}
                    
                    {displaySettings.showLikeCount && (
                      <div className="flex items-center">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        {video.likeCount}
                      </div>
                    )}
                    
                    {displaySettings.showCommentCount && (
                      <div className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {video.commentCount}
                      </div>
                    )}
                    
                    {displaySettings.showSpreadRate && (
                      <div className="flex items-center">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          video.spreadRate > 20
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : video.spreadRate > 10
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        }`}>
                          {video.spreadRate.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
