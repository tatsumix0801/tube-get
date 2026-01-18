"use server"

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

// CSV用のエスケープ処理
function escapeCSV(value: string | number): string {
  const strValue = String(value)
  // ダブルクォート、カンマ、改行を含む場合はダブルクォートで囲む
  if (strValue.includes('"') || strValue.includes(',') || strValue.includes('\n')) {
    return `"${strValue.replace(/"/g, '""')}"`
  }
  return strValue
}

// CSV形式でエクスポート
export async function exportToCSV(channelInfo: ChannelInfo, videos: VideoInfo[]) {
  try {
    if (!videos || videos.length === 0) {
      return {
        success: false,
        message: "エクスポートするデータがありません",
      }
    }

    // BOM付きUTF-8（Excel日本語対応）
    const BOM = '\uFEFF'

    let csvContent = BOM

    // チャンネル情報セクション
    csvContent += '# チャンネル情報\n'
    csvContent += '項目,値\n'
    csvContent += `チャンネル名,${escapeCSV(channelInfo.title)}\n`
    csvContent += `登録者数,${escapeCSV(channelInfo.subscriberCount)}\n`
    csvContent += `総動画数,${escapeCSV(channelInfo.videoCount)}\n`
    csvContent += `総再生回数,${escapeCSV(channelInfo.viewCount)}\n`
    csvContent += `チャンネル作成日,${escapeCSV(new Date(channelInfo.publishedAt).toLocaleDateString("ja-JP"))}\n`
    csvContent += '\n'

    // 動画一覧セクション
    csvContent += '# 動画一覧\n'
    csvContent += 'タイトル,投稿日,再生回数,高評価数,コメント数,拡散率,動画尺,URL\n'

    videos.forEach((video) => {
      const row = [
        escapeCSV(video.title),
        escapeCSV(new Date(video.publishedAt).toLocaleDateString("ja-JP")),
        escapeCSV(video.viewCount),
        escapeCSV(video.likeCount),
        escapeCSV(video.commentCount),
        escapeCSV(`${video.spreadRate.toFixed(2)}%`),
        escapeCSV(video.duration),
        escapeCSV(video.url),
      ]
      csvContent += row.join(',') + '\n'
    })

    // Base64エンコード
    const base64 = Buffer.from(csvContent, 'utf-8').toString('base64')

    return {
      success: true,
      data: base64,
      filename: `${channelInfo.title}_動画一覧.csv`,
    }
  } catch (error) {
    console.error("CSV export error:", error)
    return {
      success: false,
      message: "CSVエクスポート中にエラーが発生しました",
    }
  }
}

// 拡張版: カスタマイズ可能なCSVエクスポート関数
export async function exportToCSVWithTemplate(
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

    // BOM付きUTF-8（Excel日本語対応）
    const BOM = '\uFEFF'
    let csvContent = BOM

    // チャンネル情報セクション
    csvContent += '# チャンネル情報\n'
    csvContent += '項目,値\n'
    csvContent += `チャンネル名,${escapeCSV(channelInfo.title)}\n`
    csvContent += `登録者数,${escapeCSV(channelInfo.subscriberCount)}\n`
    csvContent += `総動画数,${escapeCSV(channelInfo.videoCount)}\n`
    csvContent += `総再生回数,${escapeCSV(channelInfo.viewCount)}\n`

    const creationDate = new Date(channelInfo.publishedAt)
    csvContent += `チャンネル作成日,${escapeCSV(format(creationDate, exportOptions.dateFormat, { locale: ja }))}\n`

    // 追加情報
    if (channelInfo.description) {
      csvContent += `チャンネル説明,${escapeCSV(channelInfo.description)}\n`
    }
    if (channelInfo.customUrl) {
      csvContent += `カスタムURL,${escapeCSV(channelInfo.customUrl)}\n`
    }
    if (channelInfo.country) {
      csvContent += `国,${escapeCSV(channelInfo.country)}\n`
    }
    if (channelInfo.keywords && channelInfo.keywords.length > 0) {
      csvContent += `キーワード,${escapeCSV(channelInfo.keywords.join(", "))}\n`
    }
    csvContent += '\n'

    // 動画一覧セクション（選択された項目）
    csvContent += '# 動画一覧\n'

    // ヘッダー行作成（新しい順序）
    const headers: string[] = []
    if (exportOptions.includeFields.includes("publishedAt")) headers.push("投稿日")
    if (exportOptions.includeFields.includes("duration")) headers.push("動画尺")
    if (exportOptions.includeFields.includes("title")) headers.push("タイトル")
    if (exportOptions.includeFields.includes("description")) headers.push("説明欄")
    if (exportOptions.includeFields.includes("tags")) headers.push("タグ")
    if (exportOptions.includeFields.includes("viewCount")) headers.push("再生回数")
    if (exportOptions.includeFields.includes("likeCount")) headers.push("高評価数")
    if (exportOptions.includeFields.includes("commentCount")) headers.push("コメント数")
    if (exportOptions.includeFields.includes("spreadRate")) headers.push("拡散率")
    if (exportOptions.includeFields.includes("url")) headers.push("URL")

    csvContent += headers.join(',') + '\n'

    // データ行作成
    videos.forEach((video) => {
      const row: string[] = []

      if (exportOptions.includeFields.includes("publishedAt")) {
        const date = new Date(video.publishedAt)
        row.push(escapeCSV(format(date, exportOptions.dateFormat, { locale: ja })))
      }
      if (exportOptions.includeFields.includes("duration")) row.push(escapeCSV(video.duration))
      if (exportOptions.includeFields.includes("title")) row.push(escapeCSV(video.title))
      if (exportOptions.includeFields.includes("description")) row.push(escapeCSV(video.description || ""))
      if (exportOptions.includeFields.includes("tags")) row.push(escapeCSV(video.tags ? video.tags.join(", ") : ""))
      if (exportOptions.includeFields.includes("viewCount")) row.push(escapeCSV(video.viewCount))
      if (exportOptions.includeFields.includes("likeCount")) row.push(escapeCSV(video.likeCount))
      if (exportOptions.includeFields.includes("commentCount")) row.push(escapeCSV(video.commentCount))
      if (exportOptions.includeFields.includes("spreadRate")) row.push(escapeCSV(`${video.spreadRate.toFixed(2)}%`))
      if (exportOptions.includeFields.includes("url")) row.push(escapeCSV(video.url))

      csvContent += row.join(',') + '\n'
    })

    // Base64エンコード
    const base64 = Buffer.from(csvContent, 'utf-8').toString('base64')

    // ファイル名の設定
    let filename = `${channelInfo.title}_動画一覧`
    if (exportOptions.customFilename) {
      filename = exportOptions.customFilename
    }

    return {
      success: true,
      data: base64,
      filename: `${filename}.csv`,
    }
  } catch (error) {
    console.error("CSV export error:", error)
    return {
      success: false,
      message: "CSVエクスポート中にエラーが発生しました",
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
