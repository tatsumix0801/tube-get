"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ChannelInfoForm() {
  const [channelUrl, setChannelUrl] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // ここでYouTube Data APIを使用してチャンネル情報を取得する処理を実装します
    // 現在は仮の実装としてエラーメッセージを表示します
    setError("チャンネル情報の取得に失敗しました。URLを確認してください。")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>チャンネル情報取得</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="チャンネルURL (例: https://www.youtube.com/@username)"
              value={channelUrl}
              onChange={(e) => setChannelUrl(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button type="submit">情報を取得</Button>
        </form>
      </CardContent>
    </Card>
  )
}

