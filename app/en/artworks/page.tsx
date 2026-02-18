"use client"

import { PageLayout } from "@/components/page-layout"
import { ListPageContent } from "@/components/list-page-content"
import { ContactSection } from "@/components/contact-section"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { artworks } from "@/lib/data"

export default function EnArtworksPage() {
  const isMobile = useIsMobile()
  return (
    <PageLayout lang="en">
      <ListPageContent
        items={artworks}
        basePath="/en/artworks"
        lang="en"
        isMobile={isMobile}
        listVariant="artworks"
        footer={<ContactSection lang="en" variant="below-list" />}
      />
    </PageLayout>
  )
}
