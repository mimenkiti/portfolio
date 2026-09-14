import { useEffect, useState } from 'react'

/** A media query as state. Used where the DOM itself should differ, not just its styling. */
export function useMedia(query: string): boolean {
  const [on, setOn] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const fn = () => setOn(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [query])
  return on
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
