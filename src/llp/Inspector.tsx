import { useState } from 'react'
import reg from './data/registry.json'

/**
 * Knowledge, curriculum, teaching — traced through the real artifacts.
 *
 * Two things this deliberately does not do. It does not draw a tidy
 * three-box diagram: the system states its own chain as five links, and
 * collapsing that silently would be inventing architecture. And it does
 * not hide the status columns. Every capability here is Draft, every
 * knowledge object the lesson needs is Candidate, and the lesson carries
 * a blocker saying so. That is the interesting part.
 *
 * Every value on screen is a cell from one of the workbooks.
 */

type Row = Record<string, string | null>
type Step = {
  layer: string
  id: string
  artifact: string
  sheet: string
  fields: Row
}

const TRACE = reg.trace as unknown as Step[]
const META = reg.meta as unknown as {
  architectureStatedBySystem: string
  counts: Record<string, number>
  statusTallies: Record<string, Record<string, number> | string>
  rules: { label: string; source: string; text: string }[]
}

const BANDS = [
  {
    key: 'knowledge',
    name: 'Knowledge',
    asks: 'What do we know about the language, and how much do we trust it?',
    layers: ['source', 'knowledge'],
  },
  {
    key: 'curriculum',
    name: 'Curriculum',
    asks: 'What should this learner learn, and in what order?',
    layers: ['curriculum', 'lesson'],
  },
  {
    key: 'teaching',
    name: 'Teaching',
    asks: 'How should that appear in this moment?',
    layers: ['exercise', 'choreography', 'pattern'],
  },
]

const LAYER_NAMES: Record<string, string> = {
  source: 'source',
  knowledge: 'knowledge object',
  curriculum: 'capability',
  lesson: 'lesson',
  exercise: 'exercise',
  choreography: 'conversation beat',
  pattern: 'runtime pattern',
}

const STATUS_FIELDS = new Set([
  'Production Status',
  'Human Validation',
  'Status',
  'Knowledge Readiness',
  'Trust Level',
  'Confidence',
  'Corroboration Required',
  'Internal Review Status',
  'Current Blocker',
])

/* The workbooks are named for a visitor rather than by filename. Provenance
   without a tour of anyone’s folders. */
const ARTIFACT_NAMES: Record<string, string> = {
  'igbo_source_registry_v0_2.xlsx': 'source registry v0.2',
  'igbo_knowledge_registry_v0_2.xlsx': 'knowledge registry v0.2',
  'igbo_capability_registry_v0_2.xlsx': 'capability registry v0.2',
  'igbo_capability_registry_v0_1.xlsx': 'capability registry v0.1',
  'igbo_exercise_system_v0_1.xlsx': 'exercise system v0.1',
  'meet_someone_experience_choreography_v0_1.xlsx': 'Meet Someone choreography v0.1',
  'runtime_experience_patterns_v0_1.xlsx': 'runtime patterns v0.1',
}

function rule(label: string) {
  return META.rules.find((r) => r.label === label)
}

export function Inspector() {
  const [at, setAt] = useState(1)
  const [deep, setDeep] = useState(false)
  const step = TRACE[at]
  const bandOf = (layer: string) => BANDS.find((b) => b.layers.includes(layer))!.key

  return (
    <div className="insp">
      <div className="insp__bands">
        {BANDS.map((b) => (
          <div
            key={b.key}
            className={['insp__band', bandOf(step.layer) === b.key ? 'is-on' : ''].join(' ')}
          >
            <p className="insp__bandName">{b.name}</p>
            <p className="insp__bandAsks caption">{b.asks}</p>
          </div>
        ))}
      </div>

      <div className="insp__rail" role="tablist" aria-label="Trace one phrase through the system">
        {TRACE.map((s, i) => (
          <button
            key={s.id + i}
            role="tab"
            aria-selected={i === at}
            className={['insp__stop', i === at ? 'is-on' : '', i < at ? 'is-done' : ''].join(' ')}
            onClick={() => setAt(i)}
          >
            <span className="insp__stopDot" aria-hidden="true" />
            <span className="insp__stopName">{LAYER_NAMES[s.layer]}</span>
          </button>
        ))}
      </div>

      <div className="insp__card">
        <div className="insp__cardHead">
          <code className="insp__id data">{step.id}</code>
          <span className="insp__from caption">
            {ARTIFACT_NAMES[step.artifact] || step.artifact} · {step.sheet}
          </span>
        </div>
        <dl className="insp__fields">
          {Object.entries(step.fields).map(([k, v]) => (
            <div
              className={['insp__field', STATUS_FIELDS.has(k) ? 'is-status' : ''].join(' ')}
              key={k}
            >
              <dt className="insp__k label">{k}</dt>
              <dd className="insp__v">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="insp__nav">
          <button
            className="act act--quiet"
            onClick={() => setAt(Math.max(0, at - 1))}
            disabled={at === 0}
          >
            <span aria-hidden="true">←</span> back
          </button>
          <button
            className="act act--quiet"
            onClick={() => setAt(Math.min(TRACE.length - 1, at + 1))}
            disabled={at === TRACE.length - 1}
          >
            onward <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <p className="insp__stated caption">
        The chain the system states for itself is longer than three:{' '}
        <strong>{META.architectureStatedBySystem}</strong>. Sources sit under knowledge; lessons,
        exercises and beats sit under teaching.
      </p>

      <button className="insp__more act act--quiet" onClick={() => setDeep(!deep)} aria-expanded={deep}>
        {deep ? 'close' : 'what the registry says about itself'}
      </button>

      {deep && (
        <div className="insp__deep">
          <div className="insp__tally">
            {[
              ['knowledge objects', META.counts.knowledge],
              ['sources', META.counts.sources],
              ['capabilities', META.counts.capabilities],
              ['exercises', META.counts.exerciseInstances],
              ['conversation beats', META.counts.beats],
              ['runtime patterns', META.counts.runtimePatterns],
            ].map(([k, v]) => (
              <div className="insp__stat" key={String(k)}>
                <span className="insp__statN data">{v}</span>
                <span className="insp__statK caption">{k}</span>
              </div>
            ))}
          </div>

          <div className="insp__gate">
            <p className="insp__gateRule">{rule('MVP Rule')?.text}</p>
            <p className="insp__gateBlock">{rule('Current Blocker')?.text}</p>
            <p className="caption">
              Every capability in the registry is <strong>Draft</strong> or{' '}
              <strong>Knowledge Gap</strong>. Of {META.counts.knowledge} knowledge objects, the
              review queue holds {META.counts.humanReviewQueue} questions for native speakers and{' '}
              {META.counts.humanReviewQueueDecided} of them have an answer. The system’s own gate
              is closed, and it is the system that says so.
            </p>
          </div>

          <div className="insp__rules">
            {['Production Status', 'Human Validation', 'Audio rule', 'Generation rule', 'Publication rule', 'Dialect principle', 'Validation principle'].map(
              (label) => {
                const r = rule(label)
                if (!r) return null
                return (
                  <div className="insp__rule" key={label}>
                    <p className="insp__ruleK label">{r.label}</p>
                    <p className="insp__ruleV">{r.text}</p>
                    <p className="insp__ruleS caption">{r.source}</p>
                  </div>
                )
              },
            )}
          </div>

          <div className="insp__defects">
            <p className="label">And where it is untidy</p>
            {(reg.knownDefects as unknown as { what: string; where: string; evidence: string }[]).map((d) => (
              <div className="insp__defect" key={d.what}>
                <p className="insp__defectWhat">{d.what}</p>
                <p className="insp__defectWhere caption">
                  {Object.entries(ARTIFACT_NAMES).reduce(
                    (acc, [file, name]) => acc.split(file).join(name),
                    d.where,
                  )}
                </p>
                <p className="insp__defectEv caption">{d.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
