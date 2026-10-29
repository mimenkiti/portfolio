/* ---------------------------------------------------------------
   Professional: career highlights, not an inventory.

   One short line per project, written so it is clear what she led (at
   Samsung) and what she contributed to (at Goldman Sachs), and links out
   to what has been published about it. No metrics and no internal
   material: she still works at Samsung, so every link is a press release
   or independent coverage.

   `links` are shown as a row of sources. `launches` is the one list that
   gets its own row, because mobile ID shipped state by state and the
   states' own announcements are the clearest record of that.
   --------------------------------------------------------------- */

export type PressLink = { label: string; href: string }
export type Project = {
  name: string
  line: string
  links: PressLink[]
  launches?: PressLink[]
}
export type Employer = {
  org: string
  team: string
  years: string
  role: string
  projects: Project[]
}

export const PROFESSIONAL: Employer[] = [
  {
    org: 'Samsung',
    team: 'Samsung Wallet',
    years: '2023 to now',
    role: 'Senior Product Manager',
    projects: [
      {
        name: 'Samsung Cash',
        line: 'I led it from zero to launch: a prepaid card built into Samsung Wallet.',
        links: [
          {
            label: 'Samsung Newsroom, Oct 2026',
            href: 'https://news.samsung.com/us/samsung-wallet-launches-new-cash-back-experience-rakuten-samsung-cash/',
          },
          {
            label: '9to5Google',
            href: 'https://9to5google.com/2026/10/29/samsung-wallet-adds-cash-card/',
          },
        ],
      },
      {
        name: 'Mobile ID',
        line: 'I led driver’s licenses and state IDs in Samsung Wallet, from the first launch to each state that followed.',
        links: [
          {
            label: 'Samsung Newsroom, Oct 2023',
            href: 'https://news.samsung.com/us/samsung-idemia-bring-mobile-drivers-licenses-samsung-wallet-arizona-iowa-first-states-rollout',
          },
        ],
        launches: [
          { label: 'Arizona', href: 'https://azdot.gov/news/samsung-wallet-newest-option-arizona-driver-license-or-id' },
          { label: 'Iowa', href: 'https://iowadot.gov/news/2024-07-22/options-iowa-mobile-id-expanding' },
          { label: 'Maryland', href: 'https://mva.maryland.gov/news/mva-announces-maryland-mobile-id-samsung-wallet' },
          { label: 'Georgia', href: 'https://dds.georgia.gov/node/35531' },
          {
            label: 'Colorado',
            href: 'https://www.colorado.gov/now-coloradans-can-add-their-driver-license-and-state-id-samsung-wallet-0',
          },
          {
            label: 'West Virginia',
            href: 'https://www.idemia.com/press-release/idemia-public-security-partners-west-virginia-division-motor-vehicles-and-samsung-bring-mobile-id-samsung-wallet-west-virginia-2025-02-24',
          },
          { label: 'North Dakota', href: 'https://www.dot.nd.gov/node/14622' },
          {
            label: 'California',
            href: 'https://www.gov.ca.gov/2026/04/28/california-expands-mobile-drivers-license-to-samsung-wallet-continuing-dmvs-digital-transformation/',
          },
        ],
      },
      {
        name: 'Samsung Pay Benefits',
        line: 'I led our partnership with Kudos on a browser add-on that finds the best card and cash back at checkout.',
        links: [
          {
            label: 'IoT M2M Council, Nov 2025',
            href: 'https://www.iotm2mcouncil.org/iot-library/news/smart-retail-news/samsung-turns-to-kudos-to-power-shopping-assistant/',
          },
          {
            label: 'Samsung support',
            href: 'https://www.samsung.com/us/support/answer/ANS10007663/',
          },
        ],
      },
    ],
  },
  {
    org: 'Goldman Sachs',
    team: 'Marcus',
    years: '2021 to 2023',
    role: 'Product Manager',
    projects: [
      {
        name: 'Apple Card Savings',
        line: 'I worked on the launch of the high-yield Savings account for Apple Card, built on Marcus deposits.',
        links: [
          {
            label: 'MacRumors, Apr 2023',
            href: 'https://www.macrumors.com/2023/04/17/apple-card-savings-interest-rate/',
          },
          {
            label: 'Apple Newsroom, Aug 2023',
            href: 'https://apple.com/newsroom/2023/08/apple-cards-savings-account-by-goldman-sachs-sees-over-10-billion-usd-in-deposits/',
          },
        ],
      },
      {
        name: 'Marcus Checking',
        line: 'I worked on Marcus’s first digital checking account.',
        links: [
          {
            label: 'American Banker',
            href: 'https://www.americanbanker.com/news/goldman-sachs-tests-checking-account-with-u-s-employees',
          },
        ],
      },
    ],
  },
]
