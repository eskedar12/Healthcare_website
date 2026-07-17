import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { EditModeProvider } from './contexts/EditModeContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <EditModeProvider>
        <App />
      </EditModeProvider>
    </BrowserRouter>
  </StrictMode>,
)