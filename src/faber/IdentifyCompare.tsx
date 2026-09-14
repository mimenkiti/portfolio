import { Fragment, useState } from 'react'
import { FaberPhoto } from './assets'
import { CAPTURE, IDENTIFIED } from './data'

/**
 * Two real identifications, side by side in time.
 *
 * The argument of this section is not that uncertainty matters, which is
 * easy to say. It is that you can watch the product's language change
 * when it stops being sure: a famous chair gets a designer, a year and a
 * city, and an anonymous cabinet gets "Unknown", "likely" and "probable"
 * written straight into the same fields. Both are captured output. The
 * only thing this page adds is the ability to put them next to each
 * other, which Faber itself does not do.
 */
export function IdentifyCompare() {
  const [i, setI] = useState(0)
  const o = IDENTIFIED[i]

  return (
    <div className="idc">
      <div className="idc__switch" role="group" aria-label="Two objects Faber identified">
        {IDENTIFIED.map((x, k) => (
          <button
            key={x.id}
            className={['idc__tab', k === i ? 'is-on' : ''].join(' ')}
            onClick={() => setI(k)}
            aria-pressed={k === i}
          >
            {x.title.join(' ')}
          </button>
        ))}
      </div>

      <div className="fq idc__card">
        <div className="idc__plate">
          <FaberPhoto
            className="idc__img"
            src={o.img}
            alt={`The photograph given to Faber: ${o.title.join(' ')}`}
          />
          <p className="idc__title" aria-hidden="true">
            {o.title.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
        </div>

        <div className="idc__body">
          <dl className="idc__facts">
            {o.facts.map(([k, v]) => (
              <Fragment key={k}>
                <dt>{k}</dt>
                <dd>{mark(v, o.hedges)}</dd>
              </Fragment>
            ))}
          </dl>
          <p className="idc__ctx">{mark(o.context, o.hedges)}</p>
        </div>
      </div>

      <p className="fq__cap caption">
        {CAPTURE.label}. Marked in tan: the places the product declines to be certain.
        The marking is the portfolio&rsquo;s, the words are Faber&rsquo;s.
      </p>
    </div>
  )
}

/** Wrap the hedged phrases so they can be seen, without touching the text. */
function mark(text: string, hedges: string[]) {
  if (!hedges.length) return text
  const found = hedges.filter((h) => text.includes(h))
  if (!found.length) return text

  let parts: (string | JSX.Element)[] = [text]
  found.forEach((h, hi) => {
    const next: (string | JSX.Element)[] = []
    for (const p of parts) {
      if (typeof p !== 'string' || !p.includes(h)) {
        next.push(p)
        continue
      }
      const bits = p.split(h)
      bits.forEach((b, bi) => {
        if (b) next.push(b)
        if (bi < bits.length - 1) {
          next.push(
            <mark className="hedge" key={`${hi}-${bi}-${next.length}`}>
              {h}
            </mark>,
          )
        }
      })
    }
    parts = next
  })
  return parts.map((p, k) => <Fragment key={k}>{p}</Fragment>)
}
