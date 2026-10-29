import type { Route } from '../lib/router'

/* ---------------------------------------------------------------
   The Gallery's rooms.

   The rooms' copy and order, shared by the plan drawing, the desktop
   preview band, the mobile carousel and the entry transition. Their
   geometry lives in layout.ts, because the plan is drawn to fit the
   window rather than at one fixed size.

   Four rooms: LLP, Faber and Archive on the axis, and Professional as
   one long room under LLP and Faber. Professional is numbered 03 so the
   phone carousel, which follows this array, reaches it before Archive.
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
  },
  {
    id: 'professional',
    n: '03',
    name: 'Professional',
    title: 'Professional work',
    orientation:
      'Consumer technology, payments, digital identity, and early-stage product development at Samsung, Goldman Sachs, and Spatio Metrics.',
    to: '/professional',
    action: 'Enter',
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
  },
]

export const byId = (id: RoomId) => ROOMS.find((r) => r.id === id)!

export const isExternal = (r: Room): r is Room & { to: { href: string } } =>
  typeof r.to !== 'string'
