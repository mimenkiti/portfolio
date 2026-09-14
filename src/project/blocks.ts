import type { ReactNode } from 'react'

export type Mode = 'experience' | 'read'

/**
 * A project is content, not a page. The same array of blocks is rendered
 * by one view in two modes — Experience composes them spatially, Read
 * resolves them into a document. There is no second route and no second
 * copy of a single sentence.
 *
 * Artifacts arrive at three scales, and the scale is the argument about
 * how much a thing mattered:
 *
 *   room     the page gives way entirely. Reserved for the product itself.
 *   embed    a real artifact, playable in place, at figure scale.
 *   figure   something built here from real data.
 *   scene    a scroll-driven sequence that takes the viewport without
 *            being entered. Faber's only use of the full width.
 */
export type Block =
  | { id: string; kind: 'moment'; n: string; title?: string }
  | { id: string; kind: 'lede'; text: ReactNode; offset?: boolean }
  | { id: string; kind: 'display'; text: ReactNode }
  | { id: string; kind: 'heading'; text: ReactNode }
  | {
      id: string
      kind: 'prose'
      paras: ReactNode[]
      /**
       * Sit in the margin-side tracks instead of the reading tracks.
       * The measure does not change; only where the column sits does,
       * so the page turns without the line length moving.
       */
      offset?: boolean
    }
  | { id: string; kind: 'aside'; text: ReactNode }
  /**
   * A sentence already in the narrative, promoted out of its paragraph
   * and set large across the reading and margin tracks. It is never a
   * new sentence and never a second copy of one: each of these was
   * already a one-sentence paragraph, so the change is typographic and
   * the reading order is untouched. Used to break the longest prose
   * runs, and nowhere else.
   */
  | { id: string; kind: 'pull'; text: ReactNode }
  /**
   * A margin gloss: one real form from the project's archive, with its
   * IPA and its meaning. Content comes from `forms.json` via a
   * diagnostic id, so the diacritics cannot drift and no phrase can
   * appear here that the project does not hold.
   */
  | { id: string; kind: 'gloss'; formId: string; note?: string }
  | {
      id: string
      kind: 'figure'
      /**
       * `column` takes the reading measure, `wide` spans reading plus
       * margin, `bleed` takes the whole viewport. Bleed is the argument
       * that a thing mattered most, so it is rationed: two on LLP, and
       * Faber's one scene.
       */
      scale: 'column' | 'wide' | 'bleed'
      caption: ReactNode
      render: (mode: Mode) => ReactNode
      /**
       * What a visitor can do to this figure, in the imperative: "drag
       * the dot", "pick a level". Present means the figure is an
       * instrument and gets the live mark on its caption. Absent means
       * it is a figure and stays visually silent. The discrimination is
       * enforced here rather than left to discipline.
       */
      does?: string
    }
  | {
      id: string
      kind: 'embed'
      /** Served from public/artifacts, or an absolute URL for the live build. */
      src: string
      /** Named for the visitor, never the file. */
      title: string
      scale: 'column' | 'wide'
      /** A drawn phone, or a page that wants its own width. */
      frame: 'phone' | 'page'
      caption: ReactNode
      /** Shown before the artifact loads; nothing heavy runs until asked. */
      invite: string
      /** iframe allow-list, e.g. microphone for the live build. */
      allow?: string
      /** Runs continuous motion this page cannot quiet. */
      animates?: boolean
    }
  | {
      id: string
      kind: 'scene'
      /**
       * A scroll-driven spatial sequence. In Experience it bleeds to the
       * full viewport and drives the ground itself; in Read it becomes a
       * contained figure with its own steps. Unlike `room` it is never
       * entered or left, because you do not enter a drawing.
       */
      render: (mode: Mode, setGround: (v: number) => void) => ReactNode
      caption: ReactNode
    }
  | {
      id: string
      kind: 'room'
      src: string
      scene: ReactNode
      cta: string
      caption: ReactNode
      label?: string
      allow?: string
      /** Shown under the threshold: what this costs, what it needs. */
      terms: string
    }
  | { id: string; kind: 'questions'; heading: string; items: string[] }

export type Project = {
  slug: string
  name: string
  subject: string
  blocks: Block[]
}
