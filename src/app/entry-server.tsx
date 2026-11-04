import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

/** Build-time render of `/` in Russian; scripts/prerender.mjs puts it into dist/index.html. */
export const render = () =>
  renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
