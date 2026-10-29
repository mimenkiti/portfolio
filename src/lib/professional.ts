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
        line: 'Led from conception to launch: a prepaid card built into Samsung Wallet.',
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
        line: 'Led the early launches of driver’s licenses and state IDs in Samsung Wallet, building the product foundation that supported subsequent state rollouts.',
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
        line: 'Led the Samsung and Kudos partnership to launch a browser-based shopping companion that helps users maximize credit card rewards and earn additional cash back on purchases.',
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
        line: 'Worked on the launch of the high-yield Savings account for Apple Card, built on Marcus deposits.',
        links: [
          {
            label: 'Apple Newsroom, Apr 2023',
            href: 'https://www.apple.com/newsroom/2023/04/apple-cards-new-high-yield-savings-account-is-now-available-offering-a-4-point-15-percent-apy/',
          },
          {
            label: 'Apple Newsroom, Aug 2023',
            href: 'https://apple.com/newsroom/2023/08/apple-cards-savings-account-by-goldman-sachs-sees-over-10-billion-usd-in-deposits/',
          },
        ],
      },
      {
        name: 'Marcus Checking',
        line: 'Worked on Marcus’s first digital checking account.',
        links: [
          {
            label: 'American Banker',
            href: 'https://www.americanbanker.com/news/goldman-sachs-tests-checking-account-with-u-s-employees',
          },
        ],
      },
    ],
  },
  {
    org: 'Spatio Metrics',
    team: 'MIT-backed startup',
    years: '2020',
    role: 'Product Manager',
    projects: [
      {
        name: 'Spatial analytics for hospitals',
        line: 'As the startup’s sole product manager, worked directly with the CTO to develop early spatial analytics tools for hospitals, including prototypes for customer pilots and investor demos.',
        links: [
          {
            label: 'MIT Sloan, Jun 2020',
            href: 'https://mitsloan.mit.edu/ideas-made-to-matter/mit-startup-studies-hospital-health-one-floor-plan-a-time',
          },
        ],
      },
    ],
  },
]
