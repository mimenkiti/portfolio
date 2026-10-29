/**
 * Screens from the app, each in a drawn phone.
 *
 * The frame is drawn here rather than baked into the images, so the same
 * screens can be swapped for captures from the TestFlight build later
 * without touching anything but the files. The images are the approved
 * design references, at 2x, unaltered; their own status bars carry the
 * review pill they were approved with.
 *
 * On a phone the row becomes a rail you swipe, the way the contact sheet
 * does, rather than five frames shrunk to illegibility.
 */

export type Screen = { src: string; label: string; alt: string }

export function Phones({ screens, note }: { screens: Screen[]; note?: string }) {
  return (
    <div className="phones">
      <ul className="phones__rail">
        {screens.map((s) => (
          <li className="phones__item" key={s.src}>
            <div className="phone">
              <img className="phone__screen" src={s.src} alt={s.alt} loading="lazy" decoding="async" />
            </div>
            <p className="phones__label label">{s.label}</p>
          </li>
        ))}
      </ul>
      {note && <p className="phones__note label">{note}</p>}
    </div>
  )
}
