"use client"

import { useRef, useState } from "react"
import { useTheme } from "./theme-provider"
import {
  contentTitleHover,
  layer2,
  layer3,
  LAYER2_HOVER_TRANSITION_MS,
  navLetterSpacing,
  supplementLetterSpacing,
} from "@/lib/text-layers"

const SUB_IMAGE = "/projects/how-we-accept/mothers-touch-sub.jpg"

const SAMPLES = [
  { label: "MOTHER'S TOUCH sample1", src: "/projects/how-we-accept/mothers-touch-sample1.wav" },
  { label: "MOTHER'S TOUCH Sample2", src: "/projects/how-we-accept/mothers-touch-sample2.wav" },
] as const

const BASE_LAYER_FONT = "var(--font-mono), ui-monospace, monospace"

export function HowWeAcceptMothersTouch() {
  const { theme } = useTheme()
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([])
  const [hovered, setHovered] = useState<number | null>(null)

  const toggle = (index: number) => {
    const current = audioRefs.current[index]
    if (!current) return
    if (!current.paused) {
      current.pause()
      return
    }
    audioRefs.current.forEach((audio, i) => {
      if (audio && i !== index) audio.pause()
    })
    current.play().catch(() => undefined)
  }

  return (
    <div className="mb-10 self-start">
      <figure className="mb-8 m-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SUB_IMAGE}
          alt=""
          className="block h-auto w-full object-contain object-left md:w-[42vw] md:max-w-[50vw]"
          style={{ maxHeight: "50vh" }}
          loading="lazy"
          decoding="async"
        />
        <figcaption
          className="mt-2 text-[10px] tracking-wide"
          style={{ color: layer3(theme), letterSpacing: supplementLetterSpacing }}
        >
          photo by Hinata Matsumura
        </figcaption>
      </figure>
      <div className="flex flex-col items-start gap-2">
        <audio ref={(el) => { audioRefs.current[0] = el }} src={SAMPLES[0].src} preload="none" />
        <audio ref={(el) => { audioRefs.current[1] = el }} src={SAMPLES[1].src} preload="none" />
        {SAMPLES.map((sample, index) => (
          <button
            key={sample.src}
            type="button"
            onClick={() => toggle(index)}
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
    </div>
  )
}
