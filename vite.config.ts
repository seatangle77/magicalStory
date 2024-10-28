import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gpt-api.hkust-gz.edu.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/v1'),
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    }
  }
})