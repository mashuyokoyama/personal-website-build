export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ paddingLeft: "10vw", paddingRight: "12vw" }}
      aria-hidden
    >
      <div
        className="w-24 h-4 rounded animate-pulse"
        style={{ backgroundColor: "var(--color-layer3, rgba(0,0,0,0.1))" }}
      />
    </div>
  )
}
