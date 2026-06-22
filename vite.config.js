import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// ERYND Intelligence — Vite config. No backend; static prototype.
export default defineConfig(function (_a) {
    var command = _a.command;
    return ({
        // Served from https://<user>.github.io/erynd_ui/ on GitHub Pages.
        // Use the repo name as base for production builds; root path in dev.
        base: command === 'build' ? '/erynd_ui/' : '/',
        plugins: [react()],
        server: { port: 5173, host: true },
    });
});
