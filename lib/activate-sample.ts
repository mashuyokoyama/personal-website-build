/** タッチの touchend と、その直後の click が同じ操作として二回来る。 */
const DUPLICATE_TAP_MS = 500

/**
 * タップした1本だけを再生する。
 * まだ止まっているときは、直前の touchend が再生できていなくても click でやり直す。
 * 鳴り始めた直後の重複イベントでは止めない。
 */
export function activateSample(
  audios: Array<HTMLAudioElement | null>,
  index: number,
  startedAt: { current: number },
) {
  const current = audios[index]
  if (!current) return
  const now = performance.now()
  if (!current.paused) {
    if (now - startedAt.current < DUPLICATE_TAP_MS) return
    current.pause()
    return
  }
  startedAt.current = now
  const pending = current.play()
  for (let i = 0; i < audios.length; i++) {
    const audio = audios[i]
    if (audio && i !== index) audio.pause()
  }
  void pending?.catch(() => undefined)
}
