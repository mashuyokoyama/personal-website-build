"use client"

import { useEffect, useState, useRef, type ReactNode } from "react"
import { usePathname } from "next/navigation"

const INITIAL_HOLD_MS = 1000 // FV立ち上げ時：単色表示
const LINE_GROW_MS = 720 // 画面下から上まで伸ばす（少しゆっくり）
const LINE_FADEOUT_MS = 160
const CONTENT_FADE_MS = 280
const CONTENT_FADE_DELAY_MS = 80 // 線フェードアウトと重ねる

const REDUCED_MOTION_HOLD_MS = 200
const REDUCED_MOTION_FADE_MS = 200

type Phase = "holding" | "lineGrowing" | "lineFadingOut" | "done"

interface TopIntroProps {
  children: ReactNode
}

/**
 * FV（TOP）立ち上げ時のアニメーション。
 * ロード完了に依存せず、TOPページのマウントと同時に開始する。
 * 単色 → 縦線が伸びる → 線が消える → コンテンツ表示。
 */
export function TopIntro({ children }: TopIntroProps) {
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>("holding")
  const [contentOpacity, setContentOpacity] = useState(0)
  const [lineVisible, setLineVisible] = useState(false)
  const [lineFadeOut, setLineFadeOut] = useState(false)
  const reducedMotionRef = useRef(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (typeof window === "undefined" || startedRef.current) return
    startedRef.current = true
    
    // Homeボタンから遷移した場合はアニメーションをスキップ
    let skipAnimation = false
    try {
      if (sessionStorage.getItem("skip-intro-animation") === "1") {
        skipAnimation = true
        sessionStorage.removeItem("skip-intro-animation")
      }
    } catch {
      // storage が使えない場合は何もしない
    }

    if (skipAnimation) {
      setContentOpacity(1)
      setPhase("done")
      return
    }

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    reducedMotionRef.current = prefersReduced

    if (prefersReduced) {
      const t1 = setTimeout(() => {
        setContentOpacity(1)
        setPhase("done")
      }, REDUCED_MOTION_HOLD_MS)
      return () => clearTimeout(t1)
    }

    // マウント時から開始（ロード待ちなし）: 単色 → 線が伸びる → 線フェードアウト → コンテンツ表示
    const tHold = setTimeout(() => {
      setPhase("lineGrowing")
      setLineVisible(true)
    }, INITIAL_HOLD_MS)

    const tGrowDone = setTimeout(() => {
      setPhase("lineFadingOut")
      setLineFadeOut(true)
      setTimeout(() => setContentOpacity(1), CONTENT_FADE_DELAY_MS)
    }, INITIAL_HOLD_MS + LINE_GROW_MS)

    const tAllDone = setTimeout(() => {
      setPhase("done")
      setLineVisible(false)
    }, INITIAL_HOLD_MS + LINE_GROW_MS + LINE_FADEOUT_MS)

    return () => {
      clearTimeout(tHold)
      clearTimeout(tGrowDone)
      clearTimeout(tAllDone)
    }
  }, [])

  const isDone = phase === "done"
  const showOverlay = !isDone && !reducedMotionRef.current
  const isEn = pathname?.startsWith("/en")
  const lineColor = isEn ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"
  const bgColor = isEn ? "#000000" : "#ffffff"

  return (
    <>
      {showOverlay && (
        <div
          aria-hidden
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{
            backgroundColor: bgColor,
            position: "fixed",
          }}
        >
          {lineVisible && (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                width: "1px",
                height: "100vh",
                transformOrigin: "bottom",
                transform: lineFadeOut ? "translateX(-50%) scaleY(1)" : "translateX(-50%) scaleY(0)",
                backgroundColor: lineColor,
                opacity: lineFadeOut ? 0 : 1,
                animation: lineFadeOut ? "none" : `topIntroLineGrow ${LINE_GROW_MS}ms linear forwards`,
                transition: lineFadeOut ? `opacity ${LINE_FADEOUT_MS}ms linear` : "none",
              }}
            />
          )}
        </div>
      )}

      <div
        style={{
          opacity: contentOpacity,
          transition: `opacity ${CONTENT_FADE_MS}ms ease-out`,
        }}
      >
        {children}
      </div>
    </>
  )
}
