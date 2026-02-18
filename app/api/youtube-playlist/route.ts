import { NextRequest, NextResponse } from "next/server"

const FEED_BASE = "https://www.youtube.com/feeds/videos.xml"

interface PlaylistItem {
  videoId: string
  title: string
  url: string
  thumbnailUrl: string
  published: string
}

function extractTag(chunk: string, tag: string): string | null {
  const start = chunk.indexOf(`<${tag}>`)
  if (start === -1) return null
  const end = chunk.indexOf(`</${tag}>`, start)
  if (end === -1) return null
  return chunk.slice(start + tag.length + 2, end).trim()
}

function parsePlaylistXml(xml: string): PlaylistItem[] {
  const parts = xml.split("<entry>").slice(1)
  const items: PlaylistItem[] = []
  for (const part of parts) {
    const entry = part.split("</entry>")[0]
    const videoId = extractTag(entry, "yt:videoId")
    const title = extractTag(entry, "title")
    const published = extractTag(entry, "published")
    if (!videoId || !title) continue
    const url = `https://www.youtube.com/watch?v=${videoId}`
    // 一覧・個別での画質を優先して maxresdefault を使う（存在しない場合は YouTube 側のフォールバックに委ねる）
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    items.push({
      videoId,
      title,
      url,
      thumbnailUrl,
      published: published ?? "",
    })
  }
  return items
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const playlistId = searchParams.get("playlistId")
  if (!playlistId) {
    return NextResponse.json({ error: "playlistId is required" }, { status: 400 })
  }

  const feedUrl = `${FEED_BASE}?playlist_id=${encodeURIComponent(playlistId)}`

  try {
    const res = await fetch(feedUrl, { next: { revalidate: 60 } })
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch playlist feed" }, { status: 502 })
    }
    const xml = await res.text()
    const items = parsePlaylistXml(xml)
    return NextResponse.json(items)
  } catch (e) {
    return NextResponse.json({ error: "Unexpected error fetching playlist" }, { status: 500 })
  }
}

