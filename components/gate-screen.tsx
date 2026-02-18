"use client"

import { useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"
import { useGate } from "./gate-context"
import { layer2, navLetterSpacing } from "@/lib/text-layers"

const GATE_FADE_MS = 140
const LINE_GROW_MS = 720
const LINE_FADEOUT_MS = 160
const HOME_FADE_MS = 280

/** body 直下にポータルで描画し、ThemeProvider のスタッキングコンテキストの影響を受けないようにする */
const GATE_Z = 9999

const BASE_LAYER_FONT = "var(--font-mono), ui-monospace, monospace"

/** Gate: 線が上に伸びる → home をフェードイン表示 → クリックで FV と音声開始 */
export function GateScreen() {
  const pathname = usePathname()
  const { setEntered } = useGate()
  const [exiting, setExiting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [lineVisible, setLineVisible] = useState(false)
  const [lineFadeOut, setLineFadeOut] = useState(false)
  const [homeOpacity, setHomeOpacity] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setLineVisible(true)
      setHomeOpacity(1)
      return
    }
    setLineVisible(true)
    const tLineFadeOut = setTimeout(() => setLineFadeOut(true), LINE_GROW_MS)
    const tLineHide = setTimeout(() => setLineVisible(false), LINE_GROW_MS + LINE_FADEOUT_MS)
    const tHome = setTimeout(() => setHomeOpacity(1), LINE_GROW_MS + LINE_FADEOUT_MS)
    return () => {
      clearTimeout(tHome)
      clearTimeout(tLineFadeOut)
      clearTimeout(tLineHide)
    }
  }, [mounted])

  const isEn = pathname?.startsWith("/en")
  const bg = isEn ? "#000000" : "#ffffff"
  const textColor = layer2(isEn ? "en" : "jp")
  const lineColor = isEn ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)"

  /** home ボタン押下 = 音声再生開始（request-audio-play）→ FV 表示。ListenAudio がイベントを受けて play() する。 */
  const handleClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("request-audio-play"))
    try {
      sessionStorage.setItem("skip-intro-animation", "1")
    } catch {
      // ignore
    }
    setExiting(true)
    setTimeout(() => setEntered(true), GATE_FADE_MS)
  }, [setEntered])

  const gate = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: GATE_Z,
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: exiting ? 0 : 1,
        transition: `opacity ${GATE_FADE_MS}ms ease-out`,
        pointerEvents: "none",
      }}
    >
      {lineVisible && (
        <div
          aria-hidden
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
            pointerEvents: "none",
          }}
        />
      )}
      <button
        type="button"
        onClick={handleClick}
        aria-label="Enter and start audio"
        style={{
          fontFamily: BASE_LAYER_FONT,
          fontSize: "14px",
          letterSpacing: navLetterSpacing,
          color: textColor,
          textDecoration: "none",
          border: "none",
          background: "none",
          padding: 0,
          cursor: "pointer",
          opacity: homeOpacity,
          transition: `opacity ${HOME_FADE_MS}ms ease-out`,
          pointerEvents: homeOpacity > 0 ? "auto" : "none",
        }}
      >
        home
      </button>
    </div>
  )

  // サーバーおよびクライアント初回はツリー内に描画（home を確実に表示）。マウント後に body 直下へポータルで出し、z-index を確実に最前面に。
  if (mounted && typeof document !== "undefined") {
    return createPortal(gate, document.body)
  }
  return gate
}
