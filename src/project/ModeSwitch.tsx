import type { Mode } from './blocks'

/**
 * One word, naming where you would go — not a pair of tabs and not a
 * question on entry. The immersive composition stays the default; this
 * is a quiet affordance for the times you just want to read.
 */
export function ModeSwitch({
  mode,
  onSwitch,
}: {
  mode: Mode
  onSwitch: (m: Mode) => void
}) {
  const next: Mode = mode === 'experience' ? 'read' : 'experience'
  return (
    <button
      className="modeswitch"
      onClick={() => onSwitch(next)}
      aria-label={next === 'read' ? 'Read this project as an essay' : 'Return to the composed experience'}
    >
      <span className="modeswitch__glyph" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      {next === 'read' ? 'read' : 'experience'}
    </button>
  )
}
