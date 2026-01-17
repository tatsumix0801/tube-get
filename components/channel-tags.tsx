"use client"

import { useState } from "react"
import { HashIcon } from "lucide-react"

interface ChannelTagsProps {
  keywords?: string[]
}

export function ChannelTags({ keywords = [] }: ChannelTagsProps) {
  // 表示するものがあるか確認
  if (!keywords || keywords.length === 0) {
    return null
  }

  // 表示する値を作成
  const displayValue = keywords.length > 5 
    ? keywords.slice(0, 5).join(', ') + ` +${keywords.length - 5}`
    : keywords.join(', ')

  return (
    <div className="space-y-2">
      <div className="flex items-center mb-1">
        <HashIcon className="w-4 h-4 mr-2 text-indigo-500" />
        <h3 className="text-lg font-medium">チャンネルタグ</h3>
      </div>
      
      <div className="text-sm text-muted-foreground break-words whitespace-normal">
        {displayValue || '-'}
      </div>
    </div>
  )
} 