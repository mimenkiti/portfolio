/* ---------------------------------------------------------------
   Derives src/llp/data/forms.json from pronunciation.json.

   Why this exists: the page needs about ten Igbo forms for its margin
   glosses, its hero and its watermark fields. Importing the whole
   48KB diagnostic to get them would pull it into the main bundle and
   undo the code splitting that keeps it inside the lazy Pronunciation
   chunk. So the subset is extracted at author time instead.

   The point is that no Igbo on this site is typed by hand. Every form,
   tone mark, IPA string and gloss below is copied out of the archive by
   this script, with its provenance, and can be regenerated:

     node derive-forms.mjs

   To use a form the page does not yet have, add its diagnostic id to
   WANTED and re-run. If the id is not in the archive the script fails
   rather than inventing anything.
   --------------------------------------------------------------- */

import { readFileSync, writeFileSync } from 'node:fs'

const SRC = 'src/llp/data/pronunciation.json'
const OUT = 'src/llp/data/forms.json'

/** Diagnostic ids the page uses, with a note on why each one is wanted. */
const WANTED = [
  'context-32', // Kedụ? — her opening, and the diagnostic's anchor item
  'context-33', // Ọ dị mma. — the learner's reply
  'context-34', // Kedụ aha gị? — what is your name
  'context-35', // Aha m bụ Chioma — her name
  'context-36', // Ka ọ dị — parting
  'combination-27', // Nnọọ — welcome, at the market threshold
  'tone-31', // isi — one spelling, three words. Tone absent from both conditions.
  'consonants-6', // Chioma — the affricate, and the character's name
  'vowels-1', // gị — you, singular
  'vowels-5', // ụzọ — way; road; door
]

const data = JSON.parse(readFileSync(SRC, 'utf8'))
const groups = data.diagnostic.groups

const all = new Map()
for (const items of Object.values(groups)) {
  for (const it of items) all.set(it.id, it)
}

const out = {}
for (const id of WANTED) {
  const it = all.get(id)
  if (!it) {
    console.error(`FAIL: "${id}" is not in ${SRC}. Not inventing it.`)
    process.exit(1)
  }
  const p = it.provenance || {}
  out[id] = {
    id: it.id,
    form: it.form,
    ipa: it.ipa,
    gloss: it.gloss,
    feature: it.feature,
    watch: it.watch,
    provenance: [p.ref, p.source].filter(Boolean).join(' · ') || p.tier || '',
  }
}

writeFileSync(
  OUT,
  JSON.stringify(
    {
      _generated: `Derived from ${SRC} by derive-forms.mjs. Do not edit by hand.`,
      forms: out,
    },
    null,
    1,
  ) + '\n',
)

console.log(`Wrote ${OUT} with ${Object.keys(out).length} forms.`)
for (const [id, f] of Object.entries(out)) console.log(`  ${id.padEnd(16)} ${f.form}  ${f.ipa}`)
