import { useState } from 'react'
import { LevelDrawing } from './assets'
import { CAPTURE, LEVELS, RERUN } from './data'

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
  const lv = LEVELS[i]

  return (
    <div className="bx">
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
