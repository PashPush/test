import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/shared/i18n';
import './ab/init';
import './index.css';
import App from './App';
import { ABProvider } from './ab/ABContext';
import { initNeuro } from '@/shared/webgl/neuro';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ABProvider>
      <App />
    </ABProvider>
  </StrictMode>
);

initNeuro();
