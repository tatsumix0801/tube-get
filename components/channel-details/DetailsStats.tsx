"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { TrendingUp, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Video } from "@/hooks/use-channel-data"
import { motion } from "framer-motion"

interface DetailsStatsProps {
  videos: Video[]
  className?: string
}

export function DetailsStats({ videos, className }: DetailsStatsProps) {
  // 動画投稿頻度の計算
  const calculatePostingFrequency = () => {
    if (videos.length < 2) return "不明"
    
    // 日付でソート
    const sortedVideos = [...videos].sort((a, b) => 
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    )
    
    // 最初と最後の投稿の日付
    const firstVideo = new Date(sortedVideos[0].publishedAt)
    const lastVideo = new Date(sortedVideos[sortedVideos.length - 1].publishedAt)
    
    // 全期間の日数
    const totalDays = (lastVideo.getTime() - firstVideo.getTime()) / (1000 * 60 * 60 * 24)
    
    // 平均投稿間隔（日）
    const averageInterval = totalDays / (videos.length - 1)
    
    if (averageInterval < 1) return `${Math.round(averageInterval * 24)}時間毎`
    if (averageInterval < 7) return `${Math.round(averageInterval)}日毎`
    if (averageInterval < 30) return `${Math.round(averageInterval / 7)}週間毎`
    return `${Math.round(averageInterval / 30)}ヶ月毎`
  }
  
  // 平均動画尺の計算関数を追加
  const calculateAverageDuration = () => {
    if (videos.length === 0) return "0:00"
    
    // 各動画の時間を秒数に変換して合計する
    const totalSeconds = videos.reduce((sum, video) => {
      const durationParts = video.duration.split(':')
      let seconds = 0
      
      // HH:MM:SS 形式
      if (durationParts.length === 3) {
        seconds = parseInt(durationParts[0]) * 3600 + parseInt(durationParts[1]) * 60 + parseInt(durationParts[2])
      }
      // MM:SS 形式
      else if (durationParts.length === 2) {
        seconds = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1])
      }
      // SS 形式（ほぼないと思いますが）
      else if (durationParts.length === 1) {
        seconds = parseInt(durationParts[0])
      }
      
      return sum + seconds
    }, 0)
    
    // 平均秒数を計算
    const avgSeconds = Math.round(totalSeconds / videos.length)
    
    // 秒数を時:分:秒の形式に変換
    const hours = Math.floor(avgSeconds / 3600)
    const minutes = Math.floor((avgSeconds % 3600) / 60)
    const seconds = avgSeconds % 60
    
    // 時間がある場合は HH:MM:SS、ない場合は MM:SS の形式で返す
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }
  
  // 月ごとの投稿数データを作成
  const getMonthlyPostsData = () => {
    const last6Months = new Array(6).fill(0).map((_, index) => {
      const date = new Date()
      date.setMonth(date.getMonth() - index)
      return {
        month: date.toLocaleString('ja-JP', { month: 'short' }),
        timestamp: date.getTime(),
        count: 0
      }
    }).reverse()
    
    // 各動画の投稿月をカウント
    videos.forEach(video => {
      const videoDate = new Date(video.publishedAt)
      
      // 過去6ヶ月以内の動画のみカウント
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      
      if (videoDate >= sixMonthsAgo) {
        const monthIndex = last6Months.findIndex(item => {
          const itemDate = new Date(item.timestamp)
          return itemDate.getMonth() === videoDate.getMonth() && 
                 itemDate.getFullYear() === videoDate.getFullYear()
        })
        
        if (monthIndex !== -1) {
          last6Months[monthIndex].count++
        }
      }
    })
    
    return last6Months
  }
  
  // 視聴回数分布の計算
  const getViewDistribution = () => {
    if (videos.length === 0) return []
    
    // 視聴回数をカテゴリに分類
    const categories = [
      { name: '~1K', max: 1000, count: 0 },
      { name: '~5K', max: 5000, count: 0 },
      { name: '~1万', max: 10000, count: 0 },
      { name: '~5万', max: 50000, count: 0 },
      { name: '5万~', max: Infinity, count: 0 }
    ]
    
    videos.forEach(video => {
      const views = parseInt(video.viewCount.replace(/,/g, ""), 10) || 0
      
      for (const category of categories) {
        if (views <= category.max) {
          category.count++
          break
        }
      }
    })
    
    return categories
  }
  
  const postingFrequency = calculatePostingFrequency()
  // 平均エンゲージメント率を平均動画尺に変更
  const averageDuration = calculateAverageDuration()
  const monthlyPostsData = getMonthlyPostsData()
  const viewDistribution = getViewDistribution()
  
  const barColors = ['#c084fc', '#818cf8', '#60a5fa', '#7dd3fc', '#a5b4fc']
  const chartBarColor = '#8b5cf6'

  // アニメーションバリアント
  const container = {
    hidden: { opacity: 1 },
    show: { opacity: 1 }
  }
  
  const item = {
    hidden: { opacity: 1 },
    show: { opacity: 1 }
  }

  return (
    <motion.div 
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}
      variants={container}
      initial="show"
      animate="show"
    >
      {/* 投稿頻度と傾向 */}
      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-purple-500" />
              投稿分析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">平均投稿頻度</p>
                <p className="text-2xl font-semibold">{postingFrequency}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">平均動画尺</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold">{averageDuration}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">各月の投稿数</p>
              </div>
              
              <div className="h-40 relative" aria-label={`月別投稿数グラフ: 過去6ヶ月間の投稿数推移`}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPostsData}>
                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis hide={true} />
                    <Tooltip 
                      formatter={(value) => [`${value}本`, "投稿数"]}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        padding: '8px',
                        fontSize: '12px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill={chartBarColor} 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 視聴回数分布 */}
      <motion.div variants={item}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              視聴回数分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-52 relative" aria-label={`視聴回数分布グラフ: 視聴回数ごとの動画本数`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewDistribution} layout="vertical">
                  <XAxis type="number" hide={true} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}本`, "動画数"]}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      padding: '8px',
                      fontSize: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Bar 
                    dataKey="count" 
                    radius={[0, 4, 4, 0]}
                  >
                    {viewDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-5 gap-1 mt-2">
              {viewDistribution.map((category, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-3 h-3 rounded mx-auto mb-1" 
                    style={{ backgroundColor: barColors[index % barColors.length] }}
                  />
                  <p className="text-xs text-muted-foreground">{category.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
} 