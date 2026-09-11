import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom' // ఇక్కడ BrowserRouter ఇంపోర్ట్ చేసాము

import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter> {/* App ని BrowserRouter లోపల ఉంచాలి */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)
