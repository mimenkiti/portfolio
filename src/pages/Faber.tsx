import { FABER_PROJECT } from '../faber/content'
import { ProjectView } from '../project/ProjectView'
import type { Mode } from '../project/blocks'
import { go } from '../lib/router'
import { EARLIER, LIVE, SOURCE } from '../lib/links'

export function Faber({ mode, setGround }: { mode: Mode; setGround: (v: number) => void }) {
  return (
    <div className={['route faber', `mode-${mode}`].join(' ')}>
      <header className="spread proj">
        <h1 className="sr-only">Faber: identifying an object, and understanding it well enough to make one</h1>
        <p className="proj__meta label">
          <span className="proj__num">02</span>
          <span className="proj__name">{FABER_PROJECT.name}</span>
          <span>{FABER_PROJECT.subject}</span>
        </p>
        {/* The provenance rule, stated once. Everything downstream of this
            carries a small mark where it is a quotation and says nothing
            about authorship again, except where a specific limitation or a
            specific event is the point. */}
        <p className="proj__draft caption side">
          Everything marked <span className="fq__tag">Faber</span> on this page was copied out of
          the live build rather than generated here. The drawings of the chair are mine, made for
          this page: Faber generates no geometry.
        </p>
      </header>

      <ProjectView project={FABER_PROJECT} mode={mode} setGround={setGround} />

      <div className="spread">
        <div className="m__next wide">
          <hr className="rule" />
          <div className="proj__links">
            <a className="act" href={LIVE.faber} target="_blank" rel="noreferrer">
              The live product <span aria-hidden="true">↗</span>
            </a>
            <a className="act act--quiet" href={SOURCE.faber} target="_blank" rel="noreferrer">
              Source on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="proj__onward">
            <button className="act act--quiet" onClick={() => go('/llp')}>
              Room 01 · LLP <span aria-hidden="true">→</span>
            </button>
            <a className="act act--quiet" href={EARLIER.archive} target="_blank" rel="noreferrer">
              Room 03 · Earlier work <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
