import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/frontend-study/',
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'questions-data': ['./src/questions-data.json']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
