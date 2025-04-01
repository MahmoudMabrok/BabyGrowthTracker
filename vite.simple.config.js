import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
  server: {
    host: true,
    strictPort: true,
    port: 5000,
    cors: true,
    origin: '*',
    // Allow any host
    allowedHosts: ['localhost', '.replit.dev', '.worf.replit.dev', '.repl.co']
  }
});