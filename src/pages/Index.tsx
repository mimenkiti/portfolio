import { useCallback, useEffect, useRef, useState } from 'react'
import { Dot } from '../components/Dot'
import { FaberIntroChair } from '../faber/assets'
import { CLIPS, hush, prime, say, type ClipKey } from '../lib/voice'
import { go } from '../lib/router'
import { CONTACT } from '../lib/links'

type Beat = 'idle' | 'wake' | 'greet' | 'choose' | 'answer' | 'done'

/**
 * The homepage is the index. No hero, no "Selected Work", no cards.
 *
 * The Dot is the full stop at the end of LLP's question. Touching it does
 * not show a word; it starts a short encounter the visitor takes part in.
 *
 * Every line spoken here is a real clip. That is a hard constraint, not a
 * detail: the exchange can only contain phrases the archive holds, so it
 * was written from the four that exist rather than the other way round.
 * Both replies are real, and both are answerable, so picking the closing
 * one is not a wrong answer. It simply ends the conversation, which is
 * what it means.
 *
 * Nothing is loaded or played before the full stop is pressed.
 */

/** Her opening, your two ways of taking it, and what each one gets. */
const ANSWERS: Record<string, ClipKey> = {
  odimma: 'ahaChioma',
  kaodi: 'kaodi',
}
const REPLIES: ClipKey[] = ['odimma', 'kaodi']

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
  useEffect(() => () => {
    clear()
    hush()
  }, [])

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
        <div className="index__id">
          <h1 className="index__name">Michelle Menkiti</h1>
          <p className="index__role">
            I&rsquo;m a product manager and builder based in San Francisco. I currently work on
            Samsung Wallet, and before that worked on consumer financial products at Goldman
            Sachs.
          </p>
          <p className="index__role">
            I studied architecture at MIT and still spend a lot of my time outside of work
            designing and building things. Recently, that has meant getting more hands-on with AI
            and exploring ideas that interest me through working products.
          </p>
        </div>

        <article className="index__entry index__entry--llp">
          <header className="index__meta">
            <span className="index__num">01</span>
            <span className="index__slug">LLP</span>
            <span className="index__desc">Learning a heritage language</span>
          </header>

          <h2 className="display index__q">
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
                <button className="act act--room" onClick={() => go('/llp')}>
                  Explore LLP <span aria-hidden="true">→</span>
                </button>
                <button className="act act--quiet act--room" onClick={dismiss}>
                  not now
                </button>
              </div>
            </div>
          </div>

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

          {!active && (
            <button className="act index__go" onClick={() => go('/llp')}>
              Explore LLP <span aria-hidden="true">→</span>
            </button>
          )}
        </article>
      </section>

      <section className="index__entry index__entry--faber spread">
        <header className="index__meta">
          <span className="index__num">02</span>
          <span className="index__slug">Faber</span>
          <span className="index__desc">Making my way back to making</span>
        </header>

        <div className="index__artifact index__artifact--faber">
          <FaberIntroChair />
        </div>

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
      </section>

      <footer className="index__foot spread">
        <hr className="rule wide" />
        <div className="index__footRow wide">
          <div className="index__footCol">
            <p className="label">Context</p>
            <button className="index__footLink" onClick={() => go('/about')}>
              About
            </button>
          </div>
          <div className="index__footCol">
            <p className="label">Elsewhere</p>
            <div className="index__links">
              {CONTACT.map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer">
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
