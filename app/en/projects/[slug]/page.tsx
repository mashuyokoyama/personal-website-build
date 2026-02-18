import { PageLayout } from "@/components/page-layout"
import { DetailPageContent } from "@/components/detail-page-content"
import { notFound } from "next/navigation"
import { allProjects, getRelatedProjects } from "@/lib/data"

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }))
}

export default async function EnProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = allProjects.find((p) => p.slug === slug)
  if (!project) notFound()
  const relatedProjects = getRelatedProjects(project, allProjects).map((p) => ({ slug: p.slug, title: p.title }))
  return (
    <PageLayout lang="en">
      <DetailPageContent
        item={project}
        lang="en"
        backHref="/en/projects"
        relatedItems={{ label: "Other projects", items: relatedProjects, basePath: "/en/projects" }}
      />
    </PageLayout>
  )
}
