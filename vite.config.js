import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// Use process.env for overrides (avoid adding dotenv dependency in dev)

// Proxy target can be overridden with VITE_API_PROXY_TARGET environment variable.
// If not set, falls back to the production API host used previously.
const proxyTarget = process.env.VITE_API_PROXY_TARGET || 'https://api.dgi.gold';
console.log('Vite dev server proxy target:', proxyTarget);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
});
