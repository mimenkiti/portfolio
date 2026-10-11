import { useEffect } from 'react'
import type { Route } from './router'

export type World = 'global' | 'gallery' | 'llp' | 'faber'

/**
 * The index gets its own world rather than sharing 'global' with About.
 * About is back matter and belongs on plain paper; the index is the
 * Gallery, with its own neutral environment and three room states.
 */
const WORLD: Record<Route, World> = {
  '/': 'gallery',
  '/llp': 'llp',
  '/faber': 'faber',
  '/about': 'global',
}

/** Worlds that announce themselves on arrival. The cover does not. */
const ENTRANCE: World[] = ['llp', 'faber']

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
    // Leaving the Gallery clears whichever room state it was holding.
    if (world !== 'gallery') {
      document.documentElement.classList.remove('room-llp', 'room-faber', 'room-archive')
    }

    if (!ENTRANCE.includes(world) || prev === world) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = document.createElement('div')
    el.className = `world-in world-in--${world}`
    document.body.appendChild(el)
    const t = window.setTimeout(() => el.remove(), 1600)
    return () => {
      window.clearTimeout(t)
      el.remove()
      // Undo this run's claim on the world. Without it, a mount that is torn
      // down at once (StrictMode does this to every component in
      // development) leaves `data-world` already set, so the mount that stays
      // reads it as "already here" and the entrance never plays. On a real
      // route change the next effect sets the new world immediately after,
      // in the same commit, so nothing paints in between.
      if (prev) document.documentElement.dataset.world = prev
      else delete document.documentElement.dataset.world
    }
  }, [route])
}
