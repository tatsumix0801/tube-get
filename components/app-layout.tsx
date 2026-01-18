"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { FaviconManager } from "@/components/favicon-manager"
import { SkipLink } from "@/components/skip-link"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/"
  
  return (
    <div className="min-h-screen flex flex-col dark:sf-grid-bg">
      <SkipLink />
      {/* ログインページ以外でヘッダーを表示 */}
      {!isLoginPage && <Header />}

      <main id="main-content" className="flex-1">
        <FaviconManager />
        {children}
      </main>
      
      {/* ログインページ以外でフッターを表示 */}
      {!isLoginPage && (
        <footer className="bg-background border-t border-border py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} TubeVision. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  )
} 