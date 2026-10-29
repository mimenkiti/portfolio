import type { RoomId } from './rooms'

/* ---------------------------------------------------------------
   The plan, drawn to fit the window: Interlocking Ls.

   LLP and Professional are two L-shaped rooms that lock into each
   other. Faber sits in the corner they make, and Archive is set into
   Professional's notch. The way through runs entry, LLP, Faber,
   Professional, Archive, with a second door straight from LLP into
   Professional, so the two large rooms are also directly connected.

   The building is not one drawing scaled up and down. Two compositions
   are drawn by hand, a compact one for phones and a wider one for
   desktop, with the same rooms, walls and doors in the same order, and
   the plan interpolates between them by the proportion of the box it
   is given. A phone gets a nearly square building with Faber at its
   centre; a wide screen gets a longer one whose rooms widen while
   their depths barely change. Past the widest composition the building
   stops stretching and sits centred with space around it, so no room
   is ever pulled into a corridor.

   Height is fixed in drawing units (H), which keeps wall thickness,
   door openings and labels the same weight at every size.
   --------------------------------------------------------------- */

export type Pt = [number, number]
export type Rect = { x: number; y: number; w: number; h: number }
/** `leaf: false` is an opening with no door in it: the way in from outside. */
export type Door = { dir: 'v' | 'h'; x: number; y: number; swing: 0 | 1; into: number; leaf?: boolean }
export type RoomShape = { pts: Pt[]; label: Pt; w: number }
export type PlanLayout = {
  viewBox: string
  vest: Rect
  rooms: Record<RoomId, RoomShape>
  doors: Door[]
}

const H = 440
const PAD = { l: 52, r: 24, t: 12, b: 12 }

/* The two hand-drawn compositions, as named coordinates. Every value is
   interpolated, so the two must describe the same plan. */
type Spec = {
  ew: number // entry width
  ey: number // entry top
  eh: number // entry height
  lTop: number // LLP's top edge (it sits a step below Professional)
  armR: number // right end of LLP's upper arm, where Professional begins
  armB: number // underside of LLP's arm: Faber's top and Professional's notch
  legR: number // right side of LLP's leg, where Faber begins
  fR: number // Faber's right side, where Professional's leg begins
  pR: number // Professional's right side
  pB: number // underside of Professional's leg
  aR: number // Archive's right side
}
const COMPACT: Spec = { ew: 58, ey: 250, eh: 104, lTop: 30, armR: 330, armB: 170, legR: 196, fR: 418, pR: 660, pB: 330, aR: 590 }
const WIDE: Spec = { ew: 70, ey: 286, eh: 112, lTop: 40, armR: 540, armB: 196, legR: 320, fR: 650, pR: 1060, pB: 326, aR: 880 }

/** Building widths at the two compositions, for mapping proportion to blend. */
const width = (s: Spec) => s.pR
const ratio = (s: Spec) => (width(s) + PAD.l + PAD.r) / (H + PAD.t + PAD.b)

/** The proportion the plan falls back to before it has been measured. */
export const ASPECT = { fallback: ratio(WIDE) }

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function planLayout(aspect: number): PlanLayout {
  const lo = ratio(COMPACT)
  const hi = ratio(WIDE)
  const t = Math.min(1, Math.max(0, ((aspect || hi) - lo) / (hi - lo)))
  const s = Object.fromEntries(
    (Object.keys(COMPACT) as (keyof Spec)[]).map((k) => [k, Math.round(lerp(COMPACT[k], WIDE[k], t))]),
  ) as Spec

  const x0 = s.ew // the building proper starts after the entry
  const vest: Rect = { x: 0, y: s.ey, w: s.ew, h: s.eh }

  const llp: Pt[] = [
    [x0, s.lTop],
    [s.armR, s.lTop],
    [s.armR, s.armB],
    [s.legR, s.armB],
    [s.legR, H],
    [x0, H],
  ]
  const faber: Pt[] = [
    [s.legR, s.armB],
    [s.fR, s.armB],
    [s.fR, H],
    [s.legR, H],
  ]
  const professional: Pt[] = [
    [s.armR, 0],
    [s.pR, 0],
    [s.pR, s.pB],
    [s.fR, s.pB],
    [s.fR, s.armB],
    [s.armR, s.armB],
  ]
  const archive: Pt[] = [
    [s.fR, s.pB],
    [s.aR, s.pB],
    [s.aR, H],
    [s.fR, H],
  ]

  const rooms: Record<RoomId, RoomShape> = {
    llp: { pts: llp, label: [x0 + 15, s.lTop + 34], w: s.armR - x0 },
    faber: { pts: faber, label: [s.legR + 15, s.armB + 34], w: s.fR - s.legR },
    professional: { pts: professional, label: [s.armR + 15, 34], w: s.pR - s.armR },
    archive: { pts: archive, label: [s.fR + 15, s.pB + 30], w: s.aR - s.fR },
  }

  const doors: Door[] = [
    // In from outside, where the entry arrow arrives, then into LLP.
    { dir: 'v', x: 0, y: s.ey + s.eh / 2, swing: 1, into: s.ew, leaf: false },
    { dir: 'v', x: x0, y: s.ey + s.eh / 2, swing: 1, into: s.legR - x0 },
    // LLP's arm straight into Professional.
    { dir: 'v', x: s.armR, y: s.lTop + (s.armB - s.lTop) * 0.55, swing: 1, into: s.fR - s.armR },
    // LLP's leg into Faber, low on the shared wall.
    { dir: 'v', x: s.legR, y: s.armB + (H - s.armB) * 0.62, swing: 1, into: s.fR - s.legR },
    // Faber into Professional's leg.
    { dir: 'v', x: s.fR, y: s.armB + (s.pB - s.armB) * 0.5, swing: 1, into: s.pR - s.fR },
    // Professional down into Archive.
    { dir: 'h', x: s.fR + (s.aR - s.fR) * 0.45, y: s.pB, swing: 0, into: H - s.pB },
  ]

  const w = s.pR + PAD.l + PAD.r
  return {
    viewBox: `${-PAD.l} ${-PAD.t} ${w} ${H + PAD.t + PAD.b}`,
    vest,
    rooms,
    doors,
  }
}

export const points = (pts: Pt[]) => pts.map(([x, y]) => `${x},${y}`).join(' ')
