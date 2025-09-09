import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const viteEnv = loadEnv(command, process.cwd())
  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: true,
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver(),
          // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep'],
          }),
        ],
        dts: true,
      }),
      // 自动导入图标组件
      Icons({
        autoInstall: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host: true, // host设置为true才可以使用network的形式，以ip访问项目
      open: true, // 项目启动时自动打开浏览器
      cors: true, // 解决跨域问题
      proxy: {
        '/api': {
          target: viteEnv.VITE_API_BASEURL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径，将路径开头的/api替换为空字符串
        },
      },
    },
    base: './',
    build: {
      reportCompressedSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000000,
      minify: 'esbuild',
      assetsDir: 'static/assets',
      // 静态资源打包到dist下的不同目录
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  }
})