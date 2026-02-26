import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './src/index.css';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

if (import.meta.env.DEV) {
  const originalInfo = console.info.bind(console);
  console.info = (...args: unknown[]) => {
    const message = args[0];
    if (typeof message === 'string' && message.includes('react.dev/link/react-devtools')) {
      return;
    }
    originalInfo(...args);
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);
