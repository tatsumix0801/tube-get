"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Save, Key } from "lucide-react"

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 保存済みのAPI Keyがあれば取得
  useEffect(() => {
    // ローカルストレージからAPI Keyを取得
    const savedApiKey = localStorage.getItem("youtube_api_key")
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // API Keyのバリデーション
    if (!apiKey || apiKey.length < 10) {
      toast({
        title: "エラー",
        description: "有効なAPI Keyを入力してください",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/youtube/apikey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey }),
      })

      const data = await response.json()

      if (!data.success) {
        toast({
          title: "エラー",
          description: data.message || "API Keyの保存に失敗しました",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // API検証が成功したらローカルストレージに保存
      localStorage.setItem("youtube_api_key", data.apiKey)
      
      toast({
        title: "設定を保存しました",
        description: "YouTube Data API Keyが正常に保存されました",
      })
    } catch (error) {
      console.error("API Key save error:", error)
      toast({
        title: "エラー",
        description: "API Keyの保存中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
          設定
        </h1>
        <p className="text-muted-foreground">アプリケーションの設定を管理します</p>
      </div>

      <div className="relative max-w-2xl">
        <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 blur"></div>
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm overflow-hidden">
          <form onSubmit={handleSaveApiKey}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-300">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">YouTube Data API Key</CardTitle>
                  <CardDescription>
                    YouTube Data APIを使用するためのAPIキーを設定します。
                    <a
                      href="https://www.canva.com/design/DAGbkeCZFrM/ruembgqVMl4gXwpbdNLJfA/view?utm_content=DAGbkeCZFrM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h338a14344d"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      APIキーの取得方法
                    </a>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="text-sm font-medium">
                    API Key
                  </Label>
                  <div className="flex">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1 h-12 px-4 rounded-lg border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-500/20 transition-all"
                      placeholder="YouTube Data API Keyを入力"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="ml-2 h-12 w-12 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    注意: API
                    Keyは安全に保管してください。このアプリケーションではサーバーサイドのCookieに保存されます。
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-6 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    保存中...
                  </div>
                ) : (
                  <>
                    保存
                    <Save className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
