import { CAPTURE, GUIDE_FOOT, GUIDE_HEAD, GUIDE_STEPS, LEVELS } from './data'

/**
 * What actually comes off the screen today.
 *
 * Faber's build view has a print button. It applies a print stylesheet
 * that drops the navigation and the two side columns, sets the steps to
 * full width, and puts a running head and foot on every page. That is
 * the whole of it: a printable text guide. This figure reproduces it at
 * paper proportions, with the real running heads and the real step
 * titles from the Maker programme for Chair No. 14.
 *
 * It is not the illustrated sheet in Michelle's process graphic. That is
 * a direction, and the page says so where it shows it.
 */
export function BuildGuide() {
  const maker = LEVELS[1]
  return (
    <div className="bg">
      <div className="bg__paper">
        <p className="bg__head">
          <span>{GUIDE_HEAD}</span>
        </p>
        <div className="bg__body">
          <p className="bg__title">{maker.result.object}</p>
          <p className="bg__sub">
            {maker.name} · {maker.result.steps} steps
          </p>
          {GUIDE_STEPS.map((g) => (
            <section key={g.group} className="bg__group">
              <p className="bg__gname">{g.group}</p>
              {g.items.map((s) => (
                <p className="bg__step" key={s.n}>
                  <span className="bg__n">{s.n}</span>
                  <span className="bg__st">{s.title}</span>
                </p>
              ))}
            </section>
          ))}
          <p className="bg__more">steps 11 and 12 continue on the next sheet</p>
        </div>
        <p className="bg__foot">
          <span>{GUIDE_FOOT}</span>
        </p>
      </div>
      <p className="fq__cap caption">
        Faber&rsquo;s printable Build Guide, set at paper proportions. Running heads and step titles
        are the product&rsquo;s own; {CAPTURE.label}.
      </p>
    </div>
  )
}
