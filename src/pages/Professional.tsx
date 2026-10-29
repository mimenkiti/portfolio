import { go } from '../lib/router'
import { CONTACT } from '../lib/links'
import { PROFESSIONAL } from '../lib/professional'

/**
 * Professional: Room 03, the long room under LLP and Faber.
 *
 * Her professional work, set out plainly on the same paper as About. It
 * is career highlights, not case studies: one short line per project
 * saying what she led or contributed to, and links to what has been
 * published about it. The personal projects
 * are where she writes at length; this room says what she works on.
 */
export function Professional() {
  return (
    <div className="route about professional">
      <header className="gal__head about__head">
        <button className="gal__name about__home" onClick={() => go('/')}>
          Michelle A. Menkiti
        </button>
        <span className="about__where label">03 · Professional</span>
      </header>

      <section className="m spread">
        <div className="prose m__prose">
          <h1 className="lede m__lift">The products I work on for a living.</h1>
          <p>
            Most of my working life has been spent on financial and identity products: digital
            wallets, payments and digital ID at Samsung, and consumer banking at Goldman Sachs
            before that. This room keeps it short. Where something about a project has been
            published, it&rsquo;s linked.
          </p>

          {PROFESSIONAL.map((e) => (
            <section className="pr" key={e.org} aria-labelledby={`pr-${e.org.replace(/\s+/g, '-')}`}>
              <header className="pr__head">
                <h2 className="pr__org" id={`pr-${e.org.replace(/\s+/g, '-')}`}>
                  {e.org} <span className="pr__team">· {e.team}</span>
                </h2>
                <p className="pr__meta data">
                  {e.role} · {e.years}
                </p>
              </header>
              <ul className="pr__list">
                {e.projects.map((p) => (
                  <li className="pr__item" key={p.name}>
                    <h3 className="pr__name">{p.name}</h3>
                    <p className="pr__line">{p.line}</p>
                    {p.launches && (
                      <p className="pr__launches">
                        <span className="pr__launches-label data">State launches</span>
                        {p.launches.map((l) => (
                          <a
                            key={l.href}
                            className="act act--quiet"
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {l.label}
                          </a>
                        ))}
                      </p>
                    )}
                    {p.links.length > 0 && (
                      <p className="pr__links">
                        {p.links.map((l) => (
                          <a
                            key={l.href}
                            className="act act--quiet"
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {l.label} <span aria-hidden="true">↗</span>
                          </a>
                        ))}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <p className="pr__after">
            More about me, and how this site came about, is in{' '}
            <a
              href="#/about"
              onClick={(ev) => {
                ev.preventDefault()
                go('/about')
              }}
            >
              About
            </a>
            .
          </p>
        </div>
      </section>

      <footer className="gal__foot about__foot">
        {CONTACT.map((c) => (
          <a
            key={c.label}
            href={c.href}
            {...(c.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })}
          >
            {c.label}
          </a>
        ))}
      </footer>
    </div>
  )
}
