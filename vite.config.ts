import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  appType: 'spa',
  base: './',
  plugins: [react()],
  build: {
    assetsDir: 'assets',
    emptyOutDir: true,
    manifest: false,
    outDir: 'dist',
    sourcemap: false,
    ssrManifest: false,
    target: 'es2020',
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  preview: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 8080,
  },
});
