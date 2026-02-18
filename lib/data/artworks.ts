import type { Artwork } from "./types"
import { getArtworkPhotos } from "../assets/projectsPhotos"

// 一覧・個別ともに参照できる全 Artworks
export const allArtworks: Artwork[] = [
  (() => {
    const photos = getArtworkPhotos("her-egg")
    return {
      slug: "her-egg",
      title: "her egg",
      year: 2024,
      type: "Painting",
      role: "Oil paint, Pen writing",
      thumbnail: photos?.thumbnail,
      thumbDisplay: { widthVw: 50 },
      gallery: photos?.gallery,
      credits: [
        {
          role: "",
          names: ["Mashu Yokoyama"],
        },
      ],
    }
  })(),
  (() => {
    const photos = getArtworkPhotos("lotus")
    return {
      slug: "lotus",
      title: "Lotus",
      year: 2025,
      type: "Video Art",
      role: "Direction, Sound Production",
      thumbnail: photos?.thumbnail,
      thumbDisplay: { widthVw: 55, offsetY: 1 },
      gallery: photos?.gallery,
      credits: [
        {
          role: "Sound",
          names: ["Mashu Yokoyama"],
        },
        {
          role: "Video",
          names: ["Kai Takegawa"],
        },
        {
          role: "Words",
          names: ["Sayaka Yamato"],
        },
      ],
    }
  })(),
  (() => {
    const photos = getArtworkPhotos("ruwet")
    return {
      slug: "ruwet",
      title: "ruwet",
      year: 2025,
      type: "Video Art",
      role: "Sound Production",
      thumbnail: photos?.thumbnail,
      thumbDisplay: { widthVw: 48, offsetX: 1 },
      gallery: photos?.gallery,
      credits: [
        {
          role: "Video",
          names: ["Ryutaro Kobayashi"],
        },
        {
          role: "Sound",
          names: ["Mashu Yokoyama"],
        },
      ],
    }
  })(),
  (() => {
    const photos = getArtworkPhotos("amv")
    return {
      slug: "amv",
      title: "AMV",
      year: 2025,
      type: "Video Art",
      role: "Sound Production",
      thumbnail: photos?.thumbnail,
      thumbDisplay: { widthVw: 52 },
      gallery: photos?.gallery,
      credits: [
        {
          role: "Video",
          names: ["Ryutaro Kobayashi"],
        },
        {
          role: "Sound",
          names: ["Mashu Yokoyama"],
        },
      ],
    }
  })(),
  (() => {
    const photos = getArtworkPhotos("ever")
    return {
      slug: "ever",
      title: "Ever",
      year: 2024,
      type: "Visual/Poetry Book",
      role: "Visual and poetry",
      thumbnail: photos?.thumbnail,
      thumbDisplay: { widthVw: 45, offsetY: -1 },
      gallery: photos?.gallery,
      credits: [
        {
          role: "",
          names: ["Wada"],
        },
      ],
    }
  })(),
  (() => {
    const photos = getArtworkPhotos("cinema24")
    return {
      slug: "cinema24",
      title: "Cinema24",
      year: 2023,
      type: "Video Art",
      role: "Direction, Sound Production",
      thumbnail: photos?.thumbnail,
      thumbDisplay: { widthVw: 58 },
      gallery: photos?.gallery,
      credits: [
        {
          role: "Sound",
          names: ["Mashu Yokoyama"],
        },
        {
          role: "Video",
          names: ["Kai Takegawa"],
        },
        {
          role: "Words",
          names: ["Sayaka Yamato"],
        },
      ],
    }
  })(),
  (() => {
    const photos = getArtworkPhotos("safer-place")
    return {
      slug: "safer-place",
      title: "Safer Place",
      year: 2024,
      type: "Video Art",
      role: "Sound Production",
      thumbnail: photos?.thumbnail,
      thumbDisplay: { widthVw: 50, offsetX: -1 },
      gallery: photos?.gallery,
      credits: [
        {
          role: "Video",
          names: ["Ryutaro Kobayashi"],
        },
        {
          role: "Sound",
          names: ["Mashu Yokoyama"],
        },
      ],
    }
  })(),
  (() => {
    const photos = getArtworkPhotos("by-the-cliff")
    return {
      slug: "by-the-cliff",
      title: "By The Cliff",
      year: 2022,
      type: "Painting",
      role: "Oil, Candle, Pen",
      thumbnail: photos?.thumbnail,
      // 一覧でのスケールを少し抑える
      thumbDisplay: { widthVw: 46 },
      gallery: photos?.gallery,
      credits: [
        {
          role: "",
          names: ["Mashu Yokoyama"],
        },
      ],
    }
  })(),
  (() => {
    const photos = getArtworkPhotos("morning-after")
    return {
      slug: "morning-after",
      title: "Morning After",
      year: 2019,
      type: "Sound Album",
      role: "Sound Production",
      thumbnail: photos?.thumbnail,
      thumbDisplay: { widthVw: 48 },
      gallery: photos?.gallery,
      credits: [
        {
          role: "",
          names: ["Mashu Yokoyama"],
        },
      ],
    }
  })(),
]

// 一覧に出す Artworks（表示順: Lotus → AMV → ruwet → her egg）
const ARTWORKS_LIST_SLUGS = ["lotus", "amv", "ruwet", "her-egg"] as const
export const artworks: Artwork[] = ARTWORKS_LIST_SLUGS.map((slug) =>
  allArtworks.find((a) => a.slug === slug),
).filter((a): a is Artwork => !!a)
