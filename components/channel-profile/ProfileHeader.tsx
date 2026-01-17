"use client"

import Image from "next/image"
import { ExternalLink, Calendar, Globe, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import type { ChannelInfo } from "@/hooks/use-channel-data"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogClose, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"

interface ProfileHeaderProps {
  channelInfo: ChannelInfo
}

export function ProfileHeader({ channelInfo }: ProfileHeaderProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [bannerLoaded, setBannerLoaded] = useState(false)
  const [showBannerModal, setShowBannerModal] = useState(false)
  const [showIconModal, setShowIconModal] = useState(false)
  
  // 公開日をフォーマット
  const formattedPublishedDate = channelInfo.publishedAt 
    ? new Date(channelInfo.publishedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '不明'
    
  // チャンネル年齢を計算
  const channelAge = channelInfo.publishedAt
    ? formatDistanceToNow(new Date(channelInfo.publishedAt), { locale: ja, addSuffix: true })
    : '不明'
    
  // チャンネルURLを作成
  const channelUrl = `https://www.youtube.com/channel/${channelInfo.id}`

  return (
    <div className="space-y-5">
      {/* バナー画像モーダル */}
      <Dialog open={showBannerModal} onOpenChange={setShowBannerModal}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden bg-transparent border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{channelInfo.title} バナー画像</DialogTitle>
          </DialogHeader>
          <DialogClose className="absolute z-10 p-2 rounded-full bg-black/50 text-white right-4 top-4 hover:bg-black/70">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="relative w-full max-h-[80vh] flex items-center justify-center">
            {channelInfo.banner && (
              <Image
                src={channelInfo.banner}
                alt={`${channelInfo.title} バナー（フル）`}
                width={1920}
                height={1080}
                className="max-w-full max-h-[80vh] object-contain"
                unoptimized
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* アイコン画像モーダル */}
      <Dialog open={showIconModal} onOpenChange={setShowIconModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-transparent border-none">
          <DialogHeader className="sr-only">
            <DialogTitle>{channelInfo.title} アイコン画像</DialogTitle>
          </DialogHeader>
          <DialogClose className="absolute z-10 p-2 rounded-full bg-black/50 text-white right-4 top-4 hover:bg-black/70">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <div className="relative w-full flex items-center justify-center">
            <Image
              src={channelInfo.thumbnails.high?.url || channelInfo.thumbnails.default.url}
              alt={`${channelInfo.title} アイコン（フル）`}
              width={800}
              height={800}
              className="max-w-full max-h-[80vh] object-contain"
              unoptimized
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* バナー画像 */}
      {channelInfo.banner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer"
          onClick={() => channelInfo.banner && setShowBannerModal(true)}
        >
          <div className="relative w-full h-[120px]">
            <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse ${bannerLoaded ? 'hidden' : 'flex'}`}>
              <span className="sr-only">バナー画像読み込み中...</span>
            </div>
            <Image
              src={channelInfo.banner}
              alt={`${channelInfo.title} バナー`}
              width={1200}
              height={120}
              className={`w-full h-full object-cover transition-opacity duration-300 ${bannerLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setBannerLoaded(true)}
              unoptimized
            />
          </div>
        </motion.div>
      )}

      {/* チャンネル基本情報 */}
      <div className="flex flex-col gap-5">
        {/* プロフィール基本情報 */}
        <div className="flex items-center gap-4">
          {/* チャンネルアイコン */}
          {channelInfo.thumbnails && channelInfo.thumbnails.default && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative flex-shrink-0 w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm cursor-pointer"
              onClick={() => setShowIconModal(true)}
            >
              <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse ${imageLoaded ? 'hidden' : 'flex'}`}>
                <span className="sr-only">画像読み込み中...</span>
              </div>
              <Image
                src={channelInfo.thumbnails.default.url}
                alt={`${channelInfo.title} アイコン`}
                width={80}
                height={80}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                unoptimized
              />
            </motion.div>
          )}
          
          {/* チャンネル名とカスタムURL */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex-grow"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50">
              {channelInfo.title}
            </h1>
            <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
              {channelInfo.customUrl}
            </p>
          </motion.div>
          
          {/* YouTubeボタン */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600" 
              onClick={() => window.open(channelUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2 text-purple-500" />
              YouTubeで開く
            </Button>
          </motion.div>
        </div>
        
        {/* チャンネル詳細情報 */}
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
          <CardContent className="p-4">
            <h3 className="text-base font-medium mb-3 text-gray-700 dark:text-gray-300">チャンネル詳細情報</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 開設日情報 */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">チャンネル開設日</p>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-50">{formattedPublishedDate}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{channelAge}</p>
                </div>
              </div>
              
              {/* 国・地域情報 */}
              {channelInfo.country && (
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">国・地域</p>
                    <p className="text-base font-medium text-gray-900 dark:text-gray-50">{channelInfo.country}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 