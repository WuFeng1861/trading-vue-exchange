import path from 'path';
import {defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers';
import {visualizer} from 'rollup-plugin-visualizer';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import viteCompression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';

const pathSrc = path.resolve(__dirname, './src');

export default ({ mode }) => {
  const url = loadEnv(mode, process.cwd()).VITE_BASE_PATH;
  return project(url);
};

// https://vitejs.dev/config/
const project = (url) => defineConfig( {
  base: url,
  resolve: {
    alias: {
      '@': pathSrc,
      extensions: ['.js', '.mjs', '.vue', '.json', '.less', '.css']
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        })
      ],
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        ElementPlusResolver()
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    viteCompression({
      threshold: 10 * 1024 // 对大于 1mb 的文件进行压缩 需要更改大小可以自己进行换算
    }),
    legacy({
      targets: ['defaults', 'ie >= 11', 'chrome 52'],  //需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      modernPolyfills: true,
      // polyfills: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all',
        'es/array/virtual/flat-map'
      ]
    }),
    // 这个放最后
    visualizer(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/index.scss";`
      }
    }
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: 'static/[ext]/[name]-[hash][extname]',
        // 拆包其实有时候并不需要
        //manualChunks 两种使用形式
        manualChunks: {
          elementPlus:['element-plus'],
          echarts:['echarts'],
          dayjs:['dayjs'],
          vue:['vue'],
          vueRouter:['vue-router']
        }
        // manualChunks(id) {
        //   if (id.includes('element-plus')) {
        //     return 'element-plus';
        //   }
        // }
      }
    }
  }
});
