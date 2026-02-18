"use client"

import { useEffect, useState } from "react"
import { AnimatedLink } from "./animated-link"
import { usePathname } from "next/navigation"
import { layer2, layer3, navLetterSpacing } from "@/lib/text-layers"

interface LanguageToggleProps {
  lang: "jp" | "en"
  /** 親コンテナ内にインライン配置する（モバイル縦並び用） */
  inline?: boolean
}

const DELAY_MS = 3500
const STORAGE_KEY = "lang-toggle-seen"
const SKIP_INTRO_KEY = "skip-intro-animation"

/** 一覧ページ（Projects / Artworks）では EN/JP を常時表示 */
function isListPage(pathname: string): boolean {
  return /^\/(jp|en)\/(projects|artworks)\/?$/.test(pathname.replace(/\?.*$/, ""))
}

/** 一度でも表示済みなら true（FV 言語切替後の再マウントで即表示するため） */
function hasSeenToggle(): boolean {
  if (typeof window === "undefined") return false
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

export function LanguageToggle({ lang, inline }: LanguageToggleProps) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const isList = isListPage(pathname ?? "")
  const otherLang = lang === "jp" ? "en" : "jp"
  const otherLangPath = pathname?.replace(`/${lang}`, `/${otherLang}`) ?? ""
  const displayTheme = pathname?.startsWith("/en") ? "en" : "jp"
  const navColor = layer2(displayTheme)
  const navInactive = layer3(displayTheme)

  const handleLangClick = () => {
    try {
      sessionStorage.setItem(SKIP_INTRO_KEY, "1")
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (isList) return
    const showNow = hasSeenToggle()
    const delay = showNow ? 0 : DELAY_MS
    const t = setTimeout(() => {
      setVisible(true)
      try {
        sessionStorage.setItem(STORAGE_KEY, "1")
      } catch {
        // ignore
      }
    }, delay)
    return () => clearTimeout(t)
  }, [pathname])

  // 一覧ページ（projects/artworks）では最初から固定表示。FV同様、フェードなし。
  const showToggle = isList || visible

  const toggleContent = (
    <div
      className="flex items-center gap-2 text-xs"
      style={{
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        letterSpacing: navLetterSpacing,
      }}
    >
      <span style={{ color: navColor }}>{lang.toUpperCase()}</span>
      <span style={{ color: navInactive, opacity: 0.8 }}>/</span>
      <AnimatedLink href={otherLangPath} onClick={handleLangClick} style={{ color: navInactive }}>
        {otherLang.toUpperCase()}
      </AnimatedLink>
    </div>
  )

  if (inline) {
    return (
      <div
        className="transition-opacity duration-700 ease-out"
        style={{
          opacity: showToggle ? 1 : 0,
          pointerEvents: showToggle ? "auto" : "none",
          transition: isList ? "none" : "opacity 0.4s ease-out",
        }}
      >
        {toggleContent}
      </div>
    )
  }

  return (
    <div
      className="fixed top-6 z-50 transition-opacity duration-700 ease-out"
      style={{
        right: "10vw",
        opacity: showToggle ? 1 : 0,
        pointerEvents: showToggle ? "auto" : "none",
        transition: isList ? "none" : "opacity 0.4s ease-out",
      }}
    >
      {toggleContent}
    </div>
  )
}
