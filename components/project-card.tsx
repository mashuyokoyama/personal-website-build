"use client"

import { AnimatedLink } from "./animated-link"
import { useTheme } from "./theme-provider"

interface ProjectCardProps {
  title: string
  tag: string
  href: string
  lang: "jp" | "en"
}

export function ProjectCard({ title, tag, href }: ProjectCardProps) {
  const { theme } = useTheme()
  const color = theme === "jp" ? "#000000" : "#ffffff"

  return (
    <AnimatedLink href={href} className="block py-8" style={{ color }}>
      <div className="project-card__inner">
        <div className="project-card__text space-y-3">
          <h3 className="text-sm tracking-wide">{title}</h3>
          <p className="text-xs tracking-widest uppercase opacity-70">{tag}</p>
        </div>
        <div className="project-card__thumb">
          {/* サムネイルは後工程で img または placeholder に差し替え */}
          <div className="aspect-[16/10] w-full max-w-[320px] bg-black/5" aria-hidden />
        </div>
      </div>
    </AnimatedLink>
  )
}
