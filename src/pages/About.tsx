import { go } from '../lib/router'

/**
 * About is back matter, not Room 04.
 *
 * A normal page on plain paper: no plan, no room state, no résumé, and
 * none of the Gallery's apparatus. It carries the professional record
 * in prose and then gets out of the way.
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
          <p className="lede m__lift">
            I&rsquo;m Michelle A. Menkiti, a product manager and builder based in San Francisco.
          </p>
          <p>
            I currently work as a Senior Product Manager at Samsung, where I lead products across
            payments, rewards and digital identity for Samsung Wallet. Prior to that, I worked on
            consumer financial products at Goldman Sachs, with a brief stint at an early-stage
            startup in between.
          </p>
          <p>
            I studied architecture at MIT, and I&rsquo;ve never really stopped designing outside of
            work. I&rsquo;m usually building something of my own, sometimes software, sometimes
            something physical, and often just because there&rsquo;s something I want to understand
            better.
          </p>
          <p>
            This site is a collection of some of the newer and older projects I&rsquo;ve worked on,
            including a few things that are still in progress. If anything here sparks a question or
            an idea, feel free to reach out.
          </p>
        </div>

        <div className="m__next wide">
          <hr className="rule" />
          <button className="act" onClick={() => go('/')}>
            <span aria-hidden="true">←</span> Gallery
          </button>
        </div>
      </section>

      <footer className="gal__foot about__foot">
        <a href="https://www.linkedin.com/in/michelle-menkiti/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href="https://github.com/mimenkiti" target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href="mailto:mimichelle2011@gmail.com">Email</a>
      </footer>
    </div>
  )
}
