/**
 * Where each part of LLP stands.
 *
 * A plain list, read top to bottom. Status is said in words and drawn
 * with the line's weight (solid for built, dashed for exploratory, dotted
 * for planned and proposed), never with colour, so nothing reads as a traffic light.
 */

type Status = 'Built' | 'Tested' | 'Exploratory' | 'Planned' | 'Proposed'

const STAGES: { when: string; what: string; status: Status }[] = [
  { when: 'Before Aug 2026', what: 'Exercise-first: the first build, with exercises, hearts and a combo counter', status: 'Built' },
  { when: 'Aug to Sep 2026', what: 'Encounter-first, on the web: the market, Chioma and the dot', status: 'Built' },
  { when: 'Oct 2026', what: 'The iPhone app: Lesson 1, and the app around it', status: 'Built' },
  { when: 'Oct 2026', what: 'Conversation-first: a conversation that becomes a lesson', status: 'Exploratory' },
  { when: 'Oct 2026', what: 'Talking to Chioma by voice, hands-free', status: 'Exploratory' },
  { when: 'Next', what: 'A private TestFlight with early testers', status: 'Planned' },
  { when: 'Next', what: 'Measure how well recognition hears real learners, then one hands-free conversation', status: 'Proposed' },
]

export function Stages() {
  return (
    <ol className="stages">
      {STAGES.map((s) => (
        <li className={`stages__row stages__row--${s.status.toLowerCase()}`} key={s.what}>
          <span className="stages__when data">{s.when}</span>
          <span className="stages__mark" aria-hidden="true" />
          <span className="stages__what">{s.what}</span>
          <span className="stages__status label">{s.status}</span>
        </li>
      ))}
    </ol>
  )
}
