import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './authContext.jsx'
import App from './App.jsx'
import { BrowserRouter as Router  } from 'react-router-dom'
import Routes from './Routes.jsx'
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes />
      </Router>
    </AuthProvider>
  </StrictMode>
)

