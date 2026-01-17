"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HashIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface VideoTagsProps {
  tags?: string[]
  truncateAt?: number
}

export function VideoTags({ tags = [], truncateAt = 999 }: VideoTagsProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  if (!tags || tags.length === 0) {
    return null
  }

  const visibleTags = tags.slice(0, truncateAt)
  const hasMoreTags = tags.length > truncateAt

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {visibleTags.map((tag, index) => (
          <Badge
            key={`tag-${index}`}
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800"
          >
            {tag}
          </Badge>
        ))}
        
        {hasMoreTags && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] px-1.5 py-0 h-5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                +{tags.length - truncateAt}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="start">
              <div className="flex items-center mb-2">
                <HashIcon className="w-4 h-4 mr-2 text-indigo-500" />
                <h3 className="text-sm font-medium">タグ一覧</h3>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto">
                {tags.map((tag, index) => (
                  <Badge
                    key={`popover-tag-${index}`}
                    variant="outline"
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:hover:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
} 