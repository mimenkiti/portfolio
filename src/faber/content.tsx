import type { Project } from '../project/blocks'
import { FaberPhoto } from './assets'
import { IdentifyCompare } from './IdentifyCompare'
import { UnderstandStudy } from './UnderstandStudy'
import { BuildAxis } from './BuildAxis'
import { MissingObject } from './MissingObject'
import { BuildGuide } from './BuildGuide'
import { UnderstandQuote } from './UnderstandQuote'
import { CAPTURE, FABER_IMG, FABER_URL, PROCESS_SKETCH } from './data'

/**
 * Faber as content.
 *
 * The prose is Michelle's. Three factual corrections were made against
 * the live product, and only three:
 *
 *  1. The three build levels already produce genuinely different objects,
 *     materials, tools and step counts. The copy described that as an
 *     intention and as unfinished. It is neither.
 *  2. What is unfinished is specifically the visual transformation: Faber
 *     can write the three builds, it cannot show you the object at the
 *     end of one.
 *  3. What ships today is a printable Build Guide, which is a print
 *     stylesheet over the written steps. The illustrated, IKEA-like
 *     Workshop Sheet is a direction Michelle has designed, not a feature
 *     the product has.
 *
 * Nothing else was rewritten, tightened or made punchier.
 */
export const FABER_PROJECT: Project = {
  slug: 'faber',
  name: 'Faber',
  subject: 'Identifying an object, and understanding it well enough to make one',

  blocks: [
    /* ------------------------------ See ------------------------------ */
    { id: 'm-see', kind: 'moment', n: '01', title: 'See' },
    {
      id: 'see-head',
      kind: 'display',
      text: 'Making my way back to making',
    },
    {
      id: 'see-photo',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          The photograph, before it is anything else. Faber ships with three sample objects and
          this is one of them.
        </>
      ),
      render: () => (
        <FaberPhoto
          className="fphoto"
          src={FABER_IMG.thonet}
          alt="A Thonet bentwood chair photographed on a pavement"
        />
      ),
    },
    {
      id: 'see-1',
      kind: 'prose',
      paras: [
        <>
          I studied architecture in college, and while my career eventually moved toward software,
          I&rsquo;ve always missed the physical part of design. There is something very satisfying
          about ending with an object that didn&rsquo;t exist before, particularly one that you can
          live with, use, or give to someone else.
        </>,
        <>Furniture has been one of the ways I&rsquo;ve wanted to return to that.</>,
        <>
          The problem is that I often start with an image. I see a chair, lamp, or table that I
          like, but there is a considerable distance between recognizing that I like something and
          understanding it well enough to make it. I need to know what it is, how it is constructed,
          what tools and materials it requires, and eventually whether making my own version is even
          reasonable.
        </>,
      ],
    },
    {
      id: 'see-thesis',
      kind: 'lede',
      offset: true,
      text: <>Faber started as an attempt to shorten that distance.</>,
    },
    {
      id: 'see-2',
      kind: 'prose',
      paras: [
        <>
          It also gave me an excuse to learn in a way that tends to work well for me: by building
          something I actually wanted. I was interested in AI and wanted more experience working
          directly with it, but I was equally interested in stretching the visual and technical side
          of my own work. Faber became a place to experiment with both.
        </>,
      ],
    },
    {
      id: 'see-sketch',
      kind: 'figure',
      scale: 'column',
      caption: (
        <>
          A working drawing made while building Faber. Photograph the object, identify and measure
          it, adjust the approach to making it, leave with something you can build from. Project
          material, not a screen and not a Faber output.
        </>
      ),
      render: () => (
        <img
          className="fsketch"
          src={PROCESS_SKETCH.full}
          alt="Four panels: photographing a chair, a dimensioned line drawing of it, two versions of the chair with a slider between them, and a multi-view drawing sheet"
          loading="lazy"
        />
      ),
    },

    /* --------------------- Identify and Understand -------------------- */
    { id: 'm-id', kind: 'moment', n: '02', title: 'Identify, understand, build' },
    {
      id: 'stages',
      kind: 'prose',
      paras: [
        <>The product developed around three stages.</>,
        <>
          <em>Identify</em> begins with an object. Give Faber an image and it tries to determine what
          it is, who designed it, where it came from, and when it was made.
        </>,
        <>
          This works surprisingly well for recognizable pieces. It becomes less reliable as the
          object becomes more obscure, and that distinction ended up mattering. A plausible
          identification and a correct identification can look almost identical on a screen.
        </>,
      ],
    },
    {
      id: 'rule',
      kind: 'aside',
      text: (
        <>
          One of the simpler rules I&rsquo;ve adopted while building Faber is that the product
          shouldn&rsquo;t write what it doesn&rsquo;t know. I&rsquo;d rather expose uncertainty than
          have the confidence of the interface make a guess look like a fact.
        </>
      ),
    },
    {
      id: 'identify-compare',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          A chair the world has written about, and a cabinet nobody signed. Same fields, same
          product, different willingness to commit.
        </>
      ),
      render: () => <IdentifyCompare />,
    },
    {
      id: 'understand-1',
      kind: 'prose',
      paras: [
        <>
          <em>Understand</em> moves from the identity of an object to its construction.
        </>,
        <>
          What is it made from? What are the major components? How are they connected? What
          fabrication methods are likely involved?
        </>,
        <>
          This stage has its own failure mode. AI can be very good at explaining how something could
          be made while also making the process considerably more complicated than it needs to be.
          Understanding an object isn&rsquo;t just about generating more information. Part of the
          work is deciding which information actually helps someone see how the thing comes
          together.
        </>,
      ],
    },
    {
      id: 'study',
      kind: 'scene',
      caption: (
        <>
          Six views of one object: the photograph, the elevation, the axonometric, a view you turn
          yourself, the parts separated, and the single bent length the product singles out. A
          portfolio drawing. Faber&rsquo;s own Understand stage shows a placeholder frame where an
          object viewer will go.
        </>
      ),
      render: (mode, setGround) => (
        <UnderstandStudy embedded={mode === 'read'} onGround={setGround} />
      ),
    },
    {
      id: 'understand-quote',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          Material, construction, and the one detail the product decides is the key to the object.
        </>
      ),
      render: () => <UnderstandQuote />,
    },
    {
      id: 'build-lead',
      kind: 'prose',
      paras: [
        <>
          And then there is <em>Build</em>.
        </>,
        <>
          This is where Faber stops being primarily about the original object and starts becoming
          about the person making it.
        </>,
      ],
    },

    /* ----------------------------- Build ------------------------------ */
    { id: 'm-build', kind: 'moment', n: '03', title: 'Build' },
    {
      id: 'build-head',
      kind: 'display',
      text: 'There isn’t one correct version to build',
    },
    {
      id: 'build-1',
      kind: 'prose',
      paras: [
        <>
          Someone with a free afternoon, a drill and a modest budget probably shouldn&rsquo;t
          receive the same instructions as someone with a workshop and years of experience.
        </>,
        <>
          Faber currently approaches that through three levels: The Curious, The Maker, and The
          Craftsperson.
        </>,
        <>
          The difference isn&rsquo;t the amount of explanation wrapped around the same object. Time,
          difficulty, tools, materials and construction all change.
        </>,
      ],
    },
    {
      id: 'build-axis',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          The same chair, asked for three ways on one afternoon. A wire sculpture you can bend with
          pliers, a bentwood chair that needs a steam box and a router, and a café chair that adds a
          lathe, a drawknife and compound-angle joinery.
        </>
      ),
      render: () => <BuildAxis />,
    },
    {
      id: 'build-2',
      kind: 'prose',
      paras: [
        <>
          The Curious version should be approachable and relatively quick, using simpler
          construction and more accessible tools. The Maker can take on more time and complexity.
          The Craftsperson can move closer to the logic and fabrication of the original.
        </>,
        <>
          I wanted those to be genuinely different interpretations of the same object rather than
          easier and harder instruction manuals, and that part works.
        </>,
        <>What I haven&rsquo;t finished is being able to see it.</>,
      ],
    },

    /* ------------------------ The missing object ---------------------- */
    { id: 'm-missing', kind: 'moment', n: '04', title: 'The object that doesn’t arrive' },
    {
      id: 'missing-head',
      kind: 'display',
      text: 'The thing I still want Faber to do',
    },
    {
      id: 'missing-1',
      kind: 'prose',
      paras: [
        <>
          Right now, Faber can move surprisingly far from an image. It can identify an object, help
          explain its construction, and generate genuinely different approaches to building it.
        </>,
        <>What I really want is to see the transformation.</>,
        <>
          If I choose The Curious, I don&rsquo;t only want simpler written instructions, and I
          don&rsquo;t only want a different list of materials, which Faber already produces. I want
          Faber to show me the version of the object that those constraints produce. Maybe a
          complicated joint disappears. Maybe a curved form becomes planar. Maybe the material
          changes because the original requires equipment I don&rsquo;t have.
        </>,
      ],
    },
    {
      id: 'missing-viz',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          The same chair under three sets of constraints, drawn only as far as the product can
          currently take it.
        </>
      ),
      render: () => <MissingObject />,
    },
    {
      id: 'missing-2',
      kind: 'prose',
      paras: [
        <>
          The new object should still carry whatever made the original interesting, but it should
          also visibly belong to the person who is going to make it.
        </>,
        <>I haven&rsquo;t solved that yet.</>,
      ],
    },
    {
      id: 'missing-sketch',
      kind: 'figure',
      scale: 'column',
      caption: (
        <>
          From the same drawing: two versions of one chair, and a control between them. The
          transformation was drawn before it could be built, and it is still the part that
          isn&rsquo;t.
        </>
      ),
      render: () => (
        <img
          className="fsketch fsketch--panel"
          src={PROCESS_SKETCH.transformPanel}
          alt="Two line drawings of the same lounge chair, one more complex than the other, with a slider between them"
          loading="lazy"
        />
      ),
    },

    /* --------------------------- Build guide -------------------------- */
    { id: 'm-sheet', kind: 'moment', n: '05', title: 'Off the screen' },
    {
      id: 'sheet-1',
      kind: 'prose',
      paras: [
        <>
          For now, the process ends with something much more practical: a printable Build Guide that
          can come off the screen and into the actual build. It is the plain version of an idea
          I&rsquo;ve spent more time on than it probably deserves. The Workshop Sheet I keep
          drawing, the one that works the way IKEA instructions work, is still a direction rather
          than something the product makes.
        </>,
        <>
          I want it because it seems useful, but also because it is fun to design. I like the idea
          that something generated by a digital tool can eventually become folded, marked up, dusty,
          or kept alongside the thing it helped you make.
        </>,
      ],
    },
    {
      id: 'guide',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          What prints today. Faber drops its navigation and both side columns and sends the steps to
          paper with a running head.
        </>
      ),
      render: () => <BuildGuide />,
    },

    /* ----------------------------- Close ------------------------------ */
    {
      id: 'close',
      kind: 'prose',
      paras: [
        <>
          Faber has ended up being a useful place for me to work across a few things I wanted to get
          better at: designing with AI without assuming it is always right, thinking about physical
          objects again, and building more spatial interfaces than I normally get to make in product
          work.
        </>,
        <>There are still several pieces of it that I don&rsquo;t know how to build.</>,
      ],
    },
    {
      id: 'close-line',
      kind: 'lede',
      offset: true,
      text: <>That is probably why I&rsquo;m still interested in it.</>,
    },
    {
      id: 'colophon',
      kind: 'aside',
      text: (
        <>
          Faber is live at{' '}
          <a href={FABER_URL.home} target="_blank" rel="noreferrer">
            faber-five.vercel.app
          </a>
          . Product output on this page was {CAPTURE.label} and is quoted, not generated here.
          Drawings of the chair are the portfolio&rsquo;s.
        </>
      ),
    },
  ],
}
