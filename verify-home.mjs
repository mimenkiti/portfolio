import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

/**
 * The homepage encounter: real clips, nothing before the gesture.
 */
const OUT = new global.URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const URL = 'http://localhost:4173/'
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const b = await chromium.launch({
  executablePath: EXE,
  args: ['--autoplay-policy=no-user-gesture-required'],
})
const fails = []

for (const pick of ['odimma', 'kaodi']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 2 })
  const audio = []
  p.on('request', (r) => {
    if (/\.mp3/.test(r.url())) audio.push(r.url().split('/audio/')[1])
  })
  p.on('pageerror', (e) => fails.push('PAGEERROR ' + e.message))
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1600)

  if (pick === 'odimma') {
    console.log('audio requested before the gesture:', audio.length, audio.length === 0 ? 'OK' : 'FAIL')
    if (audio.length) fails.push('audio fetched before entry: ' + audio.join(', '))
    await p.screenshot({ path: `${OUT}/h-01-rest.png` })
  }

  await p.click('.index__stop button.dot')
  await p.waitForTimeout(1500)
  if (pick === 'odimma') await p.screenshot({ path: `${OUT}/h-02-greet.png` })
  await p.waitForTimeout(1400)
  const her = await p.$eval('.enc__line', (e) => e.textContent.trim())
  const opts = await p.$$eval('.enc__reply', (e) => e.map((x) => x.textContent.trim()))
  if (pick === 'odimma') {
    console.log('she says:', her, '| you may say:', opts.join(' / '))
    await p.screenshot({ path: `${OUT}/h-03-choose.png` })
  }

  const i = pick === 'odimma' ? 0 : 1
  await p.$$eval('.enc__reply', (els, i) => els[i].click(), i)
  await p.waitForTimeout(3200)
  const back = await p.$eval('.enc__line', (e) => e.textContent.trim())
  const acts = await p.$$eval('.enc__acts .act', (e) => e.map((x) => x.textContent.trim()))
  const body = await p.evaluate(() => document.querySelector('.enc').innerText.replace(/\n+/g, ' | '))
  console.log(`pick ${i === 0 ? opts[0] : opts[1]} -> she says: ${back}`)
  console.log('  transcript:', body)
  console.log('  actions:', acts.join(' / '))
  await p.screenshot({ path: `${OUT}/h-04-done-${pick}.png` })

  console.log('  clips played:', audio.join(', ') || 'NONE')
  if (!audio.length) fails.push(pick + ': no real clip was played')
  if (/idea|whole idea|conversation in a language/i.test(body))
    fails.push('the explanatory ending is still present')
  await p.close()
}

// Mobile, same journey.
{
  const p = await b.newPage({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)
  await p.screenshot({ path: `${OUT}/hm-01-rest.png` })
  await p.click('.index__stop button.dot')
  await p.waitForTimeout(3000)
  await p.screenshot({ path: `${OUT}/hm-02-choose.png` })
  await p.$$eval('.enc__reply', (els) => els[0].click())
  await p.waitForTimeout(3200)
  await p.screenshot({ path: `${OUT}/hm-03-done.png` })
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  console.log('mobile h-overflow:', ov + 'px', ov <= 0 ? 'OK' : 'FAIL')
  if (ov > 0) fails.push('mobile overflow on the homepage: ' + ov)
  await p.close()
}

console.log('\n' + (fails.length ? 'FAILURES:\n  ' + fails.join('\n  ') : 'homepage ok'))
await b.close()
process.exit(fails.length ? 1 : 0)
