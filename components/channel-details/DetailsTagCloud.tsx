"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check, TagsIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface DetailsTagCloudProps {
  keywords: string[]
  className?: string
}

export function DetailsTagCloud({ keywords, className }: DetailsTagCloudProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  
  // タグをコピーする機能
  const copyTags = () => {
    const tagsText = keywords.join(", ")
    navigator.clipboard.writeText(tagsText)
      .then(() => {
        setIsCopied(true)
        toast({
          title: "コピー完了",
          description: "タグをクリップボードにコピーしました",
        })
        
        // 3秒後にコピー状態をリセット
        setTimeout(() => setIsCopied(false), 3000)
      })
      .catch((error) => {
        console.error("タグのコピーに失敗しました:", error)
        toast({
          title: "エラー",
          description: "タグのコピーに失敗しました",
          variant: "destructive",
        })
      })
  }
  
  // タグのフォントサイズを調整する関数（頻度に基づく重み付け）
  const getTagSize = (index: number) => {
    const totalTags = keywords.length
    
    // シンプルな例：インデックスに基づいて3つのサイズクラスに分ける
    if (index < totalTags * 0.3) return "text-sm"
    if (index < totalTags * 0.7) return "text-xs"
    return "text-xs opacity-80"
  }
  
  // タグの色を調整する関数
  const getTagColor = (index: number) => {
    const colors = [
      "bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 dark:text-purple-300",
      "bg-indigo-100 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 dark:text-indigo-300",
      "bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 dark:text-blue-300",
      "bg-violet-100 hover:bg-violet-200 text-violet-800 dark:bg-violet-900/30 dark:hover:bg-violet-800/50 dark:text-violet-300"
    ]
    
    return colors[index % colors.length]
  }

  // アニメーションバリアント
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.3
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn("border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300", className)}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TagsIcon className="h-4 w-4 text-purple-500" />
              チャンネルタグ
            </CardTitle>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={copyTags}
                className="text-xs text-muted-foreground hover:text-foreground h-8"
                disabled={isCopied}
                aria-label="すべてのタグをコピー"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
                    <span className="text-xs">コピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">すべてコピー</span>
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="flex flex-wrap gap-2"
            variants={container}
            initial="hidden"
            animate="show"
            role="list"
            aria-label="チャンネルタグ一覧"
          >
            {keywords.map((keyword, index) => (
              <motion.div
                key={index}
                variants={item}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                role="listitem"
              >
                <Badge
                  variant="secondary"
                  className={cn(
                    "cursor-default transition-all duration-300 hover:scale-105",
                    getTagSize(index),
                    getTagColor(index)
                  )}
                >
                  {keyword}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
          
        </CardContent>
      </Card>
    </motion.div>
  )
} 