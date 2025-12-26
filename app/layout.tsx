import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'お店ナレッジ - おいしかった居酒屋・お店を記録',
  description: 'おいしかった居酒屋やお店をナレッジとして登録・管理できるサイト',
  charset: 'utf-8',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

