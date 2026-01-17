"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { FileText, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface DetailsDescriptionProps {
  description: string | undefined
  maxLength?: number
  className?: string
}

export function DetailsDescription({ description, maxLength = 300, className }: DetailsDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()
  
  // 説明テキストが存在しない場合のデフォルトメッセージ
  const descriptionContent = description || "チャンネル説明はありません"
  
  // 説明テキストが設定された最大文字数を超えているかどうか
  const isLongDescription = descriptionContent.length > maxLength
  
  // 表示するテキスト（展開されていない場合は最大文字数までに制限）
  const displayText = isExpanded ? descriptionContent : descriptionContent.slice(0, maxLength)
  
  // コンポーネントのロード完了を示す
  useEffect(() => {
    // 少し遅延を入れてロード中の状態を見せる
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])
  
  // URLをリンクに変換する関数
  const linkifyText = (text: string) => {
    // URLマッチングのための正規表現
    const urlRegex = /(https?:\/\/[^\s]+)/g
    
    // テキストを分割してURLをリンクに変換
    const parts = text.split(urlRegex)
    
    return parts.map((part, index) => {
      // URLにマッチする部分はリンクに変換
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-500 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline underline-offset-2 inline-flex items-center"
          >
            {part.length > 50 ? `${part.substring(0, 50)}...` : part} 
            <ExternalLink className="h-3 w-3 ml-1 inline" />
          </a>
        )
      }
      
      return part
    })
  }
  
  // テキストのコピー機能
  const copyToClipboard = () => {
    navigator.clipboard.writeText(descriptionContent)
      .then(() => {
        setIsCopied(true)
        toast({
          title: "コピー完了",
          description: "チャンネル説明をクリップボードにコピーしました",
        })
        
        // 3秒後にコピー状態をリセット
        setTimeout(() => setIsCopied(false), 3000)
      })
      .catch((error) => {
        console.error("テキストのコピーに失敗しました:", error)
        toast({
          title: "エラー",
          description: "テキストのコピーに失敗しました",
          variant: "destructive",
        })
      })
  }
  
  // 改行をbrタグに変換
  const formattedText = displayText.split("\n").map((line, index, array) => (
    <span key={index}>
      {linkifyText(line)}
      {index < array.length - 1 && <br />}
    </span>
  ))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={cn("border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-500" />
            チャンネル説明
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLoaded ? (
            <div className="rounded-md p-3 bg-gray-50 dark:bg-gray-900/50 animate-pulse h-[150px]">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
            </div>
          ) : (
            <div className="relative">
              <div className={cn(
                "text-sm rounded-md p-3 bg-gray-50 dark:bg-gray-900/50 transition-all duration-500 ease-in-out",
                isExpanded ? "max-h-[800px] overflow-y-auto" : "max-h-[200px] overflow-hidden"
              )}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isExpanded ? "expanded" : "collapsed"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formattedText}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* 非展開時の下部グラデーション */}
              {isLongDescription && !isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
              )}
            </div>
          )}
          
          {/* アクションボタンエリア */}
          <div className="flex items-center justify-between">
            {isLoaded && isLongDescription && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                  aria-expanded={isExpanded}
                  aria-controls="description-content"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      折りたたむ
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      もっと読む
                    </>
                  )}
                </Button>
              </motion.div>
            )}
            
            {isLoaded && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-auto"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-xs text-muted-foreground hover:text-foreground"
                  disabled={isCopied}
                  aria-label="テキストをコピー"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-1 text-green-500" />
                      コピー完了
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      テキストをコピー
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 