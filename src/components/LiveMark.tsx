/**
 * The live mark.
 *
 * One cue, site-wide, for "this figure is an instrument". It is not a
 * new invention: the embed invite already carries an ink dot that grows
 * under the cursor, and the Dot already breathes on a 5.5s cycle. This
 * is that same primitive at caption scale, so the page teaches the
 * vocabulary once and then reuses it.
 *
 * It sits on the caption line, which is where a reader already looks to
 * find out what a figure is, and it is always followed by the specific
 * thing you can do. A figure without a `does` gets no mark at all, so
 * static figures stay visually silent and the distinction is carried by
 * the content rather than by restraint.
 *
 * Under reduced motion the breathing stops and the mark holds filled.
 * The instruction is text either way, so nothing about discovering an
 * instrument depends on motion.
 */
export function LiveMark({ does }: { does: string }) {
  return (
    <span className="live-mark">
      <span className="live-mark__dot" aria-hidden="true" />
      <span className="live-mark__does">{does}</span>
    </span>
  )
}
