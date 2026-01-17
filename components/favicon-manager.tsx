"use client"

import { useEffect } from "react"

export function FaviconManager() {
  useEffect(() => {
    // ファビコンを設定
    const setFavicon = (faviconUrl: string) => {
      // 既存のファビコン要素を検索
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      
      // なければ新しく作成
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      
      // ファビコンURLを設定
      link.href = faviconUrl;
    };

    // PNGファビコンを設定（キャッシュ対策のタイムスタンプ付き）
    setFavicon(`/favicon.png?v=${new Date().getTime()}`);

    // コンポーネントがアンマウントされたとき
    return () => {};
  }, []);

  return null;
} 