import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'よくある質問 (FAQ) | つべナビ',
  description: 'つべナビの利用に関するよくある質問と回答をまとめています。'
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 