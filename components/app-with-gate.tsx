"use client"

import { useGate } from "./gate-context"
import { GateScreen } from "./gate-screen"

/**
 * Gate 表示／本編は GateProvider の isEntered（初期値は sessionStorage から決定）のみで制御。
 * 判定は初期レンダリング前に確定するため、BlankScreen や effect による途中切替は行わない。
 */
export function AppWithGate({ children }: { children: React.ReactNode }) {
  const { isEntered } = useGate()

  if (!isEntered) return <GateScreen />
  return <>{children}</>
}
