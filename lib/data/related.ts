import type { Project, Artwork } from "./types"

/** role 文字列から職種キーワード（先頭語）を取得。同一職種で関連づける用 */
function roleCategory(role: string): string {
  const firstPart = role.split(",")[0]?.trim() ?? ""
  const firstWord = firstPart.split(/\s+/)[0]?.trim() ?? ""
  return firstWord.toLowerCase()
}

/** Sound 系 type：Sound Installation の関連に Sound Album（Sleeps など）も含める */
const SOUND_PROJECT_TYPES = ["Sound Installation", "Sound Album"]

/**
 * 関連プロジェクトを取得。
 * 1) 同じ type で絞る（Sound 系は Sound Installation + Sound Album を同一グループ扱い）
 * 2) いなければ同じ role の職種キーワード（Sound, Host など）で絞る
 */
export function getRelatedProjects(current: Project, all: Project[]): Project[] {
  const others = all.filter((p) => p.slug !== current.slug)
  const isSoundType = SOUND_PROJECT_TYPES.includes(current.type)
  const sameType = isSoundType
    ? others.filter((p) => SOUND_PROJECT_TYPES.includes(p.type))
    : others.filter((p) => p.type === current.type)
  if (sameType.length > 0) return sameType
  const category = roleCategory(current.role)
  if (!category) return []
  return others.filter((p) => roleCategory(p.role) === category)
}

/**
 * 関連アートワークを取得。
 * 1) 同じ type（Painting, Video Art など）で絞る
 * 2) いなければ同じ role の職種キーワードで絞る
 */
export function getRelatedArtworks(current: Artwork, all: Artwork[]): Artwork[] {
  const others = all.filter((a) => a.slug !== current.slug)
  const sameType = others.filter((a) => a.type === current.type)
  if (sameType.length > 0) return sameType
  const category = roleCategory(current.role)
  if (!category) return []
  return others.filter((a) => roleCategory(a.role) === category)
}
