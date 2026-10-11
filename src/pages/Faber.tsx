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
        {/* What Faber is, said once for a reader who arrives without the
            Gallery. The provenance rule used to sit here; it now sits under
            the first quotation it governs (identify-compare), so a visitor
            learns the idea before the bookkeeping. */}
        <p className="proj__draft caption side">
          Faber is a design and DIY companion. Start with a photograph of a designed object, and it
          helps you identify what it is, understand how it was made, and work out how you could
          make one yourself.
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
