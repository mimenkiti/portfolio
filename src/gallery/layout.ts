import type { RoomId } from './rooms'

/* ---------------------------------------------------------------
   The plan, drawn to fit the window.

   The building is not one fixed drawing scaled up and down. The Plan
   measures the box it is given and asks for a layout at that box's
   proportion, so a wide desktop gets a longer building and a phone gets
   a compact one, within limits that keep the rooms from stretching into
   corridors, and the drawing always fills its space rather
   than sitting letterboxed in the middle of it.

   Height is fixed in drawing units (H) and only the width changes with
   the proportion. That keeps wall thickness, door openings and the room
   numbers at the same size relative to the plan's height everywhere, so
   only the shape of the building changes, never the weight of its line.

   The arrangement holds at every size: entry, LLP, Faber and Archive
   along the axis, and Professional as one long room under LLP and
   Faber, entered from each. It is kept deliberately off the grid of the
   rooms above (in from LLP's outer wall, out past Faber), with Faber and
   Archive stepping down at uneven heights.
   --------------------------------------------------------------- */

export type Rect = { x: number; y: number; w: number; h: number }
export type Door = { dir: 'v' | 'h'; x: number; y: number; swing: 0 | 1; into: number }
export type PlanLayout = {
  viewBox: string
  vest: Rect
  rects: Record<RoomId, Rect>
  doors: Door[]
}

/** Drawing height, in plan units. */
const H = 440
/** Room left around the building for the entry arrow and Archive's label. */
const PAD = { l: 44, r: 74, t: 12, b: 12 }

/** The proportions the plan will stretch between. */
export const ASPECT = { min: 1.5, max: 3.3, fallback: 2.4 }

export function planLayout(aspect: number): PlanLayout {
  const a = Math.min(ASPECT.max, Math.max(ASPECT.min, aspect || ASPECT.fallback))
  // The whole viewBox has proportion `a`; the building fills it inside PAD.
  const W = a * (H + PAD.t + PAD.b) - PAD.l - PAD.r

  // Professional's depth: shallower than LLP and Faber, but a real room,
  // not a corridor.
  const prof = Math.round(H * 0.4)
  const base = H - prof // the shared floor line of LLP and Faber

  const vw = Math.round(Math.min(96, Math.max(56, W * 0.075)))
  const U = W - vw // what the rooms share along the axis

  const vest: Rect = { x: 0, y: Math.round(base * 0.2), w: vw, h: Math.round(base * 0.6) }
  const llp: Rect = { x: vw, y: 0, w: Math.round(U * 0.4), h: base }
  const fy = Math.round(base * 0.1)
  const faber: Rect = { x: llp.x + llp.w, y: fy, w: Math.round(U * 0.31), h: base - fy }
  const ay = Math.round(base * 0.16)
  const archive: Rect = {
    x: faber.x + faber.w,
    y: ay,
    w: Math.max(47, Math.round(U * 0.065)),
    h: Math.round(base * 0.52),
  }
  const px = llp.x + Math.round(llp.w * 0.17)
  const professional: Rect = {
    x: px,
    y: base,
    w: Math.round(vw + U * 0.93) - px,
    h: prof,
  }

  const doors: Door[] = [
    // The way in from outside, where the entry arrow arrives.
    { dir: 'v', x: vest.x, y: vest.y + vest.h / 2, swing: 1, into: vest.w },
    { dir: 'v', x: vest.x + vest.w, y: vest.y + vest.h / 2, swing: 1, into: llp.w },
    { dir: 'v', x: faber.x, y: faber.y + (base - faber.y) * 0.5, swing: 1, into: faber.w },
    { dir: 'v', x: archive.x, y: archive.y + archive.h * 0.55, swing: 1, into: archive.w },
    // Off-centre on purpose, one toward each end of the long room.
    { dir: 'h', x: llp.x + llp.w * 0.66, y: base, swing: 0, into: prof },
    { dir: 'h', x: faber.x + faber.w * 0.7, y: base, swing: 0, into: prof },
  ]

  return {
    viewBox: `${-PAD.l} ${-PAD.t} ${W + PAD.l + PAD.r} ${H + PAD.t + PAD.b}`,
    vest,
    rects: { llp, faber, professional, archive },
    doors,
  }
}
