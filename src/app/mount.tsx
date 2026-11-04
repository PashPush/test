import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './gsap';
import '@/shared/i18n';
import { isDefaultVariant } from '@/features/ab-testing';
import App from './App';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The build prerenders the default (control) variant; any other A/B variant renders fresh.
// The dev server serves an empty #root.
if (root.firstElementChild && isDefaultVariant) hydrateRoot(root, app);
else createRoot(root).render(app);
