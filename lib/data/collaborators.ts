import type { Collaborator } from "./types"
import { projects } from "./projects"
import { artworks } from "./artworks"

/** データ上で参照されている collaborator slug を収集 */
function getReferencedSlugs(): Set<string> {
  const set = new Set<string>()
  for (const p of projects) {
    for (const c of p.collaborators ?? []) {
      set.add(c.slug)
    }
  }
  for (const a of artworks) {
    for (const c of a.collaborators ?? []) {
      set.add(c.slug)
    }
  }
  return set
}

/** 参照されている人物のみ。重複は1人に統合。 */
export function getCollaborators(): Collaborator[] {
  const refs = getReferencedSlugs()
  return collaboratorsData.filter((c) => refs.has(c.slug))
}

const collaboratorsData: Collaborator[] = [
  { slug: "mad-o", name: "Mad O", photoSrc: "/placeholder-user.jpg" },
  { slug: "yoshiki-saitoh", name: "Yoshiki Saitoh", photoSrc: "/placeholder-user.jpg" },
]
