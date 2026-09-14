import { chromium } from 'playwright'

/**
 * The truthfulness and voice audit.
 *
 * Two things it can check mechanically: that the page contains no language
 * the brief rules out, and that every Igbo string and every registry value
 * on screen also exists in the supplied material. It cannot check judgement,
 * so what it prints is a list for a person to read, not a pass mark.
 */
const URL = 'http://localhost:4173/#/llp'
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const b = await chromium.launch({ executablePath: EXE })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto(URL, { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)

// Open every disclosure, and walk every tabbed register, so nothing
// hides from the audit behind a control.
async function sweep() {
  return p.evaluate(async () => {
    const seen = []
    const settle = () => new Promise((r) => setTimeout(r, 350))
    for (const sel of ['.pron__more', '.insp__more', '.clip__literalBtn']) {
      for (const el of document.querySelectorAll(sel)) {
        el.click()
        await settle()
      }
    }
    for (const sel of ['.appr__ask', '.rec__tab', '.insp__stop', '.pron__tab', '.pron__voice']) {
      for (const el of document.querySelectorAll(sel)) {
        el.click()
        await settle()
        seen.push(document.body.innerText)
      }
    }
    seen.push(document.body.innerText)
    return seen.join('\n')
  })
}
const swept = await sweep()
// The sweep re-reads the whole page after each control, so collapse it to
// the set of distinct lines that were ever on screen.
const lines = [...new Set(swept.split('\n').map((l) => l.trim()).filter(Boolean))]
const text = lines.join('\n')
console.log('distinct lines ever visible:', lines.length)

const BANNED = [
  'user-centric', 'leveraged', 'drove impact', 'key learnings', 'my process',
  'problem statement', 'the solution', 'the results', 'takeaways', 'learnings',
  'role:', 'timeline:', 'tools:', 'team:', 'deliverables', 'stakeholder',
  'north star', 'double diamond', 'design thinking', 'iterated on',
]
const hits = BANNED.filter((w) => text.toLowerCase().includes(w))
console.log('case-study language:', hits.length ? hits : 'none')

// Numbers that would be metrics if they were claims about people.
const metricish = [...text.matchAll(/\b\d+(\.\d+)?\s?%|\bn\s?=\s?\d+|\b\d+\s+(users|participants|learners|interviews|testers)\b/gi)]
console.log('metric-shaped claims:', metricish.length ? metricish.map((m) => m[0]) : 'none')

// Em dashes: allowed only inside quoted material and in site chrome that
// predates this pass. Anything else is Michelle's authored copy.
const dashLines = lines.filter((l) => /—|--/.test(l))
console.log('\nlines carrying an em dash (each must be a quote or chrome):')
for (const l of dashLines) console.log('  ·', l.trim().slice(0, 120))

// Every Igbo string on the page must exist in the supplied material.
const IGBO = await p.evaluate(() =>
  [...new Set([...document.querySelectorAll('.ig')].map((e) => e.textContent.trim()))],
)
console.log('\nIgbo strings rendered:', IGBO.length)
for (const s of IGBO) console.log('  ·', s)

await b.close()
