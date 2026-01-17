"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, FileSpreadsheet, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { loadSettings, updateExportSettings } from "@/lib/user-settings"
import { toast } from "sonner"

interface ExportSettingsProps {
  onChange?: () => void
}

export function ExportSettings({ onChange }: ExportSettingsProps) {
  // 設定状態
  const [settings, setSettings] = useState({
    includeFields: ["title", "publishedAt", "viewCount", "likeCount", "commentCount", "spreadRate", "duration", "url"],
    dateFormat: "yyyy-MM-dd",
    customFilename: ""
  })
  const [open, setOpen] = useState(false)

  // 設定の読み込み
  useEffect(() => {
    const userSettings = loadSettings()
    setSettings(userSettings.exportOptions)
  }, [])

  // フィールド設定の変更処理
  const handleFieldToggle = (field: string) => {
    const currentFields = [...settings.includeFields]
    const index = currentFields.indexOf(field)
    
    if (index === -1) {
      // フィールドを追加
      currentFields.push(field)
    } else {
      // フィールドを削除
      currentFields.splice(index, 1)
    }
    
    const newSettings = updateExportSettings('includeFields', currentFields)
    setSettings(newSettings.exportOptions)
    
    if (onChange) {
      onChange()
    }
    
    toast.success("エクスポート設定を保存しました", {
      description: "設定は自動的に保存され、次回も引き継がれます。",
      duration: 3000,
    })
  }

  // 日付フォーマット設定の変更処理
  const handleDateFormatChange = (dateFormat: string) => {
    const newSettings = updateExportSettings('dateFormat', dateFormat)
    setSettings(newSettings.exportOptions)
    
    if (onChange) {
      onChange()
    }
  }

  // カスタムファイル名の変更処理
  const handleFilenameChange = (customFilename: string) => {
    const newSettings = updateExportSettings('customFilename', customFilename)
    setSettings(newSettings.exportOptions)
    
    if (onChange) {
      onChange()
    }
  }

  // 出力項目オプション
  const fieldOptions = [
    { label: "タイトル", value: "title" },
    { label: "説明欄", value: "description" },
    { label: "投稿日", value: "publishedAt" },
    { label: "再生回数", value: "viewCount" },
    { label: "高評価数", value: "likeCount" },
    { label: "コメント数", value: "commentCount" },
    { label: "拡散率", value: "spreadRate" },
    { label: "動画尺", value: "duration" },
    { label: "URL", value: "url" },
    { label: "タグ", value: "tags" }
  ]

  // 日付フォーマットオプション
  const dateFormatOptions = [
    { label: "YYYY-MM-DD", value: "yyyy-MM-dd" },
    { label: "MM/DD/YYYY", value: "MM/dd/yyyy" },
    { label: "DD/MM/YYYY", value: "dd/MM/yyyy" },
    { label: "YYYY年MM月DD日", value: "yyyy年MM月dd日" }
  ]

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
          <Settings className="mr-2 h-4 w-4" />
          エクスポート設定
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-4" align="end">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">出力項目選択</h3>
            <div className="grid grid-cols-2 gap-y-1">
              {fieldOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Switch
                    id={`field-${option.value}`}
                    checked={settings.includeFields.includes(option.value)}
                    onCheckedChange={() => handleFieldToggle(option.value)}
                    className="data-[state=checked]:bg-indigo-500"
                  />
                  <Label htmlFor={`field-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">日付フォーマット</h3>
            <div className="flex flex-col space-y-1">
              {dateFormatOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`date-${option.value}`}
                    name="dateFormat"
                    value={option.value}
                    checked={settings.dateFormat === option.value}
                    onChange={() => handleDateFormatChange(option.value)}
                    className="text-indigo-500 focus:ring-indigo-500"
                  />
                  <Label htmlFor={`date-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">カスタムファイル名（省略可）</h3>
            <Input
              placeholder="例: マイチャンネル分析"
              value={settings.customFilename}
              onChange={(e) => handleFilenameChange(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              空欄の場合はチャンネル名を使用します
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 