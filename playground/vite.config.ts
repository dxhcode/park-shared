import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: /^@park\/theme$/,
        replacement: fileURLToPath(new URL('../packages/theme/src/index.ts', import.meta.url)),
      },
      {
        find: /^@park\/components$/,
        replacement: fileURLToPath(new URL('../packages/components/src/index.ts', import.meta.url)),
      },
      {
        find: /^@park\/mock$/,
        replacement: fileURLToPath(new URL('../packages/mock/src/index.ts', import.meta.url)),
      },
    ],
  },
  server: {
    host: true,
    port: 5173,
  },
})
