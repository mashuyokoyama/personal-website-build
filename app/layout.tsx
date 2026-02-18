import React from "react"
import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { GateProvider } from '@/components/gate-context'
import { AppWithGate } from '@/components/app-with-gate'
import ListenAudio from '@/components/ListenAudio'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], variable: "--font-noto-sans-jp" })

export const metadata: Metadata = {
  title: 'mashsroom',
  description: 'Mashu Yokoyama',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansJP.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* Next.js 16 + Turbopack の performance.measure 負のタイムスタンプエラーを抑制 (issue #86060) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=window.performance;if(!p||typeof p.measure!=="function"||p.__patched)return;var o=p.measure.bind(p);p.measure=function(){try{return o.apply(p,arguments)}catch(e){if((e&&e.message||"").indexOf("negative time stamp")!==-1||e&&e.name==="InvalidAccessError")return;throw e}};p.__patched=true}catch(_){}})();`,
          }}
        />
        <ThemeProvider>
          <GateProvider>
            <AppWithGate>{children}</AppWithGate>
            <ListenAudio />
          </GateProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
