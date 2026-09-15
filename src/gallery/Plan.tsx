import { PLAN_VIEWBOX, ROOMS, VESTIBULE, type RoomId } from './rooms'

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

/** Where the three openings sit on the axis, in viewBox units.
 *
 *  `into` is the clear width of the room the leaf swings into. A door
 *  cannot swing further than the room it opens onto, and Archive is only
 *  47 units wide, so the arc radius is clamped per door rather than
 *  taken from OPENING. Without this the Archive leaf swept straight
 *  through the far wall and out of the building. */
const DOORS = [
  { x: VESTIBULE.x + VESTIBULE.w, y: 171, swing: 1, into: ROOMS[0].rect.w },
  { x: ROOMS[0].rect.x + ROOMS[0].rect.w, y: 167, swing: 1, into: ROOMS[1].rect.w },
  { x: ROOMS[1].rect.x + ROOMS[1].rect.w, y: 166, swing: 1, into: ROOMS[2].rect.w },
]

/** Leaf length: the opening, unless the receiving room is narrower. */
const leaf = (d: (typeof DOORS)[number]) => Math.min(OPENING, d.into - WALL)

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
  onActivate: (id: RoomId) => void
  onHover: (id: RoomId | null) => void
}) {
  const vb = `${PLAN_VIEWBOX.x} ${PLAN_VIEWBOX.y} ${PLAN_VIEWBOX.w} ${PLAN_VIEWBOX.h}`

  return (
    <svg
      className="plan"
      viewBox={vb}
      role="group"
      aria-label="Gallery floor plan. Three rooms on one axis."
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
        <rect
          key={r.id}
          className={[
            'plan__floor',
            'plan__floor--room',
            active === r.id ? 'is-active' : '',
            entering === r.id ? 'is-entering' : '',
          ].join(' ')}
          data-room={r.id}
          {...box(r.rect)}
        />
      ))}

      {/* Poché. Thick strokes, then the openings painted back out. */}
      <g className="plan__walls">
        <rect {...box(VESTIBULE)} strokeWidth={WALL} />
        {ROOMS.map((r) => (
          <rect key={r.id} {...box(r.rect)} strokeWidth={WALL} />
        ))}
      </g>

      <g className="plan__openings">
        {DOORS.map((d, i) => (
          <rect
            key={i}
            x={d.x - WALL / 2 - 1}
            y={d.y - OPENING / 2}
            width={WALL + 2}
            height={OPENING}
          />
        ))}
      </g>

      {/* Door swings. One leaf and one arc, the way a plan draws them. */}
      <g className="plan__swings">
        {DOORS.map((d, i) => {
          const r = leaf(d)
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
        <path d={`M ${VESTIBULE.x - 30} ${VESTIBULE.y + VESTIBULE.h / 2} L ${VESTIBULE.x - 4} ${VESTIBULE.y + VESTIBULE.h / 2}`} />
        <path
          d={`M ${VESTIBULE.x - 30} ${VESTIBULE.y + VESTIBULE.h / 2} l 9 -6 M ${VESTIBULE.x - 30} ${VESTIBULE.y + VESTIBULE.h / 2} l 9 6`}
        />
        <text x={VESTIBULE.x + 8} y={VESTIBULE.y + 26} className="plan__tiny">
          entry
        </text>
      </g>

      {/* Room numbers, set in the drawing rather than on labels beside it. */}
      {ROOMS.map((r) => (
        <g key={r.id} className="plan__mark" aria-hidden="true">
          <text x={r.rect.x + 15} y={r.rect.y + 34} className="plan__n">
            {r.n}
          </text>
          {r.rect.w > 90 && (
            <text x={r.rect.x + 15} y={r.rect.y + 52} className="plan__tiny">
              {r.name}
            </text>
          )}
        </g>
      ))}
      {/* Archive is too narrow to hold its own name inside the room. */}
      <text
        x={ROOMS[2].rect.x + ROOMS[2].rect.w + 12}
        y={ROOMS[2].rect.y + 34}
        className="plan__tiny"
        aria-hidden="true"
      >
        archive
      </text>

      {/* The targets. Last in paint order so nothing can sit over them,
          and sized to the room's own rectangle so the transition can
          expand exactly what was pressed. */}
      {ROOMS.map((r) => (
        <g key={r.id} className="plan__hit">
          <rect
            {...box(r.rect)}
            role="button"
            tabIndex={0}
            // The label has to say what the press actually does, which is
            // not the same on both layouts.
            aria-label={
              selectOnly
                ? `Show room ${r.n}, ${r.name}. ${r.title}.`
                : `Enter room ${r.n}, ${r.name}. ${r.title}.`
            }
            onClick={() => onActivate(r.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onActivate(r.id)
              }
            }}
            onPointerEnter={() => onHover(r.id)}
            onFocus={() => onHover(r.id)}
          />
        </g>
      ))}
    </svg>
  )
}
