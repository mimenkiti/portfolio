import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

/**
 * The launch review set for everything outside the LLP page.
 *
 * Full strips for composition, plus the homepage encounter beat by beat
 * and Faber's Understand sequence state by state, at both widths.
 */
const OUT = new global.URL('./review/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const BASE = 'http://localhost:4173'
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const b = await chromium.launch({
  executablePath: EXE,
  args: ['--autoplay-policy=no-user-gesture-required'],
})

const DESKTOP = { width: 1400, height: 900 }
const MOBILE = { width: 390, height: 844 }

async function page(vp, mobile) {
  return b.newPage({ viewport: vp, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile })
}

/* --- full strips --- */
for (const [label, vp, mobile] of [['desktop', DESKTOP, false], ['mobile', MOBILE, true]]) {
  const p = await page(vp, mobile)
  for (const [route, name] of [['/', 'home'], ['/faber', 'faber-experience'], ['/about', 'about']]) {
    await p.goto(BASE + '/#' + route, { waitUntil: 'networkidle' })
    await p.waitForTimeout(1800)
    await p.evaluate(() => window.scrollTo(0, 0))
    await p.waitForTimeout(500)
    await p.screenshot({ path: `${OUT}${label}-${name}-full.png`, fullPage: true })
    console.log('shot', label, name)
  }
  // Faber in Read
  await p.goto(BASE + '/#/faber', { waitUntil: 'networkidle' })
  await p.waitForTimeout(1500)
  await p.click('.modeswitch')
  await p.waitForTimeout(2000)
  await p.evaluate(() => window.scrollTo(0, 0))
  await p.waitForTimeout(600)
  await p.screenshot({ path: `${OUT}${label}-faber-read-full.png`, fullPage: true })
  console.log('shot', label, 'faber-read')
  await p.close()
}

/* --- the homepage encounter, beat by beat --- */
for (const [label, vp, mobile] of [['desktop', DESKTOP, false], ['mobile', MOBILE, true]]) {
  const p = await page(vp, mobile)
  await p.goto(BASE + '/#/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(1600)
  await p.screenshot({ path: `${OUT}${label}-home-01-at-rest.png` })
  await p.click('.index__stop button.dot')
  await p.waitForTimeout(1400)
  await p.screenshot({ path: `${OUT}${label}-home-02-she-speaks.png` })
  await p.waitForTimeout(1800)
  await p.screenshot({ path: `${OUT}${label}-home-03-your-turn.png` })
  await p.click('.enc__replies .enc__reply')
  await p.waitForTimeout(3000)
  await p.screenshot({ path: `${OUT}${label}-home-04-she-answers.png` })
  console.log('shot', label, 'home beats')
  await p.close()
}

/* --- Faber's Understand sequence --- */
const STATES = [
  ['01-source-image', 0.02],
  ['02-elevation', 0.2],
  ['03-axonometric', 0.36],
  ['04-free-view', 0.52],
  ['05-exploded', 0.72],
  ['06-detail', 0.93],
]
for (const [label, vp, mobile] of [['desktop', DESKTOP, false], ['mobile', MOBILE, true]]) {
  const p = await page(vp, mobile)
  await p.goto(BASE + '/#/faber', { waitUntil: 'networkidle' })
  await p.waitForTimeout(1600)
  const st = await p.evaluate(() => {
    const s = document.querySelector('.study')
    return { top: s.offsetTop, h: s.offsetHeight }
  })
  for (const [name, frac] of STATES) {
    await p.evaluate(({ top, h, frac }) => window.scrollTo(0, top + (h - window.innerHeight) * frac), { ...st, frac })
    await p.waitForTimeout(1500)
    await p.screenshot({ path: `${OUT}${label}-faber-scene-${name}.png` })
  }
  console.log('shot', label, 'faber scenes')
  await p.close()
}

/* --- Faber's three build stops and the two identifications --- */
{
  const p = await page(DESKTOP, false)
  await p.goto(BASE + '/#/faber', { waitUntil: 'networkidle' })
  await p.waitForTimeout(1600)
  await p.evaluate(() => document.querySelector('[data-b="identify-compare"]').scrollIntoView({ block: 'center' }))
  await p.waitForTimeout(800)
  await p.screenshot({ path: `${OUT}desktop-faber-identify-01-thonet.png` })
  await p.click('.idc__switch .idc__tab:nth-child(2)')
  await p.waitForTimeout(800)
  await p.screenshot({ path: `${OUT}desktop-faber-identify-02-cabinet.png` })

  await p.evaluate(() => document.querySelector('[data-b="build-axis"]').scrollIntoView({ block: 'center' }))
  await p.waitForTimeout(800)
  for (const [i, n] of [[1, 'curious'], [2, 'maker'], [3, 'craftsperson']]) {
    await p.click(`.bx__stops .bx__stop:nth-child(${i})`)
    await p.waitForTimeout(600)
    await p.screenshot({ path: `${OUT}desktop-faber-build-${i}-${n}.png` })
  }
  for (const [id, name] of [['missing-viz', 'missing-object'], ['guide', 'build-guide'], ['understand-quote', 'understand-quoted']]) {
    await p.evaluate((s) => document.querySelector(`[data-b="${s}"]`).scrollIntoView({ block: 'center' }), id)
    await p.waitForTimeout(800)
    await p.screenshot({ path: `${OUT}desktop-faber-${name}.png` })
  }
  console.log('shot faber detail')
  await p.close()
}

await b.close()
console.log('review set written to', OUT)
