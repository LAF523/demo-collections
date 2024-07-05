/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import viteEslint from 'vite-plugin-eslint';

const envDir = path.resolve(process.cwd(), './env');
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir);
  return {
    envDir,
    envPrefix: 'VITE_',
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.scss', '.css'],
      alias: {
        '@': path.resolve(__dirname, 'src') // 源文件根目录
      }
    },
    plugins: [
      react(),
      viteEslint({
        failOnError: false
      })
    ],
    css: {
      // 预处理器配置项
      preprocessorOptions: {
        less: {
          math: 'always',
          globalVars: {
            //配置全局变量
            test: '#1CC0FF'
          }
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom', //提供浏览器API以模拟浏览器环境
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html']
      }
    },
    server: {
      open: true, // 自动打开浏览器
      port: 8080, // 服务端口
      proxy: {
        '/api': {
          target: env.VITE_SERVE,
          changeOrigin: true
          // rewrite: path => path.replace(/^\/api/, '')
        }, // api代理路径
        '/mock': '' // mock代理路径,
      }
    }
  };
});
