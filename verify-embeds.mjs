import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

/** Each embedded prototype has to actually run once it is asked for. */
const OUT = new global.URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const URL = 'http://localhost:4173/#/llp'
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const b = await chromium.launch({ executablePath: EXE })
const fails = []

async function open(p, blockId, shot) {
  const host = await p.$(`[data-b="${blockId}"]`)
  await host.scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  const invite = await host.$('.embed__invite')
  if (!invite) return null
  await invite.click()
  await p.waitForTimeout(2600)
  const frame = await host.$('iframe')
  if (!frame) {
    fails.push(blockId + ': no iframe after invite')
    return null
  }
  const f = await frame.contentFrame()
  const info = await f.evaluate(() => ({
    title: document.title,
    text: (document.body.innerText || '').slice(0, 160).replace(/\s+/g, ' '),
    w: document.documentElement.scrollWidth,
    clipped: document.documentElement.scrollWidth - window.innerWidth,
  }))
  console.log(`${blockId}: "${info.title}" | overflow ${info.clipped}px | ${info.text.slice(0, 90)}`)
  if (shot) await p.screenshot({ path: `${OUT}/${shot}.png` })
  return info
}

{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  p.on('pageerror', (e) => fails.push('PAGEERROR ' + e.message))
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.waitForTimeout(900)

  const first = await open(p, 'first-build', 'e-first-build')
  if (first && /Duolingo Benchmark/.test(first.title)) fails.push('first-build still carries the forked title')
  if (first && /au bout de/.test(first.text)) fails.push('first-build still shows the French leftover')

  await open(p, 'dot-lab', 'e-dot-lab')

  // The seam register deep-links into the dot lab's Enc<->Prac tab.
  const appr = await p.$('[data-b="approaches"]')
  await appr.scrollIntoViewIfNeeded()
  await p.waitForTimeout(300)
  await p.$eval('.appr__ask:last-child', (e) => e.click())
  await p.waitForTimeout(400)
  const seam = await open(p, 'approaches', 'e-seam')
  if (seam) {
    const f = await (await (await p.$('[data-b="approaches"]')).$('iframe')).contentFrame()
    const tab = await f.evaluate(() => {
      const on = document.querySelector('#tabs button.on')
      const note = document.getElementById('noteTtl')
      return { tab: on && on.textContent, note: note && note.textContent }
    })
    console.log('  deep link landed on tab:', JSON.stringify(tab))
    if (!tab.note || !tab.note.startsWith('E')) fails.push('dot lab deep link did not open the seam tab')
  }
  await p.close()
}

// Same, on a phone.
{
  const p = await b.newPage({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.waitForTimeout(900)
  await open(p, 'first-build', 'm-first-build')
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  console.log('mobile h-overflow with an artifact running:', ov + 'px', ov <= 0 ? 'OK' : 'FAIL')
  if (ov > 0) fails.push('mobile overflow with artifact running: ' + ov)
  await p.close()
}

console.log('\n' + (fails.length ? 'FAILURES:\n  ' + fails.join('\n  ') : 'embeds ok'))
await b.close()
process.exit(fails.length ? 1 : 0)
