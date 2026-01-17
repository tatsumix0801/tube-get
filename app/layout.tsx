import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"
import { AppLayout } from "@/components/app-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "つべナビ | YouTube動画分析ツール",
  description: "YouTubeチャンネルおよび動画の分析・インサイト・最適化ツール",
  generator: 'v0.dev',
  // icons: {
  //   icon: [
  //     { url: "/assets/branding/icon.png", type: "image/png" },
  //   ],
  //   apple: [
  //     { url: "/assets/branding/icon.png", type: "image/png" },
  //   ],
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* キャッシュを無効化するメタタグ */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
          {/* キャッシュクリアスクリプト */}
          <Script src="/no-cache.js" strategy="beforeInteractive" />
        </ThemeProvider>
      </body>
    </html>
  )
}
