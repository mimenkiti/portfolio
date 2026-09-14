/* ---------------------------------------------------------------
   Every URL the site points at, in one place.

   The global set is LinkedIn · Email · GitHub, in that order. The
   per-project links are contextual: they sit at the foot of each
   project page, in the same quiet type as the rest of the page, and
   they point at the thing itself rather than at a page about it.
   --------------------------------------------------------------- */

export const LIVE = {
  llp: 'https://llp-build-01.vercel.app/',
  faber: 'https://faber-five.vercel.app/',
}

export const SOURCE = {
  llp: 'https://github.com/mimenkiti/LLP',
  faber: 'https://github.com/mimenkiti/faber',
}

export const EARLIER = {
  archive: 'https://mmenkiti.myportfolio.com/',
  pandora:
    'https://github.com/Pirouz-Nourian/Spatial_Computing_Design_Studio19/tree/master/Pandora',
}

export type Contact = { label: string; href: string }

const LINKEDIN = 'https://www.linkedin.com/in/michelle-menkiti/'
const EMAIL = 'mimichelle2011@gmail.com'
const GITHUB_PROFILE = 'https://github.com/mimenkiti'

export const CONTACT: Contact[] = [
  { label: 'LinkedIn', href: LINKEDIN },
  { label: 'Email', href: `mailto:${EMAIL}` },
  { label: 'GitHub', href: GITHUB_PROFILE },
]
