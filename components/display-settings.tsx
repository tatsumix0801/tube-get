"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, EyeIcon, EyeOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { loadSettings, updateDisplaySettings } from "@/lib/user-settings"
import { toast } from "sonner"

interface DisplaySettingsProps {
  onChange?: () => void
}

export function DisplaySettings({ onChange }: DisplaySettingsProps) {
  // 設定状態
  const [settings, setSettings] = useState({
    showDuration: true,
    showViewCount: true,
    showSpreadRate: true,
    showLikeCount: true,
    showCommentCount: true,
    showTags: true,
    showDescription: true,
    showThumbnails: true,
  })
  const [open, setOpen] = useState(false)

  // 設定の読み込み
  useEffect(() => {
    const userSettings = loadSettings()
    setSettings(userSettings.displayOptions)
  }, [])

  // 設定の変更処理
  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    // 設定を更新して保存
    const newSettings = updateDisplaySettings(key, value)
    setSettings(newSettings.displayOptions)
    
    // 親コンポーネントに変更を通知
    if (onChange) {
      onChange()
    }
    
    // トースト通知
    toast.success("表示設定を保存しました", {
      description: "設定は自動的に保存され、次回も引き継がれます。",
      duration: 3000,
    })
  }

  // 表示オプションのリスト（表示名と設定キーのマッピング）
  const displayOptions = [
    { label: "動画の長さ", key: "showDuration" },
    { label: "再生回数", key: "showViewCount" },
    { label: "拡散率", key: "showSpreadRate" },
    { label: "高評価数", key: "showLikeCount" },
    { label: "コメント数", key: "showCommentCount" },
    { label: "タグ", key: "showTags" },
    { label: "説明欄", key: "showDescription" },
    { label: "サムネイル", key: "showThumbnails" },
  ] as const

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between"
          size="sm"
        >
          <EyeIcon className="mr-2 h-4 w-4" />
          表示設定
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="end">
        <Command>
          <CommandInput placeholder="表示設定を検索..." />
          <CommandEmpty>表示設定が見つかりません</CommandEmpty>
          <CommandGroup heading="表示する項目">
            {displayOptions.map(option => {
              const key = option.key as keyof typeof settings
              return (
                <CommandItem key={option.key} className="flex justify-between items-center cursor-default">
                  <span>{option.label}</span>
                  <Switch
                    checked={settings[key]}
                    onCheckedChange={(checked) => handleSettingChange(key, checked)}
                    className="data-[state=checked]:bg-indigo-500"
                  />
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 