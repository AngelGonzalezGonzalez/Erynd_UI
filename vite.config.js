import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// ERYND Intelligence — Vite config. No backend; static prototype.
export default defineConfig({
    plugins: [react()],
    server: { port: 5173, host: true },
});
