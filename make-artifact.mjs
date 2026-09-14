import { readFileSync, writeFileSync } from 'fs'

/**
 * The Artifact host supplies the <!doctype>/<head>/<body> skeleton, so the
 * published file carries page *content* only: title, the font link, the
 * bundled stylesheet, the mount point and the bundled script.
 */
const src = readFileSync('/home/claude/portfolio/dist/index.html', 'utf8')

const pick = (re, label) => {
  const m = src.match(re)
  if (!m) throw new Error('could not find ' + label)
  return m[0]
}

const fontLink = pick(/<link\s+[\s\S]*?fonts\.googleapis\.com\/css2[\s\S]*?\/>/, 'font link')
const style = pick(/<style[^>]*>[\s\S]*?<\/style>/, 'style')
const script = pick(/<script type="module"[\s\S]*?<\/script>/, 'script')

const out = `<title>Michelle Menkiti</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLink}
${style}
<div id="root"></div>
${script}
`

writeFileSync('/home/claude/portfolio/artifact.html', out)
console.log('artifact.html', (out.length / 1024).toFixed(1), 'kB')

// Simulate the host skeleton so the published page can be checked exactly
// as viewers will get it, including the host's reset.
const harness = `<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
:root{color-scheme:light}
body{margin:0;background:#faf9f7;font:14px system-ui,-apple-system,sans-serif}
img{max-width:100%}
[hidden]{display:none!important}
</style>
</head><body>
${out}
</body></html>`
writeFileSync('/home/claude/portfolio/dist/harness.html', harness)
console.log('harness written')
