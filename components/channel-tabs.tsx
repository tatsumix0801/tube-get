"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChannelInfo, Video } from "@/hooks/use-channel-data"
import { ChannelOverviewTab } from "./channel-overview-tab"
import { VideoAnalysisTab } from "./video-analysis-tab"
import { cn } from "@/lib/utils"

interface ChannelTabsProps {
  channelInfo: ChannelInfo
  videos: Video[]
  className?: string
}

export function ChannelTabs({ channelInfo, videos, className }: ChannelTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs
      defaultValue="overview"
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("w-full", className)}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg h-auto">
          <TabsTrigger
            value="overview"
            className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
          >
            チャンネル概要
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm"
          >
            動画分析
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="overview" className="mt-0 outline-none">
        <ChannelOverviewTab channelInfo={channelInfo} videos={videos} />
      </TabsContent>

      <TabsContent value="videos" className="mt-0 outline-none">
        <VideoAnalysisTab videos={videos} />
      </TabsContent>
    </Tabs>
  )
} 
