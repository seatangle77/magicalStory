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
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]', // 确保资源输出到正确位置
      },
    },
    assetsInlineLimit: 0, // 禁用小文件内联
  },
  resolve: {
    alias: {
      '@': '/src', // 添加路径别名
    }
  },
  define: {
    global: 'window', // Define `global` as `window` for browser compatibility
  },
})