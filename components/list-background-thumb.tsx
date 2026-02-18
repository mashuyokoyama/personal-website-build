"use client"

import { useEffect, useState } from "react"
import type { Project, Artwork, ThumbDisplay } from "@/lib/data/types"

type Item = (Project | Artwork) & {
  slug: string
  title: string
  thumbnail?: string | null
  thumbDisplay?: ThumbDisplay | null
}

interface ListBackgroundThumbProps {
  item?: Item | null
  visible: boolean
  variant?: "projects" | "artworks"
}

const FADE_MS = 180
const ARTWORK_PLAYLIST_ID = "PLLM2ZXSPjDlMVliPsBX7VWxTZQLunGjid"

interface PlaylistItem {
  videoId: string
  title: string
  thumbnailUrl: string
}

function normalizeTitle(source: string): string {
  const trimmed = source.trim()
  const cutByDash = trimmed.split(" - ")[0]
  const cutByParen = cutByDash.split(" (")[0]
  return cutByParen.trim().toLowerCase()
}

export function ListBackgroundThumb({ item, visible, variant }: ListBackgroundThumbProps) {
  const [playlist, setPlaylist] = useState<PlaylistItem[] | null>(null)
  const [imgOpacity, setImgOpacity] = useState(0)
  useEffect(() => {
    if (!item) return
    setImgOpacity(0)
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setImgOpacity(1))
    })
    return () => cancelAnimationFrame(id)
  }, [item?.slug])

  const thumbDisplay = item?.thumbDisplay ?? null
  const isVideoArtwork = !!item && (item as Artwork).type === "Video Art"

  useEffect(() => {
    if (!isVideoArtwork || playlist) return
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(
          `/api/youtube-playlist?playlistId=${encodeURIComponent(ARTWORK_PLAYLIST_ID)}`,
        )
        if (!res.ok) return
        const data = (await res.json()) as {
          videoId: string
          title: string
          thumbnailUrl: string
        }[]
        if (!cancelled) {
          setPlaylist(
            data.map((d) => ({
              videoId: d.videoId,
              title: d.title,
              thumbnailUrl: d.thumbnailUrl,
            })),
          )
        }
      } catch {
        // fail silently; fallback to existing thumbnail
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [isVideoArtwork, playlist])

  if (!item || !thumbDisplay) return null

  // 最大表示枠のみ定義。アスペクト比は固定せず、素材の縦横比に依存させる。
  const baseMin = variant === "projects" ? 24 : 32
  const baseMax = variant === "projects" ? 32 : 42
  let maxWidthVw = Math.min(baseMax, Math.max(baseMin, thumbDisplay.widthVw))
  if (item.slug === "sleeps" || item.slug === "by-the-cliff") {
    maxWidthVw = maxWidthVw * 0.8
  }

  let thumbnail: string | null = item.thumbnail ?? null

  if (isVideoArtwork && playlist) {
    const key = normalizeTitle(item.title)
    const match =
      playlist.find(
        (p) =>
          normalizeTitle(p.title).includes(key) || key.includes(normalizeTitle(p.title)),
      ) ?? null
    if (match) {
      // Cinema24 は maxresdefault が安定しないため、この作品だけ HQ サムネにフォールバック
      if (item.slug === "cinema24") {
        thumbnail = `https://i.ytimg.com/vi/${match.videoId}/hqdefault.jpg`
      } else {
        thumbnail = match.thumbnailUrl
      }
    }
  }

  if (!thumbnail) return null

  // サムネイル自体は位置指定を持たず、レイアウト側（CSS Grid / fixed など）で配置する。
  // ここではサイズとフェードのみを扱う。
  return (
    <div
      aria-hidden
      className="pointer-events-none"
      style={{
        maxWidth: `${maxWidthVw}vw`,
        maxHeight: "50vh",
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      {/* 最大表示枠内で素材の縦横比のまま表示。object-fit: contain でトリミングしない。 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={item.slug}
        src={thumbnail}
        alt=""
        className="block"
        style={{
          objectFit: "contain",
          width: "auto",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "50vh",
          opacity: imgOpacity,
          transition: `opacity ${FADE_MS}ms ease-out`,
        }}
      />
    </div>
  )
}
