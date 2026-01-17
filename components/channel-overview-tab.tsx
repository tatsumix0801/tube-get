"use client"

import { useMemo, memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChannelInfo, Video } from "@/hooks/use-channel-data"
import { ProfileHeader } from "@/components/channel-profile/ProfileHeader"
import { ProfileMetrics } from "@/components/channel-profile/ProfileMetrics"
import { ProfileActions } from "@/components/channel-profile/ProfileActions"
import { DetailsDescription } from "@/components/channel-details/DetailsDescription"
import { DetailsTagCloud } from "@/components/channel-details/DetailsTagCloud"
import { DetailsStats } from "@/components/channel-details/DetailsStats"

interface ChannelOverviewTabProps {
  channelInfo: ChannelInfo
  videos: Video[]
}

// メモ化したコンポーネント
const MemoizedProfileHeader = memo(ProfileHeader)
const MemoizedProfileMetrics = memo(ProfileMetrics)
const MemoizedProfileActions = memo(ProfileActions)
const MemoizedDetailsDescription = memo(DetailsDescription)
const MemoizedDetailsTagCloud = memo(DetailsTagCloud)
const MemoizedDetailsStats = memo(DetailsStats)

export function ChannelOverviewTab({ channelInfo, videos }: ChannelOverviewTabProps) {
  // API キーを取得
  const apiKey = useMemo(() => sessionStorage.getItem("youtube_api_key") || "", [])

  // Reactの開発モードでメモ化のデバッグ用
  if (process.env.NODE_ENV === 'development') {
    console.log('ChannelOverviewTab rendered', {
      channelId: channelInfo.id,
      videosCount: videos.length
    })
  }

  return (
    <div className="space-y-6">
      {/* プロフィールセクション */}
      <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
            チャンネル情報
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* プロフィールヘッダー */}
          <MemoizedProfileHeader channelInfo={channelInfo} />
          
          {/* チャンネル素材ダウンロードセクション - 詳細情報の前に配置 */}
          <div className="mt-4">
            <MemoizedProfileActions 
              channelId={channelInfo.id} 
              apiKey={apiKey}
            />
          </div>
          
          {/* チャンネル説明セクション */}
          <MemoizedDetailsDescription 
            description={channelInfo.description} 
            maxLength={300} 
            className="mt-4"
          />
          
          {/* チャンネルタグセクション - チャンネル説明の下に配置 */}
          {channelInfo.keywords && channelInfo.keywords.length > 0 && (
            <div className="mt-4">
              <h3 className="text-base font-semibold mb-2">チャンネルタグ</h3>
              <MemoizedDetailsTagCloud 
                keywords={channelInfo.keywords} 
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* メトリクスセクション */}
      <MemoizedProfileMetrics channelInfo={channelInfo} videos={videos} />
      
      {/* 統計情報セクション */}
      <MemoizedDetailsStats videos={videos} />
    </div>
  )
} 