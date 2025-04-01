import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import * as themeJson from '@replit/vite-plugin-shadcn-theme-json';
import * as runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

export default defineConfig({
  plugins: [
    react(),
    themeJson.default(),
    runtimeErrorOverlay.default(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
  root: path.resolve(__dirname, "client"),
  server: {
    host: true,
    strictPort: true,
    port: 5000,
    cors: true,
    allowedHosts: ['localhost', '.replit.dev', '.worf.replit.dev', '.repl.co', 'd8a02df4-ad5c-4eca-b23d-6419e64851f7-00-5s9m2ou7gum3.worf.replit.dev']
  }
});