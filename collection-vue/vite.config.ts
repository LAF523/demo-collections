import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import viteEslint from 'vite-plugin-eslint';
import AutoImport from 'unplugin-auto-import/vite';
import AutoComponents from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import legacyPlugin from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

const envDir = path.resolve(process.cwd(), './env');
export default defineConfig(conditionalConfig => {
  const { mode } = conditionalConfig;
  const isPro = mode === 'production';
  const env = loadEnv(mode, envDir); // 环境变量

  return {
    base: env.VITE_BASE,
    root: process.cwd(),
    envDir,
    envPrefix: 'VITE_',
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.scss', '.css'],
      alias: {
        '@': path.resolve(__dirname, 'src'), // 源文件根目录
        '@/puilic': path.resolve(__dirname, 'puilic') // 配置文件根目录
      }
    },

    css: {
      preprocessorOptions: {
        less: {
          math: 'always' // 直接写计算公式,不需要calc()
          // additionalData: '@import "./src/global.less";  ' // 或者自动将全局变量文件引入每个less文件中
        }
      }
    },
    postcss: {
      plugins: [
        // css3兼容前缀
        autoprefixer({
          overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8']
        })
      ]
    },

    plugins: [
      vue(),
      // 运行vite的时候进行eslint检查
      viteEslint({ failOnError: false }),
      // 自动引入API
      AutoImport({
        dts: 'auto-imports.d.ts', // 这里是生成的global函数文件
        imports: ['vue', 'vue-router', '@vueuse/core'], // 需要自动导入的插件
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        resolvers: [ElementPlusResolver()],
        // 解决eslint报错问题
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json', // 生成的文件路径
          globalsPropValue: true
        }
      }),
      // 自动引入组件
      AutoComponents({ resolvers: [ElementPlusResolver()] }),
      // 打包分析
      visualizer({
        open: false, // 是否打包后自动展示
        gzipSize: true,
        brotliSize: true
      }),
      // Gzip压缩,上线时需要nginx也开启gzip压缩
      viteCompression({
        filter: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, // 需要压缩的文件
        threshold: 1024, // 文件容量大于这个值进行压缩
        algorithm: 'gzip', // 压缩方式
        ext: 'gz', // 后缀名
        deleteOriginFile: false // 压缩后是否删除压缩源文件
      }),
      // 兼容
      legacyPlugin({
        targets: ['chrome 52'], // 需要兼容的目标列表，可以设置多个
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // 面向IE11时需要此插件
      }),
      // 本地svg处理
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式,svg-icon组件中name的前缀对应
        symbolId: 'icon-[name]'
      })
    ],
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash:10].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash:10].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash:10].[ext]', // 资源文件像 字体，图片等
          manualChunks(id: string) {
            const isNodeModule = id.includes('node_modules');
            const isVue = /[\\/]node_modules[\\/]vue[\\/]/.test(id);
            const isElePlus = /[\\/]node_modules[\\/]element-plus[\\/]/.test(id);
            const isPinia = /[\\/]node_modules[\\/]pinia[\\/]/.test(id);
            const isVueRouter = /[\\/]node_modules[\\/]vue-router[\\/]/.test(id);

            if (isVue || isElePlus || isPinia || isVueRouter) {
              return 'common';
            }

            if (isNodeModule) {
              return 'vendor';
            }
          }
        }
      }
    },

    server: {
      open: true, // 自动打开浏览器
      port: 3000, // 服务端口
      hmr: true,
      proxy: {
        '/api': {
          target: env.VITE_SERVE,
          changeOrigin: true
        }, // api代理路径
        '/mock': '' // mock代理路径,
      }
    }
  };
});
