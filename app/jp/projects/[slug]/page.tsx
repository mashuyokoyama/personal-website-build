import { PageLayout } from "@/components/page-layout"
import { DetailPageContent } from "@/components/detail-page-content"
import { notFound } from "next/navigation"
import { allProjects, getRelatedProjects } from "@/lib/data"

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }))
}

export default async function JpProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = allProjects.find((p) => p.slug === slug)
  if (!project) notFound()
  const relatedProjects = getRelatedProjects(project, allProjects).map((p) => ({ slug: p.slug, title: p.title }))
  return (
    <PageLayout lang="jp">
      <DetailPageContent
        item={project}
        lang="jp"
        backHref="/jp/projects"
        relatedItems={{ label: "他のプロジェクト", items: relatedProjects, basePath: "/jp/projects" }}
      />
    </PageLayout>
  )
}
