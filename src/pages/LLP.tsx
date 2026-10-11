import { LLP_PROJECT } from '../llp/content'
import { Hero } from '../llp/Hero'
import { ReadOpening } from '../llp/ReadOpening'
import { ProjectView } from '../project/ProjectView'
import type { Mode } from '../project/blocks'
import { go } from '../lib/router'
import { LIVE } from '../lib/links'

export function LLP({ mode, setGround }: { mode: Mode; setGround: (v: number) => void }) {
  return (
    <div className={['route llp', `mode-${mode}`].join(' ')}>
      <header className="spread proj proj--llp">
        <h1 className="sr-only">LLP: learning a heritage language</h1>
        <p className="proj__meta label">
          <span className="proj__num">01</span>
          <span className="proj__name">{LLP_PROJECT.name}</span>
          <span>{LLP_PROJECT.subject}</span>
        </p>
        {/* A reader can arrive here without passing the Gallery, so the
            thing the Gallery's preview says has to be said once here too. */}
        <p className="proj__draft caption side">
          LLP is short for Language Learning Product. It teaches a heritage language, starting
          with Igbo: you meet a guide who speaks it, and the lesson happens around that
          conversation rather than before it.
        </p>
      </header>

      {/* The hero is the project's own opening, not a banner over it, so
          it bleeds and the narrative begins underneath. Read keeps the
          same first move, meeting the language before the explanation,
          as a contained figure in the reading column instead. */}
      {mode === 'experience' ? (
        <div className="spread">
          <div className="bleed">
            <Hero />
          </div>
        </div>
      ) : (
        <div className="spread">
          <ReadOpening />
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
          </div>
          <button className="act act--quiet" onClick={() => go('/faber')}>
            Room 02 · Faber <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
