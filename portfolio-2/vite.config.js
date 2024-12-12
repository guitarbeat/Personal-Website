import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{js,jsx}', // Include .js and .jsx files
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
});