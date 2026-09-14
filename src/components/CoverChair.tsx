import { useEffect, useRef, useState } from 'react'

/* ---------------------------------------------------------------
   The index's mark for Faber.

   Deliberately NOT `FaberIntroChair`. That component is the product's
   own SVG, copied path for path, and assets.tsx keeps its ink and its
   tan annotation colour everywhere it appears because a quotation
   should look like the thing it is quoting. Its stroke is #1C1A16,
   which measures about 1.1:1 on the cover's oxblood and is therefore
   invisible; recolouring it would break the quotation rule rather than
   solve anything.

   So the index draws its own mark instead: an axonometric fragment in
   `currentColor`, in the same construction language, making no claim to
   be Faber's output. Three dashed leaders extend a little further when
   the entry is engaged, which is the whole of the hover behaviour.
   --------------------------------------------------------------- */

const S = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: 1.1,
}

export function CoverChair() {
  const el = useRef<SVGSVGElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const node = el.current
    if (!node) return
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  const draw = (len: number, dur: number, delay: number) =>
    on
      ? { strokeDasharray: len, strokeDashoffset: 0, transition: `stroke-dashoffset ${dur}s ease ${delay}s` }
      : { strokeDasharray: len, strokeDashoffset: len }

  return (
    <svg
      ref={el}
      viewBox="0 0 200 150"
      className="cchair"
      role="img"
      aria-label="An axonometric fragment of a chair, drawn in construction lines"
    >
      {/* seat, in axonometric rather than in elevation */}
      <path {...S} d="M52,86 L108,62 L160,80 L104,104 Z" style={draw(230, 0.7, 0)} />

      {/* front and side legs */}
      <path {...S} d="M52,86 L52,128" style={draw(42, 0.28, 0.5)} />
      <path {...S} d="M104,104 L104,146" style={draw(42, 0.28, 0.58)} />
      <path {...S} d="M160,80 L160,122" style={draw(42, 0.28, 0.66)} />

      {/* the continuous bent rear leg and backpost, which is the one
          detail the project keeps returning to */}
      <path {...S} d="M108,62 C104,40 112,20 134,16" style={draw(88, 0.5, 0.74)} />
      <path {...S} d="M160,80 C156,56 164,34 186,30" style={draw(88, 0.5, 0.8)} />
      <path {...S} d="M134,16 L186,30" style={draw(54, 0.3, 1.15)} />

      {/* leaders. They reach further when the entry is engaged. */}
      <g className="cchair__leads" style={{ opacity: on ? 1 : 0 }}>
        <line className="cchair__lead" x1="52" y1="128" x2="30" y2="128" />
        <line className="cchair__lead" x1="160" y1="122" x2="182" y2="122" />
        {/* Reaches up out of the drawing toward the entry's title, so the
            two read as one object rather than a label with a picture
            parked under it. */}
        <line className="cchair__lead cchair__lead--up" x1="134" y1="16" x2="134" y2="-16" />
        <circle cx="108" cy="62" r="1.8" fill="currentColor" />
        <circle cx="160" cy="80" r="1.8" fill="currentColor" />
      </g>
    </svg>
  )
}
