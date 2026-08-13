import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './gsap';
import '@/shared/i18n';
import '@/features/ab-testing';
import './styles/index.css';
import App from './App';
import { ABProvider } from '@/features/ab-testing';
import { initNeuro } from '@/shared/webgl/neuro';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ABProvider>
      <App />
    </ABProvider>
  </StrictMode>
);

initNeuro();
