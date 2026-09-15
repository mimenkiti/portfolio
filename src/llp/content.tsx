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

export const LLP_PROJECT: Project = {
  slug: 'llp',
  name: 'LLP',
  subject: 'Learning a heritage language',
  blocks: [
    {
      id: 'open',
      kind: 'lede',
      text: 'I have a 221-day streak on Duolingo.',
    },
    {
      id: 'open-prose',
      kind: 'prose',
      paras: [
        <>
          Most of it is French. I was born in France and studied French in school, so I’ve
          always known a decent amount. I have a pretty good vocabulary and can read and understand
          quite a bit, but speaking has never come as naturally to me.
        </>,
        <>
          This has always felt a little funny because my parents are both genuinely multilingual.
          My mom speaks English, French and Igbo and can understand a few other languages. My dad
          speaks English and Spanish, understands Igbo, and has some understanding of others too.
          Being able to move between languages was a real skill for them, and one that I’ve
          always admired but never really felt like I inherited.
        </>,
        <>
          Over the last few years, I’ve gotten more serious about changing that. Duolingo has
          been one way of keeping up with the French I already know and continuing to build on it,
          and I’ve also worked with a tutor to get more comfortable actually speaking.
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
          Igbo is a little different. My mom speaks it, my dad understands more than he speaks, and
          members of my extended family speak it to varying degrees, but not many people in my
          generation really do. I never learned it either. And when I started thinking seriously
          about changing that, I realized there wasn’t an obvious equivalent to the tools I
          could use for French.
        </>,
        <>
          There are books, YouTube videos, dictionaries and classes, and I’ve tried some
          combination of all of them. But learning Igbo is much harder to fold into everyday life.
          There are fewer resources, the quality varies, pronunciation is difficult to learn from
          text, and most of the language-learning products I already use simply don’t support
          it.
        </>,
        <>
          The thing I want isn’t especially ambitious. I want to understand when my family is
          speaking Igbo and eventually be able to join in without having to rehearse what I might
          say beforehand.
        </>,
        <>So I started thinking about what I would actually need in order to learn it.</>,
        <>
          The bar I kept coming back to was pretty simple: whatever I built had to be useful enough
          that I would come back tomorrow, and then again the day after that. I couldn’t just
          make a beautiful Igbo reference tool or a collection of lessons. I had to make something I
          would actually want to keep using.
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

    {
      id: 'h-first',
      kind: 'heading',
      text: 'The first version looked a lot like Duolingo',
    },
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
          deliberately from the language-learning products I was already using. At that point I
          was mostly thinking about the resource problem: if the tools that were helping me learn
          French didn’t exist for Igbo, perhaps I could make one.
        </>,
        <>
          The exercises were sound, the sequence held together, and it taught the material it set
          out to teach.
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
      // Same measure, different position on the page: the spread turns
      // without the line length moving.
      offset: true,
      paras: [
        <>
          And that started to change the question. I didn’t really want to get good at completing
          Igbo exercises. I wanted to get comfortable enough with the language to begin
          participating in it, and the more I thought about that distinction, the more I wondered
          whether I had started with the wrong unit altogether.
        </>,
        <>Maybe the lesson shouldn’t lead eventually to a conversation.</>,
        <>Maybe the conversation could be the lesson.</>,
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
          Conversation isn’t necessarily the answer. I still don’t know if it is the best format
          for every lesson, and I suspect it isn’t.
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
          The first encounter is simple. Chioma says <span className="ig">Kedụ?</span> You hear her
          say it and see the words on screen, but she doesn’t translate them for you. You can
          answer aloud or choose one of two responses.
        </>,
        <>
          I liked the market because I didn’t want the language to feel detached from the culture
          around it, and I liked the idea of Chioma as a person who could guide you through that
          world rather than simply administer exercises. Both are specific to this version of LLP.
          If I were designing the experience around another heritage language, I would expect the
          guide, environment, references, and perhaps even parts of the teaching model to change
          with it.
        </>,
      ],
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
          The build as deployed. Chioma’s speech is synthesized on request against the knowledge
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
          myself. Conversations don’t conveniently stop while you learn the vocabulary required to
          continue them.
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
          The simpler versions generally feel better. Taking out extra instructions, decisions that
          didn’t need to be made, and help that arrived all at once tended to make the conversation
          feel more like a conversation.
        </>,
        <>
          I also found myself wanting more positive reinforcement than I expected. Not points or
          streaks, just small signals that made continuing feel good.
        </>,
        <>
          That led to what I started calling the seam. If someone doesn’t understand Chioma, help
          can open over the conversation instead of taking them somewhere else. They can hear the
          phrase again, get enough context to understand what is happening, and then return to
          exactly where they were.
        </>,
        <>
          There is still a lesson underneath the encounter. I just don’t want the learner to feel
          like they’ve left the conversation every time they need help.
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
          experience and gives the product a little life. I didn’t want another character competing
          with Chioma, and I’ve always been attracted to the idea of seeing how much expression can
          come from an extremely simple form.
        </>,
        <>So I started working with a dot.</>,
        <>
          It has gone through a slightly unreasonable number of design sprints. I’ve used it as a
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
          I’m still figuring out exactly what its role should be, but it has become one of the ways
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
          As the prototype grew, I also needed a way to make sure I wasn’t designing individual
          conversations in isolation.
        </>,
        <>
          So I separated it into three questions: what the product knows, what someone should
          learn, and how the product teaches it.
        </>,
        <>
          What it knows is held as a registry rather than as copy inside a lesson. Every word and
          phrase carries where it came from and how much I trust it, which means the product can
          tell the difference between Igbo it is confident about and Igbo it is not. Anything that
          hasn’t cleared that bar can be blocked from reaching a learner at all.
        </>,
        <>
          That rule currently blocks parts of my own curriculum. The review queue still holds
          questions for native speakers that have no answers, and until they do, the material they
          cover stays where it is.
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
          because it is personal to me, but the resource problem isn’t unique to Igbo, and
          eventually I would like to see what this system looks like for other heritage languages.
          That means building enough structure to reuse what should be reusable without assuming
          that every language, culture, or learner should be treated the same way.
        </>,
        <>That boundary is something I’m still working through.</>,
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
          I don’t think a learner needs perfect pronunciation, and an accent isn’t a failure. But I
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
          phrase-specific pronunciation overrides when a general rule wasn’t enough.
        </>,
        <>
          The override itself is not complicated. If the normal written phrase produces speech that
          sounds wrong to me, I can provide a pronunciation specifically for that phrase and send
          that to the voice model instead. Same voice. Same model. Different pronunciation
          instruction.
        </>,
        <>
          The build reports whether it used one, on every response, so the product always knows
          which it did. That matters because of what is still missing here: none of these clips
          have been checked by a native speaker, my own ear is currently part of the evaluation,
          and native-speaker review is still outstanding. The goal isn’t to build a perfect
          linguistic model of Igbo; it is to know where the technology is unreliable and make that
          uncertainty explicit enough that the product can respond to it.
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
        // The prose above now explains the override and the reporting in
        // plain language, so the caption only has to say what this
        // instrument is showing.
        <>
          And what came of it. The override is applied to one line and withheld from another, and
          the response says which, both times.
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
          imagined AI playing in LLP. The interesting question isn’t how much of the experience I
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
      text: "What it can’t reliably do yet is hear you.",
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
        <>So that is where I’m working now.</>,
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
    // The reframing, and the strongest single idea in the section: a
    // hard model problem turned into a decision about product scope.
    {
      id: 'pull-asking',
      kind: 'pull',
      text: "The product isn’t really asking what did you say?",
    },
    {
      id: 'end-after',
      kind: 'prose',
      paras: [
        <>
          It’s asking whether what you said is one of a handful of things it already knows the
          lesson could accept.
        </>,
        <>
          In a lesson, the system already knows quite a lot: what it is trying to teach, what the
          learner has heard, what kinds of responses make sense, and what it needs to determine
          before moving forward. That creates a much more constrained recognition problem than
          understanding arbitrary conversation.
        </>,
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
  ],
}
