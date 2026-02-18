"use client"

export function ProjectsLayout() {
  return (
    <div className="projects-layout">
      <div className="projects-list">
        <div className="project-item">HOW WE ACCEPT?</div>
        <div className="project-item">The Form of Quiet</div>
        <div className="project-item">Undecided</div>
        <div className="project-item">MIDORI.so</div>
      </div>

      <div className="projects-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/sample.jpg" alt="" />
      </div>
    </div>
  )
}

