import { PageLayout } from "@/components/page-layout"
import { DetailPageContent } from "@/components/detail-page-content"
import { notFound } from "next/navigation"
import { allArtworks, getRelatedArtworks } from "@/lib/data"

export function generateStaticParams() {
  return allArtworks.map((a) => ({ slug: a.slug }))
}

export default async function JpArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artwork = allArtworks.find((a) => a.slug === slug)
  if (!artwork) notFound()
  const relatedArtworks = getRelatedArtworks(artwork, allArtworks).map((a) => ({ slug: a.slug, title: a.title }))
  return (
    <PageLayout lang="jp">
      <DetailPageContent
        item={artwork}
        lang="jp"
        backHref="/jp/artworks"
        relatedItems={{ label: "他のアートワーク", items: relatedArtworks, basePath: "/jp/artworks" }}
      />
    </PageLayout>
  )
}
