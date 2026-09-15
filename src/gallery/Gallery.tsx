import { useCallback, useEffect, useRef, useState } from 'react'
import { go } from '../lib/router'
import { useMedia, useReducedMotion } from '../lib/media'
import { Plan } from './Plan'
import { PlateFaber, PlateLLP } from './Plates'
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
      onPointerLeave={() => setActive(null)}
    >
      <div
        className={['gallery__veil', entering ? `is-${entering}` : ''].join(' ')}
        ref={veil}
        aria-hidden="true"
      />

      <header className="gal__head">
        <span className="gal__name">Michelle A. Menkiti</span>
        <button className="gal__about" onClick={() => go('/about')}>
          About
        </button>
      </header>

      <div className="gal__intro">
        <p className="gal__bio">
          I&rsquo;m a product manager and builder based in San Francisco. I currently work on
          Samsung Wallet and previously worked at Goldman Sachs. I studied architecture at MIT, and
          outside of work I&rsquo;m usually designing or building digital or physical things of my
          own.
        </p>
        <p className="gal__invite">Walk through my work.</p>
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
          onActivate={narrow ? setActive : enter}
          onHover={setActive}
        />
      </div>

      {narrow ? (
        <Carousel active={shown} onActive={setActive} onEnter={enter} />
      ) : (
        <Band active={shown} onEnter={enter} />
      )}

      <footer className="gal__foot">
        <a href="https://www.linkedin.com/in/michelle-menkiti/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com/mimenkiti" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="mailto:mimichelle2011@gmail.com">Email</a>
      </footer>
    </div>
  )
}

/* --- desktop: the callout ---------------------------------------

   One band, and the leader drops into it from whichever room is
   active. With nothing selected the band holds the invitation's answer
   rather than going blank, because an empty half-screen reads as a
   loading state.
   ---------------------------------------------------------------- */

function Band({ active, onEnter }: { active: RoomId | null; onEnter: (id: RoomId) => void }) {
  return (
    <div className={['band', active ? 'is-on' : ''].join(' ')}>
      <div className="band__rule">
        <span className={['band__leader', active ? `is-${active}` : ''].join(' ')} aria-hidden="true" />
      </div>
      <div className="band__stage">
        {ROOMS.map((r) => (
          <Preview key={r.id} room={r} shown={active === r.id} onEnter={onEnter} />
        ))}
        <p className={['band__rest', active ? '' : 'is-on'].join(' ')} aria-hidden={!!active}>
          Three rooms. Hover or focus one to look in.
        </p>
      </div>
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
      <div className="peek__words">
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
      </div>

      {room.id !== 'archive' && (
        <div className="peek__plate">
          {room.id === 'llp' ? <PlateLLP /> : <PlateFaber />}
          <p className="peek__cap data">
            {room.n} · {room.name}
          </p>
        </div>
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
          <article
            className={['car__card', `car__card--${r.id}`, active === r.id ? 'is-on' : ''].join(' ')}
            key={r.id}
            data-card={r.id}
          >
            {r.id !== 'archive' && (
              <div className="car__plate">{r.id === 'llp' ? <PlateLLP /> : <PlateFaber />}</div>
            )}
            <p className="car__meta data">
              {r.n} · {r.name}
            </p>
            <h2 className="car__title">{r.title}</h2>
            <p className="car__orient">{r.orientation}</p>
            {ext ? (
              <a className="peek__enter" href={r.to.href} target="_blank" rel="noreferrer">
                {r.action} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <button className="peek__enter" onClick={() => onEnter(r.id)}>
                {r.action} <span aria-hidden="true">→</span>
              </button>
            )}
          </article>
        )
      })}
    </div>
  )
}
