"use client"

import { useEffect, useState } from 'react'
import '../global-doc-styles.css'

export default function TermsOfTradePage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch('/api/docs?file=terms-of-trade')
        if (!response.ok) {
          throw new Error('Failed to fetch content')
        }
        const data = await response.json()
        setContent(data.content)
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12 mb-2.5"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-2.5"></div>
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