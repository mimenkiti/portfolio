import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

/**
 * Launch QA for the whole site.
 *
 * verify.mjs goes deep on LLP. This one goes wide: every public route, both
 * modes for both projects, desktop and 390px, plus the things that are easy
 * to break in a merge — anchor drift, horizontal overflow, reduced motion,
 * deferred media, and links that point nowhere.
 */
const OUT = new URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const BASE = process.env.BASE || 'http://localhost:4173'
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const pass = []
const issues = []
const untested = []
const ok = (m) => pass.push(m)
const bad = (m) => issues.push(m)

// The font CDN and Faber's deployment are unreachable from this sandbox.
// Chromium reports both as generic failed-resource console errors.
const EXTERNAL = /ERR_TUNNEL|ERR_NAME|fonts\.googleapis|fonts\.gstatic|faber-five|Failed to load resource/

const b = await chromium.launch({ executablePath: EXE })

function watch(p, tag) {
  p.on('pageerror', (e) => bad(`${tag}: PAGEERROR ${e.message}`))
  p.on('console', (m) => {
    if (m.type() !== 'error') return
    if (EXTERNAL.test(m.text())) return
    bad(`${tag}: CONSOLE ${m.text()}`)
  })
}

const overflow = (p) =>
  p.evaluate(() => {
    const d = document.documentElement
    return { over: d.scrollWidth > window.innerWidth + 1, sw: d.scrollWidth, iw: window.innerWidth }
  })

const ROUTES = ['/', '/llp', '/faber', '/about']

/* ---------------- every route, desktop and mobile ---------------- */
for (const [label, vp] of [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
]) {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2 })
  watch(p, label)
  for (const r of ROUTES) {
    await p.goto(`${BASE}/#${r}`, { waitUntil: 'load' })
    await p.waitForTimeout(1600)
    const o = await overflow(p)
    if (o.over) bad(`${label} ${r}: HORIZONTAL OVERFLOW ${o.sw} > ${o.iw}`)
    else ok(`${label} ${r}: no overflow`)
    const empty = await p.evaluate(() => document.querySelector('main')?.innerText.trim().length || 0)
    if (empty < 80) bad(`${label} ${r}: page looks empty (${empty} chars of text)`)
    const name = `${label}-${r === '/' ? 'home' : r.slice(1)}`
    await p.screenshot({ path: `${OUT}00-${name}.png` })
  }
  await p.close()
}

/* ---------------- anchor drift, both projects, both directions ---------------- */
for (const [route, anchor] of [
  ['/llp', '[data-b][data-anchor]'],
  ['/faber', '[data-b="build-1"]'],
]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  watch(p, `anchor${route}`)
  await p.goto(`${BASE}/#${route}`, { waitUntil: 'load' })
  await p.waitForTimeout(1400)
  const sel = await p.evaluate((s) => {
    const els = [...document.querySelectorAll(s)]
    const el = els[Math.floor(els.length / 2)]
    return el ? `[data-b="${el.dataset.b}"]` : null
  }, anchor)
  if (!sel) {
    bad(`${route}: no anchorable block found`)
    await p.close()
    continue
  }
  await p.evaluate((s) => document.querySelector(s).scrollIntoView(), sel)
  await p.waitForTimeout(800)
  for (const dir of ['to read', 'back to experience']) {
    const before = await p.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel)
    await p.click('.modeswitch')
    await p.waitForTimeout(1600)
    const after = await p.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel)
    const drift = Math.round(after - before)
    if (Math.abs(drift) > 1) bad(`${route} ${dir}: ANCHOR DRIFT ${drift}px on ${sel}`)
    else ok(`${route} ${dir}: anchor drift ${drift}px on ${sel}`)
  }
  await p.close()
}

/* ---------------- Faber: both modes, scene states, local images ---------------- */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  watch(p, 'faber')
  await p.goto(`${BASE}/#/faber`, { waitUntil: 'load' })
  await p.waitForTimeout(1500)

  const study = await p.evaluate(() => {
    const s = document.querySelector('.study')
    return s ? { top: s.offsetTop, h: s.offsetHeight } : null
  })
  if (!study) bad('faber: no .study section')
  else {
    for (const [n, frac] of [
      ['01-source', 0.02],
      ['02-elevation', 0.2],
      ['03-axonometric', 0.36],
      ['04-free', 0.52],
      ['05-exploded', 0.72],
      ['06-detail', 0.93],
    ]) {
      await p.evaluate(({ top, h, frac }) => window.scrollTo(0, top + (h - window.innerHeight) * frac), {
        ...study,
        frac,
      })
      await p.waitForTimeout(1400)
      const drawn = await p.evaluate(() => {
        const c = document.querySelector('.study__canvas')
        if (!c) return -1
        const g = c.getContext('2d')
        const d = g.getImageData(0, 0, c.width, c.height).data
        let n = 0
        for (let i = 3; i < d.length; i += 4 * 37) if (d[i] > 8) n++
        return n
      })
      if (n === '01-source') {
        // The first state is the photograph, not the drawing. An empty
        // canvas here is correct; an empty frame is not.
        const photo = await p.evaluate(() => {
          const el = document.querySelector('.study__photo')
          return el ? { op: Number(el.style.opacity || 1), h: el.getBoundingClientRect().height } : null
        })
        if (photo && photo.op > 0.5 && photo.h > 200)
          ok('faber scene 01-source: photograph layer holds the frame')
        else bad(`faber scene 01-source: source image layer missing (${JSON.stringify(photo)})`)
      } else if (drawn < 20) bad(`faber scene ${n}: canvas appears blank (${drawn} lit samples)`)
      else ok(`faber scene ${n}: drawing present (${drawn} lit samples)`)
      await p.screenshot({ path: `${OUT}10-faber-${n}.png` })
    }
  }

  // The build axis moves through three real captured results.
  await p.evaluate(() => document.querySelector('[data-b="build-axis"]').scrollIntoView({ block: 'center' }))
  await p.waitForTimeout(700)
  for (const i of [1, 2, 3]) {
    await p.click(`.bx__stops .bx__stop:nth-child(${i})`)
    await p.waitForTimeout(500)
    const objName = await p.evaluate(() => document.querySelector('.bx__object')?.innerText.trim())
    if (!objName) bad(`faber build axis stop ${i}: no generated object name`)
    else ok(`faber build axis stop ${i}: ${objName}`)
    await p.screenshot({ path: `${OUT}11-faber-build-${i}.png` })
  }

  // Identify compare switches between two captured outputs.
  await p.evaluate(() =>
    document.querySelector('[data-b="identify-compare"]').scrollIntoView({ block: 'center' }),
  )
  await p.waitForTimeout(600)
  await p.click('.idc__switch .idc__tab:nth-child(2)')
  await p.waitForTimeout(600)
  const hedges = await p.evaluate(() => document.querySelectorAll('.hedge').length)
  if (hedges < 3) bad(`faber identify: expected marked hedges, found ${hedges}`)
  else ok(`faber identify: ${hedges} hedges marked on the cabinet output`)
  await p.screenshot({ path: `${OUT}12-faber-identify-cabinet.png` })

  // Read mode parity.
  await p.click('.modeswitch')
  await p.waitForTimeout(1500)
  await p.evaluate(() => document.querySelector('[data-b="study"]').scrollIntoView({ block: 'center' }))
  await p.waitForTimeout(1200)
  const steps = await p.evaluate(() => document.querySelectorAll('.study__steps .study__step').length)
  if (steps !== 6) bad(`faber read: expected 6 scene steps, found ${steps}`)
  else ok('faber read: contained scene offers all six views')
  await p.screenshot({ path: `${OUT}13-faber-read-scene.png` })
  await p.close()
}

/* ---------------- LLP: nothing runs before it is asked ---------------- */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  watch(p, 'llp-defer')
  await p.goto(`${BASE}/#/llp`, { waitUntil: 'networkidle' })
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await p.waitForTimeout(2500)
  const state = await p.evaluate(() => ({
    iframes: document.querySelectorAll('iframe').length,
    playing: [...document.querySelectorAll('audio')].filter((a) => !a.paused).length,
  }))
  if (state.iframes) bad(`llp: ${state.iframes} iframe(s) mounted before invitation`)
  else ok('llp: no iframe mounts before invitation')
  if (state.playing) bad(`llp: ${state.playing} audio element(s) playing unasked`)
  else ok('llp: no audio plays unasked')
  await p.close()
}

/* ---------------- homepage: nothing fetched before the full stop ---------------- */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  watch(p, 'home')
  const media = []
  p.on('request', (r) => {
    if (/\.mp3(\?|$)/.test(r.url())) media.push(r.url())
  })
  await p.goto(`${BASE}/#/`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2000)
  if (media.length) bad(`home: ${media.length} audio request(s) before the full stop was pressed`)
  else ok('home: no audio requested before the full stop')
  await p.screenshot({ path: `${OUT}20-home-at-rest.png` })

  await p.click('.index__stop button.dot')
  await p.waitForTimeout(3200)
  await p.screenshot({ path: `${OUT}21-home-greeting.png` })
  const replies = await p.evaluate(() => document.querySelectorAll('.enc__reply').length)
  if (replies !== 2) bad(`home: expected two replies, found ${replies}`)
  else ok('home: two real replies offered')
  await p.click('.enc__replies .enc__reply')
  await p.waitForTimeout(3000)
  await p.screenshot({ path: `${OUT}22-home-answered.png` })
  if (!media.length) bad('home: full stop pressed but no clip was fetched')
  else ok(`home: ${media.length} clip(s) fetched only after the full stop`)
  await p.close()
}

/* ---------------- Escape leaves the room ---------------- */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  watch(p, 'room')
  await p.goto(`${BASE}/#/llp`, { waitUntil: 'load' })
  await p.waitForTimeout(1200)
  const hasThreshold = await p.evaluate(() => !!document.querySelector('.threshold__enter'))
  if (!hasThreshold) bad('llp: no threshold found')
  else {
    await p.evaluate(() => document.querySelector('.threshold').scrollIntoView({ block: 'center' }))
    await p.waitForTimeout(600)
    await p.click('.threshold__enter')
    await p.waitForTimeout(1800)
    const opened = await p.evaluate(() => document.body.classList.contains('is-room-open'))
    if (!opened) bad('llp: room did not open')
    else {
      await p.keyboard.press('Escape')
      await p.waitForTimeout(1200)
      const closed = await p.evaluate(() => !document.body.classList.contains('is-room-open'))
      if (closed) ok('llp: Escape leaves the room')
      else bad('llp: Escape did not leave the room')
    }
  }
  await p.close()
}

/* ---------------- keyboard reach ---------------- */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  watch(p, 'keyboard')
  for (const r of ROUTES) {
    await p.goto(`${BASE}/#${r}`, { waitUntil: 'load' })
    await p.waitForTimeout(1000)
    const reach = await p.evaluate(() => {
      const sel =
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      const all = [...document.querySelectorAll(sel)]
      // A control that is deliberately inert until its moment arrives
      // carries pointer-events: none as well as tabindex -1. That pair is
      // the site's way of saying "not yet", and it is not a trap.
      const hidden = all.filter((e) => {
        const s = getComputedStyle(e)
        return (
          e.tabIndex < 0 &&
          s.display !== 'none' &&
          s.visibility !== 'hidden' &&
          s.pointerEvents !== 'none' &&
          e.offsetParent
        )
      })
      return { total: all.length, unreachable: hidden.length }
    })
    if (reach.unreachable) bad(`${r}: ${reach.unreachable} visible control(s) not keyboard-reachable`)
    else ok(`${r}: all ${reach.total} controls keyboard-reachable`)
  }
  await p.close()
}

/* ---------------- reduced motion ---------------- */
{
  const p = await b.newPage({ viewport: { width: 1280, height: 860 }, reducedMotion: 'reduce' })
  watch(p, 'reduced')
  for (const r of ROUTES) {
    await p.goto(`${BASE}/#${r}`, { waitUntil: 'load' })
    await p.waitForTimeout(1100)
    const h = await p.evaluate(() => document.querySelector('.route')?.getBoundingClientRect().height || 0)
    if (h < 200) bad(`reduced motion ${r}: route renders at ${Math.round(h)}px (blank?)`)
    else ok(`reduced motion ${r}: renders`)
  }
  await p.evaluate(() => {
    const s = document.querySelector('.study')
    if (s) window.scrollTo(0, s.offsetTop + (s.offsetHeight - window.innerHeight) * 0.72)
  })
  await p.goto(`${BASE}/#/faber`, { waitUntil: 'load' })
  await p.waitForTimeout(1000)
  await p.evaluate(() => {
    const s = document.querySelector('.study')
    window.scrollTo(0, s.offsetTop + (s.offsetHeight - window.innerHeight) * 0.72)
  })
  await p.waitForTimeout(1400)
  await p.screenshot({ path: `${OUT}30-reduced-motion-faber.png` })
  await p.close()
}

/* ---------------- links ---------------- */
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  watch(p, 'links')
  const seen = new Map()
  for (const r of ROUTES) {
    await p.goto(`${BASE}/#${r}`, { waitUntil: 'load' })
    await p.waitForTimeout(900)
    const hrefs = await p.evaluate(() =>
      [...document.querySelectorAll('a[href]')].map((a) => ({
        href: a.getAttribute('href'),
        text: a.innerText.trim().slice(0, 40),
      })),
    )
    for (const h of hrefs) if (!seen.has(h.href)) seen.set(h.href, { ...h, route: r })
  }
  for (const [href, info] of seen) {
    if (href === '#' || href === '' || href.startsWith('javascript:')) {
      bad(`dead link on ${info.route}: "${info.text}" -> ${href || '(empty)'}`)
      continue
    }
    if (!/^https?:/.test(href)) {
      ok(`internal link ${href}`)
      continue
    }
    // This sandbox reaches almost nothing outbound, so a failure here is
    // usually the egress proxy rather than the site. Report what happened
    // and let a person check the ones that matter from a real browser.
    try {
      const res = await p.request.get(href, { timeout: 15000, maxRedirects: 5 })
      if (res.status() >= 400) untested.push(`${res.status()} ${href} ("${info.text.replace(/\s+/g, ' ')}")`)
      else ok(`external link ${res.status()}: ${href}`)
    } catch (e) {
      untested.push(`unreachable ${href} (${String(e.message).slice(0, 50)})`)
    }
  }
  await p.close()
}

await b.close()

console.log('\n================ PASS ================')
pass.forEach((m) => console.log('  ok  ' + m))
console.log('\n======== NOT TESTABLE FROM THIS SANDBOX ========')
if (!untested.length) console.log('  none')
untested.forEach((m) => console.log('  ??  ' + m))

console.log('\n================ ISSUES ================')
if (!issues.length) console.log('  none')
issues.forEach((m) => console.log('  !!  ' + m))
console.log(`\n${pass.length} passed, ${issues.length} issue(s)\n`)
