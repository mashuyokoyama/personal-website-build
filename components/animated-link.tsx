"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePageTransition } from "./page-transition-context"

type AnimatedLinkProps = React.ComponentProps<typeof Link> & {
  /** 同一サイト内のパス（/jp/..., /en/...）のときフェードアウトしてから遷移する。それ以外は通常の Link として動作 */
  href: string
}

export function AnimatedLink({ href, onClick, onMouseEnter, children, ...rest }: AnimatedLinkProps) {
  const router = useRouter()
  const ctx = usePageTransition()
  const isInternal = typeof href === "string" && href.startsWith("/") && !href.startsWith("//")

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isInternal) router.prefetch(href)
    onMouseEnter?.(e)
  }

  if (ctx && isInternal) {
    return (
      <Link
        href={href}
        onClick={(e) => {
          e.preventDefault()
          ctx.animateNavigate(href)
          onClick?.(e)
        }}
        onMouseEnter={handleMouseEnter}
        {...rest}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link href={href} onClick={onClick} onMouseEnter={onMouseEnter} {...rest}>
      {children}
    </Link>
  )
}
