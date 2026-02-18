"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"

export const GATE_STORAGE_KEY = "entered"
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

function readEnteredFromStorage(): boolean {
  if (typeof window === "undefined") return false
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return false
  }
}

export function GateProvider({ children }: GateProviderProps) {
  const [isEntered, setIsEnteredState] = useState(readEnteredFromStorage)

  const setEntered = useCallback((value: boolean) => {
    setIsEnteredState(value)
    if (value) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "true")
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
