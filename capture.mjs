import { chromium } from 'playwright'
import { mkdirSync, rmSync } from 'fs'

/**
 * The launch review set.
 *
 * Four full-page strips for composition, and the page section by section
 * in reading order for detail, in both modes and at both widths. Artifacts
 * stay behind their invites, which is what a visitor sees on arrival.
 */
const OUT = new global.URL('./review/', import.meta.url).pathname
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })
const BASE = 'http://localhost:4173'
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const b = await chromium.launch({
  executablePath: EXE,
  args: ['--autoplay-policy=no-user-gesture-required'],
})

const SECTIONS = [
  ['open', 'the opening'],
  ['igbo-prose', 'why Igbo'],
  ['first-build', 'the first build'],
  ['sheet', 'the explorations'],
  ['conv-prose', 'conversation'],
  ['market', 'the threshold'],
  ['approaches', 'teaching, breaking, the seam'],
  ['dot-lab', 'the dot'],
  ['inspector', 'knowledge to teaching'],
  ['listen', 'the pronunciation pairs'],
  ['boundary', 'the voice boundary'],
  ['hearing', 'what it cannot hear'],
  ['end-after', 'the ending'],
]

const pad = (n) => String(n).padStart(2, '0')

async function journey(label, viewport, mode, mobile) {
  const p = await b.newPage({
    viewport,
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  })
  await p.goto(BASE + '/#/llp', { waitUntil: 'networkidle' })
  await p.waitForTimeout(1400)
  if (mode === 'read') {
    await p.click('.modeswitch')
    await p.waitForTimeout(1800)
  }

  await p.evaluate(() => window.scrollTo(0, 0))
  await p.waitForTimeout(600)
  await p.screenshot({ path: `${OUT}/${label}-00-full.png`, fullPage: true })

  let i = 1
  for (const [id, name] of SECTIONS) {
    const el = await p.$(`[data-b="${id}"]`)
    if (!el) continue
    await el.scrollIntoViewIfNeeded()
    await p.waitForTimeout(700)
    await p.screenshot({ path: `${OUT}/${label}-${pad(i++)}-${name.replace(/\s+/g, '-')}.png` })
  }

  // The room, from the threshold.
  if (mode === 'experience') {
    const t = await p.$('[data-b="market"]')
    await t.scrollIntoViewIfNeeded()
    await p.waitForTimeout(600)
    await p.click('.threshold__enter')
    await p.waitForTimeout(4000)
    await p.screenshot({ path: `${OUT}/${label}-${pad(i++)}-the-room.png` })
  }
  await p.close()
  console.log(label, 'captured', i - 1, 'sections')
}

async function home(label, viewport, mobile) {
  const p = await b.newPage({
    viewport,
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  })
  await p.goto(BASE + '/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(1500)
  await p.screenshot({ path: `${OUT}/${label}-00-full.png`, fullPage: true })
  await p.evaluate(() => window.scrollTo(0, 0))
  await p.waitForTimeout(400)
  await p.screenshot({ path: `${OUT}/${label}-01-at-rest.png` })
  await p.click('.index__stop button.dot')
  await p.waitForTimeout(1500)
  await p.screenshot({ path: `${OUT}/${label}-02-she-speaks.png` })
  await p.waitForTimeout(1500)
  await p.screenshot({ path: `${OUT}/${label}-03-your-turn.png` })
  await p.$$eval('.enc__reply', (els) => els[0].click())
  await p.waitForTimeout(3200)
  await p.screenshot({ path: `${OUT}/${label}-04-she-answers.png` })
  await p.close()
  console.log(label, 'captured')
}

const DESK = { width: 1440, height: 900 }
const PHONE = { width: 390, height: 844 }

await home('home-desktop', DESK, false)
await home('home-mobile', PHONE, true)
await journey('llp-experience-desktop', DESK, 'experience', false)
await journey('llp-read-desktop', DESK, 'read', false)
await journey('llp-experience-mobile', PHONE, 'experience', true)
await journey('llp-read-mobile', PHONE, 'read', true)

await b.close()
