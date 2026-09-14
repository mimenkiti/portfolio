import { CHAIR } from './object'
import { LEVELS } from './data'

/* ---------------------------------------------------------------
   The object that does not arrive.

   PORTFOLIO VISUALISATION, and the one place on this page where that
   label matters most. Faber does not generate these. It cannot yet show
   you the object a constraint produces, only describe the build that
   would produce it, so the drawing here begins and stops.

   The geometry is the same drawing used in the Understand sequence,
   which is the point: the three branches are the same object failing to
   resolve in three directions, not three new objects.
   --------------------------------------------------------------- */

/** How far each part gets before the drawing runs out of what is known. */
const RESOLVE: Record<string, [number, number, number]> = {
  // id:              curious, maker, craftsperson
  'back-hoop': [0.5, 0.78, 0.93],
  'front-leg-l': [0.46, 0.74, 0.88],
  'front-leg-r': [0.46, 0.74, 0.88],
  'seat-ring': [0.3, 0.66, 0.86],
  'inner-curve': [0, 0.26, 0.68],
  'stretcher-ring': [0, 0.42, 0.7],
  'cane-seat': [0, 0.12, 0.46],
  fixings: [0, 0, 0.3],
}

const CHANGES = [
  'the curve stops being bent and becomes wire',
  'the bend survives, in a wood that will take it',
  'the joinery and the steam bending survive, closest to the original',
]

/** Elevation: drop depth, keep width and height. */
const px = (x: number) => x + 32
const py = (z: number) => 100 - z

function Branch({ k }: { k: 0 | 1 | 2 }) {
  return (
    <svg viewBox="0 0 64 104" className="mo__svg" aria-hidden="true">
      <rect
        className="mo__env"
        x="2.5"
        y="1.5"
        width="59"
        height="99"
        fill="none"
        strokeDasharray="1.4 2.6"
      />
      {CHAIR.map((c) => {
        const amount = RESOLVE[c.id]?.[k] ?? 0
        const cut = Math.round(c.segs.length * amount)
        return (
          <g key={c.id}>
            {c.segs.map((s, i) => {
              const drawn = i < cut
              // Past the cut the line is still there as intention, not as
              // fact: it is what the object would need, drawn as if the
              // hand had lifted.
              return (
                <line
                  key={i}
                  className={drawn ? 'mo__on' : 'mo__off'}
                  x1={px(s.a[0])}
                  y1={py(s.a[2])}
                  x2={px(s.b[0])}
                  y2={py(s.b[2])}
                  strokeWidth={(c.weight ?? 1) * 0.45}
                />
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}

export function MissingObject() {
  return (
    <div className="mo">
      <div className="mo__row">
        {LEVELS.map((l, k) => (
          <figure className="mo__branch" key={l.id}>
            <Branch k={k as 0 | 1 | 2} />
            <figcaption>
              <p className="mo__name">{l.name}</p>
              <p className="mo__change">{CHANGES[k]}</p>
              <p className="mo__has data">
                {l.result.steps} steps · {l.result.cost}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mo__note">
        A portfolio drawing of something Faber cannot do. It can already write these three builds
        and it does, in detail. What it cannot do is show you the object at the end of one.
      </p>
    </div>
  )
}
