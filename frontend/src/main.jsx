import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { InventoryProvider } from './store/InventoryContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InventoryProvider>
      <App />
    </InventoryProvider>
  </React.StrictMode>
);