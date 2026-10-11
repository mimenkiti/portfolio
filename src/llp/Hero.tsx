import { useEffect, useState } from 'react'
import { Dot } from '../components/Dot'
import { useReducedMotion } from '../lib/media'
import { HERO_GLYPH, HERO_PERIPHERY, HERO_PHRASE, form } from './lang'
import { CLIPS, hush, prime, say } from '../lib/voice'

/* ---------------------------------------------------------------
   The LLP hero.

   Faber constructs: a drafting grid sweeps corner to corner and then
   fades away to reveal a drawing that was already there. LLP writes,
   and the mark it makes is the hero, so nothing fades away.

   The sequence is the real writing order for this orthography. You
   write the letters, then you go back and add the diacritics, then the
   punctuation. That second pass is not a flourish: the dot below is the
   part the technology drops, which is the subject of this project’s
   whole pronunciation layer. So it arrives as its own event, and then
   it stops being an event and becomes part of the letter.

   Two things are load-bearing about the settled state:

   The form is the archive’s. While the dot is being written the word is
   `Ked` + `u` with a drawn mark beneath it; the instant that pass ends
   the word is swapped for the precomposed `Kedụ` out of forms.json.
   A dot below does not change a `u`'s advance width, so the swap does
   not move anything, and what is left on the page afterwards is a real
   character rather than a letter with a decoration parked under it.

   The Dot is the question mark’s point, not a second mark next to it.
   The glyph’s own point is clipped off and the live Dot occupies the
   space it left, so the phrase reads `Kedụ?` with one full stop in it,
   and that full stop is the thing you can touch. This is the same move
   the index makes with the full stop at the end of its question.
   --------------------------------------------------------------- */

type Stage = 'blank' | 'stroke' | 'below' | 'question' | 'settled'

/** Crisp rather than stately: the whole sequence is under a second and a half. */
const AT: Record<Exclude<Stage, 'blank'>, number> = {
  stroke: 40,
  below: 620,
  question: 900,
  settled: 1120,
}

/**
 * Set once the word has actually been written, for the rest of the visit.
 * Coming back to Experience from Read shows the finished word rather than
 * writing it again.
 *
 * This used to be a per-instance `ran` ref set when the sequence was
 * *scheduled*. React's StrictMode (on in development) mounts every
 * component twice: the first mount set the ref and scheduled the timers,
 * its cleanup cancelled them, and the real mount saw the ref already set
 * and never scheduled them again. The hero stayed on its blank frame for
 * good: word clipped away, Dot and periphery hidden. Recording completion
 * instead of intent survives any remount.
 */
let heroWritten = false

export function Hero() {
  const phrase = form(HERO_PHRASE)
  const quiet = useReducedMotion()
  const [stage, setStage] = useState<Stage>(quiet || heroWritten ? 'settled' : 'blank')
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (quiet || heroWritten) {
      setStage('settled')
      return
    }
    // Every mount schedules its own sequence and cancels it on cleanup, so
    // a mount that is torn down early leaves nothing behind and the mount
    // that stays plays the whole thing.
    const timers = Object.entries(AT).map(([s, ms]) =>
      window.setTimeout(() => {
        setStage(s as Stage)
        if (s === 'settled') heroWritten = true
      }, ms),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [quiet])

  useEffect(() => () => hush(), [])

  const written = stage === 'settled' || stage === 'question'

  const speak = () => {
    prime()
    const dur = say(HERO_CLIP)
    setSpeaking(true)
    window.setTimeout(() => setSpeaking(false), dur)
  }

  return (
    <div className={['hero', `hero--${stage}`].join(' ')}>
      {/* The ground. A cropped letter English does not have, written by
          the same gesture as the word and then left completely still. */}
      <span className="hero__ground" aria-hidden="true">
        {HERO_GLYPH}
      </span>

      <div className="hero__body">
        {/* The accessible name is always the archive’s string, whatever
            the animation is doing to the glyphs on the way there. */}
        <p className="hero__line ig" lang="ig" aria-label={phrase.form}>
          <span className="hero__word">
            {written ? (
              'Kedụ'
            ) : (
              <>
                Ked
                <span className="hero__u">
                  u<span className="hero__below" />
                </span>
              </>
            )}
          </span>

          <span className="hero__q">?</span>

          <span className="hero__dot">
            <Dot
              /* The measured diameter of Newsreader’s own question-mark
                 point at this weight: 0.1196em. Given in em so it stays
                 the point of the glyph at every clamp step. */
              size="0.1196em"
              state={speaking ? 'speaking' : stage === 'settled' ? 'punctuation' : 'held'}
              onActivate={stage === 'settled' ? speak : undefined}
              label={`Hear ${phrase.form}`}
            />
          </span>
        </p>

        <p className="hero__gloss">
          <span className="hero__ipa data">{phrase.ipa}</span>
          <span className="hero__mean caption">{phrase.gloss}</span>
        </p>

        {/* The full stop of the question is the live Dot, and nothing on
            the page said so. Plain, and true on both a mouse and a thumb:
            the Dot is a real button with a real accessible name. */}
        <p className={['hero__say caption', stage === 'settled' ? 'is-on' : ''].join(' ')}>
          The dot at the end of the question is a button. Press it to hear her say it.
        </p>
      </div>

      {/* Three more the archive holds. Four phrases in total, because
          the count is what separates a composition from a word cloud. */}
      <div className="hero__periphery" aria-hidden="true">
        {HERO_PERIPHERY.map((id, i) => (
          <span key={id} className={`hero__near hero__near--${i + 1} ig`} lang="ig">
            {form(id).form}
          </span>
        ))}
      </div>
    </div>
  )
}

/** The clip for the hero phrase. IGB-KNW-001, no pronunciation override in production. */
const HERO_CLIP: keyof typeof CLIPS = 'kedu'
