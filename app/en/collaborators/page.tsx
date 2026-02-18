"use client"

import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { getCollaborators } from "@/lib/data"
import { layer1, layer3, supplementLetterSpacing } from "@/lib/text-layers"

export default function EnCollaboratorsPage() {
  const list = getCollaborators()
  const { theme } = useTheme()
  const nameColor = layer1(theme)
  const contactColor = layer3(theme)

  return (
    <PageLayout lang="en">
      <div className="min-h-screen py-24 flex flex-col">
        <ul className="space-y-12">
          {list.map((c) => (
            <li key={c.slug} className="flex items-center gap-6">
              <div
                className="w-20 h-20 flex-shrink-0 rounded-full bg-current overflow-hidden"
                style={{ opacity: 0.15 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.photoSrc}
                  alt=""
                  className="w-full h-full object-cover grayscale"
                  style={theme === "en" ? { filter: "invert(1) grayscale(1)" } : undefined}
                />
              </div>
              <span className="text-sm tracking-wide" style={{ color: nameColor, letterSpacing: supplementLetterSpacing }}>
                {c.name}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-24">
          <Link href="/en/contact" className="text-xs" style={{ color: contactColor, letterSpacing: supplementLetterSpacing }}>
            contact
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
