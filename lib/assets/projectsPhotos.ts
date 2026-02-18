const RAW_BASE = "https://raw.githubusercontent.com/mashuyokoyama/visual-assets/main/projects-photos/"

const toUrl = (filename: string) => `${RAW_BASE}${encodeURIComponent(filename)}`

interface PhotoEntry {
  canonical: string
  variants?: string[]
}

const projectPhotoFiles: Record<string, PhotoEntry> = {
  "how-we-accept": {
    canonical: "HOW-WE-ACCEPT?.png",
    variants: ["HOW-WE-ACCEPT-2.JPG", "HOW-WE-ACCEPT-3.jpg"],
  },
  "the-form-of-quiet": {
    canonical: "The-Form-of-Quiet.JPG",
  },
  undecided: {
    canonical: "Undecided.png",
  },
  "so-mad": {
    canonical: "Kapla.jpg",
    variants: ["Kapla-2.JPG"],
  },
  sleeps: {
    canonical: "Sleeps.JPG",
    variants: ["Sleeps-2.JPG", "Sleeps-3.jpg"],
  },
}

const artworkPhotoFiles: Record<string, PhotoEntry> = {
  "by-the-cliff": {
    canonical: "By-The-Cliff.jpeg",
  },
  "her-egg": {
    canonical: "her-egg.jpeg",
  },
}

export function getProjectPhotos(slug: string): { thumbnail: string; gallery: string[] } | null {
  const entry = projectPhotoFiles[slug]
  if (!entry) return null
  const filenames = [entry.canonical, ...(entry.variants ?? [])]
  const urls = filenames.map(toUrl)
  return {
    thumbnail: urls[0],
    gallery: urls,
  }
}

export function getArtworkPhotos(slug: string): { thumbnail: string; gallery: string[] } | null {
  const entry = artworkPhotoFiles[slug]
  if (!entry) return null
  const filenames = [entry.canonical, ...(entry.variants ?? [])]
  const urls = filenames.map(toUrl)
  return {
    thumbnail: urls[0],
    gallery: urls,
  }
}

