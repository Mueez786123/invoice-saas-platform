import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <--- YEH ZAROORI HAI

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* <--- App ko iske andar lapetna padta hai */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
) 