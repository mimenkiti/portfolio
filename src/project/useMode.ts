import { useCallback, useState } from 'react'
import type { Mode } from './blocks'

const MORPH_MS = 820

/**
 * Switching mode is not a route change: the container stays mounted, the
 * grid tracks animate, and the block nearest the reader's eye is *pinned*
 * for the duration of the transition.
 *
 * Pinning has to be continuous, not a single correction. The tracks
 * animate over ~750ms, so the text reflows the whole way and a block's
 * final resting position is not knowable on the frame after the swap —
 * measuring once put the reader 800px from where they had been. Holding
 * the anchor still every frame instead makes the composition appear to
 * resolve *around* the sentence they were reading.
 */
export function useMode(initial: Mode = 'experience') {
  const [mode, setMode] = useState<Mode>(initial)
  const [morphing, setMorphing] = useState(false)

  const switchTo = useCallback((next: Mode) => {
    const eyeline = window.innerHeight * 0.3
    let anchorId: string | null = null
    let anchorTop = 0

    // The block the eyeline is *inside* — the last one that starts above
    // it — is what the reader is actually reading. Fall back to the first
    // block below if they are above all of them.
    const cands = Array.from(document.querySelectorAll<HTMLElement>('[data-b][data-anchor]'))
    for (const el of cands) {
      const top = el.getBoundingClientRect().top
      if (top <= eyeline + 1) {
        anchorId = el.dataset.b || null
        anchorTop = top
      } else if (anchorId === null) {
        anchorId = el.dataset.b || null
        anchorTop = top
        break
      } else break
    }

    setMorphing(true)
    setMode(next)

    const until = performance.now() + MORPH_MS
    const step = () => {
      if (anchorId) {
        const el = document.querySelector<HTMLElement>(`[data-b="${anchorId}"]`)
        if (el) {
          const drift = el.getBoundingClientRect().top - anchorTop
          if (Math.abs(drift) > 0.5) window.scrollBy(0, drift)
        }
      }
      if (performance.now() < until) requestAnimationFrame(step)
      else setMorphing(false)
    }
    requestAnimationFrame(step)
  }, [])

  return { mode, morphing, switchTo }
}
