/**
 * A contact sheet, not an archive.
 *
 * There were more studies than this. Five is enough to show that the
 * current encounter was chosen rather than arrived at, and the page has
 * more important things to spend a visitor’s attention on. Each tile
 * opens the real document.
 */

const TILES = [
  {
    file: 'visual-lab-01',
    title: 'Five visual worlds',
    note: 'Field Notes, Playground Primitives, Soft Matter, Signal, Places: the same three screens drawn five ways, with the risks of each written underneath.',
  },
  {
    file: 'research-01-loyalty-delight',
    title: 'Why people open a learning app on day 190',
    note: 'A desk study of what keeps people coming back, read across the products that manage it and the ones that do not.',
  },
  {
    file: 'igbo-app-visual-exploration',
    title: 'Six directions, narrowed to three',
    note: 'Scored on whimsy, cultural grounding, simplicity and warmth. Ends on layering the survivors rather than picking one.',
  },
  {
    file: 'encounter-practice-lab',
    title: 'Where practice should live',
    note: 'In place, a separate mode, or through a seam. Three concepts at three depths, each ending in a question about how it felt to come back.',
  },
  {
    file: 'igbo-product-exploration-02',
    title: 'After the first build',
    note: 'The lesson engine again, away from the green: warm ground, one accent, a sphere instead of a mascot.',
  },
]

export function ContactSheet() {
  return (
    <div className="sheet">
      {TILES.map((t) => (
        <a
          className="sheet__tile"
          key={t.file}
          href={`/artifacts/${t.file}.html`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="sheet__shot">
            <img src={`/sheet/${t.file}.webp`} alt="" loading="lazy" width={720} />
          </span>
          <span className="sheet__title">{t.title}</span>
          <span className="sheet__note caption">{t.note}</span>
        </a>
      ))}
    </div>
  )
}
