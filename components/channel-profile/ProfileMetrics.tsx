"use client"

import { Users, PlaySquare, Eye, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChannelInfo, Video } from "@/hooks/use-channel-data"
import { motion } from "framer-motion"

interface ProfileMetricsProps {
  channelInfo: ChannelInfo
  videos: Video[]
}

export function ProfileMetrics({ channelInfo, videos }: ProfileMetricsProps) {
  // 平均高評価数の計算
  const avgLikes = videos.length > 0
    ? Math.round(
        videos.reduce(
          (sum, video) => sum + Number.parseInt(video.likeCount.replace(/,/g, ""), 10),
          0
        ) / videos.length
      )
    : 0
  
  // 表示用の数値
  const values = {
    subscribers: parseInt(channelInfo.subscriberCount.replace(/,/g, ""), 10),
    videoCount: videos.length,
    viewCount: parseInt(channelInfo.viewCount.replace(/,/g, ""), 10),
    avgLikes: avgLikes
  }
  
  // 数値のフォーマット
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // スタガーアニメーションのバリアント
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      id="channel-metrics" 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <MetricCard 
          title="登録者数" 
          value={formatNumber(values.subscribers)} 
          icon={<Users className="h-5 w-5" />}
          colors="from-white to-purple-50/50 dark:from-gray-900 dark:to-purple-900/10"
          iconColors="bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-300"
          ariaLabel={`登録者数: ${formatNumber(values.subscribers)}人`}
        />
      </motion.div>
      
      <motion.div variants={item}>
        <MetricCard 
          title="総動画数" 
          value={formatNumber(values.videoCount)} 
          icon={<PlaySquare className="h-5 w-5" />}
          colors="from-white to-indigo-50/50 dark:from-gray-900 dark:to-indigo-900/10"
          iconColors="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-300"
          ariaLabel={`総動画数: ${formatNumber(values.videoCount)}本`}
        />
      </motion.div>
      
      <motion.div variants={item}>
        <MetricCard 
          title="総再生回数" 
          value={formatNumber(values.viewCount)} 
          icon={<Eye className="h-5 w-5" />}
          colors="from-white to-blue-50/50 dark:from-gray-900 dark:to-blue-900/10"
          iconColors="bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-300"
          ariaLabel={`総再生回数: ${formatNumber(values.viewCount)}回`}
        />
      </motion.div>
      
      <motion.div variants={item}>
        <MetricCard 
          title="平均高評価数" 
          value={formatNumber(values.avgLikes)} 
          icon={<ThumbsUp className="h-5 w-5" />}
          colors="from-white to-teal-50/50 dark:from-gray-900 dark:to-teal-900/10"
          iconColors="bg-teal-100 dark:bg-teal-900/30 text-teal-500 dark:text-teal-300"
          ariaLabel={`平均高評価数: ${formatNumber(values.avgLikes)}回`}
        />
      </motion.div>
    </motion.div>
  )
}

// 個別のメトリックカードコンポーネント
interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  colors: string
  iconColors: string
  ariaLabel: string
}

function MetricCard({ title, value, icon, colors, iconColors, ariaLabel }: MetricCardProps) {
  return (
    <Card 
      className={`border-0 shadow-lg bg-gradient-to-br ${colors} overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
      aria-label={ariaLabel}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${iconColors} mr-3`} aria-hidden="true">
            {icon}
          </div>
          <span className="text-3xl font-bold">
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  )
} 