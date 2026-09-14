import { useEffect, useRef } from 'react'

type Sub = (y: number, vh: number) => void

const subs = new Set<Sub>()
let frame = 0

function flush() {
  frame = 0
  const y = window.scrollY
  const vh = window.innerHeight
  subs.forEach((s) => s(y, vh))
}

function request() {
  if (!frame) frame = requestAnimationFrame(flush)
}

let bound = false
function bind() {
  if (bound) return
  bound = true
  window.addEventListener('scroll', request, { passive: true })
  window.addEventListener('resize', request, { passive: true })
}

/**
 * Subscribe to scroll without re-rendering. Callbacks run in one shared
 * rAF, so twenty scroll-driven components cost one layout read per frame.
 */
export function useScrollEffect(fn: Sub, deps: unknown[] = []) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => {
    bind()
    const s: Sub = (y, vh) => ref.current(y, vh)
    subs.add(s)
    s(window.scrollY, window.innerHeight)
    return () => {
      subs.delete(s)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const inv = (a: number, b: number, v: number) => clamp01((v - a) / (b - a))
/** Smooth ramp used for anything that should feel like matter, not maths. */
export const ease = (t: number) => t * t * (3 - 2 * t)

/**
 * Progress of a tall element through the viewport, 0 when its top meets
 * the viewport top, 1 when its bottom meets the viewport bottom. Used for
 * sticky choreography where normal scrolling must stay predictable.
 */
export function stickyProgress(el: HTMLElement, vh: number) {
  const r = el.getBoundingClientRect()
  const total = r.height - vh
  if (total <= 0) return clamp01(-r.top / Math.max(1, r.height))
  return clamp01(-r.top / total)
}

/**
 * How much an element is "in charge" of the viewport: 0 while it is far
 * away, 1 while its centre sits at the viewport centre. This is the
 * threshold value — a continuum between page and room.
 */
export function influence(el: HTMLElement, vh: number, band = 0.62) {
  const r = el.getBoundingClientRect()
  const centre = r.top + r.height / 2
  const d = Math.abs(centre - vh / 2) / (vh * band)
  return ease(clamp01(1 - d))
}
