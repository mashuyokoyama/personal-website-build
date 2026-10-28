"use client"

import { useRef, useState } from "react"
import { useTheme } from "./theme-provider"
import {
  contentTitleHover,
  layer2,
  LAYER2_HOVER_TRANSITION_MS,
  navLetterSpacing,
} from "@/lib/text-layers"
import { activateSample } from "@/lib/activate-sample"

const SAMPLES = [
  { label: "somad sample1", src: "/projects/so-mad/somad-sample1.wav" },
  { label: "somad sample2", src: "/projects/so-mad/somad-sample2.wav" },
  { label: "somad sample3", src: "/projects/so-mad/somad-sample3.wav" },
] as const

const BASE_LAYER_FONT = "var(--font-mono), ui-monospace, monospace"

export function SoMadSamples() {
  const { theme } = useTheme()
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([])
  const startedAtRef = useRef(0)
  const [hovered, setHovered] = useState<number | null>(null)

  const onActivate = (index: number) => {
    activateSample(audioRefs.current, index, startedAtRef)
  }

  return (
    <div className="mb-10 flex flex-col items-start gap-2">
      <audio ref={(el) => { audioRefs.current[0] = el }} src={SAMPLES[0].src} preload="none" />
      <audio ref={(el) => { audioRefs.current[1] = el }} src={SAMPLES[1].src} preload="none" />
      <audio ref={(el) => { audioRefs.current[2] = el }} src={SAMPLES[2].src} preload="none" />
      {SAMPLES.map((sample, index) => (
        <button
          key={sample.src}
          type="button"
          data-sample-audio=""
          onTouchEnd={() => onActivate(index)}
          onClick={() => onActivate(index)}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          style={{
            fontFamily: BASE_LAYER_FONT,
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: navLetterSpacing,
            color: hovered === index ? contentTitleHover(theme) : layer2(theme),
            transition: `color ${LAYER2_HOVER_TRANSITION_MS}ms linear`,
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {sample.label}
        </button>
      ))}
    </div>
  )
}
