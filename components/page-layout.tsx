import React from "react"
import { PageFadeContent } from "./page-transition-context"

interface PageLayoutProps {
  lang: "jp" | "en"
  children: React.ReactNode
  showNav?: boolean
}

export function PageLayout({ lang, children, showNav = true }: PageLayoutProps) {
  if (!showNav) {
    return (
      <div className="min-h-screen">
        <main className="min-h-screen px-6 md:px-12 lg:px-24">{children}</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <main className="min-h-screen px-6 md:px-12 lg:px-24">
        <PageFadeContent>{children}</PageFadeContent>
      </main>
    </div>
  )
}
