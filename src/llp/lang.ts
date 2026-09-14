import derived from './data/forms.json'

/* ---------------------------------------------------------------
   Igbo material, read from the project's own data.

   Every form, tone mark, IPA string and gloss on the LLP page comes
   from here, and here reads `forms.json`, which `derive-forms.mjs`
   extracts out of the diagnostic archive with its dictionary and
   registry provenance attached. Nothing on this page is typed out by
   hand, which is the only way to be sure the diacritics are right and
   that no phrase appears on the portfolio that does not exist in the
   project.

   The subset exists so the page does not have to import the whole 48KB
   diagnostic, which would pull it out of the lazy Pronunciation chunk
   and into the main bundle. To use a form the page does not yet have,
   add its id to WANTED in derive-forms.mjs and re-run it. The script
   fails on an unknown id rather than inventing one.
   --------------------------------------------------------------- */

export type Form = {
  id: string
  /** Canonical Igbo orthography, exactly as the archive holds it. */
  form: string
  /** africa-g2p IPA, verbatim. */
  ipa: string
  gloss: string
  /** What the diagnostic was watching for in this item. */
  feature: string
  watch: string
  provenance: string
}

const FORMS = (derived as { forms: Record<string, Form> }).forms

export function form(id: string): Form {
  const f = FORMS[id]
  if (!f) throw new Error(`No Igbo form "${id}" in forms.json — add it to derive-forms.mjs`)
  return f
}

/* --- The hero -----------------------------------------------------

   Her opening phrase, and three more the archive holds. Four, not
   twelve: the count is the difference between a composition and a word
   cloud. `context-32` is the diagnostic's anchor item, and also the
   phrase the deployed build actually opens with.
   ------------------------------------------------------------------ */

export const HERO_PHRASE = 'context-32'

export const HERO_PERIPHERY = ['combination-27', 'context-33', 'context-36']

/**
 * The hero's ground glyph. A cropped `ụ`: the letter carries the
 * dot-below that the whole pronunciation layer of this project is
 * about, and English does not have it.
 */
export const HERO_GLYPH = 'ụ'

/* --- Watermark fields ---------------------------------------------

   Three, in fourteen thousand pixels of scroll. Each is chosen because
   it is the argument of the passage it sits behind, not because the
   page had room for it.
   ------------------------------------------------------------------ */

export const WATERMARKS: { anchor: string; formId: string }[] = [
  /* Welcome, at the threshold into the market. */
  { anchor: 'market', formId: 'combination-27' },
  /* One spelling, three words — the tone passage's own argument. */
  { anchor: 'h-voice', formId: 'tone-31' },
  /* Parting, at the close. */
  { anchor: 'h-end', formId: 'context-36' },
]
