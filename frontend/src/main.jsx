import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './contexts/ThemeContext'
import { EditModeProvider } from './contexts/EditModeContext'
import favicon from './assets/favicon.ico'
import './styles/globals.css'

// Set the browser tab title + favicon at runtime as well, so the site is
// correctly branded even if the deployed index.html hasn't been updated.
document.title = 'Lebeza Clinic'

let iconLink = document.querySelector("link[rel~='icon']")
if (!iconLink) {
  iconLink = document.createElement('link')
  iconLink.rel = 'icon'
  document.head.appendChild(iconLink)
}
iconLink.href = favicon

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <EditModeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </EditModeProvider>
    </ThemeProvider>
  </StrictMode>,
)
