"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

export default function StyleGuidePage() {
  const [iconSrc, setIconSrc] = useState("/assets/branding/icon.png")
  const [faviconSrc, setFaviconSrc] = useState("/favicon.png")
  const [ogpSrc, setOgpSrc] = useState("/assets/branding/ogp.svg")

  useEffect(() => {
    setIconSrc(`/assets/branding/icon.png?v=${Date.now()}`)
    setFaviconSrc(`/favicon.png?v=${Date.now()}`)
    setOgpSrc(`/assets/branding/ogp.svg?v=${Date.now()}`)
  }, [])

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-montserrat font-bold text-primary mb-2">TubeVision スタイルガイド</h1>
          <p className="text-muted-foreground">ブランディング要素とUIコンポーネントのガイド</p>
        </div>
        
        <Tabs defaultValue="branding">
          <TabsList className="w-full md:w-auto mb-6">
            <TabsTrigger value="branding">ブランディング</TabsTrigger>
            <TabsTrigger value="typography">タイポグラフィ</TabsTrigger>
            <TabsTrigger value="colors">カラー</TabsTrigger>
            <TabsTrigger value="components">コンポーネント</TabsTrigger>
          </TabsList>
          
          {/* ブランディングタブ */}
          <TabsContent value="branding" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>ロゴ</CardTitle>
                <CardDescription>TubeVisionの公式ロゴと使用例</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-xl">
                    <div className="p-4">
                      <Image 
                        src="/assets/branding/logo.svg" 
                        alt="TubeVision ロゴ" 
                        width={200} 
                        height={60} 
                        className="mb-4"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">プライマリーロゴ</p>
                  </div>
                  
                  <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-xl">
                    <div className="p-4">
                      <Image 
                        src="/assets/branding/logo-alt.svg" 
                        alt="TubeVision 代替ロゴ" 
                        width={200} 
                        height={60} 
                        className="mb-4"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">代替ロゴ</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-xl">
                    <div className="p-4">
                      <Image 
                        src={iconSrc}
                        alt="TubeVision アイコン" 
                        width={80} 
                        height={80} 
                        className="mb-4"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">アイコン</p>
                  </div>
                  
                  <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-xl">
                    <div className="p-4">
                      <Image 
                        src={faviconSrc}
                        alt="TubeVision ファビコン" 
                        width={32} 
                        height={32} 
                        className="mb-4"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">ファビコン</p>
                  </div>
                  
                  <div className="flex flex-col items-center bg-slate-800 p-6 rounded-xl col-span-2">
                    <div className="p-4">
                      <Image 
                        src={iconSrc}
                        alt="TubeVision アイコン" 
                        width={60} 
                        height={60} 
                        className="mb-4"
                      />
                    </div>
                    <p className="text-sm text-slate-200">ダークバックグラウンド使用例</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>OGP画像</CardTitle>
                <CardDescription>ソーシャルメディア共有用画像</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-border rounded-xl overflow-hidden">
                  <Image 
                    src={ogpSrc}
                    alt="TubeVision OGP画像" 
                    width={600} 
                    height={315} 
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* タイポグラフィタブ */}
          <TabsContent value="typography" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>フォントファミリー</CardTitle>
                <CardDescription>TubeVisionで使用されているフォント</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-montserrat font-bold mb-2">Montserrat</h2>
                    <p className="text-muted-foreground">見出し用フォント</p>
                    <div className="flex flex-col space-y-2 mt-4">
                      <p className="font-montserrat font-bold text-2xl">見出し1 (H1) - Montserrat Bold</p>
                      <p className="font-montserrat font-semibold text-xl">見出し2 (H2) - Montserrat SemiBold</p>
                      <p className="font-montserrat font-medium text-lg">見出し3 (H3) - Montserrat Medium</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <h2 className="text-3xl font-inter font-bold mb-2">Inter</h2>
                    <p className="text-muted-foreground">本文用フォント</p>
                    <div className="flex flex-col space-y-2 mt-4">
                      <p className="font-inter text-base">本文テキスト - Inter Regular</p>
                      <p className="font-inter font-medium text-base">中見出し - Inter Medium</p>
                      <p className="font-inter text-sm">小さいテキスト - Inter Small</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <h2 className="text-3xl font-poppins font-bold mb-2">Poppins</h2>
                    <p className="text-muted-foreground">アクセント用フォント</p>
                    <div className="flex flex-col space-y-2 mt-4">
                      <p className="font-poppins font-semibold text-base">ボタンテキスト - Poppins SemiBold</p>
                      <p className="font-poppins font-bold text-base">重要テキスト - Poppins Bold</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* カラータブ */}
          <TabsContent value="colors" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>カラーパレット</CardTitle>
                <CardDescription>TubeVisionのブランドカラーとUI要素のカラー</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg bg-[#FF3366]"></div>
                    <div>
                      <p className="font-medium">プライマリー</p>
                      <p className="text-xs text-muted-foreground">#FF3366</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg bg-[#3A86FF]"></div>
                    <div>
                      <p className="font-medium">セカンダリー</p>
                      <p className="text-xs text-muted-foreground">#3A86FF</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg bg-[#FFD60A]"></div>
                    <div>
                      <p className="font-medium">アクセント</p>
                      <p className="text-xs text-muted-foreground">#FFD60A</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg bg-[#9B51E0]"></div>
                    <div>
                      <p className="font-medium">グラフ - 紫</p>
                      <p className="text-xs text-muted-foreground">#9B51E0</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-20 rounded-lg bg-[#0CC08E]"></div>
                    <div>
                      <p className="font-medium">グラフ - ターコイズ</p>
                      <p className="text-xs text-muted-foreground">#0CC08E</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-6 bg-gradient-to-r from-[#FF3366] to-[#3A86FF] rounded-lg flex items-center justify-center">
                    <p className="text-white font-semibold">プライマリーグラデーション</p>
                  </div>
                  
                  <div className="p-6 brand-gradient rounded-lg flex items-center justify-center">
                    <p className="text-white font-semibold">brand-gradient クラス</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* コンポーネントタブ */}
          <TabsContent value="components" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>ボタン</CardTitle>
                <CardDescription>ボタンスタイルとバリエーション</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button size="sm">小ボタン</Button>
                  <Button>通常ボタン</Button>
                  <Button size="lg">大ボタン</Button>
                  <Button variant="secondary">セカンダリー</Button>
                  <Button variant="outline">アウトライン</Button>
                  <Button variant="ghost">ゴースト</Button>
                  <Button variant="destructive">危険</Button>
                  <Button disabled>無効</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>アニメーション効果</CardTitle>
                <CardDescription>UIアニメーションのサンプル</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-16 w-16 bg-primary rounded-full hover-scale"></div>
                    <p className="text-sm text-muted-foreground">hover-scale</p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-16 w-16 bg-secondary rounded-full hover-bright"></div>
                    <p className="text-sm text-muted-foreground">hover-bright</p>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-2">
                    <div className="h-16 w-16 bg-accent rounded-full animate-pulse-gentle"></div>
                    <p className="text-sm text-muted-foreground">animate-pulse-gentle</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <div className="h-20 w-20 bg-primary rounded-full animate-float"></div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 