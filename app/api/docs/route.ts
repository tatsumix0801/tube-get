import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

export async function GET(request: NextRequest) {
  // URLからfileパラメータを取得
  const { searchParams } = new URL(request.url)
  const file = searchParams.get('file')

  if (!file) {
    return NextResponse.json(
      { error: 'File parameter is required' },
      { status: 400 }
    )
  }

  try {
    // ファイルパスを構築
    const filePath = path.join(process.cwd(), 'app', 'docs', `${file}.mdx`)
    
    // ファイルが存在するか確認
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    // ファイルの内容を読み込む
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // MDXをHTMLに変換 (GitHub Flavored Markdownプラグインを使用)
    const processedContent = await remark()
      .use(remarkGfm) // GitHub Flavored Markdownをサポート（テーブルなど）
      .use(html, { sanitize: false }) // サニタイズを無効化してHTMLタグを保持
      .process(fileContent)
    
    let contentHtml = processedContent.toString()
    
    // 表のマークアップを強化
    contentHtml = contentHtml
      // MDXの特別なdivタグを保持
      .replace(/&lt;div className="special-table"&gt;/g, '<div class="special-table">')
      .replace(/&lt;\/div&gt;/g, '</div>')
      
      // テーブル全体にクラスを追加
      .replace(/<table>/g, '<table class="terms-table">')
      // テーブルヘッダーにクラスを追加
      .replace(/<thead>/g, '<thead class="terms-table-header">')
      // テーブル本体にクラスを追加
      .replace(/<tbody>/g, '<tbody class="terms-table-body">')
      // リスト要素にクラスを追加
      .replace(/<ul>/g, '<ul class="terms-list">')
      .replace(/<ol>/g, '<ol class="terms-ordered-list">')
      // 改行タグを適切に処理
      .replace(/&lt;br \/&gt;/g, '<br />')
      .replace(/&lt;br&gt;/g, '<br>')
    
    return NextResponse.json({ content: contentHtml })
  } catch (error) {
    console.error(`Error processing document file: ${error}`)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
} 