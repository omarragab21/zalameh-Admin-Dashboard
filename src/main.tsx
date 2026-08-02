import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initTerminalLogger } from './core/utils/terminalLogger'

// Initialize terminal logger to forward all console errors to editor terminal
initTerminalLogger();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
