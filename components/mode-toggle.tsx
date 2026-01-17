"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // マウント後のみテーマの切り替えを有効にする
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="rounded-full w-9 h-9" />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500 hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-slate-700 dark:text-slate-400 hover:rotate-12 transition-transform duration-300" />
      )}
      <span className="sr-only">テーマ切替</span>
    </Button>
  )
} 