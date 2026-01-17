"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { MainNav } from "./main-nav"

export function Header() {
  const iconSrc = "/assets/branding/icon.png"

  return (
    <header className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-3 group hover-scale"
          >
            <div className="relative h-8 w-8 brand-shadow rounded-lg overflow-hidden">
              <Image 
                src={iconSrc}
                alt="つべナビ" 
                width={32} 
                height={32}
                className="hover-bright"
              />
            </div>
            <span className="text-xl font-montserrat font-bold text-primary">
              つべナビ
            </span>
          </Link>
          
          <MainNav />
        </div>
        
        <nav className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="outline" size="sm" asChild className="font-poppins">
            <Link href="/dashboard">ダッシュボード</Link>
          </Button>
          <Button size="sm" asChild className="bg-primary hover:bg-primary/90 font-poppins">
            <Link href="/logout">ログアウト</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
