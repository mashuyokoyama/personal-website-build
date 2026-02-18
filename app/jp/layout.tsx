import React from "react"
import type { Metadata } from "next"
import { PageTransitionProvider } from "@/components/page-transition-context"
import { FVReturnWrapper } from "@/components/fv-return-button"
import { TopNav } from "@/components/top-nav"

export const metadata: Metadata = {
  title: "Mashu Yokoyama",
  description: "横山真洲",
}

export default function JapaneseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PageTransitionProvider>
      <FVReturnWrapper lang="jp" nav={<TopNav lang="jp" />}>
        {children}
      </FVReturnWrapper>
    </PageTransitionProvider>
  )
}
