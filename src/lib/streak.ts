/* ---------------------------------------------------------------
   The Duolingo streak in the first line of the LLP essay.

   One anchor, stated by Michelle: on 10 October 2026 the streak was 245
   days. Everything else is arithmetic on calendar days in the reader's
   own time zone, so the sentence reads 246 the next day, 247 the day
   after, and so on.

   If the streak ever stops, set STOPPED_ON to the last day it counted
   (YYYY-MM-DD) and the number freezes there instead of continuing.
   --------------------------------------------------------------- */

const ANCHOR = { date: '2026-10-10', days: 245 }

/** The last day the streak counted, or null while it is still running. */
const STOPPED_ON: string | null = null

function dayNumber(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number)
  return Math.round(Date.UTC(y, m - 1, d) / 86_400_000)
}

function todayNumber(now: Date): number {
  return Math.round(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000)
}

/** The streak as of `now`, counted in whole calendar days from the anchor. */
export function currentStreak(now: Date = new Date()): number {
  const end = STOPPED_ON ? Math.min(dayNumber(STOPPED_ON), todayNumber(now)) : todayNumber(now)
  // A clock set before the anchor never shows less than the stated figure.
  return ANCHOR.days + Math.max(0, end - dayNumber(ANCHOR.date))
}
