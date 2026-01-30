import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
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
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          // 核心分包逻辑：只判断路径，不计算大小
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // 将node_modules中的模块按"类目"分到不同桶里
              // 返回相同的字符串=装进同一个chunk文件
              if (id.includes('element-plus')) {
                return 'ui'         // UI库装一起
              }
              if (id.includes('echarts') || id.includes('chart')) {
                return 'charts'     // 图表库装一起
              }
              if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                return 'vue'        // Vue生态装一起
              }

              return 'vendor'       // 其他的全装vendor里
            }
          },
          chunkFileNames: 'static/js/[name]-[hash:8].js',
          entryFileNames: 'static/js/[name]-[hash:8].js',
          // assetFileNames: 'static/[ext]/[name]-[hash:8].[ext]',
          assetFileNames: (chunkInfo) => {
            const name = chunkInfo.names[0]
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
              return 'static/img/[name]-[hash:8][extname]'
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
              return 'static/font/[name]-[hash:8][extname]'
            }
            if (name?.endsWith('.css')) {
              return 'static/css/[name]-[hash:8][extname]'
            }
            return 'static/assets/[name]-[hash:8][extname]'
          }
        }
      }

    },
  }
})