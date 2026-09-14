/**
 * One level bus.
 *
 * The Dot pulses to whatever is speaking. That used to be the synthesiser
 * and on the homepage it is now a real recording, so the signal lives here
 * rather than inside either player.
 */
const subs = new Set<(v: number) => void>()

export function onLevel(fn: (v: number) => void): () => void {
  subs.add(fn)
  return () => {
    subs.delete(fn)
  }
}

export function pushLevel(v: number) {
  subs.forEach((s) => s(v))
}
