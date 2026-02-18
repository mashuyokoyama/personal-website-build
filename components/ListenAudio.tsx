"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "@/components/theme-provider"
import { useGate } from "@/components/gate-context"
import { useContactScrollFade } from "@/hooks/use-contact-scroll-fade"
import { layer2, navLetterSpacing } from "@/lib/text-layers"

/** 一覧ページではボタン非表示（音は継続再生）。 */
function isListPage(pathname: string): boolean {
  return /^\/(jp|en)\/(projects|artworks)\/?$/.test(pathname.replace(/\?.*$/, ""))
}

/** 個別ページ（プロジェクト・アートワーク詳細）ではボタン非表示。 */
function isDetailPage(pathname: string): boolean {
  return /^\/(jp|en)\/(projects|artworks)\/[^/]+\/?$/.test(pathname.replace(/\?.*$/, ""))
}

const LABEL_DELAY_MS = 3500 // JP/EN と同じタイミングでうっすら表示
/** 大和比の帯: 右端から同じ距離。縦は 1/2.4 の距離感で下から配置 */
const FV_BAND_RIGHT_VW = 10
const FV_BAND_BOTTOM_VH = 14

export default function ListenAudio() {
  const pathname = usePathname()
  const { isEntered } = useGate()
  const audioRef = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const triedFirstPlayRef = useRef(false)
  const [revealed, setRevealed] = useState(false)
  const [labelVisible, setLabelVisible] = useState(false)
  const [hasCompletedOnce, setHasCompletedOnce] = useState(false)
  const [needsClickToUnlock, setNeedsClickToUnlock] = useState(false)
  const { theme } = useTheme()
  const scrollFadeOpacity = useContactScrollFade()
  const showButton = isEntered && !isListPage(pathname ?? "") && !isDetailPage(pathname ?? "")

  // 最初から再生（ボタン用・初回はマウス移動 or クリックで再生）
  const DEFAULT_VOLUME = 0.35 // 少し大きく

  const playFromStart = () => {
    const audio = audioRef.current
    if (!audio) return Promise.resolve()
    audio.currentTime = 0
    audio.volume = DEFAULT_VOLUME
    // ブラウザがソース非対応・ブロックした場合もエラーで落とさない
    return audio.play().catch(() => undefined)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = DEFAULT_VOLUME
    const onEnded = () => setHasCompletedOnce(true)
    audio.addEventListener("ended", onEnded)
    return () => audio.removeEventListener("ended", onEnded)
  }, [])

  // home クリック時に Gate から発火。クリックハンドラ内で再生するため自動再生制限を回避
  useEffect(() => {
    const onRequestPlay = () => {
      triedFirstPlayRef.current = true
      setRevealed(true)
      playFromStart().catch(() => setNeedsClickToUnlock(true))
    }
    window.addEventListener("request-audio-play", onRequestPlay)
    return () => window.removeEventListener("request-audio-play", onRequestPlay)
  }, [])

  // Gate 通過後のみ：マウス移動 or クリックで再生を試す（同一タブ再訪で Gate スキップ時など）
  useEffect(() => {
    if (!isEntered) return
    const tryFirstPlay = () => {
      if (triedFirstPlayRef.current || hasCompletedOnce) return
      triedFirstPlayRef.current = true
      setRevealed(true)
      playFromStart().catch(() => setNeedsClickToUnlock(true))
    }
    const onPointerMove = tryFirstPlay
    const onPointerDown = (e: PointerEvent) => {
      if (buttonRef.current?.contains(e.target as Node)) return
      tryFirstPlay()
    }
    window.addEventListener("pointermove", onPointerMove, { once: true })
    window.addEventListener("pointerdown", onPointerDown, { once: true, capture: true })
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", onPointerDown, { capture: true } as any)
    }
  }, [isEntered, hasCompletedOnce])

  // Play Children.wav を JP/EN と同じタイミングでうっすら表示
  useEffect(() => {
    const t = setTimeout(() => setLabelVisible(true), LABEL_DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  // ブラウザが再生をブロックした場合、最初のクリック/タップで再生
  useEffect(() => {
    if (!needsClickToUnlock) return
    const onPointerDown = (e: PointerEvent) => {
      if (buttonRef.current?.contains(e.target as Node)) return
      playFromStart()
      setNeedsClickToUnlock(false)
    }
    window.addEventListener("pointerdown", onPointerDown, { once: true, capture: true })
    return () => window.removeEventListener("pointerdown", onPointerDown, { capture: true } as any)
  }, [needsClickToUnlock])

  return (
    <>
      <audio
        ref={audioRef}
        src="https://raw.githubusercontent.com/mashuyokoyama/audio-assets/main/Children.wav"
        preload="auto"
      />

      <div
        className="transition-opacity duration-700 ease-out"
        style={{
          position: "fixed",
          right: `${FV_BAND_RIGHT_VW}vw`,
          bottom: `${FV_BAND_BOTTOM_VH}vh`,
          zIndex: 10,
          opacity: showButton && labelVisible ? scrollFadeOpacity : 0,
          visibility: showButton && labelVisible && scrollFadeOpacity > 0.01 ? "visible" : "hidden",
          pointerEvents: showButton && labelVisible && scrollFadeOpacity > 0.01 ? "auto" : "none",
        }}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => {
            playFromStart()
            setNeedsClickToUnlock(false)
          }}
          style={{
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: "8px",
            letterSpacing: navLetterSpacing,
            userSelect: "none",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            color: layer2(theme),
          }}
        >
          Play Children.wav
        </button>
      </div>
    </>
  )
}

