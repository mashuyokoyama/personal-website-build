"use client"

import { PageLayout } from "@/components/page-layout"
import { ListPageContent } from "@/components/list-page-content"
import { ContactSection } from "@/components/contact-section"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { projects } from "@/lib/data"

export default function EnProjectsPage() {
  const isMobile = useIsMobile()
  return (
    <PageLayout lang="en">
      <ListPageContent
        items={projects}
        basePath="/en/projects"
        lang="en"
        isMobile={isMobile}
        listVariant="projects"
        footer={<ContactSection lang="en" variant="below-list" />}
      />
    </PageLayout>
  )
}

