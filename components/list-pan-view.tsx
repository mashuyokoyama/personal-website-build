"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"

const FRICTION = 0.96
const BOUND_DAMP = 0.7
const WHEEL_SCALE = 0.4

interface ListPanViewProps {
  children: ReactNode
  className?: string
}

export function ListPanView({ children, className = "" }: ListPanViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const vRef = useRef({ vx: 0, vy: 0 })
  const boundsRef = useRef({ minX: 0, maxX: 0, minY: 0, maxY: 0 })
  const posRef = useRef(pos)
  posRef.current = pos

  const updateBounds = useCallback(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (!container || !content) return
    const cw = container.clientWidth
    const ch = container.clientHeight
    const contentW = content.scrollWidth
    const contentH = content.scrollHeight
    boundsRef.current = {
      minX: Math.min(0, cw - contentW),
      maxX: 0,
      minY: Math.min(0, ch - contentH),
      maxY: 0,
    }
  }, [])

  useEffect(() => {
    updateBounds()
    const ro = new ResizeObserver(updateBounds)
    if (containerRef.current) ro.observe(containerRef.current)
    if (contentRef.current) ro.observe(contentRef.current)
    return () => ro.disconnect()
  }, [updateBounds])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      vRef.current.vx -= e.deltaX * WHEEL_SCALE
      vRef.current.vy -= e.deltaY * WHEEL_SCALE
    }
    container.addEventListener("wheel", onWheel, { passive: false })
    return () => container.removeEventListener("wheel", onWheel)
  }, [])

  useEffect(() => {
    let rafId = 0
    const loop = () => {
      const { minX, maxX, minY, maxY } = boundsRef.current
      let { vx, vy } = vRef.current
      let { x, y } = posRef.current
      x += vx
      y += vy
      if (x < minX) {
        x = minX
        vx *= BOUND_DAMP
      }
      if (x > maxX) {
        x = maxX
        vx *= BOUND_DAMP
      }
      if (y < minY) {
        y = minY
        vy *= BOUND_DAMP
      }
      if (y > maxY) {
        y = maxY
        vy *= BOUND_DAMP
      }
      vRef.current = { vx: vx * FRICTION, vy: vy * FRICTION }
      posRef.current = { x, y }
      setPos({ x, y })
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  )
}
