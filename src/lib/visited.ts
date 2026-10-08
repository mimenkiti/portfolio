import type { RoomId } from '../gallery/rooms'

/* ---------------------------------------------------------------
   Which rooms this visitor has walked into.

   Session storage, not local storage: the mark is a record of this
   visit and nothing more, so it is gone the next time the site is
   opened. Nothing is counted, scored or completed, and the Gallery is
   the only thing that reads it.

   Every access is guarded. Storage throws outright in a few contexts
   (a blocked third-party frame, Safari's private mode on older
   versions), and a floor mark is not worth a blank page.
   --------------------------------------------------------------- */

const KEY = 'mm.rooms.visited'

export function visitedRooms(): Set<RoomId> {
  try {
    const raw = window.sessionStorage.getItem(KEY)
    if (!raw) return new Set()
    const ids = JSON.parse(raw)
    return Array.isArray(ids) ? new Set(ids as RoomId[]) : new Set()
  } catch {
    return new Set()
  }
}

export function rememberRoom(id: RoomId) {
  try {
    const next = visitedRooms()
    if (next.has(id)) return
    next.add(id)
    window.sessionStorage.setItem(KEY, JSON.stringify([...next]))
  } catch {
    /* No mark this session. Nothing else depends on it. */
  }
}
