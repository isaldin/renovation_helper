/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../node_modules/.vite/web',
  resolve: {
    alias: [
      { find: '@app', replacement: resolve(__dirname, './src') },
      { find: '@/common', replacement: resolve(__dirname, '../common/src/lib') },
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 4200,
    strictPort: true,
    cors: true,
    open: false,
    allowedHosts: true,
    fs: {
      allow: ['.'],
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [vue(), tsconfigPaths(), tailwindcss()],
  css: {
    postcss: './postcss.config.js',
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8',
    },
  },
}));
