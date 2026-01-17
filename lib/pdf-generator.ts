// クライアントサイドでPDFを生成するためのユーティリティ関数
import type { jsPDF } from "jspdf"

// チャンネル情報の型定義
interface ChannelInfo {
  title: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  publishedAt: string;
  description?: string;
}

// 日本語フォントの設定
export function setupJapaneseFonts(doc: jsPDF) {
  try {
    // vfsフォントを使用するための設定
    doc.addFileToVFS('NotoSansJP-normal.ttf', 'AAEAAAAOAIAAAwBgRkZUTXl...') // この部分は実際には長い文字列になります
    doc.addFont('NotoSansJP-normal.ttf', 'NotoSansJP', 'normal')
    
    // デフォルトフォントとして設定
    doc.setFont("NotoSansJP")
    
    return doc
  } catch (error) {
    console.error("日本語フォント設定エラー:", error)
    return doc // エラー時はそのままのdocを返す
  }
}

// より簡単な代替手段として、既存のものに戻す
export function setupJapaneseFontsSimple(doc: jsPDF) {
  // フォントの埋め込みをせず、デフォルトフォントを使用
  doc.setFont("helvetica")
  return doc
}

// PDFのヘッダーを描画
export function drawHeader(doc: jsPDF, title: string) {
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("つべナビ", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" })

  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.text("YouTubeチャンネル分析レポート", doc.internal.pageSize.getWidth() / 2, 30, { align: "center" })

  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 45, { align: "center" })

  doc.setLineWidth(0.5)
  doc.line(20, 50, doc.internal.pageSize.getWidth() - 20, 50)
}

// チャンネル情報を描画
export function drawChannelInfo(doc: jsPDF, channelInfo: ChannelInfo) {
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("チャンネル情報", 20, 65)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  const infoItems = [
    { label: "チャンネル名", value: channelInfo.title },
    { label: "登録者数", value: channelInfo.subscriberCount },
    { label: "総動画数", value: channelInfo.videoCount },
    { label: "総再生回数", value: channelInfo.viewCount },
    { label: "チャンネル作成日", value: new Date(channelInfo.publishedAt).toLocaleDateString("ja-JP") },
  ]

  let y = 75
  infoItems.forEach((item) => {
    doc.text(`${item.label}: ${item.value}`, 20, y)
    y += 7
  })

  return y + 5 // 次の描画位置を返す
}

// チャンネル概要を描画
export function drawChannelDescription(doc: jsPDF, description: string, startY: number) {
  if (!description) return startY

  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("チャンネル概要", 20, startY)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")

  // 概要文を複数行に分割して描画
  const textLines = doc.splitTextToSize(description, doc.internal.pageSize.getWidth() - 40)

  // 最大10行まで表示
  const maxLines = Math.min(textLines.length, 10)
  doc.text(textLines.slice(0, maxLines), 20, startY + 10)

  // 省略表示
  if (textLines.length > 10) {
    doc.setFont("helvetica", "italic")
    doc.text("(概要文は一部省略されています)", 20, startY + 10 + maxLines * 5)
    return startY + 10 + maxLines * 5 + 10
  }

  return startY + 10 + textLines.length * 5 + 5
}

// フッターを描画
export function drawFooter(doc: jsPDF) {
  // @ts-expect-error - 型定義の不一致を無視
  const pageCount = doc.internal.getNumberOfPages()

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text(`作成日時: ${new Date().toLocaleString("ja-JP")}`, pageWidth / 2, pageHeight - 10, { align: "center" })
    doc.text(`つべナビ - YouTubeチャンネル分析ツール - ${i} / ${pageCount}`, pageWidth / 2, pageHeight - 5, {
      align: "center",
    })
  }
}

// ダークモードに対応した色を取得する関数
export function getThemeColors(isDarkMode: boolean) {
  return {
    textColor: isDarkMode ? [220, 220, 220] as [number, number, number] : [50, 50, 50] as [number, number, number],
    headBgColor: isDarkMode ? [80, 27, 120] as [number, number, number] : [100, 50, 200] as [number, number, number],
    gridColor: isDarkMode ? [70, 70, 70] as [number, number, number] : [200, 200, 200] as [number, number, number],
    backgroundColor: isDarkMode ? [30, 30, 30] as [number, number, number] : [255, 255, 255] as [number, number, number],
    accentColor: isDarkMode ? [120, 80, 200] as [number, number, number] : [100, 50, 200] as [number, number, number],
  }
}

