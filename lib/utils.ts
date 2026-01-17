import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Video } from "@/hooks/use-channel-data"

/**
 * クラス名を結合するユーティリティ関数
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 注：formatNumber関数はlib/format-utils.tsに移動しました

/**
 * 「良いチャンネル」を判定するヘルパー関数
 * 直近1ヶ月以内の動画で拡散率100%以上のものが1本でもあれば true を返す
 */
export function isGoodChannel(videos: Video[]): boolean {
  if (!videos || videos.length === 0) return false;
  
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  return videos.some(video => {
    const publishedAt = new Date(video.publishedAt);
    return publishedAt >= oneMonthAgo && video.spreadRate >= 100;
  });
}

