/**
 * What happens when it cannot hear you.
 *
 * This is the unfinished part, so it is shown rather than described. The
 * five outcomes are the ones the deployed build can actually return and
 * the microphone failures are the ones it names; what each row says has
 * been shortened to plain language, because the build’s own wording read
 * as documentation next to the essay.
 *
 * The reframing that used to sit here under "What narrows the problem"
 * has moved into the prose above, where it is the pull quote. It was the
 * best idea in the section and this component was concealing it.
 */

const OUTCOMES = [
  { k: 'Match', v: 'Continue.' },
  { k: 'English', v: "They understood, but didn’t produce the Igbo yet." },
  { k: 'Low confidence', v: "The system can’t tell. Don’t pretend otherwise." },
  { k: 'Silence', v: 'Try again without penalty.' },
  { k: 'Mismatch', v: 'Offer another attempt or some help.' },
]

const MIC = ['unsupported', 'insecure-context', 'denied', 'no-device', 'unknown']

export function Hearing() {
  return (
    <div className="hear">
      <div className="hear__what">
        <p className="hear__lead">
          What the recognizer is allowed to come back with, and what the lesson does with each.
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

      <div className="hear__mic">
        <p className="hear__k label">And when there is no microphone at all</p>
        <p className="hear__v">
          Five named ways it can fail, each with its own recovery, and an exit that is not a
          penalty: <em>carry on without speaking</em>. None of these is the learner getting
          something wrong. A browser that cannot do it, a page served without a secure context, a
          permission that was never granted, a device that is not there: those are all mine to
          handle, and the lesson should never charge them to the person trying to speak.
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
