'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // マウント後のみクライアントサイドのレンダリングを実行
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <NextThemesProvider {...props}>
      {/* マウント前はCSSでテーマ効果を無効化 */}
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </NextThemesProvider>
  )
}
