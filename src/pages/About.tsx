import { go } from '../lib/router'
import { CONTACT, EARLIER } from '../lib/links'

/**
 * About is back matter, not Room 04.
 *
 * A normal page on plain paper: no plan, no room state, no resume, and
 * none of the Gallery's apparatus.
 *
 * It no longer repeats the Gallery's paragraph. The Gallery says where
 * she is and what she does in two lines, because that is all a visitor
 * needs before choosing a room; this page answers the question the
 * Gallery cannot, which is why these two projects come from this person.
 */
export function About() {
  return (
    <div className="route about">
      <header className="gal__head about__head">
        <button className="gal__name about__home" onClick={() => go('/')}>
          Michelle A. Menkiti
        </button>
        <span className="about__where label">About</span>
      </header>

      <section className="m spread">
        <div className="prose m__prose">
          <h1 className="lede m__lift">I lead product at Samsung Wallet, and I trained as an architect.</h1>
          <p>
            I&rsquo;m a Senior Product Manager at Samsung, where I lead the products for payments,
            rewards and digital identity in Samsung Wallet. Before Samsung I worked on consumer
            financial products at Goldman Sachs, with a stretch at an early-stage startup in
            between. Most of that work has been the kind where the hard part is deciding what the
            thing should be, and then staying with it long enough that it reaches people.
          </p>
          <p>
            I studied architecture at MIT. I never practiced, but the training is the reason I think
            about products the way I do: in plans and sections, in what someone does first and what
            they do next, and in how much a drawing can commit to before anybody has to build it.
          </p>
          <p>
            I also never stopped designing outside of work. Usually that means software, sometimes
            something physical, and almost always because there is something I want to understand
            better than I currently do. Both projects on this site started that way. LLP started
            because my mother speaks Igbo, almost nobody in my generation of the family does, I
            never learned it, and the tools I used to keep up my French simply do not exist for it.
            Faber started because I wanted to make furniture and kept getting stuck in the distance
            between liking an object and understanding it well enough to build one.
          </p>
          <p>
            Neither of them is finished, and both pages say where. That is most of what I find
            interesting about them.
          </p>

          <div className="about__earlier">
            <h2 className="label">Earlier work</h2>
            <p>
              Before any of this there was architecture school and the computational design work
              around it. I&rsquo;ve kept some of it around.
            </p>
            <p className="about__archive">
              <a className="act act--quiet" href={EARLIER.archive} target="_blank" rel="noreferrer">
                The archive <span aria-hidden="true">↗</span>
              </a>
            </p>
          </div>

          <p>
            If something here raises a question, or you want to know how a piece of it was built,
            write to me.
          </p>
        </div>
      </section>

      <footer className="gal__foot about__foot">
        {CONTACT.map((c) => (
          <a
            key={c.label}
            href={c.href}
            {...(c.href.startsWith('mailto:')
              ? {}
              : { target: '_blank', rel: 'noreferrer' })}
          >
            {c.label}
          </a>
        ))}
      </footer>
    </div>
  )
}
