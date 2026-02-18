"use client"

import { PageLayout } from "@/components/page-layout"
import { useTheme } from "@/components/theme-provider"
import { layer1, layer3 } from "@/lib/text-layers"

const COLLABORATORS = [
  "Eka Kurotaki",
  "Hinata Matsumura",
  "Kai Takegawa",
  "Kei Okazaki",
  "Ryutaro Kobayashi",
  "Sayaka Yamato",
  "Wada",
  "Yoshiki Saitoh",
]

export default function JapaneseContactPage() {
  const { theme } = useTheme()
  const contactColor = layer3(theme)
  const collaboratorColor = layer1(theme)

  return (
    <PageLayout lang="jp">
      <section className="min-h-screen flex flex-col">
        <div className="py-24" aria-hidden />

        <div className="space-y-4 md:space-y-5 lg:space-y-6">
          <p className="text-sm md:text-base tracking-wide" style={{ color: contactColor }}>
            Mashu Yokoyama
          </p>
          <p className="text-sm md:text-base tracking-wide" style={{ color: contactColor }}>
            mail at example.com
          </p>
        </div>

        <div className="flex-1" />

        <div className="space-y-2 md:space-y-3 lg:space-y-4 pb-24">
          {COLLABORATORS.map((name) => (
            <p key={name} className="text-sm md:text-base tracking-wide" style={{ color: collaboratorColor }}>
              {name}
            </p>
          ))}
        </div>
      </section>
    </PageLayout>
  )
}
