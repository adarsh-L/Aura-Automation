import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('[Aura AI] Starting dashboard application...')
console.log('[Aura AI] Environment:', import.meta.env.DEV ? 'Development' : 'Production')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
