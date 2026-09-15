import { useState } from 'react'

/**
 * Four ways the same moment breaks.
 *
 * Ported from the struggle-and-recovery lab rather than embedded: the
 * original is a fixed 390px with overflow hidden, so it clips on a phone.
 * The text is the lab’s, verbatim, including the Igbo — this is the record
 * of where these four names came from, and the names are the point, because
 * they are the ones the deployed build uses.
 */

type State = {
  key: string
  letter: string
  name: string
  /** The name the same state carries in the deployed build. */
  shipped: string
  stage: string
  learnerSaid: { text: string; gloss?: string }[]
  inferred: string
  approach: string
  differs: string
  asks: string
  diagnostic: string
  affective: string
  urgency: string
}

const STATES: State[] = [
  {
    key: 'a',
    letter: 'A',
    name: 'Comprehension Gap',
    shipped: 'comprehension-gap',
    stage: "You’re unsure what she asked. What do you do?",
    learnerSaid: [{ text: '🔄 Replay that' }, { text: '... (Stay silent)' }, { text: '? I need help' }],
    inferred: 'Meaning is not yet clear. You need help understanding the phrase.',
    approach: 'Sound-first help, on demand. No automatic translation.',
    differs:
      'Three help drawers, all collapsed: listen again slower, show the words, what it means. Nothing is revealed unless it is asked for.',
    asks: 'Did the recovery feel appropriate?',
    diagnostic: 'Clear',
    affective: 'Low',
    urgency: 'Immediate',
  },
  {
    key: 'b',
    letter: 'B',
    name: 'Retrieval / Production Gap',
    shipped: 'production-gap',
    stage: "You understand her. But you hesitate, and the response isn’t there yet.",
    learnerSaid: [{ text: "I’m good" }, { text: '... (searching)' }],
    inferred:
      "You understood what she asked. The gap is: you don’t yet have the Igbo words ready.",
    approach: 'Credit what you did know. Then teach production.',
    differs:
      '"You got it. Here\'s how to say what you meant" comes before the teaching card, not after it. The credit is the first thing on screen.',
    asks: 'Did crediting your understanding help?',
    diagnostic: 'Clear',
    affective: 'Medium',
    urgency: 'Medium',
  },
  {
    key: 'c',
    letter: 'C',
    name: 'System Uncertainty',
    shipped: 'system-uncertainty',
    stage: 'You respond confidently in appropriate Igbo.',
    learnerSaid: [{ text: 'Ọ dị mma', gloss: "I’m good" }],
    inferred:
      'Audio was slightly unclear, or your pronunciation differs from the training data. The system has insufficient evidence to judge.',
    approach: 'Neutral retry. No judgment. No red.',
    differs:
      'The machine speaks in the first person and takes the blame: "I didn\'t quite catch that. Let me listen more carefully." Two equal exits, try again and keep going, so neither is the penalty.',
    asks: 'Did this feel like failure?',
    diagnostic: 'Ambiguous',
    affective: 'High',
    urgency: 'None',
  },
  {
    key: 'd',
    letter: 'D',
    name: 'Misunderstanding',
    shipped: 'misunderstanding',
    stage: 'You respond confidently, but you misunderstood what she asked.',
    learnerSaid: [{ text: "Ànyị nọ n'Ígbò", gloss: "We’re in Igboland" }],
    inferred:
      "You responded confidently, but your answer doesn’t match what she asked. You have a meaning hypothesis that’s incorrect.",
    approach: 'Clarify without shaming. Help discovery.',
    differs:
      'The only state where Chioma does the repair herself. She looks gently confused and rephrases, and the correction arrives as conversation rather than as a verdict.',
    asks: 'Did you feel like you failed?',
    diagnostic: 'Clear',
    affective: 'Medium',
    urgency: 'High',
  },
]

const KEY_PRINCIPLE =
  'System uncertainty ≠ your failure. This is the system taking responsibility for what it doesn’t know.'

export function Recovery() {
  const [at, setAt] = useState('a')
  const s = STATES.find((x) => x.key === at)!

  return (
    <div className="rec">
      <p className="rec__lead">
        The same moment, Chioma saying <span className="ig">Kedụ?</span>, going wrong in four
        different ways.
      </p>

      <div className="rec__tabs" role="tablist">
        {STATES.map((x) => (
          <button
            key={x.key}
            role="tab"
            aria-selected={x.key === at}
            className={['rec__tab', x.key === at ? 'is-on' : ''].join(' ')}
            onClick={() => setAt(x.key)}
          >
            <span className="rec__tabL data">{x.letter}</span>
            <span className="rec__tabN">{x.name}</span>
          </button>
        ))}
      </div>

      <div className="rec__panel">
        <div className="rec__stage">
          <p className="rec__she ig">Kedụ?</p>
          <p className="rec__what">{s.stage}</p>
          <div className="rec__said">
            {s.learnerSaid.map((l) => (
              <span className="rec__chip" key={l.text}>
                <span className={l.gloss ? 'ig' : ''}>{l.text}</span>
                {l.gloss && <span className="rec__chipGloss caption">{l.gloss}</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="rec__read">
          <div className="rec__row">
            <p className="rec__k label">What the system inferred</p>
            <p className="rec__v">{s.inferred}</p>
          </div>
          <div className="rec__row">
            <p className="rec__k label">Recovery approach</p>
            <p className="rec__v rec__v--strong">{s.approach}</p>
          </div>
          <div className="rec__row">
            <p className="rec__k label">What that looks like</p>
            <p className="rec__v">{s.differs}</p>
          </div>
          <div className="rec__row">
            <p className="rec__k label">What the lab asked afterwards</p>
            <p className="rec__v">{s.asks}</p>
          </div>
        </div>
      </div>

      {s.key === 'c' && <p className="rec__principle">{KEY_PRINCIPLE}</p>}

      <table className="rec__matrix data">
        <thead>
          <tr>
            <th />
            {STATES.map((x) => (
              <th key={x.key} className={x.key === at ? 'is-on' : ''}>
                {x.letter}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ['diagnostic', 'diagnostic'],
            ['affective risk', 'affective'],
            ['teaching urgency', 'urgency'],
          ].map(([label, field]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {STATES.map((x) => (
                <td key={x.key} className={x.key === at ? 'is-on' : ''}>
                  {String(x[field as keyof State])}
                </td>
              ))}
            </tr>
          ))}
          <tr className="rec__shipped">
            <th scope="row">in the build today</th>
            {STATES.map((x) => (
              <td key={x.key} className={x.key === at ? 'is-on' : ''}>
                <code>{x.shipped}</code>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <p className="rec__after caption">
        All four names survived. They are the recovery states the deployed build runs on, under
        exactly these labels.
      </p>
    </div>
  )
}
