import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { store } from './store/index.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.88rem',
            background: '#0e0d0b',
            color: '#f5f2ec',
            borderRadius: '10px',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#4caf6e', secondary: '#0e0d0b' } },
          error: { iconTheme: { primary: '#c94c4c', secondary: '#0e0d0b' } },
        }}
      />
    </Provider>
  </React.StrictMode>
)
