/* ---------------------------------------------------------------
   Chair No. 14, as a drawing.

   PORTFOLIO VISUALISATION. Faber does not produce geometry. This is a
   drawing made for this page, built to be understood rather than to be
   accurate: the aim is the construction logic a maker would need to see,
   not a reconstruction of the object.

   Two numbers come from Faber's own Understand output for this object
   and are honoured here: overall height 95 cm and seat height 45 cm.
   The rest is proportion. The drawing carries no dimension it cannot
   stand behind, and Faber's full dimension set is quoted separately, as
   a quotation, where the reader can see that it came from the product.

   The part list is the one the product describes: a continuous rear leg
   and backpost in a single length of bent beech, an inner back curve, a
   seat ring, a cane panel, two front legs, a stretcher ring, and the
   screws and nuts that hold it together without glue.
   --------------------------------------------------------------- */

import type { Comp, Seg, V3 } from './engine'

const SEAT_Z = 45
const SEAT_R = 21.5
const SEAT_DROP = 2.6
const TOP_Z = 95
const RING_Z = 20
const RING_R = 21

const S = (a: V3, b: V3): Seg => ({ a, b })

/** Polyline through points, in order. */
function poly(pts: V3[], close = false): Seg[] {
  const out: Seg[] = []
  for (let i = 1; i < pts.length; i++) out.push(S(pts[i - 1], pts[i]))
  if (close && pts.length > 2) out.push(S(pts[pts.length - 1], pts[0]))
  return out
}

/** Ring in the horizontal plane. */
function ring(r: number, z: number, n = 44): Seg[] {
  const pts: V3[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push([Math.cos(a) * r, Math.sin(a) * r, z])
  }
  return poly(pts, true)
}

/** Small ring standing up in the x/z plane, used for fixings. */
function mark(p: V3, r = 1.15, n = 12): Seg[] {
  const pts: V3[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push([p[0] + Math.cos(a) * r, p[1], p[2] + Math.sin(a) * r])
  }
  return poly(pts, true)
}

/** Catmull-like resample so a hand-placed control path draws smoothly. */
function smooth(pts: V3[], per = 5): V3[] {
  if (pts.length < 3) return pts
  const out: V3[] = []
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    for (let k = 0; k < per; k++) {
      const t = k / per
      const t2 = t * t
      const t3 = t2 * t
      const v: V3 = [0, 0, 0]
      for (let d = 0; d < 3; d++) {
        v[d] =
          0.5 *
          (2 * p1[d] +
            (-p0[d] + p2[d]) * t +
            (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 +
            (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)
      }
      out.push(v)
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

const mirrorX = (p: V3): V3 => [-p[0], p[1], p[2]]

/* --- the continuous piece: right foot, up the rear leg, on up the
   backpost, over the top, and down the other side. One length. */
const HOOP_HALF: V3[] = [
  [16.2, -23.5, 0],
  [14.0, -17.4, RING_Z],
  [13.8, -16.5, SEAT_Z],
  [17.0, -17.4, 58],
  [19.6, -18.4, 70],
  [20.0, -19.2, 80],
  [17.2, -19.7, 88],
  [10.6, -20.0, 93],
  [0, -20.1, TOP_Z],
]

const INNER_HALF: V3[] = [
  [9.0, -16.0, 46],
  [10.8, -17.0, 55],
  [11.2, -17.9, 64],
  [8.6, -18.4, 70],
  [0, -18.6, 72.5],
]

function mirroredPath(half: V3[]): V3[] {
  const down = half.slice(0, -1).reverse().map(mirrorX)
  return smooth([...half, ...down], 6)
}

/**
 * Near vertical from the seat down to the stretcher ring, then flared to
 * the foot. That is where a No. 14 puts its splay, and drawing it any
 * other way makes the stretcher ring sit outside the seat.
 */
function frontLeg(sx: 1 | -1): Seg[] {
  const ctrl: V3[] = [
    [sx * 13.8, 16.5, SEAT_Z],
    [sx * 14.0, 17.2, RING_Z],
    [sx * 20.0, 22.0, 0],
  ]
  return poly(smooth(ctrl, 7))
}

function seatRing(): Seg[] {
  const out: Seg[] = [...ring(SEAT_R, SEAT_Z), ...ring(SEAT_R, SEAT_Z - SEAT_DROP)]
  // Only where an edge would actually be visible: the two silhouette
  // extremes and the four places a leg meets the frame. A vertical every
  // thirty degrees turns a seat frame into a ladder.
  for (const a of [0, Math.PI, 0.7, Math.PI - 0.7, Math.PI + 0.7, -0.7]) {
    const x = Math.cos(a) * SEAT_R
    const y = Math.sin(a) * SEAT_R
    out.push(S([x, y, SEAT_Z], [x, y, SEAT_Z - SEAT_DROP]))
  }
  return out
}

/** The cane panel, indicated the way a drawing indicates it. */
function caneSeat(): Seg[] {
  const r = 18.2
  const z = SEAT_Z + 0.35
  const out: Seg[] = [...ring(r, z, 40)]
  const step = 4.4
  for (let v = -r + step; v < r; v += step) {
    const h = Math.sqrt(Math.max(0, r * r - v * v)) * 0.97
    out.push(S([-h, v, z], [h, v, z]))
    out.push(S([v, -h, z], [v, h, z]))
  }
  return out
}

function fixings(): Seg[] {
  const pts: V3[] = [
    [13.8, -16.5, SEAT_Z],
    [-13.8, -16.5, SEAT_Z],
    [13.8, 16.5, SEAT_Z],
    [-13.8, 16.5, SEAT_Z],
    [8.8, -16.0, 46],
    [-8.8, -16.0, 46],
  ]
  return pts.flatMap((p) => mark(p))
}

/**
 * Parts in the order a hand would draw them: the big structural move
 * first, then what hangs off it, then the infill, then the fixings.
 */
export const CHAIR: Comp[] = [
  {
    id: 'back-hoop',
    name: 'BACK HOOP + REAR LEGS',
    segs: poly(mirroredPath(HOOP_HALF)),
    dir: [0, 0, 0],
    dist: 0,
    weight: 1,
  },
  {
    id: 'front-leg-l',
    name: 'FRONT LEG',
    segs: frontLeg(-1),
    dir: [-1, 0.2, -0.25],
    dist: 15,
    weight: 1,
  },
  {
    id: 'front-leg-r',
    name: 'FRONT LEG',
    segs: frontLeg(1),
    dir: [1, 0.2, -0.25],
    dist: 15,
    weight: 1,
  },
  {
    id: 'seat-ring',
    name: 'SEAT RING',
    segs: seatRing(),
    dir: [0, 0, 1],
    dist: 10,
    weight: 0.85,
  },
  {
    id: 'inner-curve',
    name: 'INNER BACK CURVE',
    segs: poly(mirroredPath(INNER_HALF)),
    dir: [0, 1, 0.15],
    dist: 22,
    weight: 0.7,
  },
  {
    id: 'stretcher-ring',
    name: 'STRETCHER RING',
    segs: ring(RING_R, RING_Z),
    dir: [0, 0, -1],
    dist: 18,
    weight: 0.7,
  },
  {
    id: 'cane-seat',
    name: 'CANE PANEL',
    segs: caneSeat(),
    dir: [0, 0, 1],
    dist: 22,
    weight: 0.45,
  },
  {
    id: 'fixings',
    name: 'SCREWS + NUTS',
    segs: fixings(),
    dir: [0, 0.4, 1],
    dist: 30,
    weight: 0.6,
  },
]

/** The part the detail view goes to, and why it is that part. */
export const KEY_PART = 'back-hoop'

/** Centre of the object, so views rotate about it rather than the floor. */
export const PIVOT: V3 = [0, -3, 48]

export const OBJECT_SPAN = 104
