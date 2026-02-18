"use client"

import { PageLayout } from "@/components/page-layout"
import { TopIntro } from "@/components/top-intro"
import { ContactSection } from "@/components/contact-section"

export default function EnglishTopPage() {
  return (
    <TopIntro>
      <PageLayout lang="en" showNav={true}>
        <section className="min-h-[100dvh] flex flex-col" aria-label="First view">
          <div className="py-24" aria-hidden />
        </section>
        <ContactSection lang="en" />
      </PageLayout>
    </TopIntro>
  )
}
