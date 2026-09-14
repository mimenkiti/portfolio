import { pushLevel } from './level'

/**
 * Chioma's voice on the homepage: real clips, no synthesis.
 *
 * Every line here is a file that exists, generated from a knowledge-registry
 * phrase by the same model the product uses. Nothing is synthesised and
 * nothing is stitched, which means the encounter can only say what the
 * archive actually contains. That constraint shaped the exchange rather
 * than the other way round.
 *
 * Where the deployed build applies a pronunciation override to a line, the
 * clip used here is the one with the override, so the homepage is not a
 * kinder version of the product's own voice.
 *
 * Nothing loads or plays until the visitor deliberately enters. `prime`
 * is called from that gesture and does both.
 */

export type Clip = {
  id: string
  /** The knowledge-registry id this phrase comes from. */
  knowledgeId: string
  label: string
  src: string
  /** Roughly how long it runs, so the choreography can be written. */
  dur: number
}

export const CLIPS = {
  /* IGB-KNW-001. Production applies no pronunciation override to this
     line, so the plain reading is the honest one to use. */
  kedu: {
    id: 'kedu',
    knowledgeId: 'IGB-KNW-001',
    label: 'Kedụ?',
    src: '/audio/multiphrase/IGB-KNW-001__Ayomide__baseline.mp3',
    dur: 0.9,
  },
  /* IGB-KNW-002. Production returns x-llp-pronunciation: ipa-inline for
     this one, so this is the corrected reading, not the plain one. */
  odimma: {
    id: 'odimma',
    knowledgeId: 'IGB-KNW-002',
    label: 'Ọ dị mma.',
    src: '/audio/g2p/eleven_v3__Ayomide__inline-ipa.mp3',
    dur: 1.1,
  },
  /* KNW-040. The one phrase in this exchange the registry marks Approved
     rather than Candidate. No override in production. */
  kaodi: {
    id: 'kaodi',
    knowledgeId: 'KNW-040',
    label: 'Ka ọ dị.',
    src: '/audio/diagnostic/context-36_baseline.mp3',
    dur: 1.0,
  },
  /* IGB-KNW-016 filled with her name. The registry entry is a template,
     so there is no single production reading to match; the plain one is
     the conservative choice. */
  ahaChioma: {
    id: 'ahaChioma',
    knowledgeId: 'IGB-KNW-016',
    label: 'Aha m bụ Chioma.',
    src: '/audio/multiphrase/IGB-KNW-016__Ayomide__baseline.mp3',
    dur: 1.6,
  },
} satisfies Record<string, Clip>

export type ClipKey = keyof typeof CLIPS

let el: HTMLAudioElement | null = null
let ctx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let buf: Uint8Array | null = null
let raf = 0
let primed = false

/** Called from the entry gesture: unlock audio and warm the four files. */
export function prime() {
  if (primed) return
  primed = true

  el = new Audio()
  el.preload = 'auto'
  el.crossOrigin = 'anonymous'

  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
    const src = ctx.createMediaElementSource(el)
    analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    buf = new Uint8Array(analyser.fftSize)
    src.connect(analyser)
    analyser.connect(ctx.destination)
  } catch {
    // No analyser is survivable: the clip still plays, the Dot just holds
    // a steady presence instead of pulsing to it.
    ctx = null
    analyser = null
  }

  for (const c of Object.values(CLIPS)) {
    const warm = new Audio()
    warm.preload = 'auto'
    warm.src = c.src
  }
}

function pump() {
  raf = 0
  if (!analyser || !buf || !el || el.paused) {
    pushLevel(0)
    return
  }
  analyser.getByteTimeDomainData(buf)
  let sum = 0
  for (let i = 0; i < buf.length; i++) {
    const v = (buf[i] - 128) / 128
    sum += v * v
  }
  // The Dot reads better on a slightly compressed signal than on raw RMS.
  pushLevel(Math.min(1, Math.sqrt(sum / buf.length) * 3.2))
  raf = requestAnimationFrame(pump)
}

/**
 * Play one clip. Returns how long to hold the speaking state for, which
 * is the clip's real duration once the file has told us, and its written
 * estimate until then.
 */
export function say(key: ClipKey): number {
  const c = CLIPS[key]
  if (!el) return c.dur * 1000
  void ctx?.resume()
  el.pause()
  el.src = c.src
  el.currentTime = 0
  const start = () => {
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(pump)
  }
  void el.play().then(start).catch(() => pushLevel(0))
  const known = Number.isFinite(el.duration) && el.duration > 0 ? el.duration : c.dur
  return known * 1000 + 120
}

export function hush() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  el?.pause()
  pushLevel(0)
}
