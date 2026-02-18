"use client"

import { AnimatedLink } from "./animated-link"
import { usePathname } from "next/navigation"
import { useTheme } from "./theme-provider"
import { layer2, layer3, navLetterSpacing } from "@/lib/text-layers"

interface GlobalNavProps {
  lang: "jp" | "en"
  /** 親コンテナ内にインライン配置する（モバイル縦並び用） */
  inline?: boolean
}

export function GlobalNav({ lang, inline }: GlobalNavProps) {
  const pathname = usePathname()
  const prefix = lang === "jp" ? "/jp" : "/en"
  const { theme } = useTheme()
  const navColor = layer2(theme)
  const navInactive = layer3(theme)

  const projectsActive = pathname.startsWith(`${prefix}/projects`)
  const artworksActive = pathname.startsWith(`${prefix}/artworks`)

  const baseStyle = {
    fontFamily: "var(--font-mono), ui-monospace, monospace",
    color: navColor,
    letterSpacing: navLetterSpacing,
  }

  const navContent = (
    <>
      <AnimatedLink href={`${prefix}/projects`} style={{ color: projectsActive ? navColor : navInactive }}>
        Projects
      </AnimatedLink>
      <span style={{ color: navInactive, opacity: 0.8 }}>/</span>
      <AnimatedLink href={`${prefix}/artworks`} style={{ color: artworksActive ? navColor : navInactive }}>
        Artworks
      </AnimatedLink>
    </>
  )

  if (inline) {
    return (
      <nav className="flex items-center gap-3 text-xs" style={baseStyle}>
        {navContent}
      </nav>
    )
  }

  return (
    <nav
      className="fixed top-6 z-50 flex items-center gap-3 text-xs"
      style={{
        ...baseStyle,
        right: "22vw",
        left: "auto",
      }}
    >
      {navContent}
    </nav>
  )
}
