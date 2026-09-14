import { Fragment, useEffect, useRef, useState } from 'react'
import { Dot } from '../components/Dot'
import { Embed } from '../llp/Embed'
import { Room } from '../llp/Room'
import { clamp01, ease, inv, stickyProgress, useScrollEffect } from '../lib/scroll'
import type { Block, Mode, Project } from './blocks'

/**
 * One view, two modes.
 *
 * Experience composes the blocks spatially — thresholds darken the page,
 * artifacts take the width they need, notes live in the margin.
 * Read resolves the same blocks into a document — the margin column
 * collapses, notes come inline, and the room becomes a contained figure
 * that still plays. The container never unmounts between modes, so the
 * grid itself animates from one composition to the other.
 */
export function ProjectView({
  project,
  mode,
  setGround,
}: {
  project: Project
  mode: Mode
  setGround: (v: number) => void
}) {
  const [room, setRoom] = useState<{ src: string; label?: string; allow?: string } | null>(null)
  const thresholds = useRef<Map<string, HTMLElement>>(new Map())
  // Scenes darken the ground themselves. They report rather than write,
  // so one plate still owns the page and two sequences cannot fight over
  // it on the same frame.
  const scenes = useRef<Map<string, number>>(new Map())
  const experience = mode === 'experience'

  useScrollEffect(
    (_, vh) => {
      if (!experience) {
        setGround(room ? 1 : 0)
        return
      }
      let g = 0
      thresholds.current.forEach((el) => {
        const p = stickyProgress(el, vh)
        const v = Math.min(ease(inv(0, 0.24, p)), ease(inv(1, 0.9, p)))
        el.style.setProperty('--infl', v.toFixed(3))
        el.classList.toggle('is-ready', v > 0.5)
        g = Math.max(g, v)
      })
      scenes.current.forEach((v) => {
        g = Math.max(g, v)
      })
      setGround(room ? 1 : clamp01(g))
    },
    [room, experience],
  )

  useEffect(() => {
    if (!experience) scenes.current.clear()
  }, [experience])

  useEffect(() => {
    if (!experience) setGround(0)
  }, [experience, setGround])

  const enter = (src: string, label?: string, allow?: string) => {
    setRoom({ src, label, allow })
    document.body.classList.add('is-room-open')
    setGround(1)
  }

  const leave = () => {
    setRoom(null)
    document.body.classList.remove('is-room-open')
  }

  useEffect(() => () => document.body.classList.remove('is-room-open'), [])

  const setThreshold = (id: string) => (el: HTMLDivElement | null) => {
    if (el) thresholds.current.set(id, el)
    else thresholds.current.delete(id)
  }

  const sceneGround = (id: string) => (v: number) => {
    scenes.current.set(id, v)
  }

  return (
    <div className={['pv', `pv--${mode}`].join(' ')}>
      <div className="spread pv__spread">
        {project.blocks.map((b) => (
          <Fragment key={b.id}>{renderBlock(b, mode, { enter, setThreshold, sceneGround })}</Fragment>
        ))}
      </div>

      {room && (
        <Room
          src={room.src}
          allow={room.allow}
          onExit={leave}
          title={`${project.name} · ${room.label || ''}`}
        />
      )}
    </div>
  )
}

type Ctx = {
  enter: (src: string, label?: string, allow?: string) => void
  setThreshold: (id: string) => (el: HTMLDivElement | null) => void
  sceneGround: (id: string) => (v: number) => void
}

function renderBlock(b: Block, mode: Mode, ctx: Ctx) {
  const experience = mode === 'experience'
  // Moment numbers and margin notes make terrible anchors: a note that
  // moves from the margin into the flow lands the reader a screen away
  // from the sentence they were on. Only substantive blocks anchor.
  const anchorable = b.kind !== 'moment' && b.kind !== 'aside'
  const anchor = { 'data-b': b.id, ...(anchorable ? { 'data-anchor': '1' } : {}) }

  switch (b.kind) {
    case 'moment':
      return (
        <p className="b b--moment label" {...anchor}>
          {b.n}
          {b.title ? ` — ${b.title}` : ''}
        </p>
      )

    case 'lede':
      return (
        <p
          className={['b b--lede lede', experience && b.offset ? 'is-offset' : ''].join(' ')}
          {...anchor}
        >
          {b.text}
        </p>
      )

    case 'display':
      return (
        <h2 className={['b b--display', experience ? 'display' : 'display-sm'].join(' ')} {...anchor}>
          {b.text}
        </h2>
      )

    // An editorial aid, not an announcement. Set at reading size, in the
    // margin where there is one, so sections are findable without the page
    // reading as a sequence of titled chapters.
    case 'heading':
      return (
        <h2 className="b b--heading" {...anchor}>
          {b.text}
        </h2>
      )

    case 'prose':
      return (
        <div className="b b--prose prose" {...anchor}>
          {b.paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )

    case 'aside':
      // Margin note in Experience; an inline note under the prose in Read.
      return experience ? (
        <aside className="b b--aside side caption" {...anchor}>
          {b.text}
        </aside>
      ) : (
        <aside className="b b--aside-inline caption" {...anchor}>
          {b.text}
        </aside>
      )

    case 'figure':
      return (
        <figure
          className={['b b--figure', experience && b.scale === 'wide' ? 'wide' : ''].join(' ')}
          {...anchor}
        >
          <div className="b__art">{b.render(mode)}</div>
          <figcaption className="caption b__cap">{b.caption}</figcaption>
        </figure>
      )

    // A real artifact at figure scale. Identical in both modes: it already
    // waits to be started, which is exactly what Read mode would ask of it.
    case 'embed':
      return (
        <figure
          className={['b b--figure b--embedfig', experience && b.scale === 'wide' ? 'wide' : ''].join(
            ' ',
          )}
          {...anchor}
        >
          <div className="b__art">
            <Embed
              src={b.src}
              title={b.title}
              frame={b.frame}
              invite={b.invite}
              allow={b.allow}
              animates={b.animates}
              autoIdle
            />
          </div>
          <figcaption className="caption b__cap">{b.caption}</figcaption>
        </figure>
      )

    // Faber's one full-width move. It bleeds in Experience and takes the
    // ground with it; in Read it becomes a contained figure, still live
    // and still turnable, but no longer in charge of the page.
    case 'scene':
      return experience ? (
        <div className="b b--scene bleed" {...anchor}>
          {b.render(mode, ctx.sceneGround(b.id))}
        </div>
      ) : (
        <figure className="b b--figure b--scenefig" {...anchor}>
          <div className="b__art b__art--scene">{b.render(mode, () => {})}</div>
          <figcaption className="caption b__cap">{b.caption}</figcaption>
        </figure>
      )

    case 'room':
      return experience ? (
        <div className="b b--threshold threshold bleed" ref={ctx.setThreshold(b.id)} {...anchor}>
          <div className="threshold__stick">
            <div className="threshold__dot">
              <Dot size={18} state="idle" dark />
            </div>
            {b.label && <p className="threshold__label label">{b.label}</p>}
            <p className="threshold__scene">{b.scene}</p>
            <button
              className="act act--room threshold__enter"
              onClick={() => ctx.enter(b.src, b.label, b.allow)}
            >
              {b.cta} <span aria-hidden="true">↓</span>
            </button>
            <p className="threshold__aside caption">{b.terms}</p>
          </div>
        </div>
      ) : (
        // In Read the product becomes a contained figure. It still runs;
        // it just does not take the page, and it does not begin on its own.
        <figure className="b b--figure b--roomfig" {...anchor}>
          <div className="b__art">
            <Embed
              src={b.src}
              title={b.label || 'the build'}
              frame="phone"
              invite={b.cta}
              allow={b.allow}
            />
          </div>
          <figcaption className="caption b__cap">{b.caption}</figcaption>
        </figure>
      )

    case 'questions':
      return (
        <section className="b b--questions" {...anchor}>
          <p className="label b__qhead">{b.heading}</p>
          <ol className="open">
            {b.items.map((q, i) => (
              <li key={q} className="open__item">
                <span className="open__n data">{String(i + 1).padStart(2, '0')}</span>
                <span className="open__q">{q}</span>
              </li>
            ))}
          </ol>
        </section>
      )
  }
}
