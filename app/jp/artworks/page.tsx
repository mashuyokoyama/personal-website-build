"use client"

import { PageLayout } from "@/components/page-layout"
import { ListPageContent } from "@/components/list-page-content"
import { ContactSection } from "@/components/contact-section"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { artworks } from "@/lib/data"

export default function JpArtworksPage() {
  const isMobile = useIsMobile()
  return (
    <PageLayout lang="jp">
      <ListPageContent
        items={artworks}
        basePath="/jp/artworks"
        lang="jp"
        isMobile={isMobile}
        listVariant="artworks"
        footer={<ContactSection lang="jp" variant="below-list" />}
      />
    </PageLayout>
  )
}
