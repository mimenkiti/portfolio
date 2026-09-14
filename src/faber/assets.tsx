/* ---------------------------------------------------------------
   Real Faber drawings, reproduced from the product.

   These are the product's own SVGs, copied path for path from
   faber-five.vercel.app on 14 Sep 2026. They are not redrawn to match
   this site, and they keep Faber's ink and its tan annotation colour
   wherever they appear, because a quotation should look like the thing
   it is quoting.
   --------------------------------------------------------------- */

import { useEffect, useRef, useState } from 'react'

const INK = '#1C1A16'
const TAN = 'rgba(160,137,106,0.9)'
const TAN_L = 'rgba(160,137,106,0.5)'

/**
 * Faber's sample photographs are served from Faber. If that deployment
 * is unreachable the page says so in place of the image rather than
 * showing a broken frame, because a portfolio should not depend on
 * another site being up to make sense.
 */
export function FaberPhoto({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={['fphoto-out', className].filter(Boolean).join(' ')} role="img" aria-label={alt}>
        <p>Photograph served from faber-five.vercel.app, not reachable right now.</p>
      </div>
    )
  }
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

const L = {
  fill: 'none',
  stroke: INK,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: 0.9,
}

/**
 * Faber's home-page chair, with the annotation layer it carries in the
 * product: a seat-height datum, leaders to the steam-bent beech and the
 * mortise joint, and dots at the joints. In the product it draws itself
 * on first load; it does the same here when it comes into view.
 */
export function FaberIntroChair({ animate = true }: { animate?: boolean }) {
  const wrap = useRef<SVGSVGElement>(null)
  const [on, setOn] = useState(!animate)

  useEffect(() => {
    if (!animate) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [animate])

  const draw = (len: number, dur: number, delay: number) =>
    on
      ? {
          strokeDasharray: len,
          strokeDashoffset: 0,
          transition: `stroke-dashoffset ${dur}s ease ${delay}s`,
        }
      : { strokeDasharray: len, strokeDashoffset: len }

  return (
    <svg
      ref={wrap}
      viewBox="0 0 200 280"
      className="fchair"
      role="img"
      aria-label="Faber's line drawing of a chair, annotated with a seat height datum and two joint callouts"
    >
      <line {...L} x1="64" y1="166" x2="47" y2="268" style={draw(188, 0.55, 0)} />
      <line {...L} x1="136" y1="166" x2="153" y2="268" style={draw(188, 0.55, 0)} />
      <ellipse {...L} cx="100" cy="218" rx="46" ry="10" style={draw(178, 0.4, 0.45)} />
      <ellipse {...L} cx="100" cy="161" rx="50" ry="13" style={draw(200, 0.45, 0.55)} />
      <path
        {...L}
        d="M 46,270 C 48,245 54,195 58,166 C 60,153 62,110 68,44"
        style={draw(310, 0.75, 0.1)}
      />
      <path
        {...L}
        d="M 154,270 C 152,245 146,195 142,166 C 140,153 138,110 132,44"
        style={draw(310, 0.75, 0.1)}
      />
      <path {...L} d="M68,44 C52,14 148,14 132,44" style={draw(135, 0.35, 0.85)} />
      <path {...L} d="M70,98 Q100,84 130,98" style={draw(110, 0.3, 1.1)} />

      <g className="fchair__anno" style={{ opacity: on ? 1 : 0 }}>
        <line stroke={TAN_L} strokeDasharray="3 3" strokeWidth="0.65" x1="30" y1="161" x2="30" y2="268" />
        <line stroke={TAN_L} strokeDasharray="3 3" strokeWidth="0.65" x1="23" y1="161" x2="60" y2="161" />
        <line stroke={TAN_L} strokeDasharray="3 3" strokeWidth="0.65" x1="23" y1="268" x2="48" y2="268" />
        <text x="22" y="220" transform="rotate(-90,22,220)" className="fchair__t">
          45 cm
        </text>
        <line stroke={TAN_L} strokeDasharray="3 3" strokeWidth="0.65" x1="132" y1="44" x2="172" y2="22" />
        <circle cx="172" cy="22" r="1.6" fill={TAN} />
        <text x="176" y="18" className="fchair__t">
          steam-bent
        </text>
        <text x="176" y="27" className="fchair__t">
          beech
        </text>
        <line stroke={TAN_L} strokeDasharray="3 3" strokeWidth="0.65" x1="142" y1="163" x2="178" y2="182" />
        <circle cx="178" cy="182" r="1.6" fill={TAN} />
        <text x="182" y="179" className="fchair__t">
          mortise
        </text>
        <text x="182" y="188" className="fchair__t">
          joint
        </text>
        <circle cx="58" cy="152" r="2.3" fill={TAN} />
        <circle cx="142" cy="152" r="2.3" fill={TAN} />
        <circle cx="64" cy="174" r="2.3" fill={TAN} />
        <circle cx="136" cy="174" r="2.3" fill={TAN} />
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------
   The three drawings Faber shows when it asks how you want to build
   something. They are the product's files, unaltered.

   They are also FIXED ART: the same three chairs appear for a cabinet,
   a set of masks, or anything else. The page says so wherever it shows
   them, because the obvious reading — that Faber has drawn three
   versions of your object — is not true.
   --------------------------------------------------------------- */

const D = {
  fill: 'none',
  stroke: INK,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Curious() {
  return (
    <>
      <path {...D} strokeWidth="0.8" d="M 20,52 Q 60,48 100,52" />
      <line {...D} strokeWidth="0.8" x1="20" y1="52" x2="20" y2="56" />
      <line {...D} strokeWidth="0.8" x1="100" y1="52" x2="100" y2="56" />
      <path {...D} strokeWidth="0.8" d="M 22,52 C 18,34 20,16 28,12 C 60,8 85,10 92,14 C 98,18 98,36 96,52" />
      <line {...D} strokeWidth="0.8" x1="30" y1="56" x2="26" y2="72" />
      <line {...D} strokeWidth="0.8" x1="50" y1="56" x2="46" y2="72" />
      <line {...D} strokeWidth="0.8" x1="70" y1="56" x2="74" y2="72" />
      <line {...D} strokeWidth="0.8" x1="90" y1="56" x2="94" y2="72" />
    </>
  )
}

function Maker() {
  return (
    <>
      <path {...D} strokeWidth="0.8" d="M 22,52 C 18,34 20,16 28,12 C 60,8 85,10 92,14 C 98,18 98,36 96,52" />
      <path {...D} strokeWidth="0.5" d="M 26,52 C 22,35 24,18 31,15 C 60,11 82,13 88,17 C 93,20 93,35 92,52" />
      <path {...D} strokeWidth="0.8" d="M 20,52 Q 60,48 100,52" />
      <path {...D} strokeWidth="0.5" d="M 22,50 Q 60,46 98,50" />
      <line {...D} strokeWidth="0.8" x1="22" y1="52" x2="26" y2="52" />
      <line {...D} strokeWidth="0.8" x1="96" y1="52" x2="92" y2="52" />
      <circle {...D} strokeWidth="0.5" cx="38" cy="56" r="2" />
      <circle {...D} strokeWidth="0.5" cx="82" cy="56" r="2" />
      <circle {...D} strokeWidth="0.5" cx="60" cy="66" r="2.5" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="60" y2="58" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="68" y2="61" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="66" y2="72" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="54" y2="72" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="52" y2="61" />
    </>
  )
}

function Craftsperson() {
  const spindle = (x1: number, y1: number, x2: number, y2: number) => (
    <line {...D} strokeWidth="0.35" strokeOpacity="0.45" x1={x1} y1={y1} x2={x2} y2={y2} />
  )
  return (
    <>
      <path {...D} strokeWidth="0.8" d="M 22,52 C 18,34 20,16 28,12 C 60,8 85,10 92,14 C 98,18 98,36 96,52" />
      <path {...D} strokeWidth="0.5" d="M 26,52 C 22,35 24,18 31,15 C 60,11 82,13 88,17 C 93,20 93,35 92,52" />
      {spindle(40, 14, 38, 48)}
      {spindle(55, 12, 53, 48)}
      {spindle(70, 12, 68, 48)}
      {spindle(83, 15, 82, 48)}
      <path {...D} strokeWidth="0.8" d="M 20,52 Q 60,48 100,52" />
      <path {...D} strokeWidth="0.5" d="M 22,50 Q 60,46 98,50" />
      {spindle(30, 49, 90, 51)}
      {spindle(30, 51, 90, 53)}
      <circle {...D} strokeWidth="0.5" cx="36" cy="54" r="2" />
      <circle {...D} strokeWidth="0.5" cx="84" cy="54" r="2" />
      <circle {...D} strokeWidth="0.8" cx="60" cy="66" r="3" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="60" y2="57" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="69" y2="61" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="66" y2="72" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="54" y2="72" />
      <line {...D} strokeWidth="0.5" x1="60" y1="66" x2="51" y2="61" />
      <circle {...D} strokeWidth="0.5" cx="60" cy="57" r="1.5" />
      <circle {...D} strokeWidth="0.5" cx="69" cy="61" r="1.5" />
      <circle {...D} strokeWidth="0.5" cx="66" cy="72" r="1.5" />
      <circle {...D} strokeWidth="0.5" cx="54" cy="72" r="1.5" />
      <circle {...D} strokeWidth="0.5" cx="51" cy="61" r="1.5" />
      <line {...D} strokeWidth="0.35" strokeOpacity="0.45" strokeDasharray="2,2" x1="14" y1="12" x2="14" y2="52" />
      <line {...D} strokeWidth="0.35" strokeOpacity="0.45" x1="12" y1="12" x2="16" y2="12" />
      <line {...D} strokeWidth="0.35" strokeOpacity="0.45" x1="12" y1="52" x2="16" y2="52" />
    </>
  )
}

const DRAWINGS = { curious: Curious, maker: Maker, craftsperson: Craftsperson }

export function LevelDrawing({ level }: { level: 'curious' | 'maker' | 'craftsperson' }) {
  const Body = DRAWINGS[level]
  return (
    <svg viewBox="0 0 120 80" className="fleveldraw" aria-hidden="true">
      <Body />
    </svg>
  )
}
