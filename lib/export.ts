"use server"

import * as XLSX from "xlsx"
import { format } from "date-fns"
import { ja } from "date-fns/locale"

// チャンネル情報の型定義
interface ChannelInfo {
  title: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  publishedAt: string;
  description?: string;
  customUrl?: string;
  country?: string;
  keywords?: string[];
}

// 動画情報の型定義
interface VideoInfo {
  title: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  spreadRate: number;
  duration: string;
  url: string;
  tags?: string[];
  description?: string;
}

// Excel形式でエクスポート
export async function exportToExcel(channelInfo: ChannelInfo, videos: VideoInfo[]) {
  try {
    if (!videos || videos.length === 0) {
      return {
        success: false,
        message: "エクスポートするデータがありません",
      }
    }

    // 動画データをExcel用に整形
    const videoData = videos.map((video) => ({
      タイトル: video.title,
      投稿日: new Date(video.publishedAt).toLocaleDateString("ja-JP"),
      再生回数: video.viewCount,
      高評価数: video.likeCount,
      コメント数: video.commentCount,
      拡散率: `${video.spreadRate.toFixed(2)}%`,
      動画尺: video.duration,
      URL: video.url,
    }))

    // ワークブックとワークシートを作成
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(videoData)

    // 列幅の設定
    const colWidths = [
      { wch: 50 }, // タイトル
      { wch: 15 }, // 投稿日
      { wch: 12 }, // 再生回数
      { wch: 12 }, // 高評価数
      { wch: 12 }, // コメント数
      { wch: 10 }, // 拡散率
      { wch: 10 }, // 動画尺
      { wch: 45 }, // URL
    ]
    ws["!cols"] = colWidths

    // ワークシートをワークブックに追加
    XLSX.utils.book_append_sheet(wb, ws, "動画一覧")

    // チャンネル情報のシートを作成
    const channelData = [
      { 項目: "チャンネル名", 値: channelInfo.title },
      { 項目: "登録者数", 値: channelInfo.subscriberCount },
      { 項目: "総動画数", 値: channelInfo.videoCount },
      { 項目: "総再生回数", 値: channelInfo.viewCount },
      { 項目: "チャンネル作成日", 値: new Date(channelInfo.publishedAt).toLocaleDateString("ja-JP") },
    ]
    const channelWs = XLSX.utils.json_to_sheet(channelData)
    channelWs["!cols"] = [{ wch: 20 }, { wch: 30 }]
    XLSX.utils.book_append_sheet(wb, channelWs, "チャンネル情報")

    // バイナリデータに変換
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })

    // Base64エンコード
    const base64 = Buffer.from(excelBuffer).toString("base64")

    return {
      success: true,
      data: base64,
      filename: `${channelInfo.title}_動画一覧.xlsx`,
    }
  } catch (error) {
    console.error("Excel export error:", error)
    return {
      success: false,
      message: "Excelエクスポート中にエラーが発生しました",
    }
  }
}

// 拡張版: カスタマイズ可能なExcelエクスポート関数
export async function exportToExcelWithTemplate(
  channelInfo: ChannelInfo, 
  videos: VideoInfo[], 
  exportOptions: {
    includeFields: string[]
    dateFormat: string
    customFilename: string
  }
) {
  try {
    if (!videos || videos.length === 0) {
      return {
        success: false,
        message: "エクスポートするデータがありません",
      }
    }

    // 動画データをExcel用に整形
    const videoData = videos.map((video) => {
      const row: Record<string, string | number> = {}
      
      // 選択された項目に基づいてデータを追加 (新しい順序)
      if (exportOptions.includeFields.includes("publishedAt")) {
        const date = new Date(video.publishedAt)
        row["投稿日"] = format(date, exportOptions.dateFormat, { locale: ja })
      }
      if (exportOptions.includeFields.includes("duration")) row["動画尺"] = video.duration
      if (exportOptions.includeFields.includes("title")) row["タイトル"] = video.title
      if (exportOptions.includeFields.includes("description") && video.description) row["説明欄"] = video.description
      if (exportOptions.includeFields.includes("tags") && video.tags) row["タグ"] = video.tags.join(", ")
      if (exportOptions.includeFields.includes("viewCount")) row["再生回数"] = video.viewCount
      if (exportOptions.includeFields.includes("likeCount")) row["高評価数"] = video.likeCount
      if (exportOptions.includeFields.includes("commentCount")) row["コメント数"] = video.commentCount
      if (exportOptions.includeFields.includes("spreadRate")) row["拡散率"] = `${video.spreadRate.toFixed(2)}%`
      if (exportOptions.includeFields.includes("url")) row["URL"] = video.url
      
      return row
    })

    // ワークブックとワークシートを作成
    const wb = XLSX.utils.book_new()
    
    // 動画情報シートを作成（選択された項目があれば）
    if (videoData.length > 0 && Object.keys(videoData[0]).length > 0) {
      const ws = XLSX.utils.json_to_sheet(videoData)

      // 列幅の設定 (新しい順序)
      const colWidths: Array<{ wch: number }> = []
      
      if (exportOptions.includeFields.includes("publishedAt")) colWidths.push({ wch: 15 }) // 投稿日
      if (exportOptions.includeFields.includes("duration")) colWidths.push({ wch: 10 }) // 動画尺
      if (exportOptions.includeFields.includes("title")) colWidths.push({ wch: 50 }) // タイトル
      if (exportOptions.includeFields.includes("description")) colWidths.push({ wch: 70 }) // 説明欄
      if (exportOptions.includeFields.includes("tags")) colWidths.push({ wch: 30 }) // タグ
      if (exportOptions.includeFields.includes("viewCount")) colWidths.push({ wch: 12 }) // 再生回数
      if (exportOptions.includeFields.includes("likeCount")) colWidths.push({ wch: 12 }) // 高評価数
      if (exportOptions.includeFields.includes("commentCount")) colWidths.push({ wch: 12 }) // コメント数
      if (exportOptions.includeFields.includes("spreadRate")) colWidths.push({ wch: 10 }) // 拡散率
      if (exportOptions.includeFields.includes("url")) colWidths.push({ wch: 45 }) // URL
      
      ws["!cols"] = colWidths

      // ワークシートをワークブックに追加
      XLSX.utils.book_append_sheet(wb, ws, "動画一覧")
    }

    // チャンネル情報のシート
    const channelDataItems = []
    
    // 基本的なチャンネル情報
    channelDataItems.push({ 項目: "チャンネル名", 値: channelInfo.title })
    channelDataItems.push({ 項目: "登録者数", 値: channelInfo.subscriberCount })
    channelDataItems.push({ 項目: "総動画数", 値: channelInfo.videoCount })
    channelDataItems.push({ 項目: "総再生回数", 値: channelInfo.viewCount })
    
    // チャンネル作成日の日付フォーマットを設定に合わせる
    const creationDate = new Date(channelInfo.publishedAt)
    channelDataItems.push({ 
      項目: "チャンネル作成日", 
      値: format(creationDate, exportOptions.dateFormat, { locale: ja }) 
    })
    
    // 追加情報
    if (channelInfo.description) {
      channelDataItems.push({ 項目: "チャンネル説明", 値: channelInfo.description })
    }
    if (channelInfo.customUrl) {
      channelDataItems.push({ 項目: "カスタムURL", 値: channelInfo.customUrl })
    }
    if (channelInfo.country) {
      channelDataItems.push({ 項目: "国", 値: channelInfo.country })
    }
    if (channelInfo.keywords && channelInfo.keywords.length > 0) {
      channelDataItems.push({ 項目: "キーワード", 値: channelInfo.keywords.join(", ") })
    }
    
    const channelWs = XLSX.utils.json_to_sheet(channelDataItems)
    channelWs["!cols"] = [{ wch: 20 }, { wch: 60 }]
    XLSX.utils.book_append_sheet(wb, channelWs, "チャンネル情報")

    // バイナリデータに変換
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })

    // Base64エンコード
    const base64 = Buffer.from(excelBuffer).toString("base64")

    // ファイル名の設定
    let filename = `${channelInfo.title}_動画一覧`
    if (exportOptions.customFilename) {
      filename = exportOptions.customFilename
    }
    
    return {
      success: true,
      data: base64,
      filename: `${filename}.xlsx`,
    }
  } catch (error) {
    console.error("Excel export error:", error)
    return {
      success: false,
      message: "Excelエクスポート中にエラーが発生しました",
    }
  }
}

// PDFエクスポートのためのデータを準備する関数
export async function preparePdfExportData(channelInfo: ChannelInfo, videos: VideoInfo[]) {
  try {
    if (!videos || videos.length === 0) {
      return {
        success: false,
        message: "エクスポートするデータがありません",
      }
    }

    // クライアントサイドでPDFを生成するためのデータを返す
    return {
      success: true,
      channelInfo,
      videos,
      filename: `${channelInfo.title.replace(/[^a-zA-Z0-9\s\-_]/g, "")}_Analysis_Report.pdf`,
    }
  } catch (error) {
    console.error("PDF export data preparation error:", error)
    return {
      success: false,
      message: "PDFエクスポートデータの準備中にエラーが発生しました",
    }
  }
}

