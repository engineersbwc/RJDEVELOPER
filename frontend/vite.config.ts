import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Backend URL — production uses VITE_API_URL; local development should also set it if using proxy
  const backendUrl = env.VITE_API_URL || '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      // Dev Proxy: /api requests will forward only when VITE_API_URL is set
      proxy: backendUrl ? {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        '/auth': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      } : undefined,
    },
  };
});
