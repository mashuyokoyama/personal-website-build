"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { AnimatedLink } from "./animated-link"
import { ListPanView } from "./list-pan-view"
import { ListBackgroundThumb } from "./list-background-thumb"
import { useTheme } from "./theme-provider"
import {
  layer2,
  layer3,
  listTitleLetterSpacing,
  contentTitleHover,
  LAYER2_HOVER_TRANSITION_MS,
} from "@/lib/text-layers"

/** 基底レイヤー（Layer1）: UI/一覧ラベル用フォント。FONT_AND_LAYER_SPEC に準拠。 */
const BASE_LAYER_FONT = "var(--font-mono), ui-monospace, monospace"
import type { Project, Artwork } from "@/lib/data/types"

type Item = (Project | Artwork) & { slug: string; title: string; thumbnail?: string; thumbDisplay?: { widthVw: number; offsetX?: number; offsetY?: number } }

const HOVER_DEBOUNCE_MS = 80
/** 一覧テキストのフワッとした表示：遅延後にフェードイン */
const LIST_TEXT_FADE_DELAY_MS = 100
const LIST_TEXT_FADE_DURATION_MS = 520

/** テキストリストの左端（Projects / Artworks 共通。Artworks 側を基準に固定） */
const LIST_PADDING_LEFT_VW = 10
/** リストブロックの上端位置（上からの余白。小さくするほどブロックが上に寄る） */
const LIST_BLOCK_TOP_VH = 26
/** 一覧の縦リズム：行間（この定数だけ縦の間隔を決める） */
const LIST_ROW_GAP_VH = 6
/** 一覧の縦リズム：3行ごとの区切り余白（滞在時の違和感はこの2つで調整） */
const LIST_GROUP_BREAK_VH = 2

/** 一覧の縦リズムは LIST_ROW_GAP_VH / LIST_GROUP_BREAK_VH の2定数のみで決める。 */
function ListItems({
  items,
  basePath,
  getTitleStyle,
  categoryColor,
  setHoverSlug,
  onItemEnter,
  itemClassName = "group text-base md:text-[17px] block",
}: {
  items: Item[]
  basePath: string
  getTitleStyle: (slug: string) => React.CSSProperties
  categoryColor: string
  setHoverSlug: (slug: string | null) => void
  onItemEnter?: (slug: string) => void
  itemClassName?: string
}) {
  return (
    <div
      className="list-items-rhythm"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${LIST_ROW_GAP_VH}vh`,
      }}
    >
      {items.map((item, i) => (
        <AnimatedLink
          key={item.slug}
          data-index={i}
          href={`${basePath}/${item.slug}`}
          className={itemClassName}
          style={{
            ...getTitleStyle(item.slug),
            marginTop: i > 0 && i % 3 === 0 ? `${LIST_GROUP_BREAK_VH}vh` : undefined,
          }}
          onMouseEnter={() => {
            setHoverSlug(item.slug)
            onItemEnter?.(item.slug)
          }}
          onMouseLeave={() => setHoverSlug(null)}
        >
          {item.title}
          <span
            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150"
            style={{
              fontFamily: BASE_LAYER_FONT,
              color: categoryColor,
              letterSpacing: listTitleLetterSpacing,
            }}
          >
            {" "}
            ー {item.type}
          </span>
        </AnimatedLink>
      ))}
    </div>
  )
}

interface ListPageContentProps {
  items: Item[]
  basePath: string
  lang: "jp" | "en"
  isMobile: boolean
  listVariant?: "projects" | "artworks"
  /** TOP などではパン＋フルスクリーン演出を抑え、静的レイアウトに切り替える */
  enablePan?: boolean
  /** 複数の一覧が同ページにある場合に、どの一覧のどの項目がグローバルにアクティブかを共有するためのキー */
  globalActiveKey?: string | null
  setGlobalActiveKey?: (key: string | null) => void
  /** 一覧の下に表示するフッター（スクロール/パンした下の方に表示） */
  footer?: ReactNode
}

export function ListPageContent({
  items,
  basePath,
  lang,
  isMobile,
  listVariant = "projects",
  enablePan = true,
  globalActiveKey,
  setGlobalActiveKey,
  footer,
}: ListPageContentProps) {
  const { theme } = useTheme()
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const [hoverSlug, setHoverSlug] = useState<string | null>(null)
  const [textOpacity, setTextOpacity] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setTextOpacity(1)
      return
    }
    const t = setTimeout(() => setTextOpacity(1), LIST_TEXT_FADE_DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  const listTextStyle = {
    opacity: textOpacity,
    transition: `opacity ${LIST_TEXT_FADE_DURATION_MS}ms ease-out`,
  }

  const handleEnter = useCallback(
    (slug: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setActiveSlug(slug)
        if (setGlobalActiveKey) {
          setGlobalActiveKey(`${listVariant}:${slug}`)
        }
      }, HOVER_DEBOUNCE_MS)
    },
    [listVariant, setGlobalActiveKey],
  )

  const titleColor = layer2(theme)
  const titleHoverColor = contentTitleHover(theme)
  const categoryColor = layer3(theme)
  const activeItem = activeSlug ? items.find((i) => i.slug === activeSlug) : null

  const getTitleStyle = (slug: string) => ({
    color: hoverSlug === slug ? titleHoverColor : titleColor,
    letterSpacing: listTitleLetterSpacing,
    transition: `color ${LAYER2_HOVER_TRANSITION_MS}ms ease-out`,
  })
  const currentKey = activeSlug ? `${listVariant}:${activeSlug}` : null
  const isThumbVisible =
    !!activeItem && (globalActiveKey ? globalActiveKey === currentKey : true)

  /** 一覧とフッター（コンタクト）の間の余白。TOPページ同様、コンタクトインフォが左上に来るまで十分スクロール/パンさせる */
  const footerSpacer = <div aria-hidden style={{ minHeight: "120vh", flexShrink: 0 }} />

  // モバイルではシンプルな縦配置（テキスト基軸は他分岐と同じ 8vw）
  if (isMobile) {
    return (
      <>
        <section
          className="list-page-section text-left relative z-[1] -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24 min-h-[100dvh] flex flex-col"
          style={{
            paddingLeft: `${LIST_PADDING_LEFT_VW}vw`,
            paddingRight: "12vw",
            ...listTextStyle,
          }}
        >
          <div aria-hidden style={{ height: `${LIST_BLOCK_TOP_VH}vh`, flexShrink: 0 }} />
          <div className="flex-shrink-0">
            <ListItems
              items={items}
              basePath={basePath}
              getTitleStyle={getTitleStyle}
              categoryColor={categoryColor}
              setHoverSlug={setHoverSlug}
            />
          </div>
          <div aria-hidden style={{ flex: "1 1 0", minHeight: 0 }} />
        </section>
        {footer && (
          <>
            {footerSpacer}
            {footer}
          </>
        )}
      </>
    )
  }

  // PC かつ TOP などパン演出を無効にした場合
  if (!enablePan) {
    return (
      <>
        <section
          className="list-page-section projects-wrapper text-left relative z-[1] -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24 flex flex-col min-h-[100dvh]"
          style={{
            paddingLeft: `${LIST_PADDING_LEFT_VW}vw`,
            paddingRight: "12vw",
            ...listTextStyle,
          }}
        >
          <div aria-hidden style={{ height: `${LIST_BLOCK_TOP_VH}vh`, flexShrink: 0 }} />
          <div className="flex flex-row items-center gap-[4vw] flex-shrink-0">
            <div className="list-page-list">
              <ListItems
                items={items}
                basePath={basePath}
                getTitleStyle={getTitleStyle}
                categoryColor={categoryColor}
                setHoverSlug={setHoverSlug}
                onItemEnter={handleEnter}
                itemClassName="project-list-item group text-base md:text-[17px] block"
              />
            </div>
            <div className="projects-thumbnail">
              {activeItem && isThumbVisible && (
                <ListBackgroundThumb item={activeItem} visible={isThumbVisible} variant={listVariant} />
              )}
            </div>
          </div>
          <div aria-hidden style={{ flex: "1 1 0", minHeight: 0 }} />
        </section>
        {footer && (
          <>
            {footerSpacer}
            {footer}
          </>
        )}
      </>
    )
  }

  return (
    <>
      <ListPanView className="relative z-[1]">
        <div className="list-page-section text-left flex flex-col" style={listTextStyle}>
          <div className="min-h-[160vh] flex flex-col" style={{ paddingLeft: `${LIST_PADDING_LEFT_VW}vw` }}>
            <div aria-hidden style={{ height: `${LIST_BLOCK_TOP_VH}vh`, flexShrink: 0 }} />
            <div className="flex-shrink-0">
              <ListItems
                items={items}
                basePath={basePath}
                getTitleStyle={getTitleStyle}
                categoryColor={categoryColor}
                setHoverSlug={setHoverSlug}
                onItemEnter={handleEnter}
                itemClassName="project-list-item group text-base md:text-[17px] block"
              />
            </div>
            <div aria-hidden style={{ flex: "1 1 0", minHeight: 0 }} />
          </div>
          {footer && (
            <>
              {footerSpacer}
              <div style={{ paddingLeft: `${LIST_PADDING_LEFT_VW}vw`, paddingRight: "12vw" }}>
                {footer}
              </div>
            </>
          )}
        </div>
      </ListPanView>
    </>
  )
}
