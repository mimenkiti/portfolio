import { go } from '../lib/router'
import { CONTACT, EARLIER } from '../lib/links'

export function About() {
  return (
    <div className="route about">
      <section className="m spread">
        <p className="label m__num">About</p>
        <div className="prose m__prose">
          <p className="lede m__lift">
            I&rsquo;m Michelle Menkiti, a product manager and builder based in San Francisco.
          </p>
          <p>
            I currently work on Samsung Wallet, where I&rsquo;ve worked across payments, identity,
            rewards, and other consumer financial products. Before Samsung, I was a product manager
            at Goldman Sachs.
          </p>
          <p>
            I studied architecture at MIT, and I&rsquo;ve never really stopped designing outside of
            work. These days I spend a lot of that time building software, particularly projects
            that give me an excuse to get more hands-on with AI, interaction design, and things
            I&rsquo;m curious about.
          </p>
          <p>
            Outside of my day job, I&rsquo;m currently building LLP, a heritage-language learning
            product that started with my own attempt to learn Igbo, and Faber, a tool for
            understanding how physical objects are made and how you might make your own version.
          </p>
        </div>

        <aside className="side m__margin">
          <p className="label">Elsewhere</p>
          <div className="index__links about__links">
            {CONTACT.map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer">
                {c.label}
              </a>
            ))}
          </div>
        </aside>

        <div className="about__earlier">
          <p className="label">Earlier work</p>
          <div className="prose">
            <p>
              Before product management, most of my work was in architecture and computational
              design. I&rsquo;ve kept some of it around.
            </p>
          </div>
          <div className="index__links about__links about__archive">
            <a href={EARLIER.archive} target="_blank" rel="noreferrer">
              Architecture archive <span aria-hidden="true">↗</span>
            </a>
            <a href={EARLIER.pandora} target="_blank" rel="noreferrer">
              Pandora · Spatial Computing Design Studio, TU Delft{' '}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="m__next wide">
          <hr className="rule" />
          <button className="act" onClick={() => go('/')}>
            back to the index <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}
