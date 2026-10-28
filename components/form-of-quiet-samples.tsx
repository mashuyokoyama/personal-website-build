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

const AUDIO_BASE = "https://raw.githubusercontent.com/mashuyokoyama/audio-assets/main/"

const SAMPLE_FILES = [
  "The Form of Quiet Vol.2 - Future Memory - Sample1.wav",
  "The Form of Quiet Vol.2 - Future Memory - Sample2.wav",
  "The Form of Quiet Vol.2 - Future Memory - Sample3.wav",
  "The Form of Quiet Vol.2 - Future Memory - Sample4.wav",
] as const

const SAMPLE_SRCS = SAMPLE_FILES.map((file) => `${AUDIO_BASE}${encodeURIComponent(file)}`)

const BASE_LAYER_FONT = "var(--font-mono), ui-monospace, monospace"

export function FormOfQuietSamples() {
  const { theme } = useTheme()
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([])
  const startedAtRef = useRef(0)
  const [hovered, setHovered] = useState<number | null>(null)

  const onActivate = (index: number) => {
    activateSample(audioRefs.current, index, startedAtRef)
  }

  return (
    <div className="mb-10 flex flex-col items-start gap-2">
      <audio ref={(el) => { audioRefs.current[0] = el }} src={SAMPLE_SRCS[0]} preload="none" />
      <audio ref={(el) => { audioRefs.current[1] = el }} src={SAMPLE_SRCS[1]} preload="none" />
      <audio ref={(el) => { audioRefs.current[2] = el }} src={SAMPLE_SRCS[2]} preload="none" />
      <audio ref={(el) => { audioRefs.current[3] = el }} src={SAMPLE_SRCS[3]} preload="none" />
      {SAMPLE_FILES.map((_, index) => (
        <button
          key={SAMPLE_SRCS[index]}
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
          Sound Sample {index + 1}
        </button>
      ))}
    </div>
  )
}
