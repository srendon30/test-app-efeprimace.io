import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  // server: {
  //   host: true,          
  //   watch: {
  //     usePolling: true,
  //     interval: 100  
  //   }
  // },
  server:{
    proxy: {
      '/api': {
        target: 'http://localhost:8000', 
        changeOrigin: true, 
        secure: false, 
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './',
  build: {
    outDir: 'docs',
  },
  cacheDir: false,
})