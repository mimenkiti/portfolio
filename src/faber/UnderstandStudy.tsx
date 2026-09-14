import { useEffect, useRef, useState } from 'react'
import { CHAIR, KEY_PART } from './object'
import { flatten, renderObject, setupCanvas, type Flat } from './engine'
import { FABER_IMG } from './data'
import { FaberPhoto } from './assets'
import { clamp01, ease, inv, lerp, stickyProgress, useScrollEffect } from '../lib/scroll'

const FLAT: Flat[] = flatten(CHAIR)

/**
 * Six states, one object, no cuts: the photograph Faber was given, the
 * same object as a drawing, the drawing turned until the construction is
 * visible, a view you turn yourself, the parts separated, and the one
 * part the product singles out taken back to flat at a larger scale.
 *
 * The point is not that it moves. The point is that each move is a
 * different way of knowing the same thing, which is what Faber's
 * Understand stage is for.
 */
const STAGES = [
  {
    at: 0,
    name: 'SOURCE IMAGE',
    note: 'The photograph. This is where it starts, and for a long time this is as far as looking gets you.',
  },
  {
    at: 0.11,
    name: 'ELEVATION',
    note: 'Orthographic. No perspective and no camera, because a drawing is a thing you measure, not a thing you stand in front of.',
  },
  {
    at: 0.28,
    name: 'AXONOMETRIC',
    note: 'The same drawing, turned until the depth of the frame and the splay of the legs become facts rather than impressions.',
  },
  {
    at: 0.45,
    name: 'FREE VIEW',
    note: 'Drag to turn it. Nothing is narrating now.',
  },
  {
    at: 0.61,
    name: 'EXPLODED',
    note: 'Six pieces of steam-bent beech, a cane panel, ten screws and two nuts. The continuous length holds still and everything else comes off it.',
  },
  {
    at: 0.81,
    name: 'DETAIL — BACK HOOP',
    note: '“The continuous rear leg and backpost are a single length of bent beech, eliminating what would otherwise be the most vulnerable joint in the chair.”',
    quoted: true,
  },
]

function stageFor(p: number) {
  let i = 0
  for (let k = 0; k < STAGES.length; k++) if (p >= STAGES[k].at) i = k
  return i
}

type Props = {
  onGround?: (v: number) => void
  /** Contained inside a document rather than driving the page. */
  embedded?: boolean
}

export function UnderstandStudy({ onGround, embedded = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const photo = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [touched, setTouched] = useState(false)

  const st = useRef({
    p: 0,
    target: 0,
    dragYaw: 0,
    dragPitch: 0,
    curYaw: 0,
    curPitch: -Math.PI / 2,
    down: false,
    lx: 0,
    ly: 0,
    scale: 0,
    center: [0, 0] as [number, number],
  })

  // Experience mode: the section owns the scroll and takes the ground
  // dark with it, then hands both back at the end.
  useScrollEffect(
    (_, vh) => {
      if (embedded || !wrap.current) return
      const p = stickyProgress(wrap.current, vh)
      st.current.p = p
      st.current.target = p
      const s = stageFor(p)
      setStage((prev) => (prev === s ? prev : s))
      onGround?.(ease(clamp01(Math.min(inv(0, 0.1, p), inv(1, 0.955, p)))))
    },
    [embedded],
  )

  const goTo = (i: number) => {
    st.current.target = Math.min(0.995, STAGES[i].at + (i === 0 ? 0.02 : 0.05))
    setStage(i)
  }

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    let raf = 0
    let geom = setupCanvas(el)
    const onResize = () => {
      geom = setupCanvas(el)
    }
    window.addEventListener('resize', onResize)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const loop = () => {
      raf = requestAnimationFrame(loop)
      const s = st.current
      if (embedded) s.p += (s.target - s.p) * (reduce ? 1 : 0.09)
      const p = s.p

      const drawn = ease(inv(0.1, 0.27, p))
      const toAxo = ease(inv(0.28, 0.45, p))
      const explode = ease(inv(0.61, 0.8, p))
      const toDetail = ease(inv(0.81, 0.99, p))

      // Elevation is the drawing that matches the photograph. From there
      // it turns into axonometric, and at the very end it returns to flat
      // so the detail reads as a drawn part rather than a turned one.
      const baseYaw = lerp(0, 0.55, toAxo)
      // Height still dominates depth in the projection, which is what
      // keeps this a three-quarter view of a chair rather than a plan of
      // a seat with a ribbon behind it.
      const basePitch = lerp(-Math.PI / 2, -1.15, toAxo)
      const yawT = lerp(baseYaw + s.dragYaw, 0, toDetail)
      const pitchT = lerp(basePitch + s.dragPitch, -Math.PI / 2, toDetail)

      const k = reduce ? 1 : 0.11
      s.curYaw += (yawT - s.curYaw) * k
      s.curPitch += (pitchT - s.curPitch) * k
      if (!s.down) {
        s.dragYaw *= 0.95
        s.dragPitch *= 0.95
      }

      // The drawing frames itself. Every state changes how much space the
      // object needs, so asking the engine where it wants to sit and
      // easing toward that is steadier than a scale curve per stage, and
      // it is what makes the explosion read as a camera pulling back.
      const wide = geom.w > 760
      // Narrow screens stack the annotation above the drawing instead of
      // beside it, so the clear space moves from the left to the top and
      // the part-name column is dropped rather than run off the edge.
      const pad = embedded
        ? { l: 20, r: 20, t: 104, b: 78 }
        : {
            l: wide ? Math.min(geom.w * 0.3, 420) : 24,
            r: wide ? 190 : 24,
            t: wide ? 120 : 248,
            b: wide ? 96 : 132,
          }
      // Room to breathe, and more of it once the parts are in the air.
      const zoom = lerp(1.1, 1.16, explode)

      const styles = getComputedStyle(document.documentElement)
      const fit = renderObject(
        geom.c,
        FLAT,
        geom.w,
        geom.h,
        {
          yaw: s.curYaw,
          pitch: s.curPitch,
          scale: s.scale || 1,
          center: s.center,
          explode,
          focus: toDetail,
          focusId: KEY_PART,
          reveal: drawn,
          pad,
          zoom,
        },
        {
          ink: styles.getPropertyValue('--room-ink').trim() || '#e2e8ee',
          faint: styles.getPropertyValue('--room-ink-3').trim() || '#616c78',
          live: styles.getPropertyValue('--room-live').trim() || '#6fa6de',
          label: styles.getPropertyValue('--room-ink-2').trim() || '#94a0ad',
        },
        !embedded && wide,
      )

      // Ease toward the frame the drawing asked for. On the first frame
      // there is nothing to ease from, so take it whole.
      const fk = reduce ? 1 : s.scale ? 0.075 : 1
      s.scale += (fit.scale - s.scale) * fk
      s.center[0] += (fit.center[0] - s.center[0]) * fk
      s.center[1] += (fit.center[1] - s.center[1]) * fk

      if (photo.current) {
        const o = 1 - ease(inv(0.04, 0.2, p))
        photo.current.style.opacity = o.toFixed(3)
      }
      if (embedded) {
        const s2 = stageFor(s.p)
        setStage((prev) => (prev === s2 ? prev : s2))
      }
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [embedded])

  const canDrag = stage === 3 || (embedded && stage >= 2 && stage <= 4)

  const down = (e: React.PointerEvent) => {
    if (!canDrag) return
    const s = st.current
    s.down = true
    s.lx = e.clientX
    s.ly = e.clientY
    setTouched(true)
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const move = (e: React.PointerEvent) => {
    const s = st.current
    if (!s.down) return
    s.dragYaw += (e.clientX - s.lx) * 0.006
    s.dragPitch += (e.clientY - s.ly) * 0.005
    s.dragPitch = Math.max(-0.42, Math.min(0.5, s.dragPitch))
    s.lx = e.clientX
    s.ly = e.clientY
  }
  const up = () => {
    st.current.down = false
    setDragging(false)
  }

  const info = STAGES[stage]

  return (
    <div className={['study', embedded ? 'study--fig' : ''].join(' ')} ref={wrap}>
      <div className="study__stick">
        <div className="study__photo" ref={photo} aria-hidden={stage > 0}>
          <FaberPhoto
            src={FABER_IMG.thonet}
            alt="The photograph of a Thonet chair that Faber was given"
          />
        </div>

        <canvas
          ref={canvas}
          className={['study__canvas', canDrag ? 'is-grab' : '', dragging ? 'is-grabbing' : ''].join(' ')}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          aria-hidden="true"
        />

        <div className="study__hud">
          <div className="study__stage">
            <span className="study__idx data">
              {String(stage + 1).padStart(2, '0')}/{String(STAGES.length).padStart(2, '0')}
            </span>
            <span className="study__name">{info.name}</span>
          </div>
          <p className={['study__note', info.quoted ? 'is-quoted' : ''].join(' ')}>{info.note}</p>
          {info.quoted && <p className="study__src">Faber, Understand — Chair No. 14</p>}
        </div>

        {embedded && (
          <div className="study__steps" role="group" aria-label="Views of the object">
            {STAGES.map((s, i) => (
              <button
                key={s.name}
                className={['study__step', i === stage ? 'is-on' : ''].join(' ')}
                onClick={() => goTo(i)}
                aria-pressed={i === stage}
              >
                {s.name.split(' — ')[0]}
              </button>
            ))}
          </div>
        )}

        <div className={['study__hint', canDrag && !touched ? 'is-on' : ''].join(' ')}>drag</div>

        <p className="study__meta">
          Portfolio drawing. Faber has no object viewer: its Understand stage currently shows a
          placeholder frame labelled “drag to rotate” that does not rotate.
        </p>
      </div>
    </div>
  )
}
