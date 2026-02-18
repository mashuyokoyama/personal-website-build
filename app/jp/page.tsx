"use client"

import { PageLayout } from "@/components/page-layout"
import { TopIntro } from "@/components/top-intro"
import { ContactSection } from "@/components/contact-section"

export default function JapaneseTopPage() {
  return (
    <TopIntro>
      <PageLayout lang="jp" showNav={true}>
        <section className="min-h-[100dvh] flex flex-col" aria-label="First view">
          <div className="py-24" aria-hidden />
        </section>
        <ContactSection lang="jp" />
      </PageLayout>
    </TopIntro>
  )
}
