import { useCallback, useEffect, useRef } from 'react'
import { Marker } from './components/Marker'
import { useRoute } from './lib/router'
import { useWorld } from './lib/theme'
import { useMode } from './project/useMode'
import { ModeSwitch } from './project/ModeSwitch'
import { Index } from './pages/Index'
import { LLP } from './pages/LLP'
import { Faber } from './pages/Faber'
import { About } from './pages/About'

const TITLES: Record<string, string> = {
  '/llp': 'LLP',
  '/faber': 'Faber',
  '/about': 'About',
}

export default function App() {
  const route = useRoute()
  const shift = useRef<HTMLDivElement>(null)
  const { mode, morphing, switchTo } = useMode()

  useWorld(route)

  // One ground plate for the whole site. Every threshold writes to it, so
  // page-to-room is a single continuous value rather than per-page effects.
  const setGround = useCallback((v: number) => {
    if (shift.current) shift.current.style.opacity = v.toFixed(3)
    document.documentElement.classList.toggle('is-dark-ground', v > 0.5)
  }, [])

  useEffect(() => {
    setGround(0)
  }, [route, setGround])

  return (
    <>
      <div className="ground-shift" ref={shift} aria-hidden="true" />
      <div className={['above-shift', morphing ? 'is-morphing' : ''].join(' ')}>
        {route !== '/' && <Marker route={route} title={TITLES[route]} />}
        {(route === '/llp' || route === '/faber') && (
          <div className="topright">
            <ModeSwitch mode={mode} onSwitch={switchTo} />
          </div>
        )}
        <main key={route}>
          {route === '/' && <Index setGround={setGround} />}
          {route === '/llp' && <LLP mode={mode} setGround={setGround} />}
          {route === '/faber' && <Faber mode={mode} setGround={setGround} />}
          {route === '/about' && <About />}
        </main>
      </div>
    </>
  )
}
