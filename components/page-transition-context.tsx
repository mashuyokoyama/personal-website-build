"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"

/** フェードアウト時間（遷移前のテキストが消えるまでの時間） */
const FADE_OUT_MS = 240
/** 遷移後に少し間を置いてからフェードイン開始（切り替わりを自然に） */
const FADE_IN_DELAY_MS = 80
/** フェードイン時間（新ページのテキストが表示されるまでの時間） */
const FADE_IN_MS = 260

type PageTransitionContextValue = {
  exiting: boolean
  animateNavigate: (href: string) => void
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null
)

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext)
  return ctx
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    setExiting(false)
  }, [pathname])

  const animateNavigate = useCallback(
    (href: string) => {
      if (exiting) return
      setExiting(true)
      setTimeout(() => router.push(href), FADE_OUT_MS)
    },
    [exiting, router]
  )

  return (
    <PageTransitionContext.Provider
      value={{ exiting, animateNavigate }}
    >
      {children}
    </PageTransitionContext.Provider>
  )
}

export const PAGE_FADE_MS = FADE_OUT_MS

/** 子要素をフェードイン（マウント時）・フェードアウト（exiting 時）で表示する。PageTransitionProvider の子で使う。 */
export function PageFadeContent({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)
  const ctx = usePageTransition()
  const pathname = usePathname()

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), FADE_IN_DELAY_MS)
    return () => clearTimeout(id)
  }, [pathname])

  const exiting = ctx?.exiting ?? false
  const opacity = exiting ? 0 : visible ? 1 : 0

  return (
    <div
      style={{
        opacity,
        transition: `opacity ${exiting ? FADE_OUT_MS : FADE_IN_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        minHeight: "100%",
      }}
    >
      {children}
    </div>
  )
}
