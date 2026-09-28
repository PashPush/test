import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    glsl(),
    // The HTML is prerendered, so first paint needs no JS: let CSS, fonts and the hero image
    // take the bandwidth first. Hydration follows.
    {
      name: 'low-priority-entry',
      transformIndexHtml: {
        order: 'post',
        handler: html => html.replace(/<(script type="module"|link rel="modulepreload")/g, '<$1 fetchpriority="low"'),
      },
    },
    /* visualizer({ open: true }), */
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // The build-time prerender (scripts/prerender.mjs) bundles its deps: gsap's ESM files
  // aren't loadable by Node directly.
  ssr: { noExternal: true },
  build: {
    target: 'chrome84',
    manifest: !isSsrBuild,
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild
          ? undefined
          : (id: string) => {
              if (id.includes('node_modules')) {
                if (id.includes('three')) return 'vendor_three';
                if (id.includes('gsap')) return 'vendor_gsap';
                if (id.includes('@emailjs')) return 'vendor_misc';
                return 'vendor'; // other node_modules
              }
            },
      },
    },
  },
}));
