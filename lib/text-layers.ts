/**
 * 意味と距離に応じたテキストの段階。強調ではなく「距離」を表現する。
 * 設計: 基底レイヤー（UI/ナビ/一覧）= monospace・layer2/layer3 色。
 *       内容レイヤー（作品名/プロジェクト名）= proportional・主張しない色・ホバー時のみわずかに濃度変化。
 * 詳細は FONT_AND_LAYER_SPEC.md を参照。
 */

export type Theme = "jp" | "en"

/** レイヤー1: 配置としてのコンテンツ（個別タイトル・Collaborators名）— 純黒/純白を避け背景に馴染む */
export function layer1(theme: Theme): string {
  return theme === "jp" ? "rgba(0,0,0,0.78)" : "rgba(255,255,255,0.78)"
}

/** レイヤー1 の薄め（コンタクトページのメッセージ・名前用） */
export function layer1Muted(theme: Theme): string {
  return theme === "jp" ? "rgba(0,0,0,0.62)" : "rgba(255,255,255,0.62)"
}

/** レイヤー2: ナビ・ラベル・内容タイトル用の色 — 視覚的に後退し主張しない */
export function layer2(theme: Theme): string {
  return theme === "jp" ? "rgba(0,0,0,0.48)" : "rgba(255,255,255,0.48)"
}

/** 内容レイヤー（作品名/プロジェクト名）ホバー時: 色・濃度をわずかに変化させる。フェードのみ。 */
export function contentTitleHover(theme: Theme): string {
  return theme === "jp" ? "rgba(0,0,0,0.58)" : "rgba(255,255,255,0.58)"
}

/** 内容レイヤー ホバー変化のトランジション時間（0.1〜0.15秒）。動き・下線・装飾は禁止。 */
export const LAYER2_HOVER_TRANSITION_MS = 120

/** レイヤー3: 補足・Contact — さらに遠いレイヤー */
export function layer3(theme: Theme): string {
  return theme === "jp" ? "rgba(0,0,0,0.36)" : "rgba(255,255,255,0.36)"
}

/** 一覧タイトル用 letter-spacing（配置としての密度） */
export const listTitleLetterSpacing = "0.03em"

/** ナビ・ラベル用 letter-spacing（基底レイヤー Layer1）。詰め気味で統一。 */
export const navLetterSpacing = "0.03em"

/** 補足・リンク用 letter-spacing */
export const supplementLetterSpacing = "0.06em"
