import { FABER_PROJECT } from '../faber/content'
import { ProjectView } from '../project/ProjectView'
import type { Mode } from '../project/blocks'
import { go } from '../lib/router'
import { LIVE, SOURCE } from '../lib/links'

export function Faber({ mode, setGround }: { mode: Mode; setGround: (v: number) => void }) {
  return (
    <div className={['route faber', `mode-${mode}`].join(' ')}>
      <header className="spread proj">
        <p className="proj__meta label">
          <span className="proj__num">02</span>
          <span className="proj__name">{FABER_PROJECT.name}</span>
          <span>{FABER_PROJECT.subject}</span>
        </p>
        <p className="proj__draft caption side">
          Product output quoted from the live build. Drawings of the chair are made for this page:
          Faber does not generate geometry.
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
          <button className="act act--quiet" onClick={() => go('/')}>
            Back to the index <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
