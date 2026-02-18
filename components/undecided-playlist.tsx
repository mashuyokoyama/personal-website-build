"use client"

import { useEffect, useState } from "react"
import { useTheme } from "./theme-provider"
import { layer2, layer3, supplementLetterSpacing } from "@/lib/text-layers"

interface PlaylistItem {
  videoId: string
  title: string
  url: string
  thumbnailUrl: string
  published: string
}

interface UndecidedPlaylistProps {
  playlistId: string
}

export function UndecidedPlaylist({ playlistId }: UndecidedPlaylistProps) {
  const { theme } = useTheme()
  const [items, setItems] = useState<PlaylistItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  const titleColor = layer3(theme)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/youtube-playlist?playlistId=${encodeURIComponent(playlistId)}`)
        if (!res.ok) return
        const data = (await res.json()) as PlaylistItem[]
        if (!cancelled) {
          setItems(data)
        }
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [playlistId])

  const selected = items.find((i) => i.videoId === selectedId) ?? null

  if (!loaded && items.length === 0) {
    return null
  }

  return (
    <div className="mt-10 flex flex-col gap-12">
      {/* 横スクロールのリスト */}
      <section
        aria-label="Undecided playlist"
        className="overflow-x-auto pb-4"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
        }}
      >
        <div
          className="flex gap-6"
          style={{
            paddingLeft: "4vw",
            paddingRight: "12vw",
          }}
        >
          {items.map((item) => {
            const isActive = item.videoId === selectedId
            return (
              <button
                key={item.videoId}
                type="button"
                onClick={() => setSelectedId(item.videoId)}
                className="flex-shrink-0 text-left"
                style={{
                  width: "180px",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    overflow: "hidden",
                    opacity: isActive ? 0.85 : 0.55,
                    transition: "opacity 160ms ease-out",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p
                  className="mt-2 text-[11px] leading-snug line-clamp-2"
                  style={{ color: titleColor, letterSpacing: supplementLetterSpacing }}
                >
                  {item.title}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* ページ下部のプレイヤー（選択されたときだけ） */}
      {selected && (
        <section
          aria-label="Selected video"
          className="mt-8"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "70vw",
            }}
            className="md:max-w-[60vw]"
          >
            <div className="w-full aspect-video max-h-[70vh]">
              <iframe
                src={`https://www.youtube.com/embed/${selected.videoId}`}
                title={selected.title}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

