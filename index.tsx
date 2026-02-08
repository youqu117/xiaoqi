
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log("Starting application mount...");

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Application mounted successfully.");
} catch (error: any) {
  console.error("Render error:", error);
  // Remove loading state manually if error occurs
  const style = document.createElement('style');
  style.innerHTML = '#root:empty::before { display: none; }';
  document.head.appendChild(style);
  
  document.body.innerHTML = `
    <div style="color:#ff5555; padding:20px; font-family:monospace; background:rgba(0,0,0,0.9); height:100vh;">
      <h3>Start-up Error</h3>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `;
}
