/* ---------------------------------------------------------------
   Practice: her professional work, as a list rather than essays.

   Each project is one plain sentence and, where something public has
   been written about it, a link out. No metrics, no internal material:
   she still works at Samsung, so the links are press releases and
   independent coverage only.
   --------------------------------------------------------------- */

export type PressLink = { label: string; href: string }
export type Project = { name: string; line: string; links: PressLink[] }
export type Employer = {
  org: string
  team: string
  years: string
  role: string
  projects: Project[]
}

export const PRACTICE: Employer[] = [
  {
    org: 'Samsung',
    team: 'Samsung Wallet',
    years: '2023 to now',
    role: 'Senior Product Manager',
    projects: [
      {
        name: 'Samsung Cash',
        line: 'A prepaid card built into Samsung Wallet, with two kinds of account depending on how much identity verification someone completes. I led it from the first idea to launch.',
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
        name: 'Mobile driver’s license',
        line: 'Driver’s licenses and state IDs in Samsung Wallet, on Galaxy phones and watches, expanded state by state with each state’s agency.',
        links: [
          {
            label: 'Samsung Newsroom, Oct 2023',
            href: 'https://news.samsung.com/us/samsung-idemia-bring-mobile-drivers-licenses-samsung-wallet-arizona-iowa-first-states-rollout',
          },
          {
            label: 'California, Mobile ID World',
            href: 'https://www.mobileidworld.com/california-brings-mobile-drivers-license-to-samsung-wallet-expanding-smartphone-credential-options/',
          },
          {
            label: 'Samsung Wallet Digital ID',
            href: 'https://www.samsung.com/us/samsung-wallet/digital-id/',
          },
        ],
      },
      {
        name: 'Wallet navigation',
        line: 'A redesign of how Samsung Wallet in the US is organised across payments, identity and perks.',
        links: [],
      },
      {
        name: 'Privacy and child safety',
        line: 'Samsung Wallet’s US product liaison to privacy and compliance, and the product point of contact for Consumer Reports’ evaluation of digital wallets.',
        links: [
          {
            label: 'Consumer Reports, Apr 2025',
            href: 'https://advocacy.consumerreports.org/research/raising-the-bar-on-digital-wallets-how-six-leading-platforms-stack-up-on-safety-privacy-and-financial-well-being/',
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
        name: 'Marcus Checking',
        line: 'A digital checking account for Marcus, Goldman Sachs’ consumer bank.',
        links: [
          {
            label: 'American Banker',
            href: 'https://www.americanbanker.com/news/goldman-sachs-tests-checking-account-with-u-s-employees',
          },
        ],
      },
      {
        name: 'Apple Card Savings',
        line: 'The high-yield Savings account for Apple Card, from Goldman Sachs.',
        links: [
          {
            label: 'Apple Newsroom',
            href: 'https://apple.com/newsroom/2023/08/apple-cards-savings-account-by-goldman-sachs-sees-over-10-billion-usd-in-deposits/',
          },
        ],
      },
    ],
  },
]
