import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ROOMS, type RoomId } from './rooms'
import { ASPECT, planLayout, points, type Door } from './layout'

/* ---------------------------------------------------------------
   The Enfilade.

   A flat 2D floor plan, and navigation rather than artwork. It has to
   read as a plan within a second, so it uses the three things that
   actually signal "plan" and nothing else: filled wall thickness
   (poché), real openings punched through those walls, and door swings.
   No perspective, no extrusion, no shadow, no texture.

   Walls are drawn as thick strokes on the room rectangles, and the
   openings are cut by painting the ground colour back over the wall at
   the door positions. Where two rooms meet, their strokes overlap into
   a single heavier party wall, which is what an enfilade actually looks
   like in plan.

   The room is the interactive target — not a label, not a card beside
   the drawing. Each one is a button with a real accessible name.
   --------------------------------------------------------------- */

const WALL = 13
const OPENING = 52

/** `w`/`h` read better in the data; SVG needs `width`/`height`. */
const box = (r: { x: number; y: number; w: number; h: number }) => ({
  x: r.x,
  y: r.y,
  width: r.w,
  height: r.h,
})

/** Leaf length: the opening, unless the receiving room is narrower. */
const leaf = (d: Door) => Math.min(OPENING, d.into - WALL)

export function Plan({
  active,
  entering,
  selectOnly,
  onActivate,
  onHover,
}: {
  active: RoomId | null
  /** The room currently expanding, which keeps its fill through the transition. */
  entering?: RoomId | null
  /** Narrow: activating a room shows its card rather than entering it. */
  selectOnly?: boolean
  /** `wasActive`: the room was already selected when the press began. */
  onActivate: (id: RoomId, wasActive: boolean) => void
  onHover: (id: RoomId | null) => void
}) {
  // The plan reshapes to the box it is given: measure that box, and draw
  // the building at its proportion. The box is sized by CSS, never by the
  // drawing, so measuring it cannot feed back into itself.
  const svg = useRef<SVGSVGElement>(null)
  const [aspect, setAspect] = useState(ASPECT.fallback)
  useLayoutEffect(() => {
    const el = svg.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        // Round so sub-pixel jitter during a resize does not redraw.
        setAspect(Math.round((r.width / r.height) * 20) / 20)
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const L = useMemo(() => planLayout(aspect), [aspect])
  const VESTIBULE = L.vest
  const DOORS = L.doors
  // Whether the pressed room was already the selected one, read at
  // pointerdown. A touch fires focus before click, and focus selects, so
  // by the time click arrives every tapped room looks selected. Reading it
  // at the start of the press is what lets a first tap select and a second
  // tap enter.
  const pressedSelected = useRef(false)

  return (
    <svg
      ref={svg}
      className="plan"
      viewBox={L.viewBox}
      role="group"
      aria-label="Gallery floor plan. Two large L-shaped rooms, LLP and Professional, lock together, with Faber between them and Archive beside."
      /* Clearing the active room used to happen here, on leaving the SVG.
         That made the preview's own button unreachable: the pointer has to
         leave the plan to get to it, which dropped the preview to
         `opacity: 0; pointer-events: none` before the click landed, so
         `Enter →` and `View archive ↗` could never be pressed with a
         mouse. The Gallery clears it on leaving the whole page instead. */
    >
      {/* Room floors. Painted first so the walls always sit on top. */}
      <rect className="plan__floor" {...box(VESTIBULE)} />
      {ROOMS.map((r) => (
        <polygon
          key={r.id}
          className={[
            'plan__floor',
            'plan__floor--room',
            active === r.id ? 'is-active' : '',
            entering === r.id ? 'is-entering' : '',
          ].join(' ')}
          data-room={r.id}
          points={points(L.rooms[r.id].pts)}
        />
      ))}

      {/* Poché. Thick strokes, then the openings painted back out. The
          active room's wall thickens, which is the drawing's own way of
          saying which room is being talked about. */}
      <g className="plan__walls">
        <rect {...box(VESTIBULE)} strokeWidth={WALL} />
        {ROOMS.map((r) => {
          const on = active === r.id || entering === r.id
          return (
            <polygon
              key={r.id}
              points={points(L.rooms[r.id].pts)}
              strokeWidth={on ? WALL + 4 : WALL}
              className={on ? 'is-active' : ''}
            />
          )
        })}
      </g>

      <g className="plan__openings">
        {DOORS.map((d, i) =>
          d.dir === 'v' ? (
            <rect key={i} x={d.x - WALL / 2 - 1} y={d.y - OPENING / 2} width={WALL + 2} height={OPENING} />
          ) : (
            <rect key={i} x={d.x - OPENING / 2} y={d.y - WALL / 2 - 1} width={OPENING} height={WALL + 2} />
          ),
        )}
      </g>

      {/* Door swings. One leaf and one arc, the way a plan draws them. */}
      <g className="plan__swings">
        {DOORS.map((d, i) => {
          if (d.leaf === false) return null
          const r = leaf(d)
          if (d.dir === 'h') {
            // Hinged at the left jamb, swinging down into Professional: the
            // vertical door drawn with its axes swapped.
            const left = d.x - OPENING / 2
            return (
              <g key={i}>
                <path d={`M ${left} ${d.y} L ${left + r} ${d.y}`} className="plan__leaf" />
                <path d={`M ${left} ${d.y + 2} A ${r} ${r} 0 0 ${d.swing} ${left + r} ${d.y + 2 + r}`} />
              </g>
            )
          }
          const top = d.y - OPENING / 2
          return (
            <g key={i}>
              {/* The leaf, hinged at the top of the opening. */}
              <path d={`M ${d.x} ${top} L ${d.x} ${top + r}`} className="plan__leaf" />
              {/* And the quarter arc it sweeps, at the leaf's own radius. */}
              <path d={`M ${d.x + 2} ${top} A ${r} ${r} 0 0 ${d.swing} ${d.x + 2 + r} ${top + r}`} />
            </g>
          )
        })}
      </g>

      {/* Entry. The plan has to say where you came in from. */}
      <g className="plan__entry" aria-hidden="true">
        {/* Pointing in, through the opening in the entry's outer wall. */}
        <path d={`M ${VESTIBULE.x - 40} ${VESTIBULE.y + VESTIBULE.h / 2} L ${VESTIBULE.x - 10} ${VESTIBULE.y + VESTIBULE.h / 2}`} />
        <path
          d={`M ${VESTIBULE.x - 10} ${VESTIBULE.y + VESTIBULE.h / 2} l -9 -6 M ${VESTIBULE.x - 10} ${VESTIBULE.y + VESTIBULE.h / 2} l -9 6`}
        />
        <text x={VESTIBULE.x + 12} y={VESTIBULE.y + 18} className="plan__tiny">
          entry
        </text>
      </g>

      {/* Room numbers, set in the drawing rather than on labels beside it.
          While a room is selected the others step back: their marks are
          decorative here, the accessible name lives on the target below,
          and letting them fade is what keeps one room unambiguous. */}
      {ROOMS.map((r) => (
        <g
          key={r.id}
          className={[
            'plan__mark',
            active && active !== r.id ? 'is-quiet' : '',
          ].join(' ')}
          aria-hidden="true"
        >
          <text x={L.rooms[r.id].label[0]} y={L.rooms[r.id].label[1]} className="plan__n">
            {r.n}
          </text>
          {L.rooms[r.id].w > 90 && (
            <text x={L.rooms[r.id].label[0]} y={L.rooms[r.id].label[1] + 18} className="plan__tiny">
              {r.name}
            </text>
          )}
        </g>
      ))}
      {/* The targets. Last in paint order so nothing can sit over them,
          and shaped like the room itself so the transition can
          expand exactly what was pressed. */}
      {ROOMS.map((r) => (
        <g key={r.id} className="plan__hit">
          <polygon
            points={points(L.rooms[r.id].pts)}
            role="button"
            tabIndex={0}
            // The label has to say what the press actually does, which is
            // not the same on both layouts.
            aria-label={
              selectOnly && active !== r.id
                ? `Show room ${r.n}, ${r.name}. ${r.title}.`
                : `Enter room ${r.n}, ${r.name}. ${r.title}.`
            }
            onPointerDown={() => {
              pressedSelected.current = active === r.id
            }}
            onClick={() => onActivate(r.id, pressedSelected.current)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                // Focus has already selected it; a key press commits.
                onActivate(r.id, true)
              }
            }}
            // Hover is a mouse idea. A finger's pointerenter arrives just
            // before the tap and would select the room behind the press.
            onPointerEnter={(e) => {
              if (e.pointerType !== 'touch') onHover(r.id)
            }}
            onFocus={() => onHover(r.id)}
          />
        </g>
      ))}
    </svg>
  )
}
