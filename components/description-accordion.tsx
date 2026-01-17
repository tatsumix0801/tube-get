"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface DescriptionAccordionProps {
  text: string
  maxLines?: number
  maxHeight?: number
  maxPreviewLength?: number
  buttonClassName?: string
  textClassName?: string
  containerClassName?: string
}

export function DescriptionAccordion({ 
  text, 
  // maxLines = 2, // 使わないのでコメントアウト
  // maxHeight, // 使わないのでコメントアウト
  // maxPreviewLength = 150, // 使わないのでコメントアウト
  // buttonClassName = "", // ボタン消すので不要
  textClassName = "",
  containerClassName = ""
}: DescriptionAccordionProps) {
  // const [isExpanded, setIsExpanded] = useState(false) // ボタンと一緒に消す
  
  if (!text) return null

  // // If no truncation (maxHeight or maxLines) is specified AND the text is shorter than the preview length,
  // // display the entire text directly without a "read more" button.
  // if (!maxHeight && !maxLines && text.length <= maxPreviewLength) { // この条件分岐も不要になる
  //   return (
  //     <div className={`whitespace-pre-line ${textClassName}`}>
  //       {text}
  //     </div>
  //   )
  // }

  // 常に見えるようにする
  return (
    <div className={`relative ${containerClassName}`}>
      <div 
        className={`${textClassName} whitespace-pre-line`}
      >
        {text}
      </div>
      
      {/* {!isExpanded && ( // グラデーションも消す
        <div className="bg-gradient-to-b from-transparent to-white dark:to-gray-900 absolute bottom-0 left-0 right-0 h-8 pointer-events-none"></div>
      )} */}
      
      {/* <div className="relative z-10 mt-1"> // ボタンのブロック全体を消す
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`h-6 text-xs text-primary hover:text-primary/80 ${buttonClassName}`}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              折りたたむ
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              もっと読む
            </>
          )}
        </Button>
      </div> */}
    </div>
  )
} 