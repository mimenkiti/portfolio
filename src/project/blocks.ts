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
  | { id: string; kind: 'prose'; paras: ReactNode[] }
  | { id: string; kind: 'aside'; text: ReactNode }
  | {
      id: string
      kind: 'figure'
      scale: 'column' | 'wide'
      caption: ReactNode
      render: (mode: Mode) => ReactNode
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
