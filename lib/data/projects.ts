import type { Project } from "./types"
import { getProjectPhotos } from "../assets/projectsPhotos"

const howWeAcceptPhotos = getProjectPhotos("how-we-accept")
const theFormOfQuietPhotos = getProjectPhotos("the-form-of-quiet")
const undecidedPhotos = getProjectPhotos("undecided")
const aroundACirclePhotos = getProjectPhotos("around-a-circle")
const soMadPhotos = getProjectPhotos("so-mad")
const sleepsPhotos = getProjectPhotos("sleeps")
const midoriSoPhotos = getProjectPhotos("midori-so")

// 一覧・個別ともに参照できる全 Projects
export const allProjects: Project[] = [
  {
    slug: "how-we-accept",
    title: "HOW WE ACCEPT?",
    year: "2025 -",
    type: "Social Action",
    role: "Planning, Sound & Space Production",
    note: "",
    thumbnail: howWeAcceptPhotos?.thumbnail,
    thumbDisplay: { widthVw: 55, offsetX: 2, offsetY: -1 },
    gallery: howWeAcceptPhotos?.gallery,
    credits: [
      {
        role: "Producer",
        names: ["Eka Kurotaki", "Mashu Yokoyama"],
      },
      {
        role: "Sound Production",
        names: ["Mashu Yokoyama"],
      },
      {
        role: "Support",
        names: ["Siva Studio"],
        kind: "support",
      },
    ],
  },
  {
    slug: "the-form-of-quiet",
    title: "The Form of Quiet",
    year: 2025,
    type: "Sound Installation",
    role: "Sound Direction, Sound Design",
    note: "Braun Audio",
    thumbnail: theFormOfQuietPhotos?.thumbnail,
    thumbDisplay: { widthVw: 50, offsetX: -1, offsetY: 1 },
    gallery: theFormOfQuietPhotos?.gallery,
    credits: [
      {
        role: "Sound Direction",
        names: ["Mashu Yokoyama", "Kei Okazaki"],
      },
    ],
  },
  {
    slug: "undecided",
    title: "Undecided",
    year: "2025-",
    type: "Radio Program",
    role: "Host",
    note: "",
    playlistId: "PLzzJStal9Vzv3GDxyls4Cga7f-Lz_iBCL",
    thumbnail: undecidedPhotos?.thumbnail,
    thumbDisplay: { widthVw: 48 },
    gallery: undecidedPhotos?.gallery,
    credits: [
      {
        role: "Host",
        names: ["Mashu Yokoyama", "Hinata Matsumura"],
      },
      {
        role: "Support",
        names: ["Room303"],
        kind: "support",
      },
    ],
  },
  {
    slug: "around-a-circle",
    title: "Around A Circle",
    year: "2023-",
    type: "Gathering Party",
    role: "Host",
    thumbnail: aroundACirclePhotos?.thumbnail,
    thumbDisplay: { widthVw: 58, offsetY: 2 },
    gallery: aroundACirclePhotos?.gallery,
    credits: [
      {
        role: "Host",
        names: ["Mashu Yokoyama"],
      },
      {
        role: "Venue",
        names: ["Space Orbit"],
        kind: "support",
      },
    ],
  },
  {
    slug: "midori-so",
    title: "MIDORI.so",
    year: "2025 -",
    type: "Working Community",
    role: "Community Organizer",
    note: "",
    thumbnail: midoriSoPhotos?.thumbnail,
    thumbDisplay: { widthVw: 50 },
    gallery: midoriSoPhotos?.gallery,
  },
  {
    slug: "so-mad",
    title: "So mad (for Mad O art exhibition 'Kapla')",
    year: 2024,
    type: "Sound Installation",
    role: "Sound Direction, Sound Design",
    thumbnail: soMadPhotos?.thumbnail,
    thumbDisplay: { widthVw: 52 },
    collaborators: [{ name: "Mad O", slug: "mad-o" }],
    gallery: soMadPhotos?.gallery,
    credits: [
      {
        role: "Sound Production",
        names: ["Mashu Yokoyama"],
      },
    ],
  },
  {
    slug: "sleeps",
    title: "Sleeps (for Yoshiki Saitoh photo exhibition 'Sleeps')",
    year: 2023,
    type: "Sound Album",
    role: "Sound Production",
    thumbnail: sleepsPhotos?.thumbnail,
    // 一覧でのスケールを少し抑える
    thumbDisplay: { widthVw: 46, offsetX: -2 },
    collaborators: [{ name: "Yoshiki Saitoh", slug: "yoshiki-saitoh" }],
    gallery: sleepsPhotos?.gallery,
    credits: [
      {
        role: "Sound Production",
        names: ["Mashu Yokoyama"],
      },
    ],
  },
]

// 一覧に出す Projects（密度を下げるために間引いたセット）
export const projects: Project[] = allProjects.filter((p) =>
  ["how-we-accept", "the-form-of-quiet", "undecided", "midori-so"].includes(p.slug),
)
