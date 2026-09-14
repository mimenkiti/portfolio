import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/base.css'
import './styles/dot.css'
import './styles/index.css'
import './styles/llp.css'
import './styles/artifacts.css'
import './styles/faber.css'
import './styles/read.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
