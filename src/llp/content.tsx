import { lazy, Suspense, type ReactNode } from 'react'
import { Approaches } from './Approaches'
import { ContactSheet } from './ContactSheet'
import { Encounter } from './Encounter'
import { Streak } from './Streak'
import { Hearing } from './Hearing'
import { VoiceBoundary } from './VoiceBoundary'
import { Phones } from './Phones'
import { DotStates } from './DotStates'
import { Stages } from './Stages'
import type { Project } from '../project/blocks'

/* The registry and the pronunciation archive are ~140kB of real data
   between them. Neither is needed to read the first screen, so both ride
   in their own chunk and arrive when the reader does. */
const Inspector = lazy(() =>
  import('./Inspector').then((m) => ({ default: m.Inspector })),
)
const Pronunciation = lazy(() =>
  import('./Pronunciation').then((m) => ({ default: m.Pronunciation })),
)

const waiting = (label: string) => <p className="b__waiting caption">{label}</p>
const defer = (node: ReactNode, label: string) => (
  <Suspense fallback={waiting(label)}>{node}</Suspense>
)

/**
 * LLP as content.
 *
 * The prose is Michelle’s, verbatim, in her order. Nothing here is
 * paraphrased, compressed, or rearranged into a case study, and no
 * finding, metric or user appears that is not in the writing or in the
 * artifacts themselves.
 *
 * Headings are set quietly on purpose. The rhythm is meant to come from
 * what the artifacts do and how much room they take, not from a run of
 * titles announcing sections.
 */
const LIVE = 'https://llp-build-01.vercel.app'

/** One caption for the encounter, wherever a mode places it. */
export const ENCOUNTER_CAPTION = (
  <>
    The opening of the encounter, in the order the build runs it, every phrase read from the
    registry. Nothing is translated until you answer. The real one is below.
  </>
)

export const LLP_PROJECT: Project = {
  slug: 'llp',
  name: 'LLP',
  subject: 'Learning a heritage language',
  blocks: [
    {
      id: 'open',
      kind: 'lede',
      text: (
        <>
          I have a <Streak />-day streak on Duolingo.
        </>
      ),
    },
    {
      id: 'open-prose',
      kind: 'prose',
      paras: [
        <>
          Most of it is French. I was born in France and studied French in school, so I can read and
          understand quite a bit, but speaking has never come as naturally to me.
        </>,
        <>
          That has always felt a little funny, because my parents are genuinely multilingual. My mom
          speaks English, French and Igbo, and my dad speaks English and Spanish and understands
          Igbo. Moving between languages was a real skill for them, and one I&rsquo;ve always
          admired but never really felt I inherited.
        </>,
        <>
          Over the last few years I&rsquo;ve gotten more serious about changing that: Duolingo to
          keep building on the French I already know, and a tutor to get more comfortable actually
          speaking it.
        </>,
      ],
    },
    {
      id: 'igbo',
      kind: 'lede',
      offset: true,
      text: 'Naturally, it made me think about Igbo.',
    },
    {
      id: 'igbo-prose',
      kind: 'prose',
      paras: [
        <>
          My mom speaks it, my dad understands more than he speaks, and some of my extended family
          speak it to varying degrees, but not many people in my generation really do. I never
          learned it either, and when I went looking, there wasn&rsquo;t an obvious equivalent to
          the tools I use for French.
        </>,
        <>
          There are books, YouTube videos, dictionaries and classes, and I&rsquo;ve tried most of
          them. But with fewer resources, uneven quality, and pronunciation that is hard to learn
          from text, Igbo is much harder to fold into everyday life, and most of the apps I already
          use don&rsquo;t support it.
        </>,
        <>
          The thing I want isn&rsquo;t especially ambitious. I want to understand when my family is
          speaking Igbo, and eventually be able to join in without having to rehearse what I might
          say beforehand.
        </>,
        <>
          The bar I kept coming back to was simple: whatever I built had to be useful enough that I
          would come back tomorrow, and then again the day after that. Not a beautiful reference
          tool or a collection of lessons, but something I would actually want to keep using.
        </>,
      ],
    },
    // Her own sentence, kept from the earlier opening when the rest of
    // that opening was replaced. It is the hinge into the next section,
    // so the sentence carries the section change rather than the small
    // heading having to, and it appears nowhere else on the page.
    {
      id: 'pull-instinct',
      kind: 'pull',
      text: 'My first instinct was a fairly obvious one: build the thing I wished existed.',
    },

    { id: 'h-first', kind: 'heading', text: 'It started out like Duolingo' },
    {
      id: 'first-lede',
      kind: 'lede',
      text: 'And at what it was designed to do, it worked.',
    },
    {
      id: 'first-prose',
      kind: 'prose',
      paras: [
        <>
          I built a working prototype around structured lessons and exercises, borrowing quite
          deliberately from the products I was already using. If the tools helping me with French
          didn&rsquo;t exist for Igbo, perhaps I could make one. The exercises were sound, and it
          taught what it set out to teach.
        </>,
      ],
    },
    {
      id: 'first-build',
      kind: 'embed',
      src: '/artifacts/first-build.html',
      title: 'The first build',
      scale: 'wide',
      frame: 'phone',
      invite: 'take the first lesson',
      caption: (
        <>
          The first build as it was: twelve exercises, a combo counter, hearts. It still runs, and it
          is left unrestyled, because the distance between it and what came next is most of the
          story.
        </>
      ),
    },
    // The hinge of the whole project, and the reason the first build is
    // on the page at all. It is a `pull` because the turn happens in
    // this sentence rather than in the section heading after it.
    {
      id: 'pull-keep',
      kind: 'pull',
      text: "The problem was that I wasn’t convinced I would keep using it.",
    },
    {
      id: 'first-after',
      kind: 'prose',
      offset: true,
      paras: [
        <>
          I didn&rsquo;t really want to get good at completing Igbo exercises. I wanted to get
          comfortable enough to begin participating in the language, and the more I thought about
          that, the more I wondered whether I had started with the wrong unit altogether.
        </>,
        <>
          Maybe the lesson shouldn&rsquo;t lead eventually to a conversation.
        </>,
        <>
          Maybe the conversation could be the lesson.
        </>,
      ],
    },
    {
      id: 'sheet',
      kind: 'figure',
      // A sheet of five documents wants to be read as a sheet, so it
      // takes the viewport. One of LLP’s two bleeds.
      scale: 'bleed',
      // Her own sentence, moved rather than reworded: the caption
      // already said "Each one opens", and instructions now live on the
      // live mark, which is the one place a visitor looks for them.
      does: 'Each one opens.',
      caption: (
        <>
          Working documents from that turn, as they were, bad ideas included: what the product
          should feel like, what makes someone open a learning app on the hundred and ninetieth day,
          and where a lesson should sit relative to a conversation.
        </>
      ),
      render: () => <ContactSheet />,
    },

    { id: 'h-conv', kind: 'heading', text: 'Conversation as the lesson' },
    {
      id: 'conv-prose',
      kind: 'prose',
      paras: [
        <>
          I don&rsquo;t think conversation is the right format for every lesson. But it felt like a
          good place to start, because it puts you inside something recognizable straight away:
          another person has said something to you, and you need to figure out enough to respond.
        </>,
        <>
          The web prototype begins in a market, where you meet a guide named Chioma. She says{' '}
          <span className="ig" lang="ig">Kedụ?</span> You hear it and see the words, but she
          doesn&rsquo;t translate them, and you can answer aloud or choose one of two responses.
        </>,
        <>
          I wanted the language to feel connected to the culture around it, and Chioma to feel like
          a person guiding you through that world rather than someone administering exercises. For
          another heritage language, I would expect the guide, the setting, and perhaps parts of
          the teaching to change with it.
        </>,
      ],
    },
    // What a cold reader otherwise has to infer from the registries
    // several screens below, and the thing everyone assumes the wrong way
    // round. A margin note rather than a paragraph, because the narrative
    // does not need interrupting to say it.
    {
      id: 'authored',
      kind: 'aside',
      text: (
        <>
          Worth saying early, because people tend to assume the opposite: the Igbo is not
          generated. Every phrase Chioma says comes from a registry I maintain, and a lesson
          can&rsquo;t invent language while it runs. What happens live is her voice, synthesized
          line by line.
        </>
      ),
    },
    {
      id: 'turns',
      kind: 'figure',
      scale: 'column',
      does: 'advance a turn at a time',
      caption: ENCOUNTER_CAPTION,
      render: () => <Encounter />,
      // Read opens with this encounter instead (llp/ReadOpening.tsx).
      experienceOnly: true,
    },
    // Her opening line in the deployed build, and the diagnostic’s
    // anchor item. Sits beside the threshold you are about to cross.
    { id: 'g-kedu', kind: 'gloss', formId: 'context-32' },
    {
      id: 'market',
      kind: 'room',
      src: LIVE,
      label: 'the market',
      allow: 'microphone; autoplay',
      scene: (
        <>
          A woman is standing behind a table of oranges. She is about to say something to you, in
          Igbo, and she is not going to translate herself.
        </>
      ),
      cta: 'meet Chioma',
      terms: 'sound on · about three minutes · a microphone, if you want to answer aloud',
      caption: (
        <>
          The web build as deployed: her speech is synthesized from the registry, and teaching opens
          over the scene without ending it. You can answer aloud, though in this build what you say
          is checked by a stand-in rather than live Igbo recognition, which is where the last
          section picks up.
        </>
      ),
    },
    {
      id: 'conv-after',
      kind: 'prose',
      paras: [
        <>
          Putting the learner in a conversation created a new problem: conversations don&rsquo;t
          conveniently stop while you learn the vocabulary to continue them.
        </>,
        <>
          I tried versions that taught more before asking someone to respond, versions that let
          them struggle first, and versions that kept almost everything inside the encounter, and I
          spent a surprising amount of time on smaller questions, like when a hint should appear and
          what should happen after a wrong answer.
        </>,
      ],
    },
    // Welcome. The phrase the market scene is built around. Glosses go
    // immediately after a reading-column block so grid auto-placement
    // seats them in that block’s row rather than in a band of their own.
    { id: 'g-nnoo', kind: 'gloss', formId: 'combination-27' },
    // The thesis of the block it sits in, and already its own
    // one-sentence paragraph. It stays exactly where it was in the
    // reading order; the block is split around it so it can be set
    // large without moving.
    {
      id: 'pull-removing',
      kind: 'pull',
      text: 'A lot of the design work has been an exercise in removing things.',
    },
    {
      id: 'conv-after-2',
      kind: 'prose',
      paras: [
        <>
          The simpler versions generally feel better. I also wanted more positive reinforcement than
          I expected: not points or streaks, just small signals that made continuing feel good.
        </>,
        <>
          That led to what I started calling the seam. If you don&rsquo;t understand Chioma, help
          opens over the conversation instead of taking you somewhere else, and you return to
          exactly where you were. There is still a lesson underneath; you just don&rsquo;t feel
          like you&rsquo;ve left the conversation every time you need it.
        </>,
      ],
    },
    {
      id: 'approaches',
      kind: 'figure',
      scale: 'wide',
      does: 'ask any of the three',
      caption: (
        <>
          Three of those experiments, still running, and built to disagree with each other.
        </>
      ),
      render: () => <Approaches />,
    },

    { id: 'h-dot', kind: 'heading', text: 'The dot' },
    {
      id: 'dot-prose',
      kind: 'prose',
      paras: [
        <>
          At some point in all of this, I became slightly obsessed with a dot.
        </>,
        <>
          I liked the role characters like Duo play in learning products: something persistent that
          follows you through the experience and gives it a little life. But I didn&rsquo;t want
          another character competing with Chioma, and I&rsquo;ve always been attracted to seeing
          how much expression can come from an extremely simple form.
        </>,
        <>
          It has gone through a slightly unreasonable number of design sprints: a guide, a source of
          encouragement, a way into help, a control, and sometimes simply a reaction. Because there
          is so little there, very small changes in movement and timing make it feel completely
          different.
        </>,
      ],
    },
    {
      id: 'dot-lab',
      kind: 'embed',
      src: '/artifacts/dot-lab.html',
      title: 'Eighteen behaviors for one dot',
      scale: 'wide',
      frame: 'phone',
      invite: 'tap, hold and drag it',
      animates: true,
      caption: (
        <>
          Tap asks the system for something. Hold means it is listening to you. Drag only works when
          the dot is attached to something.
        </>
      ),
    },
    {
      id: 'dot-more',
      kind: 'more',
      summary: 'What the lab says about accessibility',
      body: (
        <>
          <p>
          The lab keeps its own critique beside each behavior, including this one, on what all of
            that costs:{' '}
            <em>
              Everything here is a gesture on one small target. Hold needs a tap-to-start/tap-to-stop
              alternative, drag needs stepped buttons, and motion must respect reduce-motion.
              Conventional fallbacks are not optional.
            </em>
          </p>
        </>
      ),
    },
    {
      id: 'dot-after',
      kind: 'prose',
      paras: [
        <>
          I’m still figuring out exactly what its role should be. What it has settled so far is a
          question I keep asking about the rest of the interface, which is how much of it needs to
          ask for attention at all.
        </>,
      ],
    },

    { id: 'h-under', kind: 'heading', text: 'What it knows' },
    {
      id: 'under-prose',
      kind: 'prose',
      paras: [
        <>
          As the prototype grew, I split it into three questions: what the product knows, what
          someone should learn, and how the product teaches it.
        </>,
        <>
          What it knows lives in a registry rather than inside lessons, and every word and phrase
          carries where it came from and how much I trust it. A lesson is only cleared for teaching
          once its Igbo traces back to entries I&rsquo;ve marked Approved, and the first lesson
          isn&rsquo;t there yet: none of the registry has been reviewed by a native speaker.
        </>,
      ],
    },
    // IGB-KNW-016. The registry holds this one as a template rather
    // than a finished line, which is the section’s whole subject.
    { id: 'g-aha', kind: 'gloss', formId: 'context-35' },
    {
      id: 'inspector',
      kind: 'figure',
      scale: 'wide',
      does: 'follow any phrase through',
      caption: (
        <>
          One phrase, traced from its source to the moment a learner meets it, including the cells
          that say it isn&rsquo;t ready.
        </>
      ),
      render: () => defer(<Inspector />, 'loading the registries'),
    },
    {
      id: 'registry-more',
      kind: 'more',
      summary: 'Where the registry stands',
      body: (
        <>
          <p>
          All ten capabilities in the registry are still Draft or marked as a knowledge gap. The
            first lesson carries a blocker saying the knowledge it needs is still Candidate or Hold,
            and the eight questions waiting for a native speaker have no answers yet. The lesson
            itself uses Approved and Candidate entries; anything on Hold is never transcribed, so it
            can&rsquo;t appear at all.
          </p>
        </>
      ),
    },
    {
      id: 'under-after',
      kind: 'prose',
      offset: true,
      paras: [
        <>
          Partly that separation is practical: I can improve what LLP knows without redesigning every
          lesson, and change how something is taught without touching the language underneath.
        </>,
        <>
          But I also started with Igbo because it is personal to me, and the resource problem
          isn&rsquo;t unique to Igbo. Eventually I&rsquo;d like to see what this looks like for
          other heritage languages, without assuming every language, culture, or learner should be
          treated the same way.
        </>,
      ],
    },

    { id: 'h-voice', kind: 'heading', text: 'Teaching a voice Igbo' },
    {
      id: 'voice-prose',
      kind: 'prose',
      paras: [
        <>
          Giving Chioma a voice turned out to be easy. Giving her a voice I was comfortable asking
          someone to learn from was a different problem.
        </>,
      ],
    },
    // Already its own one-sentence paragraph, at the midpoint of the
    // block. It also lands directly above the pronunciation apparatus,
    // so it introduces that figure as well as breaking the run.
    {
      id: 'pull-gap',
      kind: 'pull',
      text: 'Igbo pronunciation exposed the gap pretty quickly.',
    },
    {
      id: 'voice-prose-2',
      kind: 'prose',
      paras: [
        <>
          An accent isn&rsquo;t a failure, and I don&rsquo;t think a learner needs perfect
          pronunciation. But the standard changes when the product is the teacher. If LLP asks
          someone to listen and repeat, I need to be reasonably confident that what they hear is
          worth learning.
        </>,
        <>
          So I stopped assuming the voice model would handle pronunciation and started treating it
          as its own layer. When a phrase sounds wrong to me, I write out how it should be said and
          send that instead, which I call a pronunciation override.
        </>,
        <>
          My own ear is still part of the judgment, and no native speaker has checked these clips
          yet.
        </>,
      ],
    },
    // One spelling, three words, and tone absent from both conditions.
    // This item is the argument of the passage it sits beside.
    { id: 'g-isi', kind: 'gloss', formId: 'tone-31' },
    {
      id: 'listen',
      kind: 'figure',
      // The most instrument-like thing on the page, and the one the
      // section is about. LLP’s second and last bleed.
      scale: 'bleed',
      does: 'play either reading',
      caption: (
        <>
          The tests as they were run: two clips per line, the same voice and model, and the exact
          string behind each. Whether the second is better is left to you.
        </>
      ),
      render: () => defer(<Pronunciation />, 'loading the recordings'),
    },
    {
      id: 'boundary',
      kind: 'figure',
      scale: 'column',
      caption: (
        <>
          And what came of it.
        </>
      ),
      render: () => <VoiceBoundary />,
    },
    {
      id: 'voice-more',
      kind: 'more',
      summary: 'How the override works',
      body: (
        <>
          <p>
          Before settling on overrides I compared voices, tested generated speech against the
            pronunciation I expected, and experimented with grapheme-to-phoneme information. The
            mechanism itself is simple: the same voice on the same model receives a different
            string for one specific phrase.
          </p>
          <p>
          The build reports on every response whether it used an override, so the product always
            knows which it did. That matters because the clips haven&rsquo;t been reviewed by a
            native speaker, and the product needs to know where its own audio is least certain.
          </p>
        </>
      ),
    },
    {
      id: 'voice-after',
      kind: 'prose',
      paras: [
        <>
          That has become one of my favorite parts of the project, because it changed the role I
          imagined AI playing in LLP. The interesting question isn&rsquo;t how much of the
          experience I can generate. It is where generation is useful, where it needs structure
          around it, and where the product needs to know not to trust it.
        </>,
      ],
    },

    /* ---- Since the web build (Oct 2026) ---------------------------
       Everything from here to 'h-end' is new, drafted for Michelle and
       pending her rewrite. The private TestFlight has NOT happened yet:
       nothing here may present tester feedback as a finding. */
    { id: 'h-app', kind: 'heading', text: 'On a phone' },
    {
      id: 'app-prose',
      kind: 'prose',
      paras: [
        <>
          In October I rebuilt Lesson 1 as an iPhone app: Chioma first, and then Ifeoma, a friend of
          hers, where this time you are the one who starts the conversation. Around it are a short
          introduction to the dot, Today, the people you&rsquo;ve met, and a Notebook of
          everything you&rsquo;ve heard and said.
        </>,
        <>
          There are no streaks and no points, which is a slightly strange choice for someone whose
          story starts with a Duolingo streak, but I want to find out whether the conversation is
          reason enough to come back. For now it runs on my own phone as a development build; a
          private TestFlight is next.
        </>,
      ],
    },
    {
      id: 'app-screens',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          The approved designs for the app: meeting the dot, Today, Lesson 1, the Notebook and
          People. They are design references rather than captures from the app, and the Igbo in them
          hasn&rsquo;t been reviewed by a native speaker.
        </>
      ),
      render: () => (
        <Phones
          screens={[
            { src: '/llp/app-meet-the-dot.webp', label: 'Meet the dot', alt: 'Onboarding screen introducing the dot: hold it to answer, tap it for help.' },
            { src: '/llp/app-today.webp', label: 'Today', alt: 'Today screen with the next lesson, Ifeoma is next, and recent Notebook entries.' },
            { src: '/llp/app-lesson1-chioma.webp', label: 'Lesson 1', alt: 'Lesson 1 in the market: Chioma speaking, with her line Kedụ? on a card above her.' },
            { src: '/llp/app-notebook.webp', label: 'Notebook', alt: 'Notebook listing phrases heard and said, each marked with how it was learned.' },
            { src: '/llp/app-people-chioma.webp', label: 'People', alt: 'Chioma’s page in People, with what you know about her and where you learned it.' },
          ]}
        />
      ),
    },
    { id: 'h-explore', kind: 'heading', text: 'Talking with Chioma' },
    {
      id: 'explore-prose',
      kind: 'prose',
      paras: [
        <>
          The newest work turns the order around again: a conversation with Chioma that becomes a
          lesson when it needs to, where she listens before she teaches and treats a tangent as an
          opening rather than an interruption.
        </>,
        <>
          The version I&rsquo;m most interested in works with headphones in and your phone in your
          pocket. Chioma can explain things out loud in English, but her Igbo only ever comes from
          the registry, and when something goes wrong, it&rsquo;s the system&rsquo;s fault, never
          the learner&rsquo;s. The dot stops being a button and simply shows whose turn it is. None
          of this is built yet; it exists as design work.
        </>,
      ],
    },
    {
      id: 'explore-call',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          Exploratory. An early round of the voice idea, when it was still framed as a call, in its
          voice and written views. A later round dropped the ringing and the timer.
        </>
      ),
      render: () => (
        <Phones
          screens={[
            { src: '/llp/explore-voice-view.webp', label: 'Voice view', alt: 'Exploratory voice view: Chioma’s portrait, a large dot while she speaks, and her line Kedụ aha gị?' },
            { src: '/llp/explore-written-view.webp', label: 'Written view', alt: 'Exploratory written view of the same moment: each Igbo line with its meaning, and what you said.' },
          ]}
        />
      ),
    },
    {
      id: 'explore-dot',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          Exploratory. The dot&rsquo;s proposed states for a spoken conversation. Next to the
          eighteen behaviors above, its job has narrowed to showing whose turn it is.
        </>
      ),
      render: () => <DotStates />,
    },

    { id: 'h-end', kind: 'heading', text: 'The part that still doesn’t work' },
    {
      id: 'end-lede',
      kind: 'lede',
      text: 'Today, LLP can speak.',
    },
    {
      id: 'end-prose',
      kind: 'prose',
      paras: [
        <>
          Chioma can take you through an encounter, the interface can teach around that
          conversation, and you can respond aloud. It is a real product that someone can open and
          use without knowing very much about how it was built.
        </>,
      ],
    },
    {
      id: 'end-lede-2',
      kind: 'lede',
      offset: true,
      text: "What it can’t reliably do yet is hear you.",
    },
    {
      id: 'end-mid',
      kind: 'prose',
      paras: [
        <>
          Speech recognition for Igbo is considerably less capable than it is for English or French,
          which is particularly inconvenient for a product that cares this much about listening and
          pronunciation.
        </>,
        <>
          So that is where I&rsquo;m working now.
        </>,
      ],
    },
    // Parting. The last thing the encounter asks a learner to say, and
    // the one the product is least able to hear.
    { id: 'g-kaodi', kind: 'gloss', formId: 'context-36' },
    // The reframing, and the strongest single idea in the section: a hard
    // model problem turned into a decision about product scope. It now sits
    // before the apparatus rather than after it, because a reader skimming
    // this section should meet the decision first and the five outcomes as
    // its evidence, not the other way round.
    {
      id: 'pull-asking',
      kind: 'pull',
      text: "The product isn’t really asking what did you say?",
    },
    {
      id: 'end-narrow',
      kind: 'prose',
      paras: [
        <>
          It&rsquo;s asking whether what you said is one of a handful of things it already knows the
          lesson could accept. A lesson knows what it is teaching, what you&rsquo;ve heard, and what
          makes sense next, which makes recognition a much more constrained problem than
          understanding arbitrary conversation.
        </>,
      ],
    },
    {
      id: 'hearing',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          Where the build has got to.
        </>
      ),
      render: () => <Hearing />,
    },
    {
      id: 'end-measure',
      kind: 'prose',
      paras: [
        <>
          That&rsquo;s also why the next step isn&rsquo;t the voice version. First I want to record
          real learners speaking Igbo and measure how well recognition actually hears them, and only
          then build one small hands-free conversation.
        </>,
      ],
    },
    {
      id: 'stages',
      kind: 'figure',
      scale: 'column',
      caption: (
        <>
          Where each part of LLP stands, from the first build to what comes next.
        </>
      ),
      render: () => <Stages />,
    },
    {
      id: 'end-after',
      kind: 'prose',
      paras: [
        <>I don’t know yet how far that will get me.</>,
        <>
          But that is also more or less the point of LLP now. It started because I wanted to learn
          Igbo and couldn’t find the same path that I had found for French. Building it has made me
          less interested in reproducing that path exactly, and more interested in what a learning
          product can become when the language, the learner, and the limitations of the technology
          are allowed to shape it.
        </>,
        <>
          I also still care about the very ordinary bar I set at the beginning, which is whether I
          would come back tomorrow, and then again the day after that. Not once because the
          interaction is interesting, but repeatedly, because I want to learn a language that
          matters to me and LLP is genuinely helping me do it.
        </>,
      ],
    },
    {
      id: 'built',
      kind: 'more',
      summary: 'How it’s built',
      body: (
        <>
          <p>
          I designed LLP and directed its build: the learning system, the registry and its rules, the
            interaction model, and the product decisions. The code was written with Claude Code,
            working under rules I set for it.
          </p>
          <p>
          The web prototype is Next.js and TypeScript, and the iPhone app is Expo and React Native,
            both running the same learning engine. Chioma&rsquo;s speech comes from ElevenLabs on{' '}
            <code>eleven_v3</code>, with two voices in the archive, Ayomide and Rho, and spellings go
            through africa-g2p 0.2.0 to get IPA before they reach the voice model. Recognition, where
            it is switched on, is ElevenLabs Scribe.
          </p>
          <p>
          What the product knows lives in spreadsheets outside the application and is extracted
            into the registries this page reads. The pronunciation diagnostic on this page was run on
            23 August 2026.
          </p>
        </>
      ),
    },
  ],
}
