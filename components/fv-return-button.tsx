"use client"

import { useState, useCallback, useRef, useLayoutEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "./theme-provider"
import { layer2 } from "@/lib/text-layers"

const SKIP_INTRO_KEY = "skip-intro-animation"
const SUCK_IN_MS = 720
/** 左基軸（一覧・個別ページと同じ）。二重丸の中心がこの線上に来る。 */
const BASELINE_LEFT_VW = 10
const HOLD_AFTER_SUCK_MS = 180
const FV_FADE_MS = 320
/** FV 着地後、ナビをフェードインするまでの遅延 */
const NAV_FADE_DELAY_MS = 180
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)"

/**
 * 左上に二重丸を配置。押下で表示中の画面が二重丸に吸い込まれるように縮小し、FV（TOP）へ遷移する。
 * children が吸い込まれる対象。nav も一緒に吸い込まれ、FV 着地後まもなくフェードインする。
 */
export function FVReturnWrapper({
  lang,
  nav,
  children,
}: {
  lang: "jp" | "en"
  nav: ReactNode
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme } = useTheme()
  const [exiting, setExiting] = useState(false)
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null)
  const [landingFadeOpacity, setLandingFadeOpacity] = useState(1)
  const [navLandingOpacity, setNavLandingOpacity] = useState(1)
  /** 着地時 1→0 は即時、0→1 のみ transition するため */
  const [landingTransition, setLandingTransition] = useState(true)
  const [navLandingTransition, setNavLandingTransition] = useState(true)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const wasExitingRef = useRef(false)
  const didClickOnFVRef = useRef(false)

  const topPath = lang === "jp" ? "/jp" : "/en"
  const isOnFV = pathname === topPath
  const color = layer2(theme)

  const updateOrigin = useCallback(() => {
    const wrapperEl = wrapperRef.current
    const buttonEl = buttonRef.current
    if (wrapperEl && buttonEl) {
      const wr = wrapperEl.getBoundingClientRect()
      const br = buttonEl.getBoundingClientRect()
      setOrigin({
        x: br.left + br.width / 2 - wr.left,
        y: br.top + br.height / 2 - wr.top,
      })
    }
  }, [])

  // FV に着いたら scale(0) を解除し、コンテンツとナビをフェードインで表示する（ナビは少し遅れて）
  // useLayoutEffect でペイント前に opacity 0 を適用し、一瞬表示される二重表示を防ぐ
  useLayoutEffect(() => {
    if (pathname === topPath) {
      setExiting(false)
      setOrigin(null)
      if (wasExitingRef.current) {
        wasExitingRef.current = false
        setLandingTransition(false)
        setNavLandingTransition(false) // 1→0 は即時（transition でフェードアウトさせない）
        setLandingFadeOpacity(0)
        setNavLandingOpacity(0)
        const t1 = setTimeout(() => {
          setLandingTransition(true)
          setLandingFadeOpacity(1)
        }, 20)
        const t2 = setTimeout(() => {
          setNavLandingTransition(true)
          setNavLandingOpacity(1)
        }, 20 + NAV_FADE_DELAY_MS)
        return () => {
          clearTimeout(t1)
          clearTimeout(t2)
        }
      }
    }
  }, [pathname, topPath])

  const handleClick = useCallback(() => {
    if (isOnFV) {
      didClickOnFVRef.current = true
      updateOrigin()
      if (exiting) {
        setExiting(false)
        return
      }
      setExiting(true)
      return
    }
    if (exiting) return
    wasExitingRef.current = true
    updateOrigin()
    try {
      sessionStorage.setItem(SKIP_INTRO_KEY, "1")
    } catch {
      // ignore
    }
    setExiting(true)
    setTimeout(() => router.push(topPath), SUCK_IN_MS + HOLD_AFTER_SUCK_MS)
  }, [exiting, topPath, isOnFV, router, updateOrigin])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        aria-label={lang === "jp" ? "トップへ" : "Back to top"}
        className="fixed top-6 z-[60] w-12 h-12 flex items-center justify-center border-0 bg-transparent cursor-pointer"
        style={{
          left: `calc(${BASELINE_LEFT_VW}vw - 1.5rem)`,
        }}
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="w-7 h-7 shrink-0"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      </button>
      <div
        ref={wrapperRef}
        style={{
          transformOrigin: origin
            ? `${origin.x}px ${origin.y}px`
            : "left top",
          transformStyle: "preserve-3d",
          // 時空のねじれ: 吸い込み時に skew・rotate で要素がねじれる感じを強調。perspective で奥に吸い込まれる深度感
          transform: exiting
            ? "perspective(900px) scale(0) rotate(28deg) skewX(-14deg) skewY(10deg)"
            : "perspective(900px) scale(1) rotate(0deg) skewX(0deg) skewY(0deg)",
          // FV にサブページから着いた直後だけ scale アニメなし（フェードインのみ）。FV で二重丸を押した吸い込み・吐き出しはアニメする
          transition:
            isOnFV && !exiting && !didClickOnFVRef.current
              ? "none"
              : `transform ${SUCK_IN_MS}ms ${EASING}`,
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            opacity: navLandingOpacity,
            transition: navLandingTransition
              ? `opacity ${FV_FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : "none",
            position: "relative",
            zIndex: 50,
          }}
        >
          {nav}
        </div>
        <div
          style={{
            opacity: landingFadeOpacity,
            transition: landingTransition
              ? `opacity ${FV_FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : "none",
            minHeight: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </>
  )
}
