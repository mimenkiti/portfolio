import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = '/home/claude/portfolio/shots'
mkdirSync(OUT, { recursive: true })
const URL = 'file:///home/claude/portfolio/dist/harness.html'

const errors = []
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})
const page = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('CONSOLE: ' + m.text())
})
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

const shot = async (name, wait = 700) => {
  await page.waitForTimeout(wait)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('shot', name)
}

// ---------- Home
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(1400)
await shot('01-home')

await page.click('.index__stop button.dot')
await shot('02-home-greet', 1800)
await shot('03-home-choose', 1600)
await page.click('.enc__replies .enc__reply')
await shot('04-home-done', 2600)
await page.click('.enc__acts .act--quiet')
await page.waitForTimeout(900)

await page.evaluate(() => document.querySelector('.index__entry--faber').scrollIntoView())
await shot('05-home-faber', 1300)

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await shot('06-home-foot')

// ---------- LLP — Experience
await page.goto(URL + '#/llp', { waitUntil: 'load' })
await shot('07-llp-open', 1600)

await page.evaluate(() => {
  const t = document.querySelector('.threshold')
  window.scrollTo(0, t.offsetTop + t.offsetHeight * 0.42)
})
await shot('08-llp-threshold', 900)

await page.click('.threshold .threshold__enter')
await shot('09-room-greet', 1600)
await shot('10-room-interrupt', 6200)
await page.click('.room__interrupt .act--room')
await page.waitForTimeout(500)
await page.click('.room__acts .act--room')
await page.waitForTimeout(800)
await page.click('.room__choices .room__choice')
await page.waitForTimeout(1100)
await page.click('.room__acts .act--room')
await page.waitForTimeout(800)
await page.click('.room__choices .room__choice')
await shot('11-room-reveal', 1200)
await page.click('.room__reveal .act--room')
await page.waitForTimeout(900)

await page.evaluate(() => document.querySelector('[data-b="stall-prose"]').scrollIntoView())
await shot('12-llp-prose', 900)

await page.evaluate(() => document.querySelector('[data-b="dual"]').scrollIntoView({ block: 'center' }))
await shot('13-llp-dual')

await page.evaluate(() => document.querySelector('[data-b="tone"]').scrollIntoView({ block: 'start' }))
await shot('14-llp-tone')

await page.evaluate(() =>
  document.querySelector('[data-b="open-questions"]').scrollIntoView({ block: 'start' }),
)
await shot('15-llp-questions')

// ---------- Mode switch: land on the same sentence
await page.evaluate(() => document.querySelector('[data-b="stall-prose"]').scrollIntoView())
await page.waitForTimeout(700)
const beforeTop = await page.evaluate(
  () => document.querySelector('[data-b="stall-prose"]').getBoundingClientRect().top,
)
await page.click('.modeswitch')
await page.waitForTimeout(400)
await shot('16-read-morphing', 200)
await page.waitForTimeout(1100)
const afterTop = await page.evaluate(
  () => document.querySelector('[data-b="stall-prose"]').getBoundingClientRect().top,
)
console.log('ANCHOR DRIFT (px):', Math.round(afterTop - beforeTop))
await shot('17-read-prose')

await page.evaluate(() => document.querySelector('[data-b="market"]').scrollIntoView({ block: 'center' }))
await shot('18-read-roomfigure')

await page.evaluate(() => document.querySelector('[data-b="dual"]').scrollIntoView({ block: 'center' }))
await shot('19-read-dual')

await page.evaluate(() => window.scrollTo(0, 0))
await shot('20-read-top')

await page.click('.modeswitch')
await page.waitForTimeout(1400)
await shot('21-back-to-experience')

// ---------- Faber
await page.goto(URL + '#/faber', { waitUntil: 'load' })
await shot('22-faber-top', 1600)

const study = await page.evaluate(() => {
  const s = document.querySelector('.study')
  return { top: s.offsetTop, h: s.offsetHeight }
})
for (const [name, p] of [
  ['23-faber-plan', 0.06],
  ['24-faber-axo', 0.3],
  ['25-faber-explode', 0.7],
  ['26-faber-detail', 0.93],
]) {
  await page.evaluate(
    ({ top, h, p }) => window.scrollTo(0, top + (h - window.innerHeight) * p),
    { ...study, p },
  )
  await shot(name, 1200)
}

// ---------- Experiment + About
await page.goto(URL + '#/experiment', { waitUntil: 'load' })
await page.waitForTimeout(800)
await page.click('.xp__controls .act')
await shot('27-experiment', 2200)

await page.goto(URL + '#/about', { waitUntil: 'load' })
await shot('28-about', 900)

// ---------- Mobile
const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
m.on('pageerror', (e) => errors.push('MOBILE PAGEERROR: ' + e.message))
await m.goto(URL, { waitUntil: 'load' })
await m.waitForTimeout(1300)
await m.screenshot({ path: `${OUT}/29-mobile-home.png` })
await m.goto(URL + '#/llp', { waitUntil: 'load' })
await m.waitForTimeout(900)
await m.click('.modeswitch')
await m.waitForTimeout(1200)
await m.evaluate(() => document.querySelector('[data-b="stall-prose"]').scrollIntoView())
await m.waitForTimeout(600)
await m.screenshot({ path: `${OUT}/30-mobile-read.png` })
const overflow = await m.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth + 1,
)
console.log('MOBILE HORIZONTAL OVERFLOW:', overflow)

console.log('\n=== ERRORS ===')
console.log(errors.length ? errors.join('\n') : 'none')
await b.close()
