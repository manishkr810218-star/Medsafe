import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import { MedicineProvider } from './context/MedicineContext.jsx';
import { ToastProvider } from './components/Toast.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <MedicineProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </MedicineProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
