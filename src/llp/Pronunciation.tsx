import { useCallback, useEffect, useRef, useState } from 'react'
import data from './data/pronunciation.json'

/**
 * Listen, then inspect.
 *
 * The archive records what was generated and nothing about how it sounded.
 * There is no score, no rating, no verdict in any of the result files, so
 * this cannot be a before-and-after and does not pretend to be one. What it
 * can do is exact: the same voice, the same model, and the two strings that
 * were actually sent. The visitor's own ear is the instrument, which is also
 * how the work was done.
 *
 * Nothing plays unless asked, and one clip plays at a time.
 */

type Cond = { label: string | null; sent: string; ms?: number | null; audio: string }
type PerWord = { grapheme: string; ipa: string }
type Pair = {
  knowledgeId: string
  display: string
  english: string
  beat?: string
  voice: string
  model: string
  ipa?: string | null
  perWord?: PerWord[] | null
  conditions: { baseline: Cond; ipa: Cond }
}

const PAIRS = data.pairs as unknown as { multiphrase: Pair[]; singlePhrase: Pair[] }
const DIAG = data.diagnostic as unknown as {
  order: string[]
  count: number
  groups: Record<string, DiagItem[]>
}
type DiagItem = {
  id: string
  form: string
  gloss: string
  feature: string
  watch?: string | null
  ipa: string
  provenance: Record<string, string> | null
  conditions: { baseline: Cond; ipa: Cond }
}

type DiagMeta = {
  question: string
  notDoing: string
  generated: string
  g2p: Record<string, string>
  uncoveredGraphemes: { grapheme: string; why: string }[]
}
const meta = data.diagnosticMeta as unknown as DiagMeta
const dg = meta.g2p

const GROUP_NAMES: Record<string, string> = {
  vowels: 'the vowel pairs',
  consonants: 'consonants and digraphs',
  position: 'the same sound in different places',
  combination: 'harder combinations',
  tone: 'tone',
  context: 'the phrases from the encounter',
}

/** One element, so a second press always stops the first clip. */
function usePlayer() {
  const el = useRef<HTMLAudioElement | null>(null)
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    const a = new Audio()
    a.preload = 'none'
    a.addEventListener('ended', () => setNow(null))
    el.current = a
    return () => {
      a.pause()
      el.current = null
    }
  }, [])

  const toggle = useCallback(
    (src: string) => {
      const a = el.current
      if (!a) return
      if (now === src) {
        a.pause()
        setNow(null)
        return
      }
      a.pause()
      a.src = src
      setNow(src)
      void a.play().catch(() => setNow(null))
    },
    [now],
  )

  return { now, toggle }
}

function Clip({
  cond,
  name,
  shown,
  now,
  toggle,
}: {
  cond: Cond
  name: string
  /** A readable stand-in for the literal string, which is long markup. */
  shown?: string
  now: string | null
  toggle: (s: string) => void
}) {
  const on = now === cond.audio
  return (
    <div className="clip">
      <button
        className={['clip__play', on ? 'is-playing' : ''].join(' ')}
        onClick={() => toggle(cond.audio)}
        aria-label={`${on ? 'Stop' : 'Play'} the ${name} clip`}
      >
        <span className="clip__glyph" aria-hidden="true" />
        <span className="clip__name">{name}</span>
      </button>
      <code className="clip__sent data" title={cond.sent}>
        {shown || cond.sent}
      </code>
    </div>
  )
}

/** The phoneme markup, in full, for anyone who wants to check it. */
function Literal({ cond }: { cond: Cond }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="clip__literal">
      <button className="clip__literalBtn" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? 'hide the exact string' : 'the exact string that was sent'}
      </button>
      {open && <code className="clip__raw data">{cond.sent}</code>}
    </div>
  )
}

function PairRow({ p, now, toggle }: { p: Pair; now: string | null; toggle: (s: string) => void }) {
  return (
    <div className="pron__row">
      <div className="pron__phrase">
        <p className="ig pron__ig">{p.display}</p>
        <p className="pron__en caption">{p.english}</p>
        {p.ipa && <p className="pron__ipa data">{p.ipa}</p>}
      </div>
      <div className="pron__clips">
        <Clip cond={p.conditions.baseline} name="as written" now={now} toggle={toggle} />
        <Clip
          cond={p.conditions.ipa}
          name="with phonemes"
          shown={(p.perWord || []).map((w) => `${w.grapheme} \u2192 ${w.ipa}`).join('  ') || undefined}
          now={now}
          toggle={toggle}
        />
        <Literal cond={p.conditions.ipa} />
      </div>
    </div>
  )
}

export function Pronunciation() {
  const { now, toggle } = usePlayer()
  const voices = [...new Set(PAIRS.multiphrase.map((p) => p.voice))]
  const [voice, setVoice] = useState(voices[0])
  const [open, setOpen] = useState(false)
  const [group, setGroup] = useState(DIAG.order[0])

  const rows = [
    ...PAIRS.singlePhrase.filter((p) => p.voice === voice),
    ...PAIRS.multiphrase.filter((p) => p.voice === voice),
  ]

  return (
    <div className="pron">
      {/* The lead sentence that used to sit here said the same thing as
          the figure's own caption ("the same voice and model in each, and
          the exact string that produced them"), which the caption states
          in both Experience and Read. One note, not two. */}
      <div className="pron__head">
        <div className="pron__voices" role="group" aria-label="Voice">
          {voices.map((v) => (
            <button
              key={v}
              className={['pron__voice', v === voice ? 'is-on' : ''].join(' ')}
              onClick={() => setVoice(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="pron__rows">
        {rows.map((p) => (
          <PairRow key={p.knowledgeId + p.voice} p={p} now={now} toggle={toggle} />
        ))}
      </div>

      <p className="pron__caveat caption">
        {data.method.noJudgementRecorded} The note filed with this audio at the time:{' '}
        <em>{data.method.caveat.split(' \u2014 ')[0]}</em>
      </p>

      <button className="pron__more act act--quiet" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? 'close the diagnostic' : `open the diagnostic · ${DIAG.count} items`}
      </button>

      {open && (
        <div className="pron__diag">
          <p className="pron__diagLead">{meta.question}</p>
          <p className="pron__diagNot caption">{meta.notDoing}</p>

          <div className="pron__tabs" role="tablist">
            {DIAG.order.map((g) => (
              <button
                key={g}
                role="tab"
                aria-selected={g === group}
                className={['pron__tab', g === group ? 'is-on' : ''].join(' ')}
                onClick={() => setGroup(g)}
              >
                {GROUP_NAMES[g] || g}
                <span className="pron__tabN data">{DIAG.groups[g].length}</span>
              </button>
            ))}
          </div>

          {group === 'context' && (
            <p className="pron__anchorNote caption">
              Two of these carry a verdict in their own label, calling one phrase good at baseline
              and the other repaired. That is the author's assessment at the time, written into the
              experiment's design so the later items had something to be compared against. It is an
              ear, not a measurement, and no measurement of it exists.
            </p>
          )}

          <div className="pron__items">
            {DIAG.groups[group].map((it) => (
              <div className="pron__item" key={it.id}>
                <div className="pron__itemHead">
                  <p className="ig pron__itemForm">{it.form}</p>
                  <p className="pron__itemGloss caption">{it.gloss}</p>
                </div>
                <p className="pron__feature data">{it.feature}</p>
                {it.watch && <p className="pron__watch caption">listen for: {it.watch}</p>}
                <div className="pron__itemClips">
                  <Clip cond={it.conditions.baseline} name="as written" now={now} toggle={toggle} />
                  <Clip
                    cond={it.conditions.ipa}
                    name="with phonemes"
                    shown={it.ipa}
                    now={now}
                    toggle={toggle}
                  />
                </div>
                {it.provenance && (
                  <p className="pron__prov caption">
                    {it.provenance.tier === 'REGISTRY' ? 'registry' : 'dictionary'} ·{' '}
                    {it.provenance.source}
                    {it.provenance.url && (
                      <>
                        {' · '}
                        <a href={it.provenance.url} target="_blank" rel="noreferrer noopener">
                          entry
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="pron__notes">
            <p className="caption">
              <strong>The tool, and what it cannot do.</strong> {dg.library} {dg.version},{' '}
              {data.method.g2p.method}. Table: {dg.tableSource}. Tone: {dg.tones} {dg.caution}
            </p>
            <p className="caption">
              <strong>Left untested rather than guessed at.</strong>{' '}
              {(meta.uncoveredGraphemes || [])
                .map((u) => `${u.grapheme}: ${u.why}`)
                .join(' ')}
            </p>
            <p className="caption">
              <strong>What did not run.</strong> {data.blocked.what} {data.blocked.consequence}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
