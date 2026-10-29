import type { Route } from '../lib/router'

/* ---------------------------------------------------------------
   The Gallery's three rooms.

   Geometry and copy in one place, because the plan drawing, the
   desktop preview band, the mobile carousel and the entry transition
   all have to agree about where a room is and what it says. The
   rectangles are the plan's own coordinates, so the transition can
   scale the real room the visitor clicked rather than an approximation
   of it.

   Four rooms. Three sit on the axis as before: the two current
   projects of her own and Archive. Professional is not another room in
   that line. It is one long room laid under both LLP and Faber, entered
   by a door from each, because it is the work she has done all along
   and both projects stand on it. LLP and Faber share a floor line so
   that it can run under them. It is deliberately off the grid of the
   rooms above: it starts in from LLP's outer wall and runs out past
   Faber, so the building reads as added to over time rather than
   drawn in one go. It is numbered 03 so the phone carousel,
   which follows this array, reaches it before Archive. The vestibule
   exists because an enfilade needs somewhere to enter from, and it is
   not a project.
   --------------------------------------------------------------- */

export type RoomId = 'llp' | 'faber' | 'professional' | 'archive'

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
    rect: { x: 78, y: 0, w: 289, h: 330 },
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
    rect: { x: 367, y: 44, w: 220, h: 286 },
  },
  {
    id: 'professional',
    n: '03',
    name: 'Professional',
    title: 'Professional work',
    orientation:
      'Digital wallets, payments and identity at Samsung, and consumer banking at Goldman Sachs.',
    to: '/professional',
    action: 'Enter',
    rect: { x: 132, y: 330, w: 528, h: 98 },
  },
  {
    id: 'archive',
    n: '04',
    name: 'Archive',
    title: 'Earlier work',
    orientation:
      'Architecture, computational design and other work from before I moved into product.',
    to: { href: 'https://mmenkiti.myportfolio.com/' },
    action: 'View archive',
    rect: { x: 587, y: 58, w: 47, h: 164 },
  },
]

export const VESTIBULE = { x: 6, y: 86, w: 72, h: 170 }

/** The plan's drawing area, with room for the wall thickness at the edges. */
export const PLAN_VIEWBOX = { x: -34, y: -10, w: 724, h: 448 }

export const byId = (id: RoomId) => ROOMS.find((r) => r.id === id)!

export const isExternal = (r: Room): r is Room & { to: { href: string } } =>
  typeof r.to !== 'string'
