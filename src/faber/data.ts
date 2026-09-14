/* ---------------------------------------------------------------
   Captured Faber output.

   Every string in this file was produced by the live product and copied
   out of it without editing. Nothing here is written for the portfolio,
   and nothing here is generated at page load: Faber's build generation
   takes thirty to sixty seconds and does not always complete, so the
   page quotes rather than calls.

   Where the product hedges, the hedge is kept. Where the product is
   wrong or blunt, that is kept too. The one liberty taken is line
   breaks in long paragraphs, which are formatting, not content.
   --------------------------------------------------------------- */

import sketchFull from './img/process-sketch.jpg'
import sketchPanel from './img/process-panel3.jpg'

export const CAPTURE = {
  origin: 'faber-five.vercel.app',
  on: '14 September 2026',
  label: 'captured from Faber, 14 Sep 2026',
}

/**
 * Faber's own sample photographs, served from Faber.
 *
 * TO DO BEFORE LAUNCH: copy demo/thonet.jpg and demo/cabinet.jpg out of
 * the Faber repo into this folder and import them here, the way the
 * process sketches below are imported. They will then be inlined in the
 * build and the page will not depend on another deployment staying up.
 * Until then the page degrades to a labelled plate rather than a broken
 * image if they fail to load.
 */
export const FABER_IMG = {
  thonet: 'https://faber-five.vercel.app/demo/thonet.jpg',
  cabinet: 'https://faber-five.vercel.app/demo/cabinet.jpg',
}

/**
 * Michelle's own graphic, made while building Faber. Project material,
 * not a Faber output and not a shipped screen. Shown as made: flattened
 * onto white and cropped, nothing redrawn.
 */
export const PROCESS_SKETCH = {
  full: sketchFull,
  transformPanel: sketchPanel,
}

export const FABER_URL = {
  home: 'https://faber-five.vercel.app/',
  about: 'https://faber-five.vercel.app/about',
  thonet: 'https://faber-five.vercel.app/results/demo-thonet',
}

/* --------------------------- 01 Identify --------------------------- */

export type Identified = {
  id: string
  title: string[]
  img: string
  facts: [string, string][]
  context: string
  /** How firmly the product wrote. This is our reading of the output, not a Faber score. */
  hedges: string[]
}

export const IDENTIFIED: Identified[] = [
  {
    id: 'thonet',
    title: ['Chair', 'No.', '14'],
    img: FABER_IMG.thonet,
    facts: [
      ['Designer', 'Michael Thonet'],
      ['Year', '1859'],
      ['Origin', 'Vienna, Austria'],
    ],
    context:
      'The No. 14 is one of the most produced objects in the history of manufacturing, with an estimated 50 million chairs made by 1930. Thonet arrived at its form through a radical industrial logic: six pieces of steam-bent beech, ten screws, and two nuts, assembled without glue and flat-packed 36 to a cubic meter. What reads as elegance is entirely a consequence of constraint.',
    hedges: [],
  },
  {
    id: 'cabinet',
    title: ['Two-Door', 'Cabinet'],
    img: FABER_IMG.cabinet,
    facts: [
      ['Designer', 'Unknown — Scandinavian influence, likely Danish or Swedish'],
      ['Year', '1955–1965'],
      ['Origin', 'Northern Europe, probable'],
    ],
    context:
      'A compact two-door cabinet in the Scandinavian tradition, distinguished by its tapered splayed legs, flush door fronts, and small domed brass pulls — details that place it firmly within the mid-century Danish modern vocabulary even without a maker’s mark. Whether a minor studio production or a well-made reproduction, the proportions are considered: the doors are book-matched or closely grain-matched, and the leg splay is calibrated rather than decorative.',
    hedges: [
      'Unknown — Scandinavian influence, likely Danish or Swedish',
      'Northern Europe, probable',
      'even without a maker’s mark',
      'Whether a minor studio production or a well-made reproduction',
      'book-matched or closely grain-matched',
    ],
  },
]

/* -------------------------- 02 Understand -------------------------- */

export const UNDERSTAND = {
  material: {
    head: 'Material',
    sub: 'European Beech (Fagus sylvatica)',
    body: 'Beech was chosen not for aesthetics but for behavior. It is a closed-grain hardwood with exceptional flexibility when steamed, bending without splitting or cracking along a tight radius that would destroy most other species. It is hard enough to hold a screw firmly, consistent enough to be milled in industrial quantities, and finishes to a smooth, pale surface that takes stain evenly.',
  },
  construction: {
    head: 'Construction',
    sub: 'Steam bending',
    body: 'Straight-grained beech blanks are exposed to saturated steam for approximately one hour per inch of thickness, raising the wood’s moisture content and plasticity until it behaves more like a thick leather than a rigid timber. At that point it is clamped into a metal form and bent around a tight curve, held under tension until it cools and sets. Under-steamed wood splits. Over-steamed wood loses its ability to hold a set.',
  },
  key: {
    head: 'The key',
    body: 'The continuous rear leg and backpost are a single length of bent beech, eliminating what would otherwise be the most vulnerable joint in the chair.',
  },
  dims: [
    ['Height', '95 cm'],
    ['Width', '54 cm'],
    ['Depth', '52 cm'],
    ['Seat height', '45 cm'],
  ] as [string, string][],
  difficulty: 'Advanced',
}

/* ---------------------------- 03 Build ----------------------------- */

export type Level = {
  id: 'curious' | 'maker' | 'craftsperson'
  /** Faber's own label and blurb, verbatim. */
  name: string
  blurb: string
  /** Faber's own level metadata. Static in the product: the same for every object. */
  meta: [string, string][]
  recommended?: boolean
  /** What Faber actually generated for Chair No. 14 at this level. */
  result: {
    object: string
    steps: number
    material: string
    tools: string
    /** Sum of the quoted material ranges, stated as a range because Faber states ranges. */
    cost: string
    /** One verbatim line from the generated steps, chosen because it is revealing. */
    quote: string
  }
}

export const LEVELS: Level[] = [
  {
    id: 'curious',
    name: 'The Curious',
    blurb:
      'You want to understand the shape and feel of this object. Simple materials, minimal tools, one weekend.',
    meta: [
      ['Time', '1 weekend'],
      ['Cost', '$50–$150'],
      ['Tools', '4 basic'],
      ['Skill', 'No experience needed'],
    ],
    result: {
      object: 'Bent Wire Chair',
      steps: 11,
      material: '12-gauge aluminium or copper wire, wooden dowel, hemp rope',
      tools: 'Pliers, wire cutters, hand saw, tape measure, pencil',
      cost: '$56–$88',
      quote:
        'This is about exploring the elegant bent form, not creating a full-strength chair.',
    },
  },
  {
    id: 'maker',
    name: 'The Maker',
    recommended: true,
    blurb:
      'You’ve built things before and want this to feel real. Some joinery, better materials and standard workshop tools.',
    meta: [
      ['Time', '2–3 weekends'],
      ['Cost', '$150–$400'],
      ['Tools', '8 tools'],
      ['Skill', 'Some experience'],
    ],
    result: {
      object: 'Bentwood Side Chair',
      steps: 12,
      material: 'White oak or ash, dowel rods, pre-woven cane webbing',
      tools:
        'Steam box, bending form, band saw, drill press, dowel jig, router, clamps, sanders',
      cost: '$138–$222',
      quote:
        'Create a bending form from 3/4" plywood that matches the curve of the chair’s back hoop (approximately 18" radius).',
    },
  },
  {
    id: 'craftsperson',
    name: 'The Craftsperson',
    blurb:
      'A high-fidelity build that honours the original’s materials, joinery, and proportions. This will take time.',
    meta: [
      ['Time', '4+ weekends'],
      ['Cost', '$400+'],
      ['Tools', '12+ tools'],
      ['Skill', 'Experienced maker'],
    ],
    result: {
      object: 'Bentwood Café Chair',
      steps: 12,
      material: 'Solid white oak or ash, pre-woven cane webbing, reed spline, marine-grade glue',
      tools:
        'Steam box, bending forms and clamps, table saw and band saw, wood lathe, drill press, spoke shave and drawknife, router, calipers',
      cost: '$218–$278',
      quote:
        'Traditional Chair No. 14 uses compound angles, so careful marking and test fitting is essential.',
    },
  },
]

/**
 * Faber writes a new build every time it is asked. The Craftsperson level
 * was run twice: the first time it returned a Bent Beechwood Chair in 14
 * steps, the second a Bentwood Café Chair in 12. Both are real; neither
 * is the answer. Worth saying on a page that quotes one of them.
 */
export const RERUN =
  'Faber writes each build fresh. Asked a second time, the Craftsperson level returned a Bent Beechwood Chair in fourteen steps instead of this one.'

/* ------------------------ The printable guide ---------------------- */

/** Real steps from the Maker programme, used for the Build Guide figure. */
export const GUIDE_STEPS: { group: string; items: { n: string; title: string }[] }[] = [
  {
    group: 'Prepare and steam bend components',
    items: [
      { n: '01', title: 'Mill and prepare bending stock' },
      { n: '02', title: 'Build bending form and steam wood' },
      { n: '03', title: 'Bend and secure wood to form' },
    ],
  },
  {
    group: 'Cut and shape chair parts',
    items: [
      { n: '04', title: 'Cut legs and stretchers' },
      { n: '05', title: 'Drill all joinery holes' },
      { n: '06', title: 'Shape and prepare seat frame' },
    ],
  },
  {
    group: 'Assemble chair base',
    items: [
      { n: '07', title: 'Join front leg assembly' },
      { n: '08', title: 'Complete base assembly' },
    ],
  },
  {
    group: 'Attach back and install seat',
    items: [
      { n: '09', title: 'Install bentwood back supports' },
      { n: '10', title: 'Install cane webbing seat' },
    ],
  },
]

/** The running heads Faber's print stylesheet actually puts on the page. */
export const GUIDE_HEAD = 'FABER — Build Guide'
export const GUIDE_FOOT = 'faber.app · I FABERed this'
