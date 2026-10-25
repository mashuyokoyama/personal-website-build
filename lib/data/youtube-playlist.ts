import { youtubePlaylistFallback } from "./youtube-playlist-fallback"

export interface YoutubePlaylistItem {
  videoId: string
  title: string
  url: string
  thumbnailUrl: string
  published: string
}

const FEED_BASE = "https://www.youtube.com/feeds/videos.xml"
const PAGE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Cookie: "CONSENT=YES+cb.20210328-17-p0.en+FX+667",
}

function toItem(videoId: string, title: string, published = ""): YoutubePlaylistItem {
  return {
    videoId,
    title,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    published,
  }
}

function extractTag(chunk: string, tag: string): string | null {
  const start = chunk.indexOf(`<${tag}>`)
  if (start === -1) return null
  const end = chunk.indexOf(`</${tag}>`, start)
  if (end === -1) return null
  return chunk.slice(start + tag.length + 2, end).trim()
}

function parsePlaylistXml(xml: string): YoutubePlaylistItem[] {
  const parts = xml.split("<entry>").slice(1)
  const items: YoutubePlaylistItem[] = []
  for (const part of parts) {
    const entry = part.split("</entry>")[0]
    const videoId = extractTag(entry, "yt:videoId")
    const title = extractTag(entry, "title")
    const published = extractTag(entry, "published")
    if (!videoId || !title) continue
    items.push(toItem(videoId, title, published ?? ""))
  }
  return items
}

function extractYtInitialData(html: string): unknown | null {
  const marker = "ytInitialData = "
  const start = html.indexOf(marker)
  if (start === -1) return null
  const jsonStart = html.indexOf("{", start)
  if (jsonStart === -1) return null
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = jsonStart; i < html.length; i++) {
    const char = html[i]
    if (inString) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === "\\") {
        escaped = true
        continue
      }
      if (char === '"') inString = false
      continue
    }
    if (char === '"') {
      inString = true
      continue
    }
    if (char === "{") depth++
    else if (char === "}") {
      depth--
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(jsonStart, i + 1))
        } catch {
          return null
        }
      }
    }
  }
  return null
}

function textContent(node: unknown): string {
  if (!node || typeof node !== "object") return ""
  const record = node as { simpleText?: string; content?: string; runs?: { text?: string }[] }
  if (typeof record.simpleText === "string") return record.simpleText
  if (typeof record.content === "string") return record.content
  if (Array.isArray(record.runs)) return record.runs.map((run) => run?.text ?? "").join("")
  return ""
}

function parsePlaylistHtml(html: string): YoutubePlaylistItem[] {
  const data = extractYtInitialData(html)
  if (!data) return []
  const items: YoutubePlaylistItem[] = []
  const seen = new Set<string>()
  const push = (videoId: string, title: string) => {
    if (!videoId || !title || seen.has(videoId)) return
    seen.add(videoId)
    items.push(toItem(videoId, title))
  }
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
      for (const child of node) walk(child)
      return
    }
    const record = node as {
      lockupViewModel?: {
        contentType?: string
        contentId?: string
        metadata?: { lockupMetadataViewModel?: { title?: unknown } }
      }
      playlistVideoRenderer?: { videoId?: string; title?: unknown }
    }
    const lockup = record.lockupViewModel
    if (lockup?.contentType === "LOCKUP_CONTENT_TYPE_VIDEO" && lockup.contentId) {
      push(lockup.contentId, textContent(lockup.metadata?.lockupMetadataViewModel?.title))
    }
    const legacy = record.playlistVideoRenderer
    if (legacy?.videoId) push(legacy.videoId, textContent(legacy.title))
    for (const value of Object.values(record)) walk(value)
  }
  walk(data)
  return items
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: PAGE_HEADERS, next: { revalidate: 60 } })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

/** プレイリスト RSS が 404 のときは公開プレイリストページから同じ項目を取る。 */
export async function loadYoutubePlaylist(playlistId: string): Promise<YoutubePlaylistItem[]> {
  const xml = await fetchText(`${FEED_BASE}?playlist_id=${encodeURIComponent(playlistId)}`)
  if (xml) {
    const fromFeed = parsePlaylistXml(xml)
    if (fromFeed.length > 0) return fromFeed
  }
  const html = await fetchText(`https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`)
  if (html) {
    const fromPage = parsePlaylistHtml(html)
    if (fromPage.length > 0) return fromPage
  }
  return youtubePlaylistFallback[playlistId] ?? []
}
