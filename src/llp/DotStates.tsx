import { useReducedMotion } from '../lib/media'

/**
 * The dot's proposed conversation states, from the voice exploration.
 *
 * The board is animated because the motion is the point of it. It loops
 * silently and never asks for attention; under reduced motion it is the
 * still frame instead.
 */
export function DotStates() {
  const quiet = useReducedMotion()
  const poster = '/llp/explore-dot-states.webp'
  const alt =
    'Eight proposed states for the dot in a spoken conversation, including connecting, Chioma speaking, listening, you speaking, thinking and muted.'
  return (
    <div className="dotstates">
      {quiet ? (
        <img src={poster} alt={alt} loading="lazy" />
      ) : (
        <video
          src="/llp/explore-dot-states.mp4"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-label={alt}
        />
      )}
    </div>
  )
}
