import './globals.css'
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // ここポイント
  variable: '--font-noto-sans',
})

export const metadata: Metadata = {
  title: 'Marif',
  description: '新世代のご祝儀プラットフォーム',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSans.variable}`}>
      <body className="font-sans bg-[#f4ece4] text-[#6b3d33]">
        {children}
      </body>
    </html>
  )
}
