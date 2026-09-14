import { useEffect, useState } from 'react'

export type Route = '/' | '/llp' | '/faber' | '/about'

const ROUTES: Route[] = ['/', '/llp', '/faber', '/about']

function read(): Route {
  const h = window.location.hash.replace(/^#/, '') || '/'
  return (ROUTES.includes(h as Route) ? h : '/') as Route
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(read)
  useEffect(() => {
    const on = () => {
      setRoute(read())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}

export function go(to: Route) {
  if (window.location.hash.replace(/^#/, '') === to) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  window.location.hash = to
}
