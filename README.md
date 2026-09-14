# Personal portfolio

Vite + React + TypeScript, plain CSS with custom properties. No UI framework,
no animation library, no CMS.

    npm install
    npm run dev

## The system

**Page and Room.** Quiet and editorial by default; at chosen moments the
interface withdraws — margins collapse, type retreats, the ground darkens —
and a live artifact becomes the viewport. The threshold is continuous and
scroll-driven; committing to a room is per-project.

**One accent, three grounds, two room lights.** The madder red is constant
because it is Michelle's mark. What changes per project is the temperature of
the light: global warm grey, LLP warm ochre with an amber-lit room, Faber cool
slate with a blue-black room. Temperature is the orientation cue — there are no
breadcrumbs and no "you are here" labels.

**Type.** Newsreader reads. Instrument Sans labels and annotates. IBM Plex Mono
is for data only — tables, timings, readouts — and for nothing else.

## Experience and Read

A project is content, not a page. `src/llp/content.tsx` and
`src/faber/content.tsx` are ordered arrays of typed blocks;
`src/project/ProjectView.tsx` renders either array in either mode. There is no
second route per project and no duplicated sentence.

Switching is not navigation. The container stays mounted and the grid tracks
are CSS variables, so the composition *animates* from spread to document. The
block the reader's eyeline is inside is pinned every frame for the duration of
the transition — a single measurement is not enough, because the text reflows
the whole way. Margin notes and moment numbers are excluded from anchoring.

## Artifacts

Everything on the LLP page is real. Three scales, and the scale is the argument
about how much a thing mattered:

    room     the page gives way entirely. Reserved for the deployed product.
    embed    a working prototype, playable in place, at figure scale.
    figure   something built here from the registries and the audio archive.
    scene    a scroll-driven sequence that takes the viewport without being
             entered. Faber's Understand sequence is the only one.

`public/artifacts/` holds the prototypes as they were, unrestyled. They are
historical documents: the distance between the first build and the current one
is most of the story, so they are not brought into line with this page. The
only changes made to them are a stale page title, a leftover string from the
lesson one of them was forked from, two dev-only reset buttons, a try/catch
around `localStorage` so they survive a cross-origin frame, and a hash deep
link into the interaction lab's encounter-to-practice tab.

`src/llp/data/` is generated, not hand-written. `registry.json` comes from the
eleven workbooks and `pronunciation.json` from the four pronunciation spikes;
both are verbatim, empty cells included, with the known data defects recorded
rather than repaired. The extractors live outside this repo with the archives.

Nothing loads, plays or animates until a visitor asks for it. Every prototype
sits behind an invite, no audio autoplays, one clip plays at a time, and the
two data-heavy components ride in their own chunks.

## Faber

Faber's page quotes the product rather than calling it. Every string in
`src/faber/data.ts` was copied out of the live build on a stated date, hedges
intact, because generation there takes thirty to sixty seconds and does not
always complete. The drawings of Chair No. 14 in `src/faber/object.ts` are the
portfolio's, not the product's, and the page says so wherever they appear:
Faber generates no geometry and its Understand stage currently shows a
placeholder frame that does not rotate. Faber's own SVGs and its cream and tan
are reproduced unaltered, so a quotation looks like a quotation.

Faber's two sample photographs are still loaded from Faber's deployment. Run
`node vendor-faber-images.mjs` once from a machine that can reach it, then make
the two-line change it prints. Until then the page degrades to a labelled plate
rather than a broken image.

## What the page will not claim

The pronunciation archive records what was generated and nothing about how it
sounded. There is no score, rating or verdict in any of its result files, so
the page presents pairs and the exact strings that produced them and leaves the
judgement to the reader. Where the archive's own labels carry a prior
assessment, the page says whose ear it was. The registry status columns are on
screen rather than hidden, including the blocker that says the lesson is not
cleared to ship.

## Verifying and publishing

    npm run build && npx vite preview --port 4173
    node verify-site.mjs     # every route, both modes, desktop and 390px:
                             # errors, overflow, anchor drift (must be 0),
                             # reduced motion, deferred media, links
    node verify.mjs          # LLP: errors, deferred artifacts, no autoplay,
                             # anchor drift (must be 0), mobile, keyboard
    node verify-embeds.mjs   # every prototype runs once invited
    node audit.mjs           # case-study language, metric-shaped claims,
                             # em dashes outside quotes, every Igbo string

`SINGLEFILE=1 npm run build` restores the one-document build for the artifact
harness. It is not the launch path: inlining would put the audio and all four
prototypes into the first byte of the page.

## Still open

- Faber's two sample photographs are not vendored yet. See above.
- Nothing else. The launch structure is Michelle / LLP / Faber / About; the
  experiment route and its synthesised audio were removed before launch.
