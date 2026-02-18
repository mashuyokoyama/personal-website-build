import React from "react"
import type { Metadata } from "next"
import { PageTransitionProvider } from "@/components/page-transition-context"
import { FVReturnWrapper } from "@/components/fv-return-button"
import { TopNav } from "@/components/top-nav"

export const metadata: Metadata = {
  title: "Mashu Yokoyama",
  description: "Mashu Yokoyama",
}

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PageTransitionProvider>
      <FVReturnWrapper lang="en" nav={<TopNav lang="en" />}>
        {children}
      </FVReturnWrapper>
    </PageTransitionProvider>
  )
}
