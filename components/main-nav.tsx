"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Home,
  Settings,
  Menu,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "ホーム",
    href: "/dashboard",
    icon: <Home className="h-4 w-4 mr-2" />,
  },
  {
    title: "チャンネル分析",
    href: "/channel",
    icon: <BarChart3 className="h-4 w-4 mr-2" />,
  },
  {
    title: "設定",
    href: "/settings",
    icon: <Settings className="h-4 w-4 mr-2" />,
  },
  {
    title: "ドキュメント",
    href: "/docs",
    icon: <BookOpen className="h-4 w-4 mr-2" />,
    children: [
      {
        title: "よくある質問",
        href: "/faq",
        description: "TubeVisionの使い方に関するFAQ",
      },
    ],
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // モバイルメニューを閉じる（画面サイズ変更時）
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* デスクトップナビゲーション */}
      <div className="mr-4 hidden md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {navItems.map((item) => {
              // 子メニューがあるかどうかチェック
              if (item.children) {
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger className={cn(
                      "font-montserrat font-medium",
                      pathname.startsWith(item.href) &&
                        "bg-primary/10 text-primary hover:bg-primary/15"
                    )}>
                      <span className="flex items-center">
                        {item.icon}
                        {item.title}
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                  pathname === child.href && "bg-accent/50"
                                )}
                              >
                                <div className="text-sm font-poppins font-medium">
                                  {child.title}
                                </div>
                                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                  {child.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }
              
              // 子メニューがない場合は通常のリンク
              return (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "font-montserrat font-medium hover-scale",
                        (pathname === item.href || pathname.startsWith(item.href + "/")) &&
                          "bg-primary/10 text-primary hover:bg-primary/15"
                      )}
                    >
                      <span className="flex items-center">
                        {item.icon}
                        {item.title}
                      </span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* モバイルナビゲーション */}
      <div className="md:hidden">
        <Collapsible 
          open={isMobileMenuOpen} 
          onOpenChange={setIsMobileMenuOpen}
          className="relative"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="メニュー"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent 
            className="absolute top-full mt-2 max-h-[80vh] overflow-y-auto 
              right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 
              w-[calc(100vw-2rem)] max-w-[280px] sm:max-w-[320px]
              rounded-md bg-white dark:bg-gray-800 shadow-lg 
              ring-1 ring-gray-200 dark:ring-gray-700 z-50"
          >
            <nav className="py-2">
              {navItems.map((item) => {
                if (item.children) {
                  return (
                    <div key={item.href} className="px-1">
                      <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.icon}
                        {item.title}
                      </div>
                      <div className="pl-5 border-l border-gray-200 dark:border-gray-700 ml-5 mt-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center px-3 py-2 text-sm rounded-md min-h-[44px] touch-manipulation",
                              pathname === child.href
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md mx-1 min-h-[44px] touch-manipulation",
                      (pathname === item.href || pathname.startsWith(item.href + "/"))
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
} 