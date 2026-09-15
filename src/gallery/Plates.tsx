import { Dot } from '../components/Dot'
import { CoverChair } from '../components/CoverChair'
import { form } from '../llp/lang'

/* ---------------------------------------------------------------
   Room plates.

   NOT new artwork. Each plate is assembled from material the project
   already ships: LLP's own opening phrase out of `forms.json` with the
   Dot that is its punctuation everywhere else on the site, and Faber's
   axonometric fragment, which is the mark the index has carried since
   the cover pass.

   The shell needs *a* plate in a consistent proportion so the three
   rooms read as one collection, and it needs it tonight. The cover-art
   study is explicit that the real level-2 covers were never drawn — so
   these hold the slot honestly rather than pretending to be the covers.
   Same frame, same ratio, same caption bar; swap the contents when the
   real art exists and nothing around them has to move.

   Archive has no plate on purpose. A full plate makes it read as a
   third current project, which is the one thing the Archive treatment
   is trying to avoid.
   --------------------------------------------------------------- */

export function PlateLLP() {
  const f = form('context-32')
  return (
    <div className="plate plate--llp">
      <span className="plate__word ig" aria-hidden="true">
        {f.form.replace('?', '')}
        <span className="plate__q">?</span>
        <span className="plate__dot">
          <Dot size="0.1196em" state="punctuation" />
        </span>
      </span>
      <span className="plate__ipa data" aria-hidden="true">
        {f.ipa}
      </span>
    </div>
  )
}

export function PlateFaber() {
  return (
    <div className="plate plate--faber">
      <div className="plate__chair">
        <CoverChair />
      </div>
    </div>
  )
}
