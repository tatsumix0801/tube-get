import fs from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { remark } from 'remark'
import html from 'remark-html'

export async function GET(request: NextRequest) {
  // URLからslugパラメータを取得
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug parameter is required' },
      { status: 400 }
    )
  }

  try {
    // ファイルパスを構築
    const filePath = path.join(process.cwd(), 'app', 'docs', `${slug}.mdx`)
    
    // ファイルが存在するか確認
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }
    
    // ファイルの内容を読み込む
    const fileContent = fs.readFileSync(filePath, 'utf8')
    
    // MDXをHTMLに変換
    const processedContent = await remark()
      .use(html)
      .process(fileContent)
    
    const contentHtml = processedContent.toString()
    
    return NextResponse.json({ content: contentHtml })
  } catch (error) {
    console.error(`Error processing MDX file: ${error}`)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
} 