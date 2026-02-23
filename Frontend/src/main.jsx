import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from '/src/UserPath/context/UserContext.jsx'  // ✅ ADDED


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>    {/* ✅ WRAP ENTIRE APP */}
      <App />
    </UserProvider>
  </React.StrictMode>,
)
