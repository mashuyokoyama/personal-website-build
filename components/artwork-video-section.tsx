"use client"

import { useEffect, useState } from "react"

interface PlaylistItem {
  videoId: string
  title: string
  url: string
  thumbnailUrl: string
  published: string
}

interface ArtworkVideoSectionProps {
  slug: string
  title: string
}

// Artworks 用プレイリスト（動画作品がまとまっている）
const ARTWORK_PLAYLIST_ID = "PLLM2ZXSPjDlMVliPsBX7VWxTZQLunGjid"

function normalizeTitle(source: string): string {
  // 「Lotus - 水のほとり」「Cinema24 (something)」のような場合に備え、先頭のキー部分だけを使う
  const trimmed = source.trim()
  const cutByDash = trimmed.split(" - ")[0]
  const cutByParen = cutByDash.split(" (")[0]
  return cutByParen.trim().toLowerCase()
}

function titleKeyForSlug(slug: string, title: string): string {
  // 必要ならここで slug ごとのキーを個別調整
  return normalizeTitle(title)
}

export function ArtworkVideoSection({ slug, title }: ArtworkVideoSectionProps) {
  const [items, setItems] = useState<PlaylistItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(
          `/api/youtube-playlist?playlistId=${encodeURIComponent(ARTWORK_PLAYLIST_ID)}`,
        )
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
  }, [])

  const key = titleKeyForSlug(slug, title)
  const match =
    items.find((item) => normalizeTitle(item.title).includes(key) || key.includes(normalizeTitle(item.title))) ??
    null

  if (!loaded || !match) {
    return null
  }

  return (
    <section aria-label="Artwork video" className="block w-full aspect-video md:w-full md:h-full md:aspect-auto">
      <iframe
        src={`https://www.youtube.com/embed/${match.videoId}`}
        title={match.title}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full min-h-0 border-0"
      />
    </section>
  )
}

