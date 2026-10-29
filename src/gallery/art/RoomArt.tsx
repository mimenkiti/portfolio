import llpSvg from './gallery-llp.svg?raw'
import faberSvg from './gallery-faber.svg?raw'
import archiveSvg from './gallery-archive.svg?raw'
import llpWide from './gallery-llp-landscape.svg?raw'
import faberWide from './gallery-faber-landscape.svg?raw'
import archiveWide from './gallery-archive-landscape.svg?raw'
import practiceWide from './gallery-practice-landscape.svg?raw'
import './gallery-art-motion.css'
import './gallery-art-motion-landscape.css'
import './gallery-practice-motion.css'
import type { RoomId } from '../rooms'

/* ---------------------------------------------------------------
   Room artwork. The one place the Gallery's plates come from.

   The SVGs and the two motion sheets in this folder are the approved
   handoff, copied in byte for byte. Each room has two compositions of
   the same artwork: portrait 4:5 and landscape 3:2. They are separate
   drawings, not crops of each other, and each has its own motion sheet
   keyed to its own root class (`ga--llp` / `ga--llp-landscape`), so the
   two sheets never touch each other's parts.

   Nothing here redraws them: the inner markup of each file is passed
   through untouched, and only the root <svg> is rebuilt by React so it
   can carry `is-active`, which is the hook both motion sheets are written
   against. The root's class list and viewBox are read from the file
   itself, so the right sheet always applies to the right drawing.

   They are inlined rather than loaded as <img> because the motion moves
   parts inside the drawing, and CSS cannot reach into an image.

   Selection drives it, nothing else. Desktop and mobile both pass the
   Gallery's own selected room in as `active`; there is no hover or press
   handling on the artwork itself. Adding the class runs each response
   once and holds it; removing it eases the parts back to rest. Reduced
   motion is handled by the supplied CSS: the selected composition
   applies instantly.

   The frame takes the drawing's own proportion from its viewBox, and the
   drawing always shows whole. If a layout ever gives the frame a
   different shape, the SVG's default `xMidYMid meet` letterboxes rather
   than crops.
   --------------------------------------------------------------- */

export type ArtShape = 'portrait' | 'landscape'

const SOURCE: Record<ArtShape, Record<RoomId, string>> = {
  // Practice has only the landscape composition, which both breakpoints
  // use today; the portrait slot falls back to it until one is drawn.
  portrait: { llp: llpSvg, faber: faberSvg, practice: practiceWide, archive: archiveSvg },
  landscape: { llp: llpWide, faber: faberWide, practice: practiceWide, archive: archiveWide },
}

type Parts = { viewBox: string; ratio: string; className: string; inner: string }

/** The file's root attributes we keep, and the markup inside it. */
function split(src: string): Parts {
  const open = src.match(/<svg\b[^>]*>/)
  if (!open) throw new Error('RoomArt: no <svg> root')
  const viewBox = open[0].match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 400 500'
  const [, , w, h] = viewBox.split(/[\s,]+/).map(Number)
  const className = open[0].match(/class="([^"]+)"/)?.[1] ?? 'ga'
  // <title> and <desc> are the only things left out. The drawing is
  // aria-hidden here (the text beside it names the project), and a root
  // <title> would also surface as a browser tooltip over the plate.
  const inner = src
    .slice(open.index! + open[0].length, src.lastIndexOf('</svg>'))
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>\s*/g, '')
    .replace(/<desc\b[^>]*>[\s\S]*?<\/desc>\s*/g, '')
  return { viewBox, ratio: `${w} / ${h}`, className, inner }
}

const PARTS = Object.fromEntries(
  (Object.keys(SOURCE) as ArtShape[]).map((shape) => [
    shape,
    Object.fromEntries((Object.keys(SOURCE[shape]) as RoomId[]).map((id) => [id, split(SOURCE[shape][id])])),
  ]),
) as Record<ArtShape, Record<RoomId, Parts>>

export function RoomArt({
  id,
  active,
  shape = 'landscape',
  className,
}: {
  id: RoomId
  /** The Gallery's selected room is this one. */
  active: boolean
  /** Which composition. Both are kept until the breakpoints are settled. */
  shape?: ArtShape
  className?: string
}) {
  const { viewBox, ratio, className: root, inner } = PARTS[shape][id]
  return (
    <span
      className={['art', `art--${id}`, `art--${shape}`, className ?? ''].join(' ')}
      style={{ aspectRatio: ratio }}
    >
      {/* aria-hidden: every place this appears already names the project
          in text beside it, so the drawing's own title would be read twice. */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        className={[root, active ? 'is-active' : ''].join(' ')}
        aria-hidden="true"
        focusable="false"
        dangerouslySetInnerHTML={{ __html: inner }}
      />
    </span>
  )
}
