import { chromium } from 'playwright'

/**
 * The voice and residue audit for the routes audit.mjs does not cover.
 *
 * It cannot check judgement, so what it prints is a list for a person to
 * read. What it can check is that launch copy contains no prototype
 * language, no case-study vocabulary, and no em dash outside a quotation.
 */
const BASE = process.env.BASE || 'http://localhost:4173'
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const ROUTES = ['/', '/faber', '/about']

const RESIDUE = [
  'design study', 'thesis pending', 'placeholder geometry', 'lorem', 'TODO', 'FIXME',
  'coming soon', 'TBD', 'work in progress', 'enter the investigation',
  'enter the spatial study', 'Résumé', 'built to be argued with',
]
const CASE_STUDY = [
  'problem statement', 'the solution', 'key learnings', 'key takeaways', 'my role',
  'the challenge', 'impact:', 'results:', 'deliverables', 'stakeholders', 'north star',
]

const b = await chromium.launch({ executablePath: EXE })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const findings = []

for (const r of ROUTES) {
  await p.goto(`${BASE}/#${r}`, { waitUntil: 'load' })
  await p.waitForTimeout(1500)
  // Read mode carries the same words; Faber has one.
  const modes = ['experience']
  if (await p.$('.modeswitch')) modes.push('read')
  for (const m of modes) {
    if (m === 'read') {
      await p.click('.modeswitch')
      await p.waitForTimeout(1500)
    }
    const text = await p.evaluate(() => document.querySelector('main').innerText)
    const tag = `${r} (${m})`
    for (const w of RESIDUE)
      if (text.toLowerCase().includes(w.toLowerCase())) findings.push(`RESIDUE ${tag}: "${w}"`)
    for (const w of CASE_STUDY)
      if (text.toLowerCase().includes(w.toLowerCase())) findings.push(`CASE-STUDY ${tag}: "${w}"`)
    for (const line of text.split('\n'))
      if (/—|--/.test(line)) findings.push(`EM DASH ${tag}: ${line.trim().slice(0, 110)}`)
    // Metric-shaped claims: a percentage or an "increased/reduced by".
    for (const line of text.split('\n'))
      if (/\b\d+(\.\d+)?%|\b(increased|reduced|improved|boosted)\b/i.test(line))
        findings.push(`METRIC-SHAPED ${tag}: ${line.trim().slice(0, 110)}`)
  }
}
await b.close()

console.log('\n=== site audit (routes outside audit.mjs) ===')
if (!findings.length) console.log('  nothing flagged')
findings.forEach((f) => console.log('  · ' + f))
console.log()
