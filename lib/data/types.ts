export type Lang = "jp" | "en"

export interface CollaboratorRef {
  name: string
  slug: string
  photoSrc?: string
}

/** 個別ページの画像表示の振る舞い。写真＝黒マットを背景に溶かす / 図面・映像＝加工なし */
export type ImageBehavior = "photo" | "figure"

/** サムネ表示用。作品ごとにサイズ・オフセットを定義 */
export interface ThumbDisplay {
  widthVw: number // 45–70 推奨
  offsetX?: number // 微小オフセット（px または %）
  offsetY?: number
}

export interface Credit {
  role: string
  names: string[]
  /** 補助的なクレジット（Support / Venue など）は kind: "support" として扱う */
  kind?: "main" | "support"
}

export interface Project {
  slug: string
  title: string
  year: string | number
  type: string
  role: string
  /** このプロジェクトに紐づく YouTube プレイリスト（例: Undecided） */
  playlistId?: string
  note?: string
  thumbnail?: string
  thumbDisplay?: ThumbDisplay
  collaborators?: CollaboratorRef[]
  credits?: Credit[]
  /** 個別ページ用ギャラリー（canonical + variants） */
  gallery?: string[]
}

export interface Artwork {
  slug: string
  title: string
  year: string | number
  type: string
  role: string
  thumbnail?: string
  thumbDisplay?: ThumbDisplay
  collaborators?: CollaboratorRef[]
  credits?: Credit[]
  /** 個別ページ用ギャラリー（canonical + variants） */
  gallery?: string[]
  /** 画像の振る舞い。photo＝黒マットを背景にブレンド、figure＝そのまま。未指定は figure */
  imageBehavior?: ImageBehavior
}

export interface Collaborator {
  slug: string
  name: string
  photoSrc: string
}
