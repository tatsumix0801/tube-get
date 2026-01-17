"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import '../global-doc-styles.css'

// デバッグ情報の型を定義
interface DebugInfo {
  params: any; // paramsの型はnext/navigationのuseParamsの戻り値型
  slug: string | string[] | null | undefined;
  fetchingSlug?: string | undefined;
  responseStatus?: number;
  error?: unknown;
}

export default function DocPage() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [debug, setDebug] = useState<DebugInfo>({ params, slug })

  useEffect(() => {
    async function loadContent() {
      try {
        // デバッグ情報を更新
        setDebug((prev: DebugInfo) => ({ ...prev, fetchingSlug: slug }))
        
        if (!slug) {
          setError(true)
          return
        }

        // サーバーサイドでファイルを読み込む代わりに、フェッチでMDXファイルを取得
        const response = await fetch(`/api/docs?file=${slug}`)
        setDebug((prev: DebugInfo) => ({ ...prev, responseStatus: response.status }))
        
        if (!response.ok) {
          throw new Error('Failed to load MDX content')
        }
        
        const data = await response.json()
        setContent(data.content)
      } catch (err) {
        console.error('Error loading content:', err)
        setDebug((prev: DebugInfo) => ({ ...prev, error: err }))
        setError(true)
      }
    }

    // slugがある場合のみコンテンツをロード
    if (slug) {
      loadContent()
    }
  }, [slug])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">ページが見つかりませんでした</h1>
        <p>お探しのドキュメントは存在しないか、移動した可能性があります。</p>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-lg font-bold">デバッグ情報</h2>
          <pre className="text-xs overflow-auto mt-2">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12 mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-2.5"></div>
        </div>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-lg font-bold">デバッグ情報</h2>
          <pre className="text-xs overflow-auto mt-2">
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl terms-of-trade-container">
      <div 
        className="terms-content prose dark:prose-invert lg:prose-lg"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  )
} 