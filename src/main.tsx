import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n';
import './ab/init';
import './index.css';
import App from './App.tsx';
import { ABProvider } from './ab/ABContext.tsx';
import { initNeuro } from './neuro';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ABProvider>
      <App />
    </ABProvider>
  </StrictMode>
);

initNeuro();
