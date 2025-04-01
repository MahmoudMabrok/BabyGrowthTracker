import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
  ],
  base: "./", // Sets base path as relative
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./assets"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    fs: {
      allow: ['.'],
    },
    hmr: {
      host: 'localhost',
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
});