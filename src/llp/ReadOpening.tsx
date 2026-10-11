import { useEffect, useState } from 'react'
import { Dot } from '../components/Dot'
import { LiveMark } from '../components/LiveMark'
import { HERO_PHRASE, form } from './lang'
import { CLIPS, hush, prime, say } from '../lib/voice'
import { Encounter } from './Encounter'
import { ENCOUNTER_CAPTION } from './content'

/* ---------------------------------------------------------------
   LLP's opening in Read.

   Experience makes the encounter the environment: the hero holds the
   viewport, the ground letter and the periphery surround it, and the
   word is written in front of you. Read keeps the same first move,
   meeting the language before being told about it, but as a figure in
   the document: the question at figure scale with its live full stop,
   then the existing four turns, then the essay.

   Nothing here is new content. The phrase, its clip and the Dot are the
   hero's; the turns are `Encounter`, which Read shows here instead of
   further down, so the encounter appears exactly once in either mode.
   The gloss is deliberately absent: the turns withhold translation
   until the learner answers, and printing "how are you?" above them
   would give it away first.
   --------------------------------------------------------------- */

const CLIP: keyof typeof CLIPS = 'kedu'

export function ReadOpening() {
  const phrase = form(HERO_PHRASE)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => () => hush(), [])

  const speak = () => {
    prime()
    const dur = say(CLIP)
    setSpeaking(true)
    window.setTimeout(() => setSpeaking(false), dur)
  }

  return (
    <figure className="ropen">
      <div className="ropen__ask">
        <p className="ropen__line ig" lang="ig" aria-label={phrase.form}>
          <span>Kedụ</span>
          <span className="hero__q">?</span>
          <span className="hero__dot ropen__dot">
            <Dot
              size="0.1196em"
              state={speaking ? 'speaking' : 'punctuation'}
              onActivate={speak}
              label={`Hear ${phrase.form}`}
            />
          </span>
        </p>
        <p className="ropen__say caption">
          The dot at the end of the question is a button. Press it to hear her say it.
        </p>
      </div>

      <Encounter />

      <figcaption className="caption b__cap ropen__cap">
        <LiveMark does="advance a turn at a time" />
        {ENCOUNTER_CAPTION}
      </figcaption>
    </figure>
  )
}
