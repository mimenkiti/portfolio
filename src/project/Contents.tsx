import { useRef, useState } from 'react'
import { useScrollEffect } from '../lib/scroll'
import { useMedia, useReducedMotion } from '../lib/media'
import type { Block, Mode, Project } from './blocks'

/* ---------------------------------------------------------------
   Project contents.

   Derived from the narrative rather than imposed on it, which means the
   two projects produce genuinely different rails, because they are
   built differently:

     LLP    six `heading` blocks, no moments. Unnumbered, because the
            writing is not numbered and inventing 01–06 would impose a
            structure the prose does not have.
     Faber  five `moment` blocks, no headings. Numbered, because those
            numbers are already in the content.

   Both also get an opening entry, labelled from the project's own
   `subject` field. Nothing here is a generic case-study section, and if
   either narrative is edited the rail follows it without being touched.

   Anchors are the existing `data-b` ids, which `useMode` already uses
   for its anchor pinning, so jumping and mode-switching share one id
   space and cannot disagree about where a block is.
   --------------------------------------------------------------- */

export type Entry = { id: string; label: string; n?: string }

/** Headings carry ReactNode; the rail needs a string. LLP's are plain strings. */
function label(node: unknown, fallback: string): string {
  return typeof node === 'string' ? node : fallback
}

export function contentsOf(project: Project): Entry[] {
  const moments = project.blocks.filter((b): b is Block & { kind: 'moment' } => b.kind === 'moment')

  const body: Entry[] = moments.length
    ? moments.map((b) => ({ id: b.id, label: b.title || b.n, n: b.n }))
    : project.blocks
        .filter((b): b is Block & { kind: 'heading' } => b.kind === 'heading')
        .map((b) => ({ id: b.id, label: label(b.text, b.id) }))

  // The opening is whatever the reader actually lands on first, so the
  // rail's first entry scrolls somewhere real rather than to a heading
  // that does not exist yet.
  const first = project.blocks.find((b) => b.kind === 'lede' || b.kind === 'display')
  const open: Entry[] = first ? [{ id: first.id, label: project.subject }] : []

  return [...open, ...body]
}

function useActive(entries: Entry[]) {
  const [at, setAt] = useState(0)
  const last = useRef(0)
  useScrollEffect(
    (_, vh) => {
      const eyeline = vh * 0.34
      let i = 0
      for (let k = 0; k < entries.length; k++) {
        const el = document.querySelector<HTMLElement>(`[data-b="${entries[k].id}"]`)
        if (!el) continue
        if (el.getBoundingClientRect().top <= eyeline) i = k
        else break
      }
      if (i !== last.current) {
        last.current = i
        setAt(i)
      }
    },
    [entries],
  )
  return at
}

function useJump() {
  const quiet = useReducedMotion()
  return (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-b="${id}"]`)
    if (!el) return
    el.scrollIntoView({ behavior: quiet ? 'auto' : 'smooth', block: 'start' })
  }
}

/**
 * The rail. Fixed rather than sticky, and positioned off the same track
 * variables the spread is built from, so it sits in the margin column
 * without needing a tall grid parent to stick inside. It also means the
 * rail follows a mode change for free: Read sets `--col-side` to zero,
 * and at that point the compact control takes over instead.
 */
function Rail({ entries }: { entries: Entry[] }) {
  const at = useActive(entries)
  const jump = useJump()
  const [away, setAway] = useState(true)

  /**
   * The rail withdraws in three situations, all of them the same idea:
   * something else has the page.
   *
   * Over the opening composition, because it has nothing to report
   * before anyone has started reading, and on LLP it would otherwise
   * sit on the hero's own typography. Over the closing links, where
   * there is nothing left to navigate. And whenever a full-bleed moment
   * is on screen, because a bleed takes the whole viewport including the
   * track the rail lives in — the same reason the page already hides it
   * once the ground has gone dark for a threshold.
   */
  useScrollEffect((y, vh) => {
    const h = document.documentElement.scrollHeight
    const atEnds = y < vh * 0.45 || y + vh > h - vh * 0.75
    let covered = false
    if (!atEnds) {
      for (const el of document.querySelectorAll<HTMLElement>('.pv__spread > .bleed')) {
        const r = el.getBoundingClientRect()
        if (r.top < vh * 0.92 && r.bottom > vh * 0.08) {
          covered = true
          break
        }
      }
    }
    setAway(atEnds || covered)
  })

  return (
    <nav className={['toc', away ? 'is-away' : ''].join(' ')} aria-label="Project contents">
      <p className="toc__head label">Contents</p>
      <ol className="toc__list">
        {entries.map((e, i) => (
          <li key={e.id}>
            <button
              className={['toc__item', i === at ? 'is-at' : ''].join(' ')}
              onClick={() => jump(e.id)}
              aria-current={i === at ? 'true' : undefined}
            >
              <span className="toc__lead" aria-hidden="true" />
              {e.n && <span className="toc__n data">{e.n}</span>}
              <span className="toc__label">{e.label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * The compact control, for phones and for Read mode. One line closed,
 * so it costs almost no vertical space, and it closes again after a
 * jump because its job is finished at that point.
 */
function Compact({ entries }: { entries: Entry[] }) {
  const [open, setOpen] = useState(false)
  const at = useActive(entries)
  const jump = useJump()

  return (
    <nav className="toc-c" aria-label="Project contents">
      <button className="toc-c__toggle label" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="toc-c__mark" aria-hidden="true" />
        Contents
        <span className="toc-c__count data">{entries.length}</span>
      </button>
      {open && (
        <ol className="toc-c__list">
          {entries.map((e, i) => (
            <li key={e.id}>
              <button
                className={['toc-c__item', i === at ? 'is-at' : ''].join(' ')}
                onClick={() => {
                  jump(e.id)
                  setOpen(false)
                }}
                aria-current={i === at ? 'true' : undefined}
              >
                {e.n && <span className="toc__n data">{e.n}</span>}
                <span>{e.label}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </nav>
  )
}

export function Contents({ project, mode }: { project: Project; mode: Mode }) {
  const entries = contentsOf(project)
  /**
   * The rail lives in the spread's outermost track, not its margin
   * track, because the margin is now carrying the glosses and
   * marginalia belong next to the sentence they gloss while an index
   * does not. That track is `1fr`, so it only exists once the fixed
   * tracks have been paid for: it is 319px at 1440 and 180px at 1280,
   * and gone by about 1200. Below that the compact control takes over,
   * which is the same navigation in less room rather than none.
   */
  const wide = useMedia('(min-width: 1270px)')
  if (entries.length < 2) return null
  return wide && mode === 'experience' ? <Rail entries={entries} /> : <Compact entries={entries} />
}
