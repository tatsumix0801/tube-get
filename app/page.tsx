"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const [iconUrl, setIconUrl] = useState("/assets/branding/icon-top.png")

  // 認証済みの場合はダッシュボードへリダイレクト
  useEffect(() => {
    // ミドルウェアで処理されるため、クライアントサイドでの追加チェックは不要
    setIconUrl(`/assets/branding/icon-top.png?v=${new Date().getTime()}`)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // シンプルなJSONデータとしてパスワードを送信
      const payload = { password }

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // クレデンシャルを含める（Cookieの送受信に必要）
        credentials: "include",
      })

      // レスポンスをJSONとして解析
      const data = await response.json().catch(() => ({ 
        success: false, 
        message: "レスポンスの解析に失敗しました" 
      }))

      // レスポンスのステータスコードをチェック
      if (!response.ok) {
        throw new Error(data.message || `エラーが発生しました (${response.status})`)
      }

      if (data.success) {
        toast({
          title: "ログイン成功",
          description: "ダッシュボードにリダイレクトします",
        })
        // 強制的にページをリロードしてミドルウェアを通す
        window.location.href = "/dashboard"
      } else {
        setError(data.message || "パスワードが正しくありません")
        toast({
          title: "ログイン失敗",
          description: data.message || "パスワードが正しくありません",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      const errorMessage = error instanceof Error ? error.message : "ログイン処理中にエラーが発生しました"
      setError(errorMessage)
      toast({
        title: "エラー",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-4">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/10 via-transparent to-brand-blue/10 pointer-events-none"></div>

      <div className="w-full max-w-md relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-brand-pink to-brand-blue rounded-full blur-3xl opacity-20"></div>

        <Card className="w-full backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border-0 shadow-[0_0_1rem_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink to-brand-blue"></div>
          <CardHeader className="space-y-1 flex flex-col items-center pt-8">
            <div className="flex items-center gap-2 mb-6 bg-gradient-to-r from-brand-pink to-brand-blue p-4 rounded-xl shadow-lg">
              <div className="relative h-16 w-16 brand-shadow rounded-xl overflow-hidden">
                <Image 
                  src={iconUrl}
                  alt="つべナビ" 
                  width={64} 
                  height={64}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-brand-pink to-brand-blue text-transparent bg-clip-text font-montserrat">
              つべナビ
            </CardTitle>
            <CardDescription className="text-center font-inter">YouTubeチャンネル分析ツールへようこそ</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="パスワードを入力"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 focus:border-brand-pink focus:ring focus:ring-brand-pink/20 transition-all font-inter"
                  required
                />
                {error && <p className="text-sm text-red-500 font-medium font-inter">{error}</p>}
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-lg font-medium bg-gradient-to-r from-brand-pink to-brand-blue hover:from-brand-pink/90 hover:to-brand-blue/90 transition-all duration-300 shadow-md hover:shadow-lg font-poppins"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                    ログイン中...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    ログイン
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <p className="mt-8 text-sm text-muted-foreground font-inter">© 2025 つべナビ</p>
    </div>
  )
}
