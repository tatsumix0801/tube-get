// YouTube API Response Types

export interface YouTubeChannel {
  id: string
  snippet?: {
    title: string
    description: string
    customUrl?: string
    publishedAt: string
    thumbnails: {
      default?: { url: string; width?: number; height?: number }
      medium?: { url: string; width?: number; height?: number }
      high?: { url: string; width?: number; height?: number }
    }
    defaultLanguage?: string
    country?: string
  }
  statistics?: {
    viewCount: string
    subscriberCount: string
    hiddenSubscriberCount: boolean
    videoCount: string
  }
  contentDetails?: {
    relatedPlaylists?: {
      uploads?: string
      likes?: string
    }
  }
  brandingSettings?: {
    channel?: {
      title?: string
      description?: string
      keywords?: string
      country?: string
    }
    image?: {
      bannerExternalUrl?: string
    }
  }
  topicDetails?: {
    topicCategories?: string[]
  }
}

export interface YouTubePlaylistItem {
  id?: string
  snippet?: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default?: { url: string; width?: number; height?: number }
      medium?: { url: string; width?: number; height?: number }
      high?: { url: string; width?: number; height?: number }
    }
    channelTitle: string
    playlistId: string
    position: number
    resourceId: {
      kind: string
      videoId: string
    }
  }
}

export interface YouTubeVideo {
  id: string
  snippet?: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default?: { url: string; width?: number; height?: number }
      medium?: { url: string; width?: number; height?: number }
      high?: { url: string; width?: number; height?: number }
    }
    channelTitle: string
    tags?: string[]
    categoryId?: string
    defaultLanguage?: string
  }
  contentDetails?: {
    duration: string
    dimension?: string
    definition?: string
    caption?: string
    licensedContent?: boolean
  }
  statistics?: {
    viewCount?: string
    likeCount?: string
    dislikeCount?: string
    favoriteCount?: string
    commentCount?: string
  }
  status?: {
    uploadStatus?: string
    privacyStatus?: string
    license?: string
    embeddable?: boolean
    publicStatsViewable?: boolean
  }
  topicDetails?: {
    relevantTopicIds?: string[]
    topicCategories?: string[]
  }
}

export interface YouTubeApiResponse<T> {
  kind: string
  etag: string
  nextPageToken?: string
  prevPageToken?: string
  pageInfo?: {
    totalResults: number
    resultsPerPage: number
  }
  items: T[]
  error?: {
    code: number
    message: string
    errors: Array<{
      message: string
      domain: string
      reason: string
    }>
  }
}

export interface FormattedVideo {
  id: string
  title: string
  description: string
  publishedAt: string
  thumbnail: string
  duration: string
  viewCount: string
  likeCount: string
  commentCount: string
  spreadRate: number
  url: string
  tags: string[]
  topics: string[]
}

export interface ChannelInfo {
  id: string
  title: string
  description: string
  customUrl: string
  publishedAt: string
  thumbnail: string
  banner: string
  viewCount: string
  subscriberCount: string
  videoCount: string
  keywords: string[]
  topics: string[]
}

export interface ChannelStats {
  totalViews: number
  totalLikes: number
  totalComments: number
  avgViews: number
  avgLikes: number
  avgComments: number
  avgSpreadRate: number
  mostViewedVideo: FormattedVideo | null
  mostLikedVideo: FormattedVideo | null
}