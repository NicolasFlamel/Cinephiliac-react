import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cinephiliac-react/',
  plugins: [
    react(),
    viteTsconfigPaths(),
    checker({
      typescript: {
        tsconfigPath: 'tsconfig.app.json',
      },
      eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
      overlay: true,
    }),
  ],
  server: {
    port: 3000,
  },
});
