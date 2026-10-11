import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { go } from '../lib/router'
import { CONTACT } from '../lib/links'
import { useMedia, useReducedMotion } from '../lib/media'
import { Plan } from './Plan'
import { RoomArt, type ArtShape } from './art/RoomArt'
import { ROOMS, byId, isExternal, type Room, type RoomId } from './rooms'

/* ---------------------------------------------------------------
   The Gallery — Entry.

   Composition E1: the plan sits on the page and stays dominant, and a
   1px leader drops from the active room to the preview band, the way a
   drawing annotates itself. The preview is a callout from the plan, not
   a sidebar beside it.

   The environment is the state. There is no selection chrome and no
   highlighted card: ground, ink, rules and poché all move together
   toward the active project's world, and Archive goes graphite rather
   than to a third project colour because it is not a current flagship.

   Entering is Transition B. The room the visitor actually pressed is
   measured on screen and expanded outward until its walls pass beyond
   the frame, revealing the project underneath. The plan never leaves
   2D: no camera, no perspective, no walking.
   --------------------------------------------------------------- */

const ENTER_MS = 420

/* Which composition of the artwork each presentation uses. Landscape 3:2
   at both for now; the portrait 4:5 files stay in art/ until that is
   settled, and switching back is this one line. */
const ART_SHAPE: Record<'desktop' | 'mobile', ArtShape> = { desktop: 'landscape', mobile: 'landscape' }

/* Two bios, because the phone is a different composition rather than a
   narrower copy of this one. The long one is the orientation a desktop
   visitor reads above a plan they can see all of at once; the short one
   exists so that on a phone the invitation and the plan are both above
   the fold. What the short one leaves out is in About, which is where it
   belongs now that About no longer repeats this paragraph. */
const BIO =
  "I\u2019m a product manager and builder based in San Francisco. I currently work on Samsung Wallet and previously worked at Goldman Sachs. I studied architecture at MIT, and outside of work I\u2019m usually designing or building digital or physical things of my own."
const BIO_SHORT =
  'Product manager and builder in San Francisco. Samsung Wallet now, Goldman Sachs before that, architecture at MIT.'

export function Gallery() {
  const [active, setActive] = useState<RoomId | null>(null)
  const [entering, setEntering] = useState<RoomId | null>(null)
  const quiet = useReducedMotion()
  const narrow = useMedia('(max-width: 52rem)')
  const veil = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)

  // The environment lives on the root element, so the whole page turns
  // rather than a panel inside it.
  useEffect(() => {
    const c = document.documentElement.classList
    c.toggle('room-llp', active === 'llp')
    c.toggle('room-faber', active === 'faber')
    c.toggle('room-archive', active === 'archive')
    return () => c.remove('room-llp', 'room-faber', 'room-archive')
  }, [active])

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
      document.documentElement.classList.remove('room-llp', 'room-faber', 'room-archive')
    },
    [],
  )

  const enter = useCallback(
    (id: RoomId) => {
      const room = byId(id)
      if (isExternal(room)) {
        window.open(room.to.href, '_blank', 'noopener,noreferrer')
        return
      }
      if (entering) return

      const route = room.to as '/llp' | '/faber'

      if (quiet) {
        go(route)
        return
      }

      // Measure the room the visitor actually pressed, in screen space.
      const el = document.querySelector<SVGRectElement>(`.plan__floor[data-room="${id}"]`)
      const node = veil.current
      if (!el || !node) {
        go(route)
        return
      }
      const r = el.getBoundingClientRect()

      setEntering(id)
      node.style.transition = 'none'
      node.style.left = `${r.left}px`
      node.style.top = `${r.top}px`
      node.style.width = `${r.width}px`
      node.style.height = `${r.height}px`
      node.style.opacity = '1'

      // Next frame, take the room past every edge of the frame.
      requestAnimationFrame(() => {
        if (!veil.current) return
        const grow = Math.max(window.innerWidth, window.innerHeight)
        veil.current.style.transition = `left ${ENTER_MS}ms var(--e-io), top ${ENTER_MS}ms var(--e-io), width ${ENTER_MS}ms var(--e-io), height ${ENTER_MS}ms var(--e-io)`
        veil.current.style.left = `${-grow * 0.2}px`
        veil.current.style.top = `${-grow * 0.2}px`
        veil.current.style.width = `${window.innerWidth + grow * 0.4}px`
        veil.current.style.height = `${window.innerHeight + grow * 0.4}px`
      })

      timer.current = window.setTimeout(() => go(route), ENTER_MS - 40)
    },
    [entering, quiet],
  )

  // The leader drops from the active room's real position. The plan is
  // letterboxed into whatever height its row gets, so the room's screen
  // x is not a fixed fraction of the band and has to be measured.
  useEffect(() => {
    if (!active) return
    const place = () => {
      const room = document.querySelector<SVGRectElement>(`.plan__floor[data-room="${active}"]`)
      const rule = document.querySelector<HTMLElement>('.band__rule')
      if (!room || !rule) return
      const r = room.getBoundingClientRect()
      const b = rule.getBoundingClientRect()
      document.documentElement.style.setProperty(
        '--leader-x',
        `${Math.round(r.left + r.width / 2 - b.left)}px`,
      )
    }
    place()
    window.addEventListener('resize', place, { passive: true })
    return () => window.removeEventListener('resize', place)
  }, [active])

  const shown = active ?? null

  return (
    <div
      className={['route gallery', entering ? 'is-entering' : ''].join(' ')}
      // The active room survives the trip from the plan down to the
      // preview, so the preview's own button can actually be pressed. It
      // clears when the pointer leaves the Gallery altogether.
      // Touch excluded: a finger "leaves" on every lift, so a swipe that
      // hit the end of the rail, or a tap on the bio, used to drop the
      // selection and send the selected card's artwork back to rest.
      onPointerLeave={(e) => {
        if (e.pointerType !== 'touch') setActive(null)
      }}
    >
      <div
        className={['gallery__veil', entering ? `is-${entering}` : ''].join(' ')}
        ref={veil}
        aria-hidden="true"
      />

      <header className="gal__head">
        <h1 className="gal__name">Michelle A. Menkiti</h1>
        <button className="gal__about" onClick={() => go('/about')}>
          About
        </button>
      </header>

      <div className="gal__intro">
        <p className="gal__bio">{narrow ? BIO_SHORT : BIO}</p>
        <p className="gal__invite">Walk through my work.</p>
        {/* Said at the plan, not in the band below it: an instruction a
            screen away from the thing it describes is one nobody reads.
            Desktop only, and only where hovering is possible at all. A phone
            gets its own cue under the drawing. */}
        {!narrow && <p className="gal__cue">Hover over a room to look inside.</p>}
      </div>

      <div className="gal__plan">
        {/* On a phone the plan selects rather than commits. A touch fires
            pointerenter and click together, so wiring the room straight to
            `enter` meant one tap left for the project without the visitor
            ever seeing the preview it was supposed to open. Narrow taps set
            the active room, which scrolls the carousel to its card, and the
            card's own Enter is the commit. */}
        <Plan
          active={shown}
          entering={entering}
          selectOnly={narrow}
          // Phone: the first tap on a room selects it and brings its card
          // round; a tap on the room that is already selected enters it.
          onActivate={(id, wasActive) => (narrow && !wasActive ? setActive(id) : enter(id))}
          onHover={setActive}
        />
      </div>

      {/* Phone only. The plan says which room is selected in the drawing;
          this says it in words, directly under it, so the connection
          between a tap on the plan and the card below is never a guess. */}
      {narrow && (
        <p className="gal__at label" aria-live="polite">
          {shown ? `Room ${byId(shown).n} \u00b7 ${byId(shown).name}` : 'Tap a room to look inside.'}
        </p>
      )}

      {narrow ? (
        <Carousel active={shown} onActive={setActive} onEnter={enter} />
      ) : (
        <Band active={shown} onEnter={enter} />
      )}

      <footer className="gal__foot">
        {CONTACT.map((c) => (
          <a
            key={c.label}
            href={c.href}
            {...(c.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })}
          >
            {c.label}
          </a>
        ))}
      </footer>
    </div>
  )
}

/* --- desktop: the callout ---------------------------------------

   One room at a time. The selected room's artwork hangs directly under
   that room, on the leader, as if the plan had been lifted to show what
   is inside it, and the room's words sit at the left margin. The other
   two artworks are not on the page at all: there is no strip of
   thumbnails to choose from, so the plan stays the only way to choose.

   The order is the room's own: the floor and the environment turn first,
   the words come up with them, and the artwork is revealed a beat later,
   dropping open from the leader. Its own response (the reply, the kit
   lining up, the column righting itself) starts once it is in view, then
   holds. Under reduced motion all of it is simply there.
   ---------------------------------------------------------------- */

/** When the artwork's own response starts, after its reveal has begun. */
const ART_AFTER = 340

function Band({ active, onEnter }: { active: RoomId | null; onEnter: (id: RoomId) => void }) {
  const quiet = useReducedMotion()
  const stage = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState<RoomId | null>(null)
  const [tight, setTight] = useState(false)

  // The artwork the motion CSS sees as active. It follows the selection,
  // a beat late so the response plays in view rather than behind the
  // reveal. Deselecting is immediate, so a plate leaving starts home at once.
  useEffect(() => {
    if (quiet || !active) {
      setLit(active)
      return
    }
    setLit(null)
    const t = window.setTimeout(() => setLit(active), ART_AFTER)
    return () => window.clearTimeout(t)
  }, [active, quiet])

  // Each plate hangs from its own room, so its x is the room's measured
  // centre, the same measurement the leader uses. Where the plan is too
  // narrow for that to leave the words a readable column, the plates
  // move to the band's right edge instead.
  useLayoutEffect(() => {
    const place = () => {
      const el = stage.current
      if (!el) return
      const b = el.getBoundingClientRect()
      const plate = el.querySelector<HTMLElement>('.bplate')
      const w = plate?.offsetWidth ?? 0
      let first = Infinity
      for (const r of ROOMS) {
        const room = document.querySelector<SVGRectElement>(`.plan__floor[data-room="${r.id}"]`)
        if (!room) continue
        const rr = room.getBoundingClientRect()
        const x = Math.min(Math.max(rr.left + rr.width / 2 - b.left, w / 2), b.width - w / 2)
        el.style.setProperty('--plate-w', `${w}px`)
        el.style.setProperty(`--x-${r.id}`, `${Math.round(x)}px`)
        first = Math.min(first, x - w / 2)
      }
      // Room left for the words, beside the leftmost plate.
      const room = first - 40
      el.style.setProperty('--words-max', `${Math.round(room)}px`)
      setTight(room < 380)
    }
    place()
    window.addEventListener('resize', place, { passive: true })
    return () => window.removeEventListener('resize', place)
  }, [])

  return (
    <div className={['band', active ? 'is-on' : ''].join(' ')}>
      <div className="band__rule">
        <span className={['band__leader', active ? `is-${active}` : ''].join(' ')} aria-hidden="true" />
      </div>
      <div className={['band__stage', tight ? 'is-tight' : ''].join(' ')} ref={stage}>
        <div className="band__words">
          {ROOMS.map((r) => (
            <Preview key={r.id} room={r} shown={active === r.id} onEnter={onEnter} />
          ))}
        </div>
        <div className="band__art">
          {ROOMS.map((r) => (
            <Plate key={r.id} room={r} on={active === r.id} lit={lit === r.id} onEnter={onEnter} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** The selected room's artwork. Pressing it is the same as its Enter,
 *  because that is what a visitor who has just watched it respond will
 *  try; Enter stays the keyboard's target, so this is not a tab stop. */
function Plate({
  room,
  on,
  lit,
  onEnter,
}: {
  room: Room
  on: boolean
  lit: boolean
  onEnter: (id: RoomId) => void
}) {
  return (
    <div
      className={['bplate', `bplate--${room.id}`, on ? 'is-on' : ''].join(' ')}
      style={{ ['--x' as string]: `var(--x-${room.id}, 50%)` }}
      onClick={on ? () => onEnter(room.id) : undefined}
    >
      <RoomArt id={room.id} active={lit} shape={ART_SHAPE.desktop} />
    </div>
  )
}

function Preview({
  room,
  shown,
  onEnter,
}: {
  room: Room
  shown: boolean
  onEnter: (id: RoomId) => void
}) {
  const ext = isExternal(room)
  return (
    <article className={['peek', `peek--${room.id}`, shown ? 'is-on' : ''].join(' ')} aria-hidden={!shown}>
      <p className="peek__meta data">
        {room.n} · {room.name}
      </p>
      <h2 className="peek__title">{room.title}</h2>
      <p className="peek__orient">{room.orientation}</p>
      {ext ? (
        <a
          className="peek__enter"
          href={room.to.href}
          target="_blank"
          rel="noreferrer"
          tabIndex={shown ? 0 : -1}
        >
          {room.action} <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <button className="peek__enter" onClick={() => onEnter(room.id)} tabIndex={shown ? 0 : -1}>
          {room.action} <span aria-hidden="true">→</span>
        </button>
      )}
    </article>
  )
}

/* --- mobile: the carousel ---------------------------------------

   Contained cards, swiped horizontally, with the next one peeking so
   it is obvious there is more. It is synchronised with the plan in both
   directions: swiping sets the active room, tapping a room scrolls the
   carousel to it. It never scrolls itself.
   ---------------------------------------------------------------- */

function Carousel({
  active,
  onActive,
  onEnter,
}: {
  active: RoomId | null
  onActive: (id: RoomId | null) => void
  onEnter: (id: RoomId) => void
}) {
  const track = useRef<HTMLDivElement>(null)
  const fromTap = useRef(false)

  // Tapping a room moves the carousel. Guarded so the resulting scroll
  // does not then fight the scroll handler for the active state.
  useEffect(() => {
    if (!active || !track.current) return
    const card = track.current.querySelector<HTMLElement>(`[data-card="${active}"]`)
    if (!card) return
    const want = card.offsetLeft - track.current.offsetLeft
    if (Math.abs(track.current.scrollLeft - want) < 8) return
    fromTap.current = true
    track.current.scrollTo({ left: want, behavior: 'smooth' })
    window.setTimeout(() => (fromTap.current = false), 420)
  }, [active])

  const onScroll = () => {
    const t = track.current
    if (!t || fromTap.current) return
    const mid = t.scrollLeft + t.clientWidth / 2
    let best: RoomId | null = null
    let bestD = Infinity
    for (const r of ROOMS) {
      const card = t.querySelector<HTMLElement>(`[data-card="${r.id}"]`)
      if (!card) continue
      const c = card.offsetLeft - t.offsetLeft + card.offsetWidth / 2
      const d = Math.abs(c - mid)
      if (d < bestD) {
        bestD = d
        best = r.id
      }
    }
    if (best && best !== active) onActive(best)
  }

  return (
    <div className="car" ref={track} onScroll={onScroll}>
      {ROOMS.map((r) => {
        const ext = isExternal(r)
        return (
          // The whole card is the way in; `Enter` stays as the explicit
          // call to action and the keyboard's target. A swipe never fires
          // a click, so scrolling the rail cannot open a project by accident.
          <article
            className={['car__card', `car__card--${r.id}`, active === r.id ? 'is-on' : ''].join(' ')}
            key={r.id}
            data-card={r.id}
            onClick={() => onEnter(r.id)}
          >
            {/* The artwork first, across the card's full width, and the
                room's words under it: swiping the rail is a walk past
                three pictures, each captioned, not three text cards. */}
            <RoomArt id={r.id} active={active === r.id} shape={ART_SHAPE.mobile} className="car__art" />
            <p className="car__meta data">
              {r.n} · {r.name}
            </p>
            <h2 className="car__title">{r.title}</h2>
            <p className="car__orient">{r.orientation}</p>
            {ext ? (
              <a
                className="peek__enter"
                href={r.to.href}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {r.action} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <button
                className="peek__enter"
                onClick={(e) => {
                  e.stopPropagation()
                  onEnter(r.id)
                }}
              >
                {r.action} <span aria-hidden="true">→</span>
              </button>
            )}
          </article>
        )
      })}
    </div>
  )
}
