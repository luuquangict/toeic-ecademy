import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Manage Service Worker: only active in production, unregister in development
if ('serviceWorker' in navigator) {
  const isProd = Boolean((import.meta as any).env?.PROD);
  if (isProd) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration failed:', err);
      });
    });
  } else {
    // In dev mode, unregister any active service worker to prevent caching Vite dev modules
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
