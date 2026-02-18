"use client"

import { GlobalNav } from "./global-nav"
import { LanguageToggle } from "./language-toggle"
import { useContactScrollFade } from "@/hooks/use-contact-scroll-fade"
import { useIsMobile } from "@/hooks/use-is-mobile"

interface TopNavProps {
  lang: "jp" | "en"
}

/** モバイル版ナビ文字の透明度（デスクトップは 1） */
const MOBILE_NAV_OPACITY = 0.85

/**
 * 常に固定表示。CSS メディアクエリでレスポンシブ（useIsMobile 不要 = 初期レイアウトシフトなし）
 * モバイル: ナビテキストの中央ラインを二重丸の中心（top-6 + h-12 の中央 = 3rem）に揃える
 * デスクトップ: top-6 で横並び
 * コンタクトページではスクロールに応じてフェードアウト
 */
export function TopNav({ lang }: TopNavProps) {
  const scrollFadeOpacity = useContactScrollFade()
  const isMobile = useIsMobile()
  const navOpacity = scrollFadeOpacity * (isMobile ? MOBILE_NAV_OPACITY : 1)

  return (
    <div
      className="fixed top-[calc(3rem-0.375rem)] right-[10vw] z-50 flex flex-col items-end gap-1.5 md:top-6 md:translate-y-0 md:flex-row md:items-center md:gap-10 transition-opacity duration-300"
      style={{
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        opacity: navOpacity,
        visibility: navOpacity < 0.005 ? "hidden" : "visible",
        pointerEvents: navOpacity < 0.005 ? "none" : "auto",
      }}
    >
      <GlobalNav lang={lang} inline />
      <LanguageToggle lang={lang} inline />
    </div>
  )
}
