/* ---------------------------------------------------------------
   Vendor Faber's two sample photographs into this repo.

   Until this is run, the portfolio loads them from Faber's own
   deployment and falls back to a labelled plate if that deployment is
   unreachable. Run it once from a machine that can reach Faber:

       node vendor-faber-images.mjs

   Then follow the two-line change it prints at the end.
   --------------------------------------------------------------- */

import { mkdir, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const OUT = join(dirname(fileURLToPath(import.meta.url)), 'src', 'faber', 'img')
const FILES = {
  'thonet.jpg': 'https://faber-five.vercel.app/demo/thonet.jpg',
  'cabinet.jpg': 'https://faber-five.vercel.app/demo/cabinet.jpg',
}

await mkdir(OUT, { recursive: true })
for (const [name, url] of Object.entries(FILES)) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(join(OUT, name), buf)
  console.log(`${name}  ${(buf.length / 1024).toFixed(0)} kB`)
}

console.log(`
Saved to src/faber/img/. Now edit src/faber/data.ts:

  import thonetPhoto from './img/thonet.jpg'
  import cabinetPhoto from './img/cabinet.jpg'

  export const FABER_IMG = { thonet: thonetPhoto, cabinet: cabinetPhoto }

and delete the TO DO note above that constant.`)
