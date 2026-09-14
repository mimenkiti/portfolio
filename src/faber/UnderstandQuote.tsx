import { CAPTURE, UNDERSTAND } from './data'

/**
 * What Faber's Understand stage actually says.
 *
 * The drawing above it is the portfolio's. This is the product's: three
 * pieces of written construction analysis and a dimension rail, laid out
 * roughly the way the product lays them out, in the product's cream.
 * Without it the section would show my drawing and none of Faber's work,
 * which would be a strange thing for a page about Faber to do.
 */
export function UnderstandQuote() {
  const u = UNDERSTAND
  return (
    <div className="uq">
      <div className="fq uq__card">
        <div className="uq__main">
          {[u.material, u.construction].map((s) => (
            <section key={s.head} className="uq__sec">
              <p className="uq__head">{s.head}</p>
              <p className="uq__sub">{s.sub}</p>
              <p className="uq__body">{s.body}</p>
            </section>
          ))}
          <section className="uq__sec uq__sec--key">
            <p className="uq__head">{u.key.head}</p>
            <p className="uq__body uq__body--key">{u.key.body}</p>
          </section>
        </div>

        <aside className="uq__rail">
          <p className="uq__head">Dimensions</p>
          <dl className="uq__dims">
            {u.dims.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd className="data">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="uq__head uq__head--gap">Difficulty</p>
          <p className="uq__diff">{u.difficulty}</p>
        </aside>
      </div>
      <p className="fq__cap caption">
        {CAPTURE.label}. Faber&rsquo;s Understand output for this chair, abridged to its three
        written sections and its dimension rail. The dimensions are the product&rsquo;s figures, and
        the drawing above does not claim to match them.
      </p>
    </div>
  )
}
