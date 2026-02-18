"use client"

import { AnimatedLink } from "./animated-link"
import { useTheme } from "./theme-provider"
import { UndecidedPlaylist } from "./undecided-playlist"
import { ArtworkVideoSection } from "./artwork-video-section"
import { layer1, layer2, layer3, supplementLetterSpacing } from "@/lib/text-layers"
import type { Project, Artwork, Credit } from "@/lib/data/types"

type Item = Project | Artwork

function isProject(item: Item): item is Project {
  return "note" in item
}

function hasPlaylist(item: Item): item is Project & { playlistId: string } {
  return typeof (item as any).playlistId === "string" && (item as any).playlistId.length > 0
}

/** 一覧ページと同じ左基軸。Projects / Artworks 一覧と個別ページで揃える。 */
const DETAIL_PAGE_PADDING_LEFT_VW = 10
const DETAIL_PAGE_PADDING_RIGHT_VW = 12

/** PC: 50–65vw・最大70vw、アスペクト比維持・上下余白。モバイル: 幅100%、高さ60–70vhで制限、超えたらスクロール。没入ではなく「距離が縮まる瞬間」用。 */
const THUMB_PC_WIDTH_VW = 60
const THUMB_PC_MAX_WIDTH_VW = 70
const THUMB_MOBILE_MAX_HEIGHT_VH = 65

/** 個別ページで表示する関連作品（一覧から排除した作品も含む） */
export interface RelatedItem {
  slug: string
  title: string
}

interface DetailPageContentProps {
  item: Item
  lang: "jp" | "en"
  backHref: string
  /** 関連作品（他プロジェクト or 他アートワーク）。一覧に載せていない作品もここから遷移可能にする */
  relatedItems?: { label: string; items: RelatedItem[]; basePath: string }
  /** 詳細テキスト（Projects のメインテキスト相当）。未指定の場合は非表示 */
  detailText?: string
}

function HowWeAcceptDetail({
  item,
  backHref,
  relatedItems,
  lang,
}: {
  item: Project
  backHref: string
  relatedItems?: { label: string; items: RelatedItem[]; basePath: string }
  lang: "jp" | "en"
}) {
  const { theme } = useTheme()
  const creditColor = layer2(theme)
  const supplementColor = layer3(theme)
  const hasThumb = !!item.thumbnail

  const detailJp = (
    <>
      <p className="whitespace-pre-wrap">
        HOW WE ACCEPT? は、
        {"\n"}
        黒瀧慧可と横山真洲による音響空間インスタレーションと対話を通した実験的セッションです。
      </p>
      <p className="whitespace-pre-wrap">
        私たちは、人間が本来持っている身体感覚と、それを受け入れ、許し合う感覚が、都市生活のなかで静かに失われていると感じています。
        {"\n"}
        HOW WE ACCEPT? は、「人は許されることで存在している」という感覚を、五感を通して再び思い出すための試みです。
      </p>
      <p className="whitespace-pre-wrap">
        私たちは人間の身体感覚が始まる場所として「胎児の成長過程」に着目し、Vol.1では、胎児が最初に獲得するとされる感覚の一つである触覚に焦点を当て、聴覚に依存しない超低周波の振動体験を通して、身体の深層に触れることを試みています。
      </p>
      <p className="whitespace-pre-wrap">
        本セッションは、空間音響装置の設計・制作と並行して進められた連続的なアクションの第一段階でもあります。
        {"\n"}
        Mogale Super Scooper を用いた超重低音域の振動体験、素材、温度、照明、動線を含む空間構成は、「触れる」という感覚を最大限に立ち上げるために設計されました。
        {"\n"}
        このプロセスは、今後の Vol.2 以降、そして音響装置そのものの発展へと連なっていきます。
      </p>
      <p className="whitespace-pre-wrap">
        体験の後には、視覚情報を抑えた空間で対話の時間を設けました。
        {"\n"}
        それぞれが感じた身体感覚を言葉にし、共有することで、個人的な体験が社会的な感覚へと開かれていく。
        {"\n"}
        HOW WE ACCEPT? は、そのための場でもあります。
      </p>
    </>
  )

  const detailEn = (
    <>
      <p className="whitespace-pre-wrap">
        HOW WE ACCEPT? is an experimental session of sound-space installation and dialogue
        {"\n"}
        by Eka Kurotaki and Mashu Yokoyama.
      </p>
      <p className="whitespace-pre-wrap">
        We feel that the bodily senses humans inherently possess, and the sense of acceptance and forgiveness,
        {"\n"}
        are quietly being lost in urban life. HOW WE ACCEPT? is an attempt to recall through the five senses the feeling that "we exist by being accepted."
      </p>
      <p className="whitespace-pre-wrap">
        Focusing on "fetal development" as where human bodily sensation begins, Vol.1 centers on touch—one of the first senses a fetus is said to acquire—through infra-low-frequency vibration experiences independent of hearing, exploring contact with the depths of the body.
      </p>
      <p className="whitespace-pre-wrap">
        This session also marks the first phase of a continuous action developed in parallel with the design and production of a spatial sound installation.
        {"\n"}
        The spatial configuration—including the Mogale Super Scooper for infra-bass vibration, materials, temperature, lighting, and circulation—was designed to maximize the sensation of "touching."
        {"\n"}
        This process will extend to Vol.2 and beyond, as well as to the evolution of the sound installation itself.
      </p>
      <p className="whitespace-pre-wrap">
        After the experience, we set aside time for dialogue in a space with reduced visual information.
        {"\n"}
        By putting into words and sharing the bodily sensations each person felt, personal experience opens onto social sensation.
        {"\n"}
        HOW WE ACCEPT? is also a place for that.
      </p>
    </>
  )

  return (
    <div
      className="min-h-screen py-24 flex flex-col -mx-6 md:-mx-12 lg:-mx-24"
      style={{ paddingLeft: `${DETAIL_PAGE_PADDING_LEFT_VW}vw`, paddingRight: `${DETAIL_PAGE_PADDING_RIGHT_VW}vw` }}
    >
      {/* タイトル（元レイアウトと同じ位置） */}
      <h1 className="text-lg tracking-wide mb-2" style={{ color: layer1(theme) }}>
        {item.title}
      </h1>
      {/* メタ情報 */}
      <p
        className="text-[11px] tracking-wide mb-8"
        style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
      >
        {item.year}
        {item.type ? ` · ${item.type}` : ""}
        {item.role ? ` · ${item.role}` : ""}
      </p>

      {/* メイン画像：左基軸に合わせる（self-start で flex 時の中央寄せを防ぐ） */}
      <figure className="mb-12 m-0 self-start" aria-hidden={!hasThumb}>
        <div
          className="w-full overflow-y-auto md:overflow-hidden md:max-h-none md:w-[60vw] md:max-w-[70vw]"
          style={{
            opacity: hasThumb ? 1 : 0.08,
            maxHeight: `${THUMB_MOBILE_MAX_HEIGHT_VH}vh`,
          }}
        >
          <div className="w-full md:aspect-[16/10]">
            {hasThumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnail}
                alt=""
                className="w-full h-auto object-contain object-left md:h-full"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full aspect-[16/10]" />
            )}
          </div>
        </div>
      </figure>

      {/* メインテキスト（日英で同一構造） */}
      <section
        className="mb-10 text-[11px] leading-relaxed space-y-4"
        style={{ color: supplementColor }}
      >
        {lang === "jp" ? detailJp : detailEn}
      </section>

      {/* Credits・関連・戻るリンクは元レイアウトに近い配置で補足として配置 */}
      <div className="space-y-1.5 mb-6 text-[0.75rem]">
        <p className="text-[10px] tracking-wide" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
          {item.role}
          {item.note ? ` (${item.note})` : ""}
        </p>
        {item.credits && item.credits.length > 0 && (
          <>
            {item.credits
              .filter((c: Credit) => c.kind !== "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-${idx}`}
                  className="text-[10px] tracking-wide"
                  style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
            {item.credits
              .filter((c: Credit) => c.kind === "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-support-${idx}`}
                  className="text-[9px] tracking-wide"
                  style={{ color: supplementColor, letterSpacing: supplementLetterSpacing, opacity: 0.9 }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
          </>
        )}
      </div>

      {relatedItems && relatedItems.items.length > 0 && (
        <div className="pt-6 mt-4 border-t" style={{ borderColor: supplementColor }}>
          <p className="text-[10px] tracking-wide mb-3" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
            {relatedItems.label}
          </p>
          <div className="flex flex-col gap-2">
            {relatedItems.items.map((r) => (
              <AnimatedLink
                key={r.slug}
                href={`${relatedItems.basePath}/${r.slug}`}
                className="text-[10px] block"
                style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
              >
                {r.title}
              </AnimatedLink>
            ))}
          </div>
        </div>
      )}

      <nav className="pt-8">
        <AnimatedLink
          href={backHref}
          className="text-xs"
          style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
        >
          {lang === "jp" ? "一覧" : "back"}
        </AnimatedLink>
      </nav>
    </div>
  )
}

/** Video Art 個別ページ：Projects と同じ表示順、動画を大きく表示（Lotus, AMV, ruwet 等） */
function VideoArtDetail({
  item,
  backHref,
  relatedItems,
  lang,
}: {
  item: Artwork
  backHref: string
  relatedItems?: { label: string; items: RelatedItem[]; basePath: string }
  lang: "jp" | "en"
}) {
  const { theme } = useTheme()
  const creditColor = layer2(theme)
  const supplementColor = layer3(theme)

  return (
    <div
      className="min-h-screen py-24 flex flex-col -mx-6 md:-mx-12 lg:-mx-24"
      style={{ paddingLeft: `${DETAIL_PAGE_PADDING_LEFT_VW}vw`, paddingRight: `${DETAIL_PAGE_PADDING_RIGHT_VW}vw` }}
    >
      {/* 1. タイトル */}
      <h1 className="text-lg tracking-wide mb-2" style={{ color: layer1(theme) }}>
        {item.title}
      </h1>
      {/* 2. メタ情報 */}
      <p
        className="text-[11px] tracking-wide mb-8"
        style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
      >
        {item.year}
        {item.type ? ` · ${item.type}` : ""}
        {item.role ? ` · ${item.role}` : ""}
      </p>
      {/* 3. メイン画像（動画・左基軸維持・左右余白均等＝幅80vw） */}
      <figure className="mb-12 m-0 self-start" aria-hidden>
        <div
          className="w-full overflow-y-auto md:overflow-hidden md:max-h-none md:w-[80vw]"
          style={{ maxHeight: "80vh" }}
        >
          <div className="w-full aspect-video md:aspect-[16/10]">
            <ArtworkVideoSection slug={item.slug} title={item.title} />
          </div>
        </div>
      </figure>
      {/* 4. 詳細テキスト（Video Art は通常なし） */}
      {/* 5. Credits */}
      <div className="space-y-1.5 mb-6 text-[0.75rem]">
        <p className="text-[10px] tracking-wide" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
          {item.role}
        </p>
        {item.credits && item.credits.length > 0 && (
          <>
            {item.credits
              .filter((c: Credit) => c.kind !== "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-${idx}`}
                  className="text-[10px] tracking-wide"
                  style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
            {item.credits
              .filter((c: Credit) => c.kind === "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-support-${idx}`}
                  className="text-[9px] tracking-wide"
                  style={{ color: supplementColor, letterSpacing: supplementLetterSpacing, opacity: 0.9 }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
          </>
        )}
      </div>
      {/* 6. 関連作品 */}
      {relatedItems && relatedItems.items.length > 0 && (
        <div className="pt-6 mt-4 border-t" style={{ borderColor: supplementColor }}>
          <p className="text-[10px] tracking-wide mb-3" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
            {relatedItems.label}
          </p>
          <div className="flex flex-col gap-2">
            {relatedItems.items.map((r) => (
              <AnimatedLink
                key={r.slug}
                href={`${relatedItems.basePath}/${r.slug}`}
                className="text-[10px] block"
                style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
              >
                {r.title}
              </AnimatedLink>
            ))}
          </div>
        </div>
      )}
      {/* 7. 戻るリンク */}
      <nav className="pt-8">
        <AnimatedLink
          href={backHref}
          className="text-xs"
          style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
        >
          {lang === "jp" ? "一覧" : "back"}
        </AnimatedLink>
      </nav>
    </div>
  )
}

const MIDORI_SO_EMBED_URL = "https://midori.so/"

function MidoriSoDetail({
  item,
  backHref,
  relatedItems,
  lang,
}: {
  item: Project
  backHref: string
  relatedItems?: { label: string; items: RelatedItem[]; basePath: string }
  lang: "jp" | "en"
}) {
  const { theme } = useTheme()
  const creditColor = layer2(theme)
  const supplementColor = layer3(theme)

  return (
    <div
      className="min-h-screen py-24 flex flex-col -mx-6 md:-mx-12 lg:-mx-24"
      style={{ paddingLeft: `${DETAIL_PAGE_PADDING_LEFT_VW}vw`, paddingRight: `${DETAIL_PAGE_PADDING_RIGHT_VW}vw` }}
    >
      {/* タイトル */}
      <h1 className="text-lg tracking-wide mb-2" style={{ color: layer1(theme) }}>
        {item.title}
      </h1>
      {/* メタ情報 */}
      <p
        className="text-[11px] tracking-wide mb-8"
        style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
      >
        {item.year}
        {item.type ? ` · ${item.type}` : ""}
        {item.role ? ` · ${item.role}` : ""}
      </p>

      {/* メイン：MIDORI.so サイト埋め込み（FV） */}
      <figure className="mb-12 m-0 self-start">
        <div
          className="w-full overflow-hidden md:overflow-hidden md:max-h-none md:w-[60vw] md:max-w-[70vw]"
          style={{ maxHeight: `${THUMB_MOBILE_MAX_HEIGHT_VH}vh` }}
        >
          <div className="w-full aspect-[4/3] md:aspect-[16/10]">
            <iframe
              src={MIDORI_SO_EMBED_URL}
              title="MIDORI.so"
              className="w-full h-full border-0 block"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </figure>

      {/* メインテキスト（日英） */}
      <section
        className="mb-10 text-[11px] leading-relaxed space-y-4"
        style={{ color: supplementColor }}
      >
        {lang === "jp" ? (
          <>
            <p className="whitespace-pre-wrap">
              MIDORI.soは「これからの働き方」の可能性を追求し、個が尊重される社会において、また見方を変えれば、個に分断されてしまった社会であるからこそ、大切な拠り所となるであろう仲間とともに働く場です。
            </p>
            <p className="whitespace-pre-wrap">
              様々な仕事／国籍／趣味／考えを持つメンバーが集まり、各自の仕事を遂行するという意味での「働く」だけではなく、集まったメンバー同志が相互に関係しあい「働きあう」場です。
            </p>
            <p className="whitespace-pre-wrap">
              そのような創造的混沌とも呼べる状況の中から生まれる「何か」をみんなで楽しめる場を目指しています。
            </p>
          </>
        ) : (
          <>
            <p className="whitespace-pre-wrap">
              MIDORI.so pursues possibilities for "how we will work" and is a place to work with companions who can become a vital anchor—both in a society that respects the individual and, from another perspective, precisely because we live in a society fragmented into individuals.
            </p>
            <p className="whitespace-pre-wrap">
              Members with diverse jobs, nationalities, interests, and perspectives gather here. It is not only a place to "work" in the sense of each person carrying out their own tasks, but a place where members relate to one another and "work together."
            </p>
            <p className="whitespace-pre-wrap">
              We aim to create a space where everyone can enjoy the "something" that emerges from such a situation—which might be called creative chaos.
            </p>
          </>
        )}
      </section>

      {/* Credits・関連・戻るリンク */}
      <div className="space-y-1.5 mb-6 text-[0.75rem]">
        <p className="text-[10px] tracking-wide" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
          {item.role}
          {item.note ? ` (${item.note})` : ""}
        </p>
        {item.credits && item.credits.length > 0 && (
          <>
            {item.credits
              .filter((c: Credit) => c.kind !== "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-${idx}`}
                  className="text-[10px] tracking-wide"
                  style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
            {item.credits
              .filter((c: Credit) => c.kind === "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-support-${idx}`}
                  className="text-[9px] tracking-wide"
                  style={{ color: supplementColor, letterSpacing: supplementLetterSpacing, opacity: 0.9 }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
          </>
        )}
      </div>

      {relatedItems && relatedItems.items.length > 0 && (
        <div className="pt-6 mt-4 border-t" style={{ borderColor: supplementColor }}>
          <p className="text-[10px] tracking-wide mb-3" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
            {relatedItems.label}
          </p>
          <div className="flex flex-col gap-2">
            {relatedItems.items.map((r) => (
              <AnimatedLink
                key={r.slug}
                href={`${relatedItems.basePath}/${r.slug}`}
                className="text-[10px] block"
                style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
              >
                {r.title}
              </AnimatedLink>
            ))}
          </div>
        </div>
      )}

      <nav className="pt-8">
        <AnimatedLink
          href={backHref}
          className="text-xs"
          style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
        >
          {lang === "jp" ? "一覧" : "back"}
        </AnimatedLink>
      </nav>
    </div>
  )
}

function UndecidedDetail({
  item,
  backHref,
  relatedItems,
  lang,
}: {
  item: Project & { playlistId: string }
  backHref: string
  relatedItems?: { label: string; items: RelatedItem[]; basePath: string }
  lang: "jp" | "en"
}) {
  const { theme } = useTheme()
  const creditColor = layer2(theme)
  const supplementColor = layer3(theme)
  const hasThumb = !!item.thumbnail

  const detailTextJp =
    "個性溢れる生き方をする人たちと音と話を交えながら、今を生きること、「現在地」について考え探していくラジオ番組"
  const detailTextEn =
    "This program shares music and conversations with people who live uniquely, inviting listeners to reflect on living in the present and exploring their own place in life."

  return (
    <div
      className="min-h-screen py-24 flex flex-col -mx-6 md:-mx-12 lg:-mx-24"
      style={{ paddingLeft: `${DETAIL_PAGE_PADDING_LEFT_VW}vw`, paddingRight: `${DETAIL_PAGE_PADDING_RIGHT_VW}vw` }}
    >
      {/* タイトル */}
      <h1 className="text-lg tracking-wide mb-2" style={{ color: layer1(theme) }}>
        {item.title}
      </h1>
      {/* メタ情報 */}
      <p
        className="text-[11px] tracking-wide mb-8"
        style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
      >
        {item.year}
        {item.type ? ` · ${item.type}` : ""}
        {item.role ? ` · ${item.role}` : ""}
      </p>

      {/* メイン画像：左基軸に合わせる */}
      <figure className="mb-12 m-0 self-start" aria-hidden={!hasThumb}>
        <div
          className="w-full overflow-y-auto md:overflow-hidden md:max-h-none md:w-[60vw] md:max-w-[70vw]"
          style={{
            opacity: hasThumb ? 1 : 0.08,
            maxHeight: `${THUMB_MOBILE_MAX_HEIGHT_VH}vh`,
          }}
        >
          <div className="w-full md:aspect-[16/10]">
            {hasThumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnail}
                alt=""
                className="w-full h-auto object-contain object-left md:h-full"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full aspect-[16/10]" />
            )}
          </div>
        </div>
      </figure>

      {/* メインテキスト（日英分け） */}
      <section
        className="mb-10 text-[11px] leading-relaxed space-y-4"
        style={{ color: supplementColor }}
      >
        <p className="whitespace-pre-wrap">{lang === "jp" ? detailTextJp : detailTextEn}</p>
      </section>

      {/* Credits */}
      <div className="space-y-1.5 mb-6 text-[0.75rem]">
        <p className="text-[10px] tracking-wide" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
          {item.role}
          {item.note ? ` (${item.note})` : ""}
        </p>
        {item.credits && item.credits.length > 0 && (
          <>
            {item.credits
              .filter((c: Credit) => c.kind !== "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-${idx}`}
                  className="text-[10px] tracking-wide"
                  style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
            {item.credits
              .filter((c: Credit) => c.kind === "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-support-${idx}`}
                  className="text-[9px] tracking-wide"
                  style={{ color: supplementColor, letterSpacing: supplementLetterSpacing, opacity: 0.9 }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
          </>
        )}
      </div>

      {/* Undecided プレイリスト（動画候補）：フル幅でスクロールバーを長く表示 */}
      <div className="mb-12 self-start w-full">
        <UndecidedPlaylist playlistId={item.playlistId} />
      </div>

      {relatedItems && relatedItems.items.length > 0 && (
        <div className="pt-6 mt-4 border-t" style={{ borderColor: supplementColor }}>
          <p className="text-[10px] tracking-wide mb-3" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
            {relatedItems.label}
          </p>
          <div className="flex flex-col gap-2">
            {relatedItems.items.map((r) => (
              <AnimatedLink
                key={r.slug}
                href={`${relatedItems.basePath}/${r.slug}`}
                className="text-[10px] block"
                style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
              >
                {r.title}
              </AnimatedLink>
            ))}
          </div>
        </div>
      )}

      <nav className="pt-8">
        <AnimatedLink
          href={backHref}
          className="text-xs"
          style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
        >
          {lang === "jp" ? "一覧" : "back"}
        </AnimatedLink>
      </nav>
    </div>
  )
}

function TheFormOfQuietDetail({
  item,
  backHref,
  relatedItems,
  lang,
}: {
  item: Project
  backHref: string
  relatedItems?: { label: string; items: RelatedItem[]; basePath: string }
  lang: "jp" | "en"
}) {
  const { theme } = useTheme()
  const creditColor = layer2(theme)
  const supplementColor = layer3(theme)
  const hasThumb = !!item.thumbnail

  return (
    <div
      className="min-h-screen py-24 flex flex-col -mx-6 md:-mx-12 lg:-mx-24"
      style={{ paddingLeft: `${DETAIL_PAGE_PADDING_LEFT_VW}vw`, paddingRight: `${DETAIL_PAGE_PADDING_RIGHT_VW}vw` }}
    >
      {/* タイトル */}
      <h1 className="text-lg tracking-wide mb-2" style={{ color: layer1(theme) }}>
        {item.title}
      </h1>
      {/* メタ情報 */}
      <p
        className="text-[11px] tracking-wide mb-8"
        style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
      >
        {item.year}
        {item.type ? ` · ${item.type}` : ""}
        {item.role ? ` · ${item.role}` : ""}
      </p>

      {/* メイン画像：左基軸に合わせる */}
      <figure className="mb-12 m-0 self-start" aria-hidden={!hasThumb}>
        <div
          className="w-full overflow-y-auto md:overflow-hidden md:max-h-none md:w-[60vw] md:max-w-[70vw]"
          style={{
            opacity: hasThumb ? 1 : 0.08,
            maxHeight: `${THUMB_MOBILE_MAX_HEIGHT_VH}vh`,
          }}
        >
          <div className="w-full md:aspect-[16/10]">
            {hasThumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.thumbnail}
                alt=""
                className="w-full h-auto object-contain object-left md:h-full"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full aspect-[16/10]" />
            )}
          </div>
        </div>
      </figure>

      {/* メインテキスト（日英） */}
      <section
        className="mb-10 text-[11px] leading-relaxed space-y-4"
        style={{ color: supplementColor }}
      >
        {lang === "jp" ? (
          <>
            <p className="whitespace-pre-wrap">
              Common Uncommonで行われたBraun Audio企画展The Form of Quietにて
            </p>
            <p className="whitespace-pre-wrap">
              1960年代ヴィンテージの Braun Audio 3台・スピーカー5台を用いた、サウンドインスタレーションを行いました。ドイツを源流とするアンビエントミュージックや環境音をミックスしたサウンドで、"現実と夢""日常と非日常"の間を漂うサウンドスケープを描きました。
            </p>
          </>
        ) : (
          <>
            <p className="whitespace-pre-wrap">
              At The Form of Quiet, a Braun Audio exhibition held at Common Uncommon
            </p>
            <p className="whitespace-pre-wrap">
              we presented a sound installation using three 1960s vintage Braun Audio units and five speakers. With a mix of ambient music rooted in Germany and environmental sounds, we created a soundscape that drifts between "reality and dream" and "the everyday and the extraordinary."
            </p>
          </>
        )}
      </section>

      {/* Credits */}
      <div className="space-y-1.5 mb-6 text-[0.75rem]">
        <p className="text-[10px] tracking-wide" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
          {item.role}
          {item.note ? ` (${item.note})` : ""}
        </p>
        {item.credits && item.credits.length > 0 && (
          <>
            {item.credits
              .filter((c: Credit) => c.kind !== "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-${idx}`}
                  className="text-[10px] tracking-wide"
                  style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
            {item.credits
              .filter((c: Credit) => c.kind === "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-support-${idx}`}
                  className="text-[9px] tracking-wide"
                  style={{ color: supplementColor, letterSpacing: supplementLetterSpacing, opacity: 0.9 }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
          </>
        )}
      </div>

      {relatedItems && relatedItems.items.length > 0 && (
        <div className="pt-6 mt-4 border-t" style={{ borderColor: supplementColor }}>
          <p className="text-[10px] tracking-wide mb-3" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
            {relatedItems.label}
          </p>
          <div className="flex flex-col gap-2">
            {relatedItems.items.map((r) => (
              <AnimatedLink
                key={r.slug}
                href={`${relatedItems.basePath}/${r.slug}`}
                className="text-[10px] block"
                style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
              >
                {r.title}
              </AnimatedLink>
            ))}
          </div>
        </div>
      )}

      <nav className="pt-8">
        <AnimatedLink
          href={backHref}
          className="text-xs"
          style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
        >
          {lang === "jp" ? "一覧" : "back"}
        </AnimatedLink>
      </nav>
    </div>
  )
}

export function DetailPageContent({ item, lang, backHref, relatedItems, detailText }: DetailPageContentProps) {
  const { theme } = useTheme()
  const titleColor = layer1(theme)
  const creditColor = layer2(theme)
  const supplementColor = layer3(theme)
  const hasThumb = !!item.thumbnail

  if (isProject(item) && item.slug === "midori-so") {
    return (
      <>
        <MidoriSoDetail item={item} backHref={backHref} relatedItems={relatedItems} lang={lang} />
      </>
    )
  }

  if (hasPlaylist(item) && item.slug === "undecided") {
    return (
      <>
        <UndecidedDetail item={item} backHref={backHref} relatedItems={relatedItems} lang={lang} />
      </>
    )
  }

  if (isProject(item) && item.slug === "the-form-of-quiet") {
    return (
      <>
        <TheFormOfQuietDetail item={item} backHref={backHref} relatedItems={relatedItems} lang={lang} />
      </>
    )
  }

  if (isProject(item) && item.slug === "how-we-accept") {
    return (
      <>
        <HowWeAcceptDetail item={item} backHref={backHref} relatedItems={relatedItems} lang={lang} />
      </>
    )
  }

  if (!isProject(item) && item.type === "Video Art") {
    return (
      <>
        <VideoArtDetail item={item as Artwork} backHref={backHref} relatedItems={relatedItems} lang={lang} />
      </>
    )
  }

  return (
    <>
      <div
        className="min-h-screen py-24 flex flex-col -mx-6 md:-mx-12 lg:-mx-24"
        style={{ paddingLeft: `${DETAIL_PAGE_PADDING_LEFT_VW}vw`, paddingRight: `${DETAIL_PAGE_PADDING_RIGHT_VW}vw` }}
      >
      {/* タイトル */}
      <h1 className="text-lg tracking-wide mb-2" style={{ color: titleColor }}>
        {item.title}
      </h1>
      {/* メタ情報 */}
      <p
        className="text-[11px] tracking-wide mb-8"
        style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
      >
        {item.year}
        {item.type ? ` · ${item.type}` : ""}
        {item.role ? ` · ${item.role}` : ""}
      </p>
      {/* メイン画像：Video Art の場合は YouTube プレイヤー、それ以外は静止画サムネ（HOW WE ACCEPT? と同じレイアウト） */}
      {!isProject(item) && item.type === "Video Art" ? (
        <figure className="mb-12 m-0 self-start" aria-hidden>
          <div
            className="w-full overflow-y-auto md:overflow-hidden md:max-h-none md:w-[60vw] md:max-w-[70vw]"
            style={{ maxHeight: `${THUMB_MOBILE_MAX_HEIGHT_VH}vh` }}
          >
            <div className="w-full md:aspect-[16/10]">
              <ArtworkVideoSection slug={item.slug} title={item.title} />
            </div>
          </div>
        </figure>
      ) : (
        <figure className="mb-12 m-0 self-start" aria-hidden={!hasThumb}>
          <div
            className="w-full overflow-y-auto md:overflow-hidden md:max-h-none md:w-[60vw] md:max-w-[70vw]"
            style={{
              opacity: hasThumb ? 1 : 0.08,
              maxHeight: `${THUMB_MOBILE_MAX_HEIGHT_VH}vh`,
            }}
          >
            <div className="w-full md:aspect-[16/10]">
              {hasThumb ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-full h-auto object-contain object-left md:h-full"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-full aspect-[16/10]" />
              )}
            </div>
          </div>
        </figure>
      )}

      {/* 詳細テキスト */}
      {detailText && (
        <section
          className="mb-10 text-[11px] leading-relaxed space-y-4"
          style={{ color: supplementColor }}
        >
          <p className="whitespace-pre-wrap">{detailText}</p>
        </section>
      )}

      {/* Credits */}
      <div className="space-y-1.5 mb-6">
        {/* 既存 role は補足として先頭に一行だけ残す */}
        <p className="text-[10px] tracking-wide" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
          {item.role}
          {isProject(item) && item.note ? ` (${item.note})` : ""}
        </p>
        {item.credits && item.credits.length > 0 && (
          <>
            {item.credits
              .filter((c: Credit) => c.kind !== "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-${idx}`}
                  className="text-[10px] tracking-wide"
                  style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
            {item.credits
              .filter((c: Credit) => c.kind === "support")
              .map((credit: Credit, idx: number) => (
                <p
                  key={`${credit.role}-support-${idx}`}
                  className="text-[9px] tracking-wide"
                  style={{ color: supplementColor, letterSpacing: supplementLetterSpacing, opacity: 0.9 }}
                >
                  {credit.role ? `${credit.role}: ` : ""}
                  {credit.names.join(", ")}
                </p>
              ))}
          </>
        )}
      </div>

      {/* Undecided 専用: プレイリスト */}
      {hasPlaylist(item) && item.slug === "undecided" && (
        <div className="mb-12 self-start w-full">
          <UndecidedPlaylist playlistId={item.playlistId} />
        </div>
      )}

      {/* 関連作品 */}
      {relatedItems && relatedItems.items.length > 0 && (
        <div className="pt-6 mt-4 border-t" style={{ borderColor: supplementColor }}>
          <p className="text-[10px] tracking-wide mb-3" style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}>
            {relatedItems.label}
          </p>
          <div className="flex flex-col gap-2">
            {relatedItems.items.map((r) => (
              <AnimatedLink
                key={r.slug}
                href={`${relatedItems.basePath}/${r.slug}`}
                className="text-[10px] block"
                style={{ color: creditColor, letterSpacing: supplementLetterSpacing }}
              >
                {r.title}
              </AnimatedLink>
            ))}
          </div>
        </div>
      )}

      <nav className="pt-8">
        <AnimatedLink
          href={backHref}
          className="text-xs"
          style={{ color: supplementColor, letterSpacing: supplementLetterSpacing }}
        >
          {lang === "jp" ? "一覧" : "back"}
        </AnimatedLink>
      </nav>
    </div>
    </>
  )
}
