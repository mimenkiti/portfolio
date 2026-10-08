import { useState } from 'react'
import { Embed } from './Embed'
import { Recovery } from './Recovery'

/**
 * Three questions that came out of putting the learner in a conversation,
 * each answered by the thing that was actually built to answer it.
 *
 * They are registers of one apparatus rather than three figures in a row,
 * because they are one problem: a conversation cannot stop for a lesson,
 * and all three ask what to do about that from a different angle.
 */

const REGISTERS = [
  {
    key: 'order',
    ask: 'What order do you teach in?',
    said: 'Four sequences for the same first greeting. Teach then practice, try then discover, observe then infer, or test first and teach only what is missing. Walk any of them, then read them side by side.',
    kind: 'embed' as const,
    src: '/artifacts/teaching-approaches.html',
    title: 'Four teaching approaches',
    invite: 'walk the four sequences',
    frame: 'page' as const,
    animates: false,
  },
  {
    key: 'break',
    ask: 'What does it look like when it goes wrong?',
    said: 'Four recovery states for the same moment, and only one of them is about the learner being wrong. The names are the ones the deployed build runs on.',
    kind: 'recovery' as const,
  },
  {
    key: 'seam',
    ask: 'Where does the help live?',
    said: 'You are mid-encounter and you did not catch what Chioma said. Help opens over the conversation: you can hear the phrase again and read what it means, the scene stays behind it rather than being replaced, and closing the card puts you back at the same beat. Three ways of making that move. Drag the dot.',
    kind: 'embed' as const,
    src: '/artifacts/dot-lab.html#E',
    title: 'Encounter and practice',
    invite: 'try the three transitions',
    frame: 'phone' as const,
    animates: true,
  },
]

export function Approaches() {
  const [at, setAt] = useState('order')
  const r = REGISTERS.find((x) => x.key === at)!

  return (
    <div className="appr">
      <div className="appr__asks">
        {REGISTERS.map((x) => (
          <button
            key={x.key}
            className={['appr__ask', x.key === at ? 'is-on' : ''].join(' ')}
            onClick={() => setAt(x.key)}
            aria-expanded={x.key === at}
          >
            {x.ask}
          </button>
        ))}
      </div>

      <p className="appr__said">{r.said}</p>

      <div className="appr__stage">
        {r.kind === 'recovery' ? (
          <Recovery />
        ) : (
          <Embed
            key={r.src}
            src={r.src}
            title={r.title}
            frame={r.frame}
            invite={r.invite}
            animates={r.animates}
            autoIdle
          />
        )}
      </div>
    </div>
  )
}
