import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: '/frontend-study/',
  plugins: [
    react(),
    {
      name: 'copy-404',
      generateBundle() {
        const source = path.resolve(__dirname, 'public/404.html');
        if (fs.existsSync(source)) {
          const content = fs.readFileSync(source, 'utf-8');
          this.emitFile({
            fileName: '404.html',
            type: 'asset',
            source: content
          });
        }
      }
    }
  ],
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
