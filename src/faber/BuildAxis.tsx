import { useEffect, useRef, useState } from 'react'
import { LevelDrawing } from './assets'
import { CAPTURE, LEVELS, RERUN } from './data'

/**
 * The panel demonstrates itself once.
 *
 * The control is legible but it does not look movable, so the first
 * time it meaningfully enters the viewport the axis walks Maker →
 * Curious → Craftsperson → Maker and then stops for good. It ends where
 * it started, so nothing is left changed and the recommended level is
 * still what a visitor finds.
 *
 * It is not a carousel and it does not fight anybody: the first
 * deliberate touch, key or focus inside the panel cancels the rest of
 * the sequence where it stands, with no snap back. Under reduced motion
 * it never runs.
 *
 * The 15px round thumb travelling along a 1px track is deliberately the
 * same dot-on-a-rail primitive as the live mark on figure captions, so
 * this reads as part of the site's vocabulary rather than as a widget
 * doing something on its own.
 */
const DEMO: number[] = [0, 2, 1]
const HOLD = 480

/**
 * One axis, three stops. Not three cards, because three cards make the
 * levels look like tiers of the same thing, and the whole point is that
 * they are not: they are three different objects.
 *
 * Everything on this panel is captured product output. The left-hand
 * column is what Faber shows you before you choose, the right-hand
 * column is what it actually generated for Chair No. 14 at that level.
 * The panel keeps Faber's cream and its ink rather than the page's
 * slate, because it is a quotation and should look like one.
 */
export function BuildAxis() {
  const [i, setI] = useState(1)
  const [showing, setShowing] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const played = useRef(false)

  const stop = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    setShowing(false)
  }

  useEffect(() => {
    const el = panel.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting) || played.current) return
        played.current = true
        io.disconnect()
        setShowing(true)
        DEMO.forEach((stop, k) => {
          timers.current.push(
            window.setTimeout(() => {
              setI(stop)
              if (k === DEMO.length - 1) setShowing(false)
            }, HOLD * (k + 1)),
          )
        })
      },
      // Enough of the panel to be worth demonstrating, rather than a
      // sliver of it at the bottom of the screen.
      { threshold: 0.45 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      timers.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  // The visitor always wins, including mid-sequence.
  const yield_ = () => {
    played.current = true
    if (timers.current.length) stop()
  }

  const lv = LEVELS[i]

  return (
    <div
      className={['bx', showing ? 'is-showing' : ''].join(' ')}
      ref={panel}
      onPointerDown={yield_}
      onKeyDown={yield_}
      onFocusCapture={yield_}
    >
      <div className="fq bx__card">
        <p className="bx__eyebrow">Chair No. 14 · choose your approach</p>

        <div className="bx__axis">
          <input
            className="bx__range"
            type="range"
            min={0}
            max={LEVELS.length - 1}
            step={1}
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            aria-label="Build approach"
            aria-valuetext={lv.name}
          />
          <div className="bx__stops">
            {LEVELS.map((l, k) => (
              <button
                key={l.id}
                className={['bx__stop', k === i ? 'is-on' : ''].join(' ')}
                onClick={() => setI(k)}
                aria-pressed={k === i}
              >
                {l.name}
                {l.recommended && <span className="bx__rec">recommended</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="bx__grid">
          <div className="bx__left">
            <div className="bx__draw">
              <LevelDrawing level={lv.id} />
            </div>
            <p className="bx__blurb">{lv.blurb}</p>
            <dl className="bx__meta">
              {lv.meta.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="bx__fixed">
              These three drawings are fixed art in the product. The same three chairs appear when
              the object is a two-door cabinet.
            </p>
          </div>

          <div className="bx__right">
            <p className="bx__label">What Faber generated</p>
            <p className="bx__object">{lv.result.object}</p>
            <dl className="bx__out">
              <div>
                <dt>Material</dt>
                <dd>{lv.result.material}</dd>
              </div>
              <div>
                <dt>Tools</dt>
                <dd>{lv.result.tools}</dd>
              </div>
              <div>
                <dt>Steps</dt>
                <dd>{lv.result.steps}</dd>
              </div>
              <div>
                <dt>Materials, summed</dt>
                <dd>{lv.result.cost}</dd>
              </div>
            </dl>
            <blockquote className="bx__quote">{lv.result.quote}</blockquote>
          </div>
        </div>
      </div>

      <p className="fq__cap caption">
        {CAPTURE.label}. Three runs of the same object on one afternoon. Names, materials, tool
        lists, step counts and quoted lines are Faber&rsquo;s; the materials totals are its
        per-item ranges added up. {RERUN}
      </p>
    </div>
  )
}
