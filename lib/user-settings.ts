"use client"

// ブラウザのローカルストレージに保存する設定
interface UserSettings {
  displayOptions: {
    showDuration: boolean
    showViewCount: boolean
    showSpreadRate: boolean
    showLikeCount: boolean
    showCommentCount: boolean
    showTags: boolean
    showDescription: boolean
    showThumbnails: boolean
  },
  exportOptions: {
    includeFields: string[]
    dateFormat: string
    customFilename: string
  }
}

// デフォルト設定
export const defaultSettings: UserSettings = {
  displayOptions: {
    showDuration: true,
    showViewCount: true,
    showSpreadRate: true,
    showLikeCount: true,
    showCommentCount: true,
    showTags: true,
    showDescription: true,
    showThumbnails: true,
  },
  exportOptions: {
    includeFields: ["title", "description", "publishedAt", "viewCount", "likeCount", "commentCount", "spreadRate", "duration", "url", "tags"],
    dateFormat: "yyyy-MM-dd",
    customFilename: ""
  }
}

// 設定の読み込み
export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') {
    return defaultSettings
  }
  
  try {
    const savedSettings = localStorage.getItem('user_settings')
    if (!savedSettings) {
      return defaultSettings
    }
    
    const parsedSettings = JSON.parse(savedSettings) as UserSettings
    
    // バージョンアップによる新しい設定項目の追加対応
    return {
      displayOptions: {
        ...defaultSettings.displayOptions,
        ...parsedSettings.displayOptions,
      },
      exportOptions: {
        ...defaultSettings.exportOptions,
        ...parsedSettings.exportOptions,
      }
    }
  } catch (error) {
    console.error('設定の読み込みに失敗しました:', error)
    return defaultSettings
  }
}

// 設定の保存
export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem('user_settings', JSON.stringify(settings))
  } catch (error) {
    console.error('設定の保存に失敗しました:', error)
  }
}

// 表示設定項目の更新
export function updateDisplaySettings(key: keyof UserSettings['displayOptions'], value: boolean): UserSettings {
  const currentSettings = loadSettings()
  const newSettings = {
    ...currentSettings,
    displayOptions: {
      ...currentSettings.displayOptions,
      [key]: value
    }
  }
  
  saveSettings(newSettings)
  return newSettings
}

// エクスポート設定の更新
export function updateExportSettings<K extends keyof UserSettings['exportOptions']>(
  key: K, 
  value: UserSettings['exportOptions'][K]
): UserSettings {
  const currentSettings = loadSettings()
  const newSettings = {
    ...currentSettings,
    exportOptions: {
      ...currentSettings.exportOptions,
      [key]: value
    }
  }
  
  saveSettings(newSettings)
  return newSettings
} 