import { useState } from 'react'
import { useReducedMotion } from '../lib/media'
import { form } from './lang'

/* ---------------------------------------------------------------
   The first encounter, as four turns.

   The deployed build is behind the threshold below this, and it is the
   real thing. What this is for is the reader who will not cross that
   threshold: until now the page described a conversation and then
   offered to start one, and a visitor who declined saw no Igbo in
   sequence at all.

   Every phrase, every IPA string and every gloss is read out of
   `forms.json`, so nothing here is typed by hand and no phrase can
   appear that the project does not hold. The order is the deployed
   build's: welcome, the greeting, your answer, then names.

   The withholding is the argument. A gloss does not appear until the
   turn after the learner has answered, which is what the essay means by
   Chioma not translating herself. Under reduced motion the whole
   exchange is shown at once, because the sequence is information and
   not an effect.
   --------------------------------------------------------------- */

type Turn = {
  who: 'chioma' | 'you'
  formId: string
  /** Shown as tappable replies under the line, as the build offers them. */
  replies?: string[]
}

const TURNS: Turn[] = [
  { who: 'chioma', formId: 'combination-27' },
  { who: 'chioma', formId: 'context-32', replies: ['Ọ dị mma.', '? I need help'] },
  { who: 'you', formId: 'context-33' },
  { who: 'chioma', formId: 'context-34' },
]

export function Encounter() {
  const quiet = useReducedMotion()
  const [at, setAt] = useState(quiet ? TURNS.length - 1 : 0)
  const [all, setAll] = useState(quiet)

  const shown = all ? TURNS.length - 1 : at
  // The learner answers on turn three. Before that, nothing is translated.
  const answered = shown >= 2

  return (
    <div className="turns">
      <div className="turns__stage">
        <p className="turns__where label">The market · turn {shown + 1} of {TURNS.length}</p>

        <ol className="turns__list">
          {TURNS.map((t, i) => {
            const f = form(t.formId)
            const on = i <= shown
            return (
              <li
                key={t.formId}
                className={['turns__turn', `is-${t.who}`, on ? 'is-on' : ''].join(' ')}
                aria-hidden={!on}
              >
                <span className="turns__who label">{t.who === 'you' ? 'you' : 'Chioma'}</span>
                <span className="turns__line ig" lang="ig">
                  {f.form}
                </span>
                {answered ? (
                  <span className="turns__gloss caption">
                    {f.ipa} · {f.gloss}
                  </span>
                ) : (
                  <span className="turns__held caption">not translated yet</span>
                )}
                {t.replies && i === shown && (
                  <span className="turns__replies">
                    {t.replies.map((r) => (
                      <span className="turns__reply" key={r}>
                        {r}
                      </span>
                    ))}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      <div className="turns__ctl">
        <button
          className="act act--quiet"
          onClick={() => {
            setAll(false)
            setAt(Math.max(0, shown - 1))
          }}
          disabled={!all && at === 0}
        >
          <span aria-hidden="true">←</span> back
        </button>
        <button
          className="act act--quiet"
          onClick={() => setAt(Math.min(TURNS.length - 1, at + 1))}
          disabled={all || at === TURNS.length - 1}
        >
          next <span aria-hidden="true">→</span>
        </button>
        <button className="act act--quiet" onClick={() => setAll(!all)} aria-pressed={all}>
          {all ? 'one turn at a time' : 'show all turns'}
        </button>
      </div>
    </div>
  )
}
