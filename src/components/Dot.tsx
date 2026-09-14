import { useEffect, useRef } from 'react'
import { onLevel } from '../lib/level'

export type DotState = 'punctuation' | 'idle' | 'speaking' | 'listening' | 'held'

type Props = {
  size?: number
  state?: DotState
  dark?: boolean
  label?: string
  onActivate?: () => void
  className?: string
}

/**
 * The Dot.
 *
 * A hypothesis, not a system: it begins as the full stop at the end of a
 * sentence, becomes LLP's interaction object inside the encounter, and
 * afterwards sits in the margin as the way to hear things. It belongs to
 * LLP. If it ever starts behaving like site-wide chrome, that is the
 * signal it has been overextended.
 */
export function Dot({ size = 14, state = 'idle', dark, label, onActivate, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (state !== 'speaking') {
      if (ref.current) ref.current.style.setProperty('--lvl', '0')
      return
    }
    return onLevel((v) => {
      if (ref.current) ref.current.style.setProperty('--lvl', v.toFixed(3))
    })
  }, [state])

  const Tag = onActivate ? 'button' : 'span'

  return (
    <Tag
      ref={ref as never}
      className={['dot', `dot--${state}`, dark ? 'dot--dark' : '', className || ''].join(' ')}
      style={{ ['--d' as string]: `${size}px` }}
      onClick={onActivate}
      aria-label={onActivate ? label || 'Play' : undefined}
      type={onActivate ? 'button' : undefined}
    >
      <span className="dot__core" />
      <span className="dot__ring" />
    </Tag>
  )
}
