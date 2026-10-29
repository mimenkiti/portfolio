import { go } from '../lib/router'
import { CONTACT, EARLIER } from '../lib/links'

/**
 * About is back matter, not a room.
 *
 * A normal page on plain paper: no plan, no room state, no resume, and
 * none of the Gallery's apparatus. It says plainly who she is, what she
 * does now (pointing to Practice for the work itself), and why the site exists, in her own order. It does not build
 * a thesis about architecture and product management.
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
          <h1 className="lede m__lift">
            I&rsquo;m Michelle A. Menkiti, a product manager and builder based in San Francisco.
          </h1>
          <p>
            I&rsquo;m currently a Senior Product Manager at Samsung, working on Samsung Wallet
            across payments, rewards and digital identity. Before that I worked on consumer
            financial products at Goldman Sachs, with a brief stint at an early-stage startup.
          </p>
          <p>
            Most of that work has been on how people pay, save and prove who they are from a
            phone: Samsung Cash and the mobile driver&rsquo;s license in Samsung Wallet, and
            Marcus Checking and the Apple Card Savings account at Goldman. The projects are listed,
            with links to what&rsquo;s been published about them, in{' '}
            <a
              href="#/practice"
              onClick={(ev) => {
                ev.preventDefault()
                go('/practice')
              }}
            >
              Practice
            </a>
            .
          </p>
          <p>
            I studied architecture at MIT, and I never really stopped designing outside of work.
            I&rsquo;m usually building something of my own, sometimes software and sometimes
            something physical, and often because there&rsquo;s something I want to understand
            better than I do.
          </p>
          <p>
            This site collects some of those projects, newer and older, including a few that are
            still in progress.
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
            If something here sparks a question or an idea, I&rsquo;d love to hear from you.
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
