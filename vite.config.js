import { defineConfig } from "vite";

//https://vitejs.dev/config
export default defineConfig({
  base: '/site/',
  build: {
    chunkSizeWarningLimit: 1600,
    outDir: 'dist'
  },
  assetsInclude: ['**/*.gltf'],
  publicDir: 'assets'
})