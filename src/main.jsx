// File: src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Test from './test';

// Rendering Aplikasi
ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
    <React.Fragment>
        <Test/>
    </React.Fragment>
  </React.StrictMode>,
);