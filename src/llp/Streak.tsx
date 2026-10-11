import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '../lib/media'
import { currentStreak } from '../lib/streak'

/* ---------------------------------------------------------------
   The streak, as a number that arrives rather than sits.

   It stays a word in a sentence: set in the line's own face and size,
   lining tabular figures so the line never reflows while it moves, and
   no box, rule or card around it. It runs once per visit, as soon as the
   line comes into view (after the LLP hero has settled, if the line is
   already on screen at arrival), and shows the final value at once for
   reduced motion. Screen readers get the final number only.

   The treatment is a roll: each figure is a column of figures behind a
   window one figure tall, and the columns turn over toward the real
   number, the units most, the hundreds once.
   --------------------------------------------------------------- */

const DURATION = 1500

/** The LLP hero settles about 1.1s after the page opens. When the line is
 *  already on screen at arrival, the count waits for it rather than
 *  competing with the word being written. */
const AFTER_HERO = 1300

/** Once per visit, across mode switches and route changes. */
let played = false

export function Streak() {
  const value = useMemo(() => currentStreak(), [])
  const quiet = useReducedMotion()
  const el = useRef<HTMLSpanElement>(null)
  const mounted = useRef(performance.now())
  // Already seen this visit, or reduced motion: the final figure, still.
  const instant = useRef(quiet || played).current
  // `armed`: the line is on screen and the sequence may start.
  const [armed, setArmed] = useState(instant)

  useEffect(() => {
    if (armed || !el.current) return
    const node = el.current
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          played = true
          io.disconnect()
          const wait = Math.max(0, AFTER_HERO - (performance.now() - mounted.current))
          window.setTimeout(() => setArmed(true), wait)
        }
      },
      // As soon as any of the line is on screen. Waiting for the whole
      // line left the starting figure ("000", "1") readable for a moment,
      // which is a wrong number in a true sentence. Starting at the edge
      // means the start state only ever exists off-screen.
      { threshold: 0, rootMargin: '0px' },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [armed])

  return (
    <span className="streak" ref={el}>
      <span className="sr-only">{value}</span>
      {/* Until it starts, the figure is held invisible at its final width:
          a reader never sees a starting number ("000", "1") that is not
          the streak. */}
      <span
        aria-hidden="true"
        className={['streak__vis', armed ? '' : 'is-waiting'].join(' ')}
      >
        {instant ? String(value) : <Roll value={value} run={armed} />}
      </span>
    </span>
  )
}

type P = { value: number; run: boolean }

/* The roll. Each digit is a column of figures behind a window one figure
   tall. The units turn over most, the hundreds once, the way a counter
   wheel accumulates; all three settle together on the real number. */
function Roll({ value, run }: P) {
  const digits = String(value).split('').map(Number)
  return (
    <span className="roll">
      {digits.map((d, i) => {
        const fromRight = digits.length - 1 - i
        const turns = fromRight + 1 // units 3, tens 2, hundreds 1 for a 3-digit number
        const reel = Array.from({ length: turns * 10 + d + 1 }, (_, k) => k % 10)
        const to = run ? turns * 10 + d : 0
        return (
          <span className="roll__win" key={i}>
            <span
              className="roll__reel"
              style={{
                transform: `translateY(${-to}lh)`,
                transitionDuration: `${DURATION}ms`,
              }}
            >
              {reel.map((k, j) => (
                <span className="roll__fig" key={j}>
                  {k}
                </span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}
