"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Menu, X, Moon, Sun, HelpCircle, Home, BarChart3, BookOpen } from "lucide-react"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const iconSrc = "/assets/branding/icon.png"

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      // セッションストレージをクリア（先に行う）
      sessionStorage.clear()

      // ローカルストレージからセンシティブな情報をクリア
      localStorage.removeItem("youtube_api_key")
      localStorage.removeItem("channelData")
      localStorage.removeItem("videoData")
      localStorage.removeItem("analyticsData")

      // トースト表示
      toast({
        title: "ログアウト中...",
        description: "ログアウト処理を実行しています",
        duration: 2000,
      })

      // リダイレクトはサーバー側で行うようになったので、単にログアウトAPIを呼び出す
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Cookieを含める
        redirect: "follow", // リダイレクトを自動的に処理
      })

      // ログアウトAPIがリダイレクトしない場合の対策として、
      // 安全のためフロントエンドでもリダイレクト処理を実行
      if (!response.redirected) {
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "エラー",
        description: "ログアウト処理中にエラーが発生しました",
        variant: "destructive",
      })
      
      // エラー時も安全のためリダイレクト
      window.location.href = "/"
    }
  }

  // モバイルメニューを閉じる（画面サイズ変更時）
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
    // テーマ変更をトーストで通知
    toast({
      title: theme === "dark" ? "ライトモードに切り替えました" : "ダークモードに切り替えました",
      description: "画面の表示モードを変更しました",
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg shadow-md">
                <Image 
                  src={iconSrc}
                  alt="つべナビ" 
                  width={40} 
                  height={40}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-brand-pink to-brand-blue text-transparent bg-clip-text font-montserrat">
                つべナビ
              </span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                pathname === "/dashboard"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <span className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                ホーム
              </span>
              <span className={`absolute -bottom-[17px] left-0 right-0 h-[3px] bg-primary transform origin-left rounded-full transition-transform duration-300 ${
                pathname === "/dashboard" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}></span>
            </Link>
            <Link
              href="/channel"
              className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                pathname === "/channel" || pathname.startsWith("/channel/")
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <span className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                チャンネル分析
              </span>
              <span className={`absolute -bottom-[17px] left-0 right-0 h-[3px] bg-primary transform origin-left rounded-full transition-transform duration-300 ${
                pathname === "/channel" || pathname.startsWith("/channel/") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}></span>
            </Link>
            <Link
              href="/settings"
              className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                pathname === "/settings"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              <span className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                設定
              </span>
              <span className={`absolute -bottom-[17px] left-0 right-0 h-[3px] bg-primary transform origin-left rounded-full transition-transform duration-300 ${
                pathname === "/settings" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}></span>
            </Link>
            
            <div className="relative group hover:text-primary">
              <button
                type="button"
                className={`text-sm font-medium transition-colors flex items-center gap-1 focus:outline-none ${
                  pathname.startsWith("/docs") || pathname === "/faq"
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
                aria-haspopup="true"
                aria-expanded="false"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                ドキュメント
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="ml-1 h-3 w-3 transition duration-200 group-hover:rotate-180"
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              <div 
                className="absolute left-0 top-full z-50 mt-2 w-48 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform"
                role="menu" 
                aria-orientation="vertical"
              >
                <div className="py-1">
                  <Link 
                    href="/faq" 
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md ${
                      pathname === "/faq" 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    role="menuitem"
                  >
                    <HelpCircle className="h-4 w-4" />
                    よくある質問
                  </Link>
                </div>
              </div>
              <span className={`absolute -bottom-[17px] left-0 right-0 h-[3px] bg-primary transform origin-left rounded-full transition-transform duration-300 ${
                pathname.startsWith("/docs") || pathname === "/faq" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}></span>
            </div>
            
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-400 hover:rotate-12 transition-transform duration-300" />
              )}
              <span className="sr-only">テーマ切替</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center ml-2"
            >
              <LogOut className="h-4 w-4 mr-2" />
              ログアウト
            </Button>
          </nav>

          {/* モバイルメニューボタン */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-400 hover:rotate-12 transition-transform duration-300" />
              )}
              <span className="sr-only">テーマ切替</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm pt-16">
          <nav className="container mx-auto px-4 py-8 flex flex-col gap-4">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 p-3 rounded-lg ${
                pathname === "/dashboard"
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              ホーム
            </Link>
            <Link
              href="/channel"
              className={`flex items-center gap-3 p-3 rounded-lg ${
                pathname === "/channel" || pathname.startsWith("/channel/")
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BarChart3 className="h-5 w-5" />
              チャンネル分析
            </Link>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
            <Link
              href="/faq"
              className={`flex items-center gap-3 p-3 rounded-lg ${
                pathname === "/faq"
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HelpCircle className="h-5 w-5" />
              よくある質問
            </Link>
            <Link
              href="/docs"
              className={`flex items-center gap-3 p-3 rounded-lg ${
                pathname === "/docs" || pathname.startsWith("/docs/")
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              ドキュメント
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-3 p-3 rounded-lg ${
                pathname === "/settings"
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="h-5 w-5" />
              設定
            </Link>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                setIsMobileMenuOpen(false)
                handleLogout()
              }}
            >
              <LogOut className="h-5 w-5" />
              ログアウト
            </Button>
          </nav>
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="relative w-6 h-6 overflow-hidden rounded-md">
              <Image 
                src={iconSrc}
                alt="つべナビ" 
                width={24} 
                height={24}
                className="hover:scale-105 transition-transform duration-300" 
                loading="lazy"
              />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-brand-pink to-brand-blue text-transparent bg-clip-text font-montserrat">
              つべナビ
            </span>
          </div>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground mb-2">
            <Link href="/docs/privacy-policy" className="hover:text-foreground transition-colors">プライバシーポリシー</Link>
            <Link href="/docs/terms-of-trade" className="hover:text-foreground transition-colors">特定商取引法に基づく表記</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 つべナビ</p>
        </div>
      </footer>
    </div>
  )
}
