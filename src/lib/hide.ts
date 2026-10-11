import { useRef, useState } from 'react'
import { useScrollEffect } from './scroll'

/**
 * Fixed chrome that gets out of the way on the way down and comes back
 * on the way up. The Marker has behaved like this since V2; the mode
 * switch needs it too now that figures bleed to the full viewport and
 * can scroll underneath it.
 */
/**
 * Until this time, scrolling is the page's own doing, not the reader's.
 *
 * A mode switch pins the sentence being read by scrolling the page,
 * often a few hundred pixels down. Read as a scroll, that hid the mode
 * switch and the Marker the instant the switch had been used, so the
 * control to go back was gone until the reader scrolled up to find it.
 */
let holdUntil = 0

/** Keep the chrome where it is while the page scrolls itself. */
export function holdChrome(ms: number) {
  holdUntil = Math.max(holdUntil, performance.now() + ms)
}

export function useScrollHide(after = 240) {
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)
  useScrollEffect((y) => {
    if (performance.now() < holdUntil) {
      setHidden(false)
      last.current = y
      return
    }
    if (Math.abs(y - last.current) > 6) {
      setHidden(y > after && y > last.current)
      last.current = y
    }
  })
  return hidden
}
