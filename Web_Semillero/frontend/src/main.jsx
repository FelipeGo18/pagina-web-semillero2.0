import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/colors.css'
import './styles/animations.css'
import './styles/globals.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
