/* ---------------------------------------------------------------
   A small orthographic line engine.

   Deliberately not Three.js. Faber's language is drawing — elevation,
   plan, axonometric, exploded assembly — and a hand-rolled orthographic
   projection gives hairline edges with exact control over weight, depth
   fading and draw order, which is what a drawing needs and what a mesh
   renderer makes you fight for. It also costs almost nothing to run.

   IMPORTANT, and repeated in the UI: everything drawn by this engine is
   a PORTFOLIO VISUALISATION. Faber has no object viewer. Its Understand
   stage currently shows a placeholder frame labelled "3D object viewer /
   drag to rotate" that does not rotate. Nothing produced here should be
   read as an output of the product.
   --------------------------------------------------------------- */

export type V3 = [number, number, number]
export type Seg = { a: V3; b: V3 }

/** One physical part of the object. Explodes along its own vector. */
export type Comp = {
  id: string
  /** Drawing-sheet name. Uppercase is drawing convention here, not site voice. */
  name: string
  segs: Seg[]
  /** Unit-ish direction the part travels when the assembly separates. */
  dir: V3
  /** How far it travels, in object units (cm). */
  dist: number
  /** Weight of the line: 1 structural, 0.7 secondary, 0.45 infill. */
  weight?: number
}

export type ViewParams = {
  yaw: number
  pitch: number
  /** Units to pixels. Usually the smoothed value of a previous fit. */
  scale: number
  /** Centre of the frame, in projected units. Also usually smoothed. */
  center: [number, number]
  /** 0 assembled, 1 fully separated. */
  explode: number
  /** 0 whole assembly, 1 focusId alone and closer, flat. */
  focus: number
  focusId?: string
  /** 0 nothing drawn, 1 every line drawn. The object constructs itself. */
  reveal: number
  /** Space the drawing must keep clear, in pixels. */
  pad?: { l: number; r: number; t: number; b: number }
  /** Extra room the fit leaves around the object, 1 = exactly fitted. */
  zoom?: number
}

/**
 * Where the drawing wants to sit right now. The caller eases toward it,
 * which is what makes an explosion look like a camera pulling back
 * rather than a jump cut.
 */
export type Fit = { scale: number; center: [number, number] }

export type Palette = {
  ink: string
  faint: string
  live: string
  label: string
}

function project(p: V3, yaw: number, pitch: number): V3 {
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const x = p[0] * cy - p[1] * sy
  const y0 = p[0] * sy + p[1] * cy
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  const y = y0 * cp - p[2] * sp
  const z = y0 * sp + p[2] * cp
  return [x, y, z]
}

/** Flattened draw list, built once. Order is the order a hand would draw. */
export type Flat = {
  seg: Seg
  comp: Comp
  ci: number
  /** Position in the global draw order, 0..1. */
  t: number
}

export function flatten(comps: Comp[]): Flat[] {
  const total = comps.reduce((n, c) => n + c.segs.length, 0)
  const out: Flat[] = []
  let i = 0
  comps.forEach((comp, ci) => {
    for (const seg of comp.segs) {
      out.push({ seg, comp, ci, t: i / Math.max(1, total - 1) })
      i++
    }
  })
  return out
}

export function renderObject(
  c: CanvasRenderingContext2D,
  flat: Flat[],
  w: number,
  h: number,
  v: ViewParams,
  pal: Palette,
  labels = false,
): Fit {
  c.clearRect(0, 0, w, h)
  const pad = v.pad || { l: 24, r: 24, t: 24, b: 24 }
  const cx = pad.l + (w - pad.l - pad.r) / 2
  const cy = pad.t + (h - pad.t - pad.b) / 2

  const focusAmt = v.focusId ? v.focus : 0

  // Pass one: project, and find the depth range so fading is relative to
  // the object rather than to an absolute guess.
  const pts: { ax: number; ay: number; bx: number; by: number; z: number; on: number }[] = []
  let zmin = Infinity
  let zmax = -Infinity
  const focusPts: number[] = []

  for (let i = 0; i < flat.length; i++) {
    const f = flat[i]
    const isFocus = v.focusId ? f.comp.id === v.focusId : false
    // A focused part returns to its assembled position as the view zooms
    // into it: the detail is the part as built, not the part mid-flight.
    const ex = f.comp.dist * v.explode * (isFocus ? 1 - focusAmt : 1)
    const d = f.comp.dir
    const ox = d[0] * ex
    const oy = d[1] * ex
    const oz = d[2] * ex

    const a: V3 = [f.seg.a[0] + ox, f.seg.a[1] + oy, f.seg.a[2] + oz]
    const b: V3 = [f.seg.b[0] + ox, f.seg.b[1] + oy, f.seg.b[2] + oz]
    const pa = project(a, v.yaw, v.pitch)
    const pb = project(b, v.yaw, v.pitch)
    zmin = Math.min(zmin, pa[2], pb[2])
    zmax = Math.max(zmax, pa[2], pb[2])
    pts.push({
      ax: pa[0],
      ay: pa[1],
      bx: pb[0],
      by: pb[1],
      z: (pa[2] + pb[2]) / 2,
      on: isFocus ? 1 : 0,
    })
    if (isFocus) focusPts.push(i)
  }

  // Where the drawing wants the frame to be. Normally the bounds of
  // everything drawn so far; as the view moves to a single part, the
  // bounds of that part instead, so the frame walks toward the detail.
  let bx0 = Infinity
  let bx1 = -Infinity
  let by0 = Infinity
  let by1 = -Infinity
  let fx0 = Infinity
  let fx1 = -Infinity
  let fy0 = Infinity
  let fy1 = -Infinity
  // Bounds over the whole object, drawn or not, so the frame holds still
  // while the drawing constructs inside it instead of zooming out line by
  // line.
  for (let i = 0; i < flat.length; i++) {
    const p = pts[i]
    bx0 = Math.min(bx0, p.ax, p.bx)
    bx1 = Math.max(bx1, p.ax, p.bx)
    by0 = Math.min(by0, p.ay, p.by)
    by1 = Math.max(by1, p.ay, p.by)
    if (p.on) {
      fx0 = Math.min(fx0, p.ax, p.bx)
      fx1 = Math.max(fx1, p.ax, p.bx)
      fy0 = Math.min(fy0, p.ay, p.by)
      fy1 = Math.max(fy1, p.ay, p.by)
    }
  }
  if (!isFinite(bx0)) {
    bx0 = -1
    bx1 = 1
    by0 = -1
    by1 = 1
  }
  const mixed = focusAmt > 0 && isFinite(fx0) ? focusAmt : 0
  const mix = (a: number, b: number) => a + (b - a) * mixed
  const ex0 = mix(bx0, fx0)
  const ex1 = mix(bx1, fx1)
  const ey0 = mix(by0, fy0)
  const ey1 = mix(by1, fy1)

  const zoom = v.zoom ?? 1
  const fit: Fit = {
    scale: Math.min(
      (w - pad.l - pad.r) / Math.max(1e-3, (ex1 - ex0) * zoom),
      (h - pad.t - pad.b) / Math.max(1e-3, (ey1 - ey0) * zoom),
    ),
    center: [(ex0 + ex1) / 2, (ey0 + ey1) / 2],
  }

  const [vcx, vcy] = v.center
  const span = Math.max(0.001, zmax - zmin)
  c.lineCap = 'round'
  c.lineJoin = 'round'

  for (let i = 0; i < flat.length; i++) {
    const f = flat[i]
    const p = pts[i]
    // Progressive reveal: the drawing constructs in the order it would be
    // drawn, and each line fades in over a short window rather than
    // snapping on, so the whole thing reads as a hand moving.
    const rv = (v.reveal - f.t) * 26
    if (rv <= 0) continue
    const revealA = rv > 1 ? 1 : rv

    const depth = (p.z - zmin) / span
    // The rest of the chair never disappears entirely. A detail with no
    // context is a fragment; a detail with a ghost around it is a detail.
    const focusFade = focusAmt > 0 ? (p.on ? 1 : Math.max(0.13, 1 - focusAmt * 1.9)) : 1
    const alpha = (0.42 + depth * 0.5) * focusFade * revealA
    if (alpha <= 0.012) continue

    c.globalAlpha = alpha
    c.strokeStyle = p.on && focusAmt > 0.12 ? pal.live : pal.ink
    c.lineWidth = (f.comp.weight ?? 1) * (p.on && focusAmt > 0.12 ? 1.6 : 1.12)
    c.beginPath()
    c.moveTo(cx + (p.ax - vcx) * v.scale, cy - (p.ay - vcy) * v.scale)
    c.lineTo(cx + (p.bx - vcx) * v.scale, cy - (p.by - vcy) * v.scale)
    c.stroke()
  }

  // Part names in a column at the right, the way a drawing sheet does it,
  // with leaders back to each part. Names are pushed apart vertically so
  // two parts at the same height do not print on top of each other.
  const labelFade = Math.min(1, v.explode * 2.2) * Math.max(0, 1 - focusAmt * 3)
  if (labels && labelFade > 0.02) {
    c.font = '500 10px "IBM Plex Mono", ui-monospace, monospace'
    c.textBaseline = 'middle'

    type Tag = { name: string; ax: number; ay: number; y: number }
    const tags: Tag[] = []
    const seen = new Set<string>()
    let right = -Infinity

    for (let i = 0; i < flat.length; i++) {
      const f = flat[i]
      if (seen.has(f.comp.id) || v.reveal < f.t) continue
      seen.add(f.comp.id)
      let bx = -Infinity
      let by = 0
      for (let k = i; k < flat.length; k++) {
        if (flat[k].comp.id !== f.comp.id) break
        const q = pts[k]
        if (q.ax > bx) {
          bx = q.ax
          by = q.ay
        }
        if (q.bx > bx) {
          bx = q.bx
          by = q.by
        }
      }
      const ax = cx + (bx - vcx) * v.scale
      const ay = cy - (by - vcy) * v.scale
      right = Math.max(right, ax)
      tags.push({ name: f.comp.name, ax, ay, y: ay })
    }

    const colX = Math.min(right + 42, w - pad.r + 24)
    const gap = 15
    tags.sort((a, b) => a.y - b.y)
    for (let i = 1; i < tags.length; i++) {
      if (tags[i].y - tags[i - 1].y < gap) tags[i].y = tags[i - 1].y + gap
    }
    // If pushing down ran off the bottom, shift the whole column back up.
    const over = tags.length ? tags[tags.length - 1].y - (h - 64) : 0
    if (over > 0) for (const t of tags) t.y -= over

    for (const t of tags) {
      c.globalAlpha = labelFade * 0.38
      c.strokeStyle = pal.label
      c.lineWidth = 1
      c.beginPath()
      c.moveTo(t.ax + 5, t.ay)
      c.lineTo(colX - 10, t.y)
      c.lineTo(colX - 4, t.y)
      c.stroke()
      c.globalAlpha = labelFade * 0.9
      c.fillStyle = pal.label
      c.fillText(t.name, colX, t.y + 0.5)
    }
  }

  c.globalAlpha = 1
  return fit
}

export function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const r = canvas.getBoundingClientRect()
  canvas.width = Math.max(1, Math.round(r.width * dpr))
  canvas.height = Math.max(1, Math.round(r.height * dpr))
  const c = canvas.getContext('2d')!
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { c, w: r.width, h: r.height }
}
