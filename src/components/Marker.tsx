import { useRef, useState, type ReactNode } from 'react'
import { go, type Route } from '../lib/router'
import { useScrollEffect, clamp01 } from '../lib/scroll'

/**
 * The only persistent navigation. No bar, no blur, no pill. It reports
 * where you are, gets you back, and carries a hairline of read-progress
 * that works in either mode. Orientation otherwise comes from the
 * temperature of the page, not from chrome.
 */
export function Marker({
  route,
  title,
  aside,
}: {
  route: Route
  title?: string
  aside?: ReactNode
}) {
  const home = route === '/'
  const [hidden, setHidden] = useState(false)
  const bar = useRef<HTMLSpanElement>(null)
  const last = useRef(0)

  useScrollEffect((y) => {
    if (Math.abs(y - last.current) > 6) {
      setHidden(y > 240 && y > last.current)
      last.current = y
    }
    if (bar.current) {
      const h = document.documentElement.scrollHeight - window.innerHeight
      bar.current.style.transform = `scaleX(${clamp01(h > 0 ? y / h : 0).toFixed(4)})`
    }
  })

  return (
    <div className={['marker', hidden ? 'is-hidden' : ''].join(' ')}>
      <div className="marker__row">
        <button
          className="marker__home"
          onClick={() => go('/')}
          aria-label={home ? 'Michelle Menkiti' : 'Back to the index'}
        >
          {home ? 'Michelle Menkiti' : <span className="marker__back">← index</span>}
        </button>
        {!home && title && <span className="marker__title">{title}</span>}
      </div>
      {!home && (
        <span className="marker__progress" aria-hidden="true">
          <span ref={bar} />
        </span>
      )}
      {aside && <div className="marker__aside">{aside}</div>}
    </div>
  )
}
