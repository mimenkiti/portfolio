import { LLP_PROJECT } from '../llp/content'
import { Hero } from '../llp/Hero'
import { ProjectView } from '../project/ProjectView'
import type { Mode } from '../project/blocks'
import { go } from '../lib/router'
import { LIVE, SOURCE } from '../lib/links'

export function LLP({ mode, setGround }: { mode: Mode; setGround: (v: number) => void }) {
  return (
    <div className={['route llp', `mode-${mode}`].join(' ')}>
      <header className="spread proj proj--llp">
        <p className="proj__meta label">
          <span className="proj__num">01</span>
          <span className="proj__name">{LLP_PROJECT.name}</span>
          <span>{LLP_PROJECT.subject}</span>
        </p>
      </header>

      {/* The hero is the project's own opening, not a banner over it, so
          it bleeds and the narrative begins underneath. In Read it is
          not wanted at all: a document opens with its first sentence. */}
      {mode === 'experience' && (
        <div className="spread">
          <div className="bleed">
            <Hero />
          </div>
        </div>
      )}

      <ProjectView project={LLP_PROJECT} mode={mode} setGround={setGround} />

      <div className="spread">
        <div className="m__next wide">
          <hr className="rule" />
          <div className="proj__links">
            <a className="act" href={LIVE.llp} target="_blank" rel="noreferrer">
              The live build <span aria-hidden="true">↗</span>
            </a>
            <a className="act act--quiet" href={SOURCE.llp} target="_blank" rel="noreferrer">
              Source on GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
          <button className="act act--quiet" onClick={() => go('/faber')}>
            Next project · Faber <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
