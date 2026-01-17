"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { MainNav } from "./main-nav"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

export function Header() {
  const { toast } = useToast()
  const [iconSrc, setIconSrc] = useState("/assets/branding/icon.png")

  useEffect(() => {
    // setIconSrc(`/assets/branding/icon.png?v=${new Date().getTime()}`)
  }, [])

  const handleLogout = async () => {
    try {
      // セッションストレージをクリア
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
        // ローカルストレージからセンシティブな情報をクリア
        localStorage.removeItem("youtube_api_key")
        localStorage.removeItem("channelData")
        localStorage.removeItem("videoData")
        localStorage.removeItem("analyticsData")
      }

      // トースト表示
      toast({
        title: "ログアウト中...",
        description: "ログアウト処理を実行しています",
        duration: 2000,
      })

      // ログアウトAPIを呼び出す
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Cookieを含める
      })

      // APIのレスポンスを待たずに直接リダイレクト
      // 完全なページリロードを強制してチャンクロードエラーを防止
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "エラー",
        description: "ログアウト処理中にエラーが発生しました",
        variant: "destructive",
      })
      
      // エラー時も同様に完全リロード
      window.location.href = "/"
    }
  }

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-3 group hover-scale"
          >
            <div className="relative h-8 w-8 brand-shadow rounded-lg overflow-hidden">
              <Image 
                src={iconSrc}
                alt="つべナビ" 
                width={32} 
                height={32}
                className="hover-bright"
              />
            </div>
            <span className="text-xl font-montserrat font-bold text-primary">
              つべナビ
            </span>
          </Link>
          
          <MainNav />
        </div>
        
        <nav className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="outline" size="sm" asChild className="font-poppins">
            <Link href="/dashboard">ダッシュボード</Link>
          </Button>
          <Button size="sm" asChild className="bg-primary hover:bg-primary/90 font-poppins">
            <Link href="/logout">ログアウト</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

