import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ERYND Intelligence — Vite config. No backend; static prototype.
export default defineConfig(({ command }) => ({
  // Relative base so assets resolve under any GitHub Pages project path
  // (e.g. /Erynd_UI/) regardless of repo-name casing. Root path in dev.
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: { port: 5173, host: true },
}));
