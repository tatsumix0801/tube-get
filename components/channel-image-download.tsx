"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function ChannelImageDownload() {
  const router = useRouter()
  
  useEffect(() => {
    console.warn("ChannelImageDownload is deprecated. Use ProfileActions component instead.")
  }, [])
  
  return null
} 