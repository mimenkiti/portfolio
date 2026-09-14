import { useEffect, useRef, useState } from 'react'

/**
 * A real artifact, playable in place.
 *
 * Every one of these is a working single-file prototype, so the honest
 * move is to run it rather than photograph it. Two constraints shape the
 * component:
 *
 * Nothing loads until asked. Four prototypes at once is four render
 * loops, two synthesisers and a canvas; the invite defers all of it and
 * also means no artifact starts making noise at a reader.
 *
 * The artifacts are historical. They are not restyled to match this page
 * and they are not corrected — the distance between the first build and
 * the current one is the thing worth seeing.
 */
export function Embed({
  src,
  title,
  frame,
  invite,
  allow,
  autoIdle,
  animates,
}: {
  src: string
  title: string
  frame: 'phone' | 'page'
  invite: string
  allow?: string
  /** Unload when scrolled well away, for the heavier canvas artifacts. */
  autoIdle?: boolean
  /** Runs continuous motion of its own, which this page cannot quiet. */
  animates?: boolean
}) {
  const [live, setLive] = useState(false)
  const [quiet, setQuiet] = useState(false)

  // The prototypes predate this page and do not honour reduce-motion. The
  // page will not pretend otherwise, and it will not start one without
  // saying so first.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setQuiet(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const host = useRef<HTMLDivElement>(null)
  const el = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!live || !autoIdle || !host.current) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) setLive(false)
      },
      { rootMargin: '250% 0px' },
    )
    io.observe(host.current)
    return () => io.disconnect()
  }, [live, autoIdle])

  useEffect(() => {
    if (live) el.current?.focus()
  }, [live])

  return (
    <div className={['embed', `embed--${frame}`, live ? 'is-live' : ''].join(' ')} ref={host}>
      {live ? (
        <iframe
          ref={el}
          className="embed__frame"
          src={src}
          title={title}
          allow={allow}
          loading="lazy"
        />
      ) : (
        <button className="embed__invite" onClick={() => setLive(true)}>
          <span className="embed__inviteDot" aria-hidden="true" />
          <span className="embed__inviteText">{invite}</span>
          <span className="embed__inviteTitle label">{title}</span>
          {animates && quiet && (
            <span className="embed__inviteWarn caption">
              This one moves continuously, and it is old enough not to know about your
              reduced-motion setting.
            </span>
          )}
        </button>
      )}
    </div>
  )
}
