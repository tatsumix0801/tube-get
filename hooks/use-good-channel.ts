import { useMemo } from "react";
import { Video } from "@/hooks/use-channel-data";
import { isGoodChannel } from "@/lib/utils";

/**
 * 「良いチャンネル」判定を行うカスタムフック
 * useMemoを使用して無駄な再計算を防ぐ
 */
export function useGoodChannel(videos: Video[]): boolean {
  const isGood = useMemo(() => {
    return isGoodChannel(videos);
  }, [videos]);

  return isGood;
} 