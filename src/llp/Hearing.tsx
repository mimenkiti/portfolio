/**
 * What happens when it cannot hear you.
 *
 * This is the unfinished part, so it is shown rather than described. Every
 * string here is the deployed build's own: the outcomes its recogniser can
 * return, the ways a microphone can fail it, and what it says to a learner
 * in each case. Quoted verbatim, which is why the punctuation is the
 * product's and not the page's.
 */

const OUTCOMES = [
  { k: 'Match — correct Igbo', v: 'The response is one of the accepted forms for this moment. Chioma continues.' },
  { k: 'English — comprehension, no production', v: 'Understood, but answered in the wrong language. Credit the understanding, teach the words.' },
  { k: 'Low confidence — correct but unrecognised', v: 'Probably right. The system cannot tell. It says so and does not score it.' },
  { k: 'Silence — nothing heard', v: 'No evidence either way. Not a failure.' },
  { k: 'Mismatch — a different phrase', v: 'Heard something else. Chioma rephrases rather than marking it wrong.' },
]

const MIC = ['unsupported', 'insecure-context', 'denied', 'no-device', 'unknown']

export function Hearing() {
  return (
    <div className="hear">
      <div className="hear__what">
        <p className="hear__lead">
          What the recogniser is allowed to come back with, and what the lesson does with each.
        </p>
        <dl className="hear__list">
          {OUTCOMES.map((o) => (
            <div className="hear__row" key={o.k}>
              <dt className="hear__k data">{o.k}</dt>
              <dd className="hear__v">{o.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hear__narrow">
        <p className="hear__k label">What narrows the problem</p>
        <p className="hear__v">
          The request the build sends carries the line it is expecting and the set of responses
          that would count here. It is not asking what you said. It is asking whether what you said
          is one of a handful of things it already knows the lesson could accept.
        </p>
      </div>

      <div className="hear__mic">
        <p className="hear__k label">And when there is no microphone at all</p>
        <p className="hear__v">
          Four named ways it can fail, each with its own recovery, and an exit that is not a
          penalty: <em>carry on without speaking</em>.
        </p>
        <ul className="hear__kinds data">
          {MIC.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
