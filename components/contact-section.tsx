"use client"

import { useTheme } from "./theme-provider"
import { layer1Muted, layer2, supplementLetterSpacing } from "@/lib/text-layers"

interface ContactSectionProps {
  lang: "jp" | "en"
  /** 一覧ページの下に配置する場合は true（上余白を多めに） */
  variant?: "standalone" | "below-list"
}

/**
 * コンタクトページのメッセージ・名前・メールブロック。
 * TOP ページ直下または一覧ページの下に配置。
 */
export function ContactSection({ lang, variant = "standalone" }: ContactSectionProps) {
  const { theme } = useTheme()
  const messageColor = layer1Muted(theme)
  const layer2Color = layer2(theme)

  // TOPページと同じ余白で、スクロール後にコンタクトインフォが左上に表示される
  const paddingTop = "24vh"
  const paddingBottom = "58vh"

  return (
    <section
      className="contact-section overflow-x-hidden"
      style={{
        paddingTop,
        paddingBottom,
      }}
    >
      <div
        className="text-xs tracking-wide space-y-[2vh]"
        style={{
          marginTop: "0",
          maxWidth: "720px",
          letterSpacing: supplementLetterSpacing,
        }}
      >
        <div className="font-mono whitespace-nowrap" style={{ color: layer2Color }}>
          dialogue/sound/space/presence
        </div>
        <div className="font-sans mt-[4vh]" style={{ color: messageColor }}>
          If something stayed with you,
          <br />
          I&apos;m here.
        </div>
        <div className="font-sans mt-[4vh]" style={{ color: messageColor }}>
          — Mashu Yokoyama
        </div>
        <div className="font-mono" style={{ color: layer2Color }}>
          <a
            href="mailto:mashmush@me.com"
            className="cursor-pointer no-underline hover:opacity-80 transition-opacity duration-150"
            style={{ color: "inherit" }}
          >
            mashmush@me.com
          </a>
        </div>
      </div>
    </section>
  )
}
