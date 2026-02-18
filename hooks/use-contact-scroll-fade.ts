"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

/** コンタクトページ（TOP）でのみ true。一覧・個別ページは false */
function isContactPage(pathname: string | null): boolean {
  if (!pathname) return false
  return pathname === "/jp" || pathname === "/en"
}

/**
 * コンタクトページでスクロールに応じて 1 → 0 の opacity を返す。
 * ナビ・Play Children.wav のフェードアウト用。
 * 他ページでは常に 1 を返す。
 */
export function useContactScrollFade(): number {
  const pathname = usePathname()
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (!isContactPage(pathname)) {
      setOpacity(1)
      return
    }

    const update = () => {
      const scrollY = window.scrollY
      const vh = window.innerHeight
      // 20vh〜90vh で 1 → 0 にフェード。コンタクト到達前に完全不可視に
      const fadeStart = vh * 0.2
      const fadeEnd = vh * 0.9
      if (scrollY <= fadeStart) {
        setOpacity(1)
      } else if (scrollY >= fadeEnd) {
        setOpacity(0)
      } else {
        const t = (scrollY - fadeStart) / (fadeEnd - fadeStart)
        setOpacity(1 - t)
      }
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [pathname])

  return opacity
}
