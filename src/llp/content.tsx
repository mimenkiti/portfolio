import { lazy, Suspense, type ReactNode } from 'react'
import { Approaches } from './Approaches'
import { ContactSheet } from './ContactSheet'
import { Hearing } from './Hearing'
import { VoiceBoundary } from './VoiceBoundary'
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
 * The prose is Michelle's, verbatim, in her order. Nothing here is
 * paraphrased, compressed, or rearranged into a case study, and no
 * finding, metric or user appears that is not in the writing or in the
 * artifacts themselves.
 *
 * Headings are set quietly on purpose. The rhythm is meant to come from
 * what the artifacts do and how much room they take, not from a run of
 * titles announcing sections.
 */
const LIVE = 'https://llp-build-01.vercel.app'

export const LLP_PROJECT: Project = {
  slug: 'llp',
  name: 'LLP',
  subject: 'Learning a heritage language',
  blocks: [
    {
      id: 'open',
      kind: 'lede',
      text: 'LLP started, somewhat indirectly, with French.',
    },
    {
      id: 'open-prose',
      kind: 'prose',
      paras: [
        <>
          I had built up a fairly serious Duolingo streak and was meeting with a French tutor
          twice a week, and for the first time I felt pretty confident that if I kept going, I
          could actually become good at it. I wasn't starting from nothing. I had studied French
          in school and had been exposed to it in one way or another for most of my life, but I
          also had something I hadn't really had before: the time, money, and consistency to take
          learning it seriously.
        </>,
        <>
          There was something reassuring about realizing that. Learning another language had
          always felt like one of those things I would like to do eventually, and suddenly it felt
          much more mechanical: find good resources, spend enough time with them, keep going.
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
          I've wanted to learn Igbo for a long time, but what I want from it is a little
          different. I want to be able to sit with family and comfortably understand what people
          are saying, and to respond without having to rehearse the sentence in my head first. I
          want to read it, and I care about pronunciation, although I'm perfectly comfortable
          sounding like someone who didn't grow up speaking it. I don't need to write a technical
          paper in Igbo.
        </>,
        <>
          More than anything, I don't like the idea that I could be part of the reason the
          language eventually disappears from my own family. Language loss is obviously much
          larger and more complicated than one person learning to speak, but there is something
          strange about knowing a language belonged to your grandparents and your parents, and
          imagining that a few generations later it simply might not.
        </>,
        <>
          There was another reason I kept coming back to the idea. If I was going to spend this
          much time building something outside of work, I wanted it to address a need I believed
          was real. I wasn't particularly interested in making something that worked well once in
          a demo. Language learning is repetitive by nature; if LLP worked, it would have to be
          useful enough for someone to come back tomorrow, and then again the day after that. I
          liked the difficulty of that.
        </>,
        <>So I started looking seriously at what was available.</>,
        <>
          The contrast with French was difficult to miss. French has an enormous learning
          ecosystem: applications, tutors, textbooks, courses, television, podcasts, dictionaries,
          decades of curriculum. Igbo has resources too, and people doing thoughtful work to teach
          it, but there is simply much less to choose from and much less connecting those
          resources together. The more I looked, the more I realized that this wasn't particularly
          unique to Igbo. There are many languages with millions of people connected to them and
          relatively few tools designed to help those people learn.
        </>,
      ],
    },
    // Already the closing one-sentence paragraph of the block above.
    // Promoted, not rewritten and not duplicated: it is the hinge into
    // the next section, so the sentence carries the section change
    // rather than the small heading having to.
    {
      id: 'pull-instinct',
      kind: 'pull',
      text: 'My first instinct was a fairly obvious one: build the thing I wished existed.',
    },

    {
      id: 'h-first',
      kind: 'heading',
      text: 'The first version looked a lot like Duolingo',
    },
    {
      id: 'first-lede',
      kind: 'lede',
      text: 'And it was actually pretty good.',
    },
    {
      id: 'first-prose',
      kind: 'prose',
      paras: [
        <>
          I built a working prototype around structured lessons and exercises, borrowing quite
          deliberately from the language-learning products I was already using. At that point I
          was mostly thinking about the resource problem: if the tools that were helping me learn
          French didn't exist for Igbo, perhaps I could make one.
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
          The lesson engine as it was: twelve exercises, a combo counter, hearts. It still runs,
          and it is left the way it was rather than restyled to match this page, because the
          distance between it and the current build is most of the story.
        </>
      ),
    },
    {
      id: 'first-after',
      kind: 'prose',
      // Same measure, different position on the page: the spread turns
      // without the line length moving.
      offset: true,
      paras: [
        <>
          But the longer I worked on it, the more I became interested in a different part of the
          problem. I wasn't only learning Igbo with fewer resources; I was learning it for a
          different reason.
        </>,
        <>
          With French, becoming broadly proficient felt like a reasonable goal in itself. With
          Igbo, the situations I imagined were much more specific and much more human. Someone in
          my family says something to me and I understand it. I can answer. I can follow a
          conversation without waiting for someone to translate it for me. Reading, vocabulary,
          grammar and pronunciation all matter, but mostly because they help make those moments
          possible.
        </>,
        <>
          That distinction started to change what I was building. Instead of asking only how to
          make a good Igbo course, I started asking what someone actually needs in order to begin
          participating in a language.
        </>,
      ],
    },
    {
      id: 'sheet',
      kind: 'figure',
      // A sheet of five documents wants to be read as a sheet, so it
      // takes the viewport. One of LLP's two bleeds.
      scale: 'bleed',
      // Her own sentence, moved rather than reworded: the caption
      // already said "Each one opens", and instructions now live on the
      // live mark, which is the one place a visitor looks for them.
      does: 'Each one opens.',
      caption: (
        <>
          Some of what that took: what the product should feel like, what makes someone open a
          learning app on the hundred and ninetieth day, and where a lesson should sit relative to
          a conversation.
        </>
      ),
      render: () => <ContactSheet />,
    },

    {
      id: 'h-conv',
      kind: 'heading',
      text: 'I started experimenting with conversation',
    },
    {
      id: 'conv-prose',
      kind: 'prose',
      paras: [
        <>
          Conversation isn't necessarily the answer. I still don't know if it is the best format
          for every lesson, and I suspect it isn't.
        </>,
        <>
          But it felt like an interesting place to start, particularly for early lessons, because
          it puts the learner inside something recognizable almost immediately. There is another
          person, they have said something to you, and you need to figure out enough to respond.
        </>,
        <>
          The current prototype begins in a market, where you meet a guide named Chioma. She
          speaks to you in Igbo and the lesson unfolds around that interaction.
        </>,
        <>
          I liked the market because I didn't want the language to feel detached from the culture
          around it, and I liked the idea of Chioma as a person who could guide you through that
          world rather than simply administer exercises. Both are specific to this version of LLP.
          If I were designing the experience around another heritage language, I would expect the
          guide, environment, references, and perhaps even parts of the teaching model to change
          with it.
        </>,
      ],
    },
    // Her opening line in the deployed build, and the diagnostic's
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
          The build as deployed. Chioma's speech is synthesized on request against the knowledge
          registry, teaching opens over the scene without ending it, and the microphone is real.
          Nothing here is a recording of the product; it is the product.
        </>
      ),
    },
    {
      id: 'conv-after',
      kind: 'prose',
      paras: [
        <>
          Once I put the learner into a conversation, though, I created another problem for
          myself: conversations don't conveniently stop whenever someone needs a lesson.
        </>,
        <>
          A learner might understand immediately, understand part of what was said, or have no
          idea at all. I experimented with versions that taught more before asking someone to
          respond, versions that let them struggle first, and versions that tried to keep almost
          everything inside the encounter. I also spent a surprising amount of time on smaller
          questions: when a hint should appear, whether it should persist, how quickly the
          interface should react, what should happen after a wrong answer.
        </>,
      ],
    },
    // Welcome. The phrase the market scene is built around. Glosses go
    // immediately after a reading-column block so grid auto-placement
    // seats them in that block's row rather than in a band of their own.
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
          The simpler versions generally feel better. Positive reinforcement matters more than I
          expected. And when someone does need more help, I don't want that help to feel like they
          have left the experience and entered a lesson.
        </>,
        <>
          That led to what I started calling the seam: a place where the learner can move
          temporarily into more explicit teaching and then return to the conversation they were
          already having. The lesson still has structure underneath it, but it can respond when
          the learner needs something different.
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
          Three of those experiments, still running. None of them is a finished answer, and the
          labs were built to disagree with each other.
        </>
      ),
      render: () => <Approaches />,
    },

    { id: 'h-dot', kind: 'heading', text: 'The dot' },
    {
      id: 'dot-prose',
      kind: 'prose',
      paras: [
        <>At some point in all of this, I became slightly obsessed with a dot.</>,
        <>
          I had been thinking about the role that characters like Duo play in learning products,
          not necessarily as teachers, but as something persistent that follows you through the
          experience and gives the product a little life. I didn't want another character competing
          with Chioma, and I've always been attracted to the idea of seeing how much expression can
          come from an extremely simple form.
        </>,
        <>So I started working with a dot.</>,
        <>
          It has gone through a slightly unreasonable number of design sprints. I've used it as a
          guide, a source of encouragement, an entry point into help, a control, and sometimes
          simply a reaction. Because there is so little there visually, very small changes in
          movement, timing and position can make it feel completely different.
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
          Tap asks the system for something. Hold means it is listening to you. Drag only works
          when the dot is attached to something. The lab keeps its own critique of each behavior
          beside it, including this one, on what all of that costs:{' '}
          <em>
            Everything here is a gesture on one small target. Hold needs a tap-to-start/tap-to-stop
            alternative, drag needs stepped buttons, and motion must respect reduce-motion.
            Conventional fallbacks are not optional.
          </em>
        </>
      ),
    },
    {
      id: 'dot-after',
      kind: 'prose',
      paras: [
        <>
          I'm still figuring out exactly what its role should be, but it has become one of the ways
          I think about the broader interface: something can be useful without constantly asking
          for attention.
        </>,
      ],
    },

    {
      id: 'h-under',
      kind: 'heading',
      text: 'Building what sits underneath the encounter',
    },
    {
      id: 'under-prose',
      kind: 'prose',
      paras: [
        <>
          As the prototype grew, I also needed a way to make sure I wasn't designing individual
          conversations in isolation.
        </>,
        <>I started separating the system into three layers: knowledge, curriculum, and teaching.</>,
        <>
          The knowledge layer is concerned with what we actually know about the language, words,
          phrases, meanings, pronunciation, sources, and whether that information is trustworthy.
          Curriculum takes that material and organizes it around what someone should learn and in
          what sequence. Teaching is the final layer: given what we want someone to learn, how
          should we actually teach it to this person in this moment?
        </>,
      ],
    },
    // IGB-KNW-016. The registry holds this one as a template rather
    // than a finished line, which is the section's whole subject.
    { id: 'g-aha', kind: 'gloss', formId: 'context-35' },
    {
      id: 'inspector',
      kind: 'figure',
      scale: 'wide',
      does: 'follow any phrase through',
      caption: (
        <>
          One phrase, traced from the source it came from to the moment a learner meets it. Every
          value is a cell from the registries, including the ones saying this is not ready.
        </>
      ),
      render: () => defer(<Inspector />, 'loading the registries'),
    },
    {
      id: 'under-after',
      kind: 'prose',
      // Same measure, different position on the page: the spread turns
      // without the line length moving.
      offset: true,
      paras: [
        <>
          The separation is partly practical. I want to be able to improve what LLP knows without
          redesigning every lesson, and I want to experiment with how something is taught without
          changing the underlying language material.
        </>,
        <>
          But it also comes from the longer-term ambition for the project. I started with Igbo
          because it is personal to me, but the resource problem isn't unique to Igbo, and
          eventually I would like to see what this system looks like for other heritage languages.
          That means building enough structure to reuse what should be reusable without assuming
          that every language, culture, or learner should be treated the same way.
        </>,
        <>That boundary is something I'm still working through.</>,
      ],
    },

    {
      id: 'h-voice',
      kind: 'heading',
      text: 'When the technology doesn’t know the language as well as it needs to',
    },
    {
      id: 'voice-prose',
      kind: 'prose',
      paras: [
        <>One of the more interesting constraints appeared when I gave Chioma a voice.</>,
        <>
          Modern text-to-speech tools make it relatively easy to give a character speech, but
          producing audio and producing audio I was comfortable asking someone to learn from turned
          out to be different problems.
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
          I don't think a learner needs perfect pronunciation, and an accent isn't a failure. But I
          do think the standard changes when the product is the teacher. If LLP is asking someone
          to listen and repeat, I need to be reasonably confident that what they are hearing is
          something they should actually learn.
        </>,
        <>
          So I stopped treating pronunciation as something the voice model would simply handle for
          me and started treating it as its own layer of the product.
        </>,
        <>
          I compared voices, tested generated speech against the pronunciation I expected,
          experimented with grapheme-to-phoneme information, and eventually built support for
          phrase-specific pronunciation overrides when a general rule wasn't enough. The goal isn't
          to build a perfect linguistic model of Igbo; it is to know where the technology is
          unreliable and make that uncertainty explicit enough that the product can respond to it.
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
      // section is about. LLP's second and last bleed.
      scale: 'bleed',
      does: 'play either reading',
      caption: (
        <>
          The tests, as they were run. Two clips per line, the same voice and model in each, and
          the exact string that produced them. Whether the second is better is the judgment the
          work was trying to make, and it is left to you.
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
          And what came of it. The override is applied to one line, withheld from another, and
          reported either way, so the product can never quietly stop being sure.
        </>
      ),
      render: () => <VoiceBoundary />,
    },
    {
      id: 'voice-after',
      kind: 'prose',
      paras: [
        <>
          That has become one of my favorite parts of the project, because it changed the role I
          imagined AI playing in LLP. The interesting question isn't how much of the experience I
          can generate. It is where generation is useful, where it needs structure around it, and
          where the product needs to know not to trust it.
        </>,
      ],
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
      text: "What it can't reliably do yet is hear you.",
    },
    {
      id: 'end-mid',
      kind: 'prose',
      paras: [
        <>
          Speech recognition for Igbo is considerably less capable than it is for languages like
          English or French, which is particularly inconvenient for a product where I care so much
          about listening and pronunciation.
        </>,
        <>So that is where I'm working now.</>,
      ],
    },
    // Parting. The last thing the encounter asks a learner to say, and
    // the one the product is least able to hear.
    { id: 'g-kaodi', kind: 'gloss', formId: 'context-36' },
    {
      id: 'hearing',
      kind: 'figure',
      scale: 'wide',
      caption: (
        <>
          Where the build has got to. It can tell these five outcomes apart, and one of them is an
          admission that it does not know, which is the one that had to exist.
        </>
      ),
      render: () => <Hearing />,
    },
    {
      id: 'end-after',
      kind: 'prose',
      paras: [
        <>
          I'm interested in whether LLP actually needs to understand unrestricted Igbo speech in
          order to teach effectively. In a lesson, the system already knows quite a lot: what it is
          trying to teach, what the learner has heard, what kinds of responses make sense, and what
          it needs to determine before moving forward. That creates a much more constrained
          recognition problem than understanding arbitrary conversation.
        </>,
        <>I don't know yet how far that will get me.</>,
        <>
          But that is also more or less the point of LLP now. It started because I wanted to learn
          Igbo and couldn't find the same path that I had found for French. Building it has made me
          less interested in reproducing that path exactly, and more interested in what a learning
          product can become when the language, the learner, and the limitations of the technology
          are allowed to shape it.
        </>,
        <>
          I also still care about the very ordinary test that made me want to build it in the first
          place: whether this can become something people actually use. Not once because the
          interaction is interesting, but repeatedly, because they want to learn a language that
          matters to them and LLP is genuinely helping them do it.
        </>,
      ],
    },
  ],
}
