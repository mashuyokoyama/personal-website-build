import { PageLayout } from "@/components/page-layout"
import { DetailPageContent } from "@/components/detail-page-content"
import { notFound } from "next/navigation"
import { allArtworks, getRelatedArtworks } from "@/lib/data"

export function generateStaticParams() {
  return allArtworks.map((a) => ({ slug: a.slug }))
}

export default async function EnArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artwork = allArtworks.find((a) => a.slug === slug)
  if (!artwork) notFound()
  const relatedArtworks = getRelatedArtworks(artwork, allArtworks).map((a) => ({ slug: a.slug, title: a.title }))
  return (
    <PageLayout lang="en">
      <DetailPageContent
        item={artwork}
        lang="en"
        backHref="/en/artworks"
        relatedItems={{ label: "Other artworks", items: relatedArtworks, basePath: "/en/artworks" }}
      />
    </PageLayout>
  )
}
