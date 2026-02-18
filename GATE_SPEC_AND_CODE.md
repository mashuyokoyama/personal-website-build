# Gate 仕様とコード（ChatGPT 相談用）

## 仕様（やりたいこと）

- **初回訪問時**: 画面には「home」だけのゲート画面を表示する。
- **「home」をクリック**: それが FV（ファーストビュー）表示と音声（Children.wav）の**正式な開始点**とする。
- **再訪時**: sessionStorage に `gate-entered` が入っていればゲートをスキップし、いきなり本編を表示する。
- **現状の問題**: ゲートの「home」が**一切表示されない**（初回でも出ない）。

## 技術的な流れ

1. **layout**: `ThemeProvider` → `GateProvider` → `AppWithGate` で `{children}` をラップ。その外に `ListenAudio`。
2. **AppWithGate**:  
   - マウント前: 背景色だけの `BlankScreen`（hydration 合わせ用）。  
   - マウント後: `sessionStorage` の `gate-entered` を読む。`"1"` なら `setEntered(true)`。  
   - `!mounted` → BlankScreen、`mounted && !isEntered` → **GateScreen（「home」）**、`mounted && isEntered` → 本編（children）。
3. **GateScreen**: 中央に「home」のみ表示。クリックで `request-audio-play` を発火 → 140ms でフェードアウト → `setEntered(true)`。z-index は 9999、body 直下に createPortal で描画する実装あり。
4. **ListenAudio**: `request-audio-play` を listen して `playFromStart()`。ゲート通過後のみ pointer で初回再生。

## 関連コード

### 1. `app/layout.tsx`

```tsx
import React from "react"
import type { Metadata } from 'next'
import { Inter, Noto_Sans_JP } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { GateProvider } from '@/components/gate-context'
import { AppWithGate } from '@/components/app-with-gate'
import ListenAudio from '@/components/ListenAudio'
import './globals.css'

// ... metadata ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <GateProvider>
            <AppWithGate>{children}</AppWithGate>
            <ListenAudio />
          </GateProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. `components/gate-context.tsx`

```tsx
"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

export const GATE_STORAGE_KEY = "gate-entered"
const STORAGE_KEY = GATE_STORAGE_KEY

interface GateContextType {
  isEntered: boolean
  setEntered: (value: boolean) => void
}

const GateContext = createContext<GateContextType | null>(null)

export function useGate() {
  const ctx = useContext(GateContext)
  if (!ctx) throw new Error("useGate must be used within GateProvider")
  return ctx
}

interface GateProviderProps {
  children: ReactNode
}

export function GateProvider({ children }: GateProviderProps) {
  const [isEntered, setIsEnteredState] = useState(false)

  const setEntered = useCallback((value: boolean) => {
    setIsEnteredState(value)
    if (value) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1")
      } catch {
        // ignore
      }
    }
  }, [])

  return (
    <GateContext.Provider value={{ isEntered, setEntered }}>
      {children}
    </GateContext.Provider>
  )
}
```

### 3. `components/app-with-gate.tsx`

```tsx
"use client"

import { useLayoutEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useGate } from "./gate-context"
import { GateScreen } from "./gate-screen"
import { GATE_STORAGE_KEY } from "./gate-context"

/** 初回描画のみ。サーバーとクライアントで同じにして hydration を合わせる */
function BlankScreen() {
  const pathname = usePathname()
  const bg = pathname?.startsWith("/en") ? "#000000" : "#ffffff"
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 150,
        backgroundColor: bg,
      }}
    />
  )
}

export function AppWithGate({ children }: { children: React.ReactNode }) {
  const { isEntered, setEntered } = useGate()
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(GATE_STORAGE_KEY) === "1") {
        setEntered(true)
      }
    } catch {
      // ignore
    }
    setMounted(true)
  }, [setEntered])

  if (!mounted) return <BlankScreen />
  if (!isEntered) return <GateScreen />
  return <>{children}</>
}
```

### 4. `components/gate-screen.tsx`

```tsx
"use client"

import { useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"
import { useGate } from "./gate-context"
import { layer2, navLetterSpacing } from "@/lib/text-layers"

const GATE_FADE_MS = 140
const GATE_Z = 9999

/** home クリックで FV 表示と音声開始。Gate は演出ではなく入口。 */
export function GateScreen() {
  const pathname = usePathname()
  const { setEntered } = useGate()
  const [exiting, setExiting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isEn = pathname?.startsWith("/en")
  const bg = isEn ? "#000000" : "#ffffff"
  const textColor = layer2(isEn ? "en" : "jp")

  const handleClick = useCallback(() => {
    window.dispatchEvent(new CustomEvent("request-audio-play"))
    setExiting(true)
    setTimeout(() => setEntered(true), GATE_FADE_MS)
  }, [setEntered])

  const gate = (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleClick()
        }
      }}
      aria-label="Enter"
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
        cursor: "default",
        border: "none",
        outline: "none",
      }}
    >
      <span
        style={{
          fontFamily: "inherit",
          fontSize: "14px",
          letterSpacing: navLetterSpacing,
          color: textColor,
          textDecoration: "none",
          border: "none",
          background: "none",
        }}
      >
        home
      </span>
    </div>
  )

  // サーバーおよびクライアント初回はツリー内に描画。マウント後に body 直下へポータルで出し、z-index を最前面に。
  if (mounted && typeof document !== "undefined") {
    return createPortal(gate, document.body)
  }
  return gate
}
```

### 5. `components/theme-provider.tsx`（スタッキングコンテキストの参考）

```tsx
// 抜粋: ラッパー div
<div
  data-theme={theme}
  className="min-h-screen overflow-y-visible"
  style={{
    position: "relative",
    zIndex: 1,
    backgroundColor: theme === "jp" ? "#ffffff" : "#000000",
    color: theme === "jp" ? "#000000" : "#ffffff",
  }}
>
  {children}
</div>
```

### 6. `lib/text-layers.ts`（Gate で使用）

```ts
export type Theme = "jp" | "en"

export function layer2(theme: Theme): string {
  return theme === "jp" ? "rgba(0,0,0,0.48)" : "rgba(255,255,255,0.48)"
}

export const navLetterSpacing = "0.08em"
```

### 7. `components/ListenAudio.tsx`（Gate との連携部分のみ）

- `useGate()` で `isEntered` を取得。`showButton = isEntered && !isListPage(pathname)`。
- `window.addEventListener("request-audio-play", ...)` で home クリック時に `playFromStart()` を実行。

---

## 相談したいこと

上記の実装で、**初回訪問時でもゲートの「home」が一切表示されない**状態です。  
考えられる原因（`mounted` が true にならない、初回から sessionStorage に値が入っている、レイヤー・z-index で隠れている、など）を切り分ける方法や、より確実に「home」を表示する実装案を教えてほしいです。Next.js App Router（React 18）です。
