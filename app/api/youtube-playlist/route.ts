import { NextRequest, NextResponse } from "next/server"
import { loadYoutubePlaylist } from "@/lib/data/youtube-playlist"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const playlistId = searchParams.get("playlistId")
  if (!playlistId) {
    return NextResponse.json({ error: "playlistId is required" }, { status: 400 })
  }

  const items = await loadYoutubePlaylist(playlistId)
  if (items.length === 0) {
    return NextResponse.json({ error: "Failed to fetch playlist feed" }, { status: 502 })
  }
  return NextResponse.json(items)
}
