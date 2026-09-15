import { useEffect, useRef, useState } from 'react'

/**
 * The room, now holding the real thing.
 *
 * V2's room held a synthesised stand-in for the encounter. It holds the
 * deployed product instead, which is why nothing here draws: the page
 * withdraws, the lamp comes up, and the build gets the viewport.
 *
 * The iframe is only created once someone has crossed the threshold, so
 * the product’s first synthesis call is never made by a visitor who was
 * only scrolling past.
 */
export function Room({
  src,
  title,
  onExit,
  allow,
}: {
  src: string
  title: string
  onExit: () => void
  allow?: string
}) {
  const [entered, setEntered] = useState(false)
  const exit = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 40)
    return () => window.clearTimeout(t)
  }, [])

  // Leaving is the one thing that must always work, including while the
  // artifact has focus and is swallowing its own key events.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  // Deliberately NOT focusing the iframe. It is cross-origin, so once it
  // has the keyboard this page stops hearing Escape and the only way out
  // is the mouse. Focus the exit instead and let people tab in themselves.
  useEffect(() => {
    const t = window.setTimeout(() => exit.current?.focus(), 700)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <div className={['room', entered ? 'is-in' : ''].join(' ')}>
      <div className="room__bar">
        <span className="room__tag label">{title}</span>
        <button className="act act--room" ref={exit} onClick={onExit}>
          leave <span aria-hidden="true">↑</span>
        </button>
      </div>

      <div className="room__stage room__stage--live">
        <iframe
          className="room__frame"
          src={src}
          title={title}
          allow={allow}
          loading="lazy"
        />
      </div>

      <p className="room__foot caption">
        the live build · escape to leave
      </p>
    </div>
  )
}
