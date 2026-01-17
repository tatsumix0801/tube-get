"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // APIを使った認証
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        credentials: "include",
      })

      // レスポンスのステータスコードをチェック
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      // レスポンスをJSONとして解析
      const data = await response.json()

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
      setError(error instanceof Error ? error.message : "ログイン処理中にエラーが発生しました")
      toast({
        title: "エラー",
        description: error instanceof Error ? error.message : "ログイン処理中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
