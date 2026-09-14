import { useCallback, useEffect, useRef, useState } from 'react'
import { Dot } from '../components/Dot'
import { CoverChair } from '../components/CoverChair'
import { CLIPS, hush, prime, say, type ClipKey } from '../lib/voice'
import { go } from '../lib/router'
import { CONTACT } from '../lib/links'
import { form } from '../llp/lang'

type Beat = 'idle' | 'wake' | 'greet' | 'choose' | 'answer' | 'done'

/**
 * The index, as a ledger.
 *
 * Not a hero and not two cards under a bio. The first viewport is the
 * whole information architecture: who she is, that there are exactly
 * two bodies of work, what kind of thing each one is, and that there is
 * somewhere to find her. The project descriptions follow underneath,
 * because the architecture has to be visible immediately and the prose
 * does not.
 *
 * The two entries are deliberately not equal. LLP is the taller band
 * and carries a question, a live Dot and its own language in the
 * ground; Faber is shorter and carries a drawing. Equal treatment is
 * what makes two things look like cards, and these are not the same
 * kind of thing.
 *
 * The page is the cover: dark and saturated where both projects are
 * light. Engaging an entry pulls the ground a little way toward that
 * project's temperature without leaving the cover, so clicking through
 * is still a change of world rather than a zoom.
 *
 * The Dot is the full stop at the end of LLP's question. Touching it
 * does not show a word; it starts a short encounter the visitor takes
 * part in. Every line spoken is a real clip, which is a hard constraint
 * rather than a detail: the exchange can only contain phrases the
 * archive holds, so it was written from the four that exist rather than
 * the other way round. Both replies are real and both are answerable,
 * so picking the closing one is not a wrong answer. It simply ends the
 * conversation, which is what it means.
 *
 * Nothing is loaded or played before the full stop is pressed.
 */

/** Her opening, your two ways of taking it, and what each one gets. */
const ANSWERS: Record<string, ClipKey> = {
  odimma: 'ahaChioma',
  kaodi: 'kaodi',
}
const REPLIES: ClipKey[] = ['odimma', 'kaodi']

/** Real forms from the archive, ghosted into the LLP entry's ground. */
const GHOSTS = ['combination-27', 'context-33', 'context-36']

export function Index({ setGround }: { setGround: (v: number) => void }) {
  const [beat, setBeat] = useState<Beat>('idle')
  const [speaking, setSpeaking] = useState(false)
  const [reply, setReply] = useState<string | null>(null)
  const [line, setLine] = useState<ClipKey>('kedu')
  const timers = useRef<number[]>([])
  const beatRef = useRef<Beat>('idle')
  beatRef.current = beat

  const at = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(
    () => () => {
      clear()
      hush()
      document.documentElement.classList.remove('is-warming', 'is-cooling')
    },
    [],
  )

  /**
   * The ground's temperature follows whichever entry is engaged. This
   * is the site's own colour mechanism run at partial strength: the
   * same `html` element, the same 0.9s background transition, the same
   * pairing of warm with LLP and cool with Faber that the project pages
   * commit to fully.
   */
  const temper = useCallback((to: 'warm' | 'cool' | null) => {
    const c = document.documentElement.classList
    if (beatRef.current !== 'idle') return
    c.toggle('is-warming', to === 'warm')
    c.toggle('is-cooling', to === 'cool')
  }, [])

  const heat = (to: 'warm' | 'cool') => ({
    onPointerEnter: () => temper(to),
    onPointerLeave: () => temper(null),
    onFocusCapture: () => temper(to),
    onBlurCapture: () => temper(null),
  })

  const speak = useCallback((key: ClipKey) => {
    const dur = say(key)
    setSpeaking(true)
    at(dur, () => setSpeaking(false))
  }, [])

  const wake = () => {
    if (beat !== 'idle') return
    clear()
    prime()
    setBeat('wake')
    setLine('kedu')
    // The cover's own colour drains as the lamp comes up, rather than a
    // light page going dark. Same plate, same value, different start.
    document.documentElement.classList.remove('is-warming', 'is-cooling')
    setGround(0.88)
    at(700, () => {
      setBeat('greet')
      speak('kedu')
    })
    at(2500, () => setBeat('choose'))
    // If they hesitate she simply says it again. No hint, no translation.
    at(8200, () => {
      if (beatRef.current === 'choose') speak('kedu')
    })
  }

  const answer = (id: string) => {
    if (beat !== 'choose') return
    clear()
    setReply(id)
    setBeat('answer')
    at(560, () => {
      setLine(ANSWERS[id])
      speak(ANSWERS[id])
    })
    at(2400, () => setBeat('done'))
  }

  const dismiss = () => {
    clear()
    hush()
    setBeat('idle')
    setReply(null)
    setLine('kedu')
    setGround(0)
  }

  const active = beat !== 'idle'

  return (
    <div className={['route index', active ? 'is-hushed' : ''].join(' ')}>
      <div className={['index__warm', active ? 'is-on' : ''].join(' ')} aria-hidden="true" />

      <section className="index__first spread">
        <div className="index__id wide">
          <h1 className="index__name">Michelle Menkiti</h1>
          <p className="index__role">
            I&rsquo;m a product manager and builder based in San Francisco. I currently work on
            Samsung Wallet, where I get to work across payments, rewards and identity products.
            Before that, I focused on consumer products at Goldman Sachs.
          </p>
          <p className="index__role">
            I studied architecture at MIT and still spend a lot of my time outside of work designing
            and building both digital and physical things. Most of the projects here started with
            something I wanted to understand better, so I made something to explore it.
          </p>
        </div>

        <div className="index__ledger bleed">
          {/* 01 — the taller entry. A question, a live full stop, and
              the project's own language in the ground. */}
          <article className="index__band index__band--llp" {...heat('warm')}>
            {/* The whole band stays clickable for a mouse, but the
                labelled control below is the real one: two focusable
                things per entry saying the same sentence would only be
                two stops in the tab order. */}
            <div className="index__reach" onClick={() => go('/llp')} aria-hidden="true" />

            <header className="index__meta">
              <span className="index__num data">01</span>
              <span className="index__slug">LLP</span>
              <span className="index__desc">Learning a heritage language</span>
              <button
                className="index__enter"
                onClick={() => go('/llp')}
                tabIndex={active ? -1 : 0}
              >
                Explore LLP <span aria-hidden="true">→</span>
              </button>
            </header>

            <h2 className="index__q">
              <span className="index__qtext">Can the encounter be the lesson</span>
              <span className="index__stop">
                <Dot
                  size={16}
                  state={speaking ? 'speaking' : active ? 'held' : 'punctuation'}
                  dark={active}
                  onActivate={active ? undefined : wake}
                  label="Meet Chioma"
                  className={active ? 'is-presence' : ''}
                />
              </span>
            </h2>

            {!active && <p className="index__prompt caption">touch the full stop</p>}

            <div className="index__ghosts" aria-hidden="true">
              {GHOSTS.map((id, i) => (
                <span key={id} className={`index__ghost index__ghost--${i + 1} ig`}>
                  {form(id).form}
                </span>
              ))}
            </div>

            <div className={['enc', active ? 'is-on' : ''].join(' ')} aria-live="polite">
              <p className="enc__who label">Chioma</p>

              <p className={['enc__line ig', beat !== 'wake' ? 'is-on' : ''].join(' ')}>
                {CLIPS[line].label}
              </p>

              <div
                className={[
                  'enc__replies',
                  beat === 'choose' ? 'is-on' : '',
                  reply ? 'is-settled' : '',
                ].join(' ')}
              >
                {REPLIES.map((k) => (
                  <button
                    key={k}
                    className={['enc__reply ig', reply === k ? 'is-picked' : ''].join(' ')}
                    onClick={() => answer(k)}
                    tabIndex={beat === 'choose' ? 0 : -1}
                  >
                    {CLIPS[k].label}
                  </button>
                ))}
              </div>

              <div className={['enc__close', beat === 'done' ? 'is-on' : ''].join(' ')}>
                <div className="enc__acts">
                  <button
                    className="act act--room"
                    onClick={() => go('/llp')}
                    tabIndex={beat === 'done' ? 0 : -1}
                  >
                    Explore LLP <span aria-hidden="true">→</span>
                  </button>
                  <button
                    className="act act--quiet act--room"
                    onClick={dismiss}
                    tabIndex={beat === 'done' ? 0 : -1}
                  >
                    not now
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* 02 — the same grammar, different material. Its drawing sits
              under its own title rather than isolated at the far edge, and
              a datum runs off it across the band, which is how Faber uses
              width everywhere else. Drawn rather than spoken. */}
          <article className="index__band index__band--faber" {...heat('cool')}>
            <div className="index__reach" onClick={() => go('/faber')} aria-hidden="true" />

            <header className="index__meta">
              <span className="index__num data">02</span>
              <span className="index__slug">Faber</span>
              <span className="index__desc">Making my way back to making</span>
              <button
                className="index__enter"
                onClick={() => go('/faber')}
                tabIndex={active ? -1 : 0}
              >
                Explore Faber <span aria-hidden="true">→</span>
              </button>
            </header>

            <div className="index__mark">
              <CoverChair />
            </div>
          </article>

          {/* The third and quietest entry. */}
          <div className="index__band index__band--about">
            <button className="index__about" onClick={() => go('/about')}>
              About
            </button>
            <div className="index__links">
              {CONTACT.map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer">
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The descriptions, underneath, where prose belongs. Both are
          unchanged from the approved copy. */}
      <section className="index__notes spread">
        <div className="index__note wide">
          <p className="index__noteHead label">
            <span className="index__num data">01</span> LLP
          </p>
          <div className="index__blurb">
            <p>
              I&rsquo;m building LLP because I want to learn Igbo, and the tools that worked for me
              when learning French don&rsquo;t really exist for many heritage languages.
            </p>
            <p>
              It started as something pretty close to Duolingo for Igbo. Since then, I&rsquo;ve been
              experimenting with conversation, different ways of teaching, pronunciation, and where
              AI is actually useful when the language itself is underrepresented in the technology.
            </p>
          </div>
          <button className="act index__go" onClick={() => go('/llp')}>
            Explore LLP <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="index__note wide">
          <p className="index__noteHead label">
            <span className="index__num data">02</span> Faber
          </p>
          <div className="index__blurb">
            <p>
              Faber started with furniture. I wanted to be able to see an object I liked, understand
              how it was made, and figure out how I might make my own version.
            </p>
            <p>
              I built Faber to explore that idea and to get more hands-on with AI, while returning to
              some of the visual and spatial design work I missed from architecture.
            </p>
          </div>
          <button className="act index__go" onClick={() => go('/faber')}>
            Explore Faber <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}
