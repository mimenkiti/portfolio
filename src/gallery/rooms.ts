import type { Route } from '../lib/router'

/* ---------------------------------------------------------------
   The Gallery's three rooms.

   Geometry and copy in one place, because the plan drawing, the
   desktop preview band, the mobile carousel and the entry transition
   all have to agree about where a room is and what it says. The
   rectangles are the plan's own coordinates, so the transition can
   scale the real room the visitor clicked rather than an approximation
   of it.

   Three rooms only. The vestibule exists because an enfilade needs
   somewhere to enter from, and it is not a project.
   --------------------------------------------------------------- */

export type RoomId = 'llp' | 'faber' | 'archive'

export type Room = {
  id: RoomId
  /** Displayed as `01`, and spoken as "room one". */
  n: string
  name: string
  /** The project's own title, in her words. */
  title: string
  /** One plain-English sentence. No metadata, no stack, no evidence. */
  orientation: string
  /** Where entering goes. External rooms open in a new tab. */
  to: Route | { href: string }
  action: string
  /** Interior rectangle in the plan's viewBox units. */
  rect: { x: number; y: number; w: number; h: number }
}

/* "Language Learning Product" is Michelle's expansion of LLP, confirmed
   by her rather than taken from the repository, which does not record it
   anywhere. It is written out here, in the preview a cold reader meets
   first, and once more in the LLP page's own header. Everywhere else the
   initials stand on their own. */
export const ROOMS: Room[] = [
  {
    id: 'llp',
    n: '01',
    name: 'LLP',
    title: 'Learning a heritage language',
    orientation:
      'Language Learning Product: a working heritage-language tool that starts with Igbo, where the lesson happens inside a conversation rather than before one.',
    to: '/llp',
    action: 'Enter',
    rect: { x: 78, y: 0, w: 289, h: 356 },
  },
  {
    id: 'faber',
    n: '02',
    name: 'Faber',
    title: 'Making my way back to making',
    orientation:
      'A design and DIY companion that helps you understand designed objects, how they\u2019re made, and how you could make them yourself.',
    to: '/faber',
    action: 'Enter',
    rect: { x: 367, y: 26, w: 220, h: 282 },
  },
  {
    id: 'archive',
    n: '03',
    name: 'Archive',
    title: 'Earlier work',
    orientation:
      'Architecture, computational design and other work from before I moved into product.',
    to: { href: 'https://mmenkiti.myportfolio.com/' },
    action: 'View archive',
    rect: { x: 587, y: 76, w: 47, h: 180 },
  },
]

export const VESTIBULE = { x: 6, y: 86, w: 72, h: 170 }

/** The plan's drawing area, with room for the wall thickness at the edges. */
export const PLAN_VIEWBOX = { x: -34, y: -10, w: 700, h: 376 }

export const byId = (id: RoomId) => ROOMS.find((r) => r.id === id)!

export const isExternal = (r: Room): r is Room & { to: { href: string } } =>
  typeof r.to !== 'string'
