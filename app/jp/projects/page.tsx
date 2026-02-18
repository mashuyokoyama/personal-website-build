"use client"

import { PageLayout } from "@/components/page-layout"
import { ListPageContent } from "@/components/list-page-content"
import { ContactSection } from "@/components/contact-section"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { projects } from "@/lib/data"

export default function JpProjectsPage() {
  const isMobile = useIsMobile()
  return (
    <PageLayout lang="jp">
      <ListPageContent
        items={projects}
        basePath="/jp/projects"
        lang="jp"
        isMobile={isMobile}
        listVariant="projects"
        footer={<ContactSection lang="jp" variant="below-list" />}
      />
    </PageLayout>
  )
}

