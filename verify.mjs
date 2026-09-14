import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

/**
 * What has to hold before this ships.
 *
 * The mode-switch anchor drift is the one that was expensive to get to
 * zero in V2, so it is checked at three points and with real artifacts in
 * the page rather than placeholder figures.
 */
const OUT = new global.URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const URL = 'http://localhost:4173/#/llp'
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const b = await chromium.launch({ executablePath: EXE })
const fails = []

// Nothing loads, plays or animates until a visitor asks for it.
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  const bad = []
  p.on('response', (r) => {
    if (r.status() >= 400) bad.push(r.status() + ' ' + r.url())
  })
  p.on('pageerror', (e) => fails.push('PAGEERROR ' + e.message))
  p.on('console', (m) => {
    const t = m.text()
    // The font CDN is unreachable from this sandbox; the page falls back
    // to Georgia and system-ui, and Chromium reports the blocked request
    // as a generic failed-resource error. Not a page fault.
    const fontBlocked = /ERR_TUNNEL|fonts\.googleapis|ERR_NAME/.test(t) || /Failed to load resource/.test(t)
    if (m.type() === 'error' && !fontBlocked) fails.push('CONSOLE ' + t)
  })
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await p.waitForTimeout(2500)
  const iframes = await p.$$eval('iframe', (e) => e.length)
  const playing = await p.evaluate(
    () => [...document.querySelectorAll('audio')].filter((a) => !a.paused).length,
  )
  console.log('bad responses:', bad.length ? bad : 'none')
  console.log('iframes before any invite:', iframes, iframes === 0 ? 'OK' : 'FAIL')
  console.log('audio autoplaying:', playing, playing === 0 ? 'OK' : 'FAIL')
  if (bad.length) fails.push('bad responses: ' + bad.join(', '))
  if (iframes !== 0) fails.push('an artifact mounted without being asked')
  if (playing !== 0) fails.push('audio autoplayed')
  await p.close()
}

// Experience <-> Read must keep the reader on the same sentence.
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.waitForTimeout(900)
  for (const target of ['conv-after', 'inspector', 'end-after']) {
    await p.evaluate((id) => {
      const el = document.querySelector(`[data-b="${id}"]`)
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3)
    }, target)
    await p.waitForTimeout(500)
    const before = await p.evaluate(
      (id) => document.querySelector(`[data-b="${id}"]`).getBoundingClientRect().top,
      target,
    )
    await p.click('.modeswitch')
    await p.waitForTimeout(1400)
    const after = await p.evaluate(
      (id) => document.querySelector(`[data-b="${id}"]`).getBoundingClientRect().top,
      target,
    )
    const drift = Math.round(Math.abs(after - before))
    console.log(`anchor drift at ${target}: ${drift}px`, drift <= 2 ? 'OK' : 'FAIL')
    if (drift > 2) fails.push(`anchor drift ${drift}px at ${target}`)
    await p.click('.modeswitch')
    await p.waitForTimeout(1400)
  }
  await p.close()
}

// It has to survive a 360px phone.
{
  const p = await b.newPage({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  })
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1200)
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  console.log('mobile h-overflow:', ov + 'px', ov <= 0 ? 'OK' : 'FAIL')
  if (ov > 0) {
    const wide = await p.evaluate(() =>
      [...document.querySelectorAll('*')]
        .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
        .slice(0, 8)
        .map((e) => (e.className && e.className.baseVal === undefined ? e.className : e.tagName)),
    )
    console.log('  offenders:', wide)
    fails.push('mobile overflow ' + ov + 'px')
  }
  for (const [id, name] of [
    ['open', 'm-top'],
    ['approaches', 'm-approaches'],
    ['listen', 'm-listen'],
    ['inspector', 'm-inspector'],
  ]) {
    const el = await p.$(`[data-b="${id}"]`)
    if (!el) continue
    await el.scrollIntoViewIfNeeded()
    await p.waitForTimeout(500)
    await p.screenshot({ path: `${OUT}/${name}.png` })
  }
  await p.close()
}

// Every control the page adds must work without a pointer.
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(URL, { waitUntil: 'networkidle' })
  await p.waitForTimeout(900)
  const el = await p.$('[data-b="approaches"]')
  await el.scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  await p.$eval('.appr__ask:nth-child(2)', (e) => e.focus())
  await p.keyboard.press('Enter')
  await p.waitForTimeout(400)
  const rec = await p.$$eval('.rec__tab', (e) => e.length)
  console.log('recovery reached by keyboard:', rec === 4 ? 'OK' : 'FAIL ' + rec)
  if (rec !== 4) fails.push('recovery not reachable by keyboard')
  else {
    await p.$eval('.rec__tab:last-child', (e) => e.focus())
    await p.keyboard.press('Enter')
    await p.waitForTimeout(300)
    const on = await p.$eval('.rec__tab.is-on .rec__tabL', (e) => e.textContent)
    console.log('keyboard selected:', on, on === 'D' ? 'OK' : 'FAIL')
    if (on !== 'D') fails.push('recovery tab ignored Enter')
  }

  const insp = await p.$('[data-b="inspector"]')
  await insp.scrollIntoViewIfNeeded()
  await p.waitForTimeout(400)
  await p.$eval('.insp__stop:last-child', (e) => e.focus())
  await p.keyboard.press('Enter')
  await p.waitForTimeout(300)
  const id = await p.$eval('.insp__id', (e) => e.textContent)
  console.log('inspector stepped by keyboard to:', id, id === 'RXP-006' ? 'OK' : 'FAIL')
  if (id !== 'RXP-006') fails.push('inspector rail ignored Enter')
  await p.close()
}

console.log('\n' + (fails.length ? 'FAILURES:\n  ' + fails.join('\n  ') : 'all checks passed'))
await b.close()
process.exit(fails.length ? 1 : 0)
