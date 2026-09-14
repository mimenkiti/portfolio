import { useEffect } from 'react'
import type { Route } from './router'

export type World = 'global' | 'llp' | 'faber'

const WORLD: Record<Route, World> = {
  '/': 'global',
  '/llp': 'llp',
  '/faber': 'faber',
  '/about': 'global',
}

/**
 * Applies the project's world to the document root and plays its
 * entrance. The entrances use different verbs on purpose: LLP *wakes*
 * (a warm bloom, because it is temporal), Faber is *drawn* (a drafting
 * grid constructs, because it is spatial). The visitor should register
 * the change of world before reading a single word.
 */
export function useWorld(route: Route) {
  useEffect(() => {
    const world = WORLD[route] || 'global'
    const prev = document.documentElement.dataset.world
    document.documentElement.dataset.world = world

    if (world === 'global' || prev === world) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = document.createElement('div')
    el.className = `world-in world-in--${world}`
    document.body.appendChild(el)
    const t = window.setTimeout(() => el.remove(), 1600)
    return () => {
      window.clearTimeout(t)
      el.remove()
    }
  }, [route])
}
