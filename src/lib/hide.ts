import { useRef, useState } from 'react'
import { useScrollEffect } from './scroll'

/**
 * Fixed chrome that gets out of the way on the way down and comes back
 * on the way up. The Marker has behaved like this since V2; the mode
 * switch needs it too now that figures bleed to the full viewport and
 * can scroll underneath it.
 */
export function useScrollHide(after = 240) {
  const [hidden, setHidden] = useState(false)
  const last = useRef(0)
  useScrollEffect((y) => {
    if (Math.abs(y - last.current) > 6) {
      setHidden(y > after && y > last.current)
      last.current = y
    }
  })
  return hidden
}
