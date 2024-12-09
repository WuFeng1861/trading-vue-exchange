// vite.config.js
import path from "path";
import { defineConfig, loadEnv } from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/vite@5.1.5_sass@1.71.1_terser@5.30.0/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.1.5_vue@3.4.21/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/unplugin-auto-import@0.17.5/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.21/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/unplugin-vue-components@0.26.0_vue@3.4.21/node_modules/unplugin-vue-components/dist/resolvers.js";
import { visualizer } from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/rollup-plugin-visualizer@5.12.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import IconsResolver from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/unplugin-icons@0.18.5/node_modules/unplugin-icons/dist/resolver.js";
import Icons from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/unplugin-icons@0.18.5/node_modules/unplugin-icons/dist/vite.js";
import viteCompression from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@5.1.5/node_modules/vite-plugin-compression/dist/index.mjs";
import legacy from "file:///C:/Users/WuFeng/Desktop/project/mintPool/Web/node_modules/.pnpm/@vitejs+plugin-legacy@5.3.2_terser@5.30.0_vite@5.1.5/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\WuFeng\\Desktop\\project\\mintPool\\Web";
var pathSrc = path.resolve(__vite_injected_original_dirname, "./src");
var vite_config_default = ({ mode }) => {
  const url = loadEnv(mode, process.cwd()).VITE_BASE_PATH;
  return project(url);
};
var project = (url) => defineConfig({
  base: url,
  resolve: {
    alias: {
      "@": pathSrc,
      extensions: [".js", ".mjs", ".vue", ".json", ".less", ".css"]
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"],
      resolvers: [
        ElementPlusResolver(),
        // 自动导入图标组件
        IconsResolver({
          prefix: "Icon"
        })
      ]
    }),
    Components({
      resolvers: [
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ["ep"]
        }),
        ElementPlusResolver()
      ]
    }),
    Icons({
      autoInstall: true
    }),
    viteCompression({
      threshold: 10 * 1024
      // 对大于 1mb 的文件进行压缩 需要更改大小可以自己进行换算
    }),
    legacy({
      targets: ["defaults", "ie >= 11", "chrome 52"],
      //需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
      renderLegacyChunks: true,
      modernPolyfills: true,
      // polyfills: true,
      polyfills: [
        "es.symbol",
        "es.array.filter",
        "es.promise",
        "es.promise.finally",
        "es/map",
        "es/set",
        "es.array.for-each",
        "es.object.define-properties",
        "es.object.define-property",
        "es.object.get-own-property-descriptor",
        "es.object.get-own-property-descriptors",
        "es.object.keys",
        "es.object.to-string",
        "web.dom-collections.for-each",
        "esnext.global-this",
        "esnext.string.match-all",
        "es/array/virtual/flat-map"
      ]
    }),
    // 这个放最后
    visualizer()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/index.scss";`
      }
    }
  },
  esbuild: {
    drop: ["console", "debugger"]
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash][extname]",
        // 拆包其实有时候并不需要
        //manualChunks 两种使用形式
        manualChunks: {
          elementPlus: ["element-plus"],
          echarts: ["echarts"],
          dayjs: ["dayjs"],
          vue: ["vue"],
          vueRouter: ["vue-router"]
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxXdUZlbmdcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXG1pbnRQb29sXFxcXFdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcV3VGZW5nXFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFxtaW50UG9vbFxcXFxXZWJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1d1RmVuZy9EZXNrdG9wL3Byb2plY3QvbWludFBvb2wvV2ViL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge2RlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnO1xuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSAndW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZSc7XG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJztcbmltcG9ydCB7RWxlbWVudFBsdXNSZXNvbHZlcn0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJztcbmltcG9ydCB7dmlzdWFsaXplcn0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gJ3VucGx1Z2luLWljb25zL3Jlc29sdmVyJztcbmltcG9ydCBJY29ucyBmcm9tICd1bnBsdWdpbi1pY29ucy92aXRlJztcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nO1xuaW1wb3J0IGxlZ2FjeSBmcm9tICdAdml0ZWpzL3BsdWdpbi1sZWdhY3knO1xuXG5jb25zdCBwYXRoU3JjID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyk7XG5cbmV4cG9ydCBkZWZhdWx0ICh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCB1cmwgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpLlZJVEVfQkFTRV9QQVRIO1xuICByZXR1cm4gcHJvamVjdCh1cmwpO1xufTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmNvbnN0IHByb2plY3QgPSAodXJsKSA9PiBkZWZpbmVDb25maWcoIHtcbiAgYmFzZTogdXJsLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aFNyYyxcbiAgICAgIGV4dGVuc2lvbnM6IFsnLmpzJywgJy5tanMnLCAnLnZ1ZScsICcuanNvbicsICcubGVzcycsICcuY3NzJ11cbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbJ3Z1ZSddLFxuICAgICAgcmVzb2x2ZXJzOiBbXG4gICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoKSxcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU1NkZFXHU2ODA3XHU3RUM0XHU0RUY2XG4gICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgIHByZWZpeDogJ0ljb24nLFxuICAgICAgICB9KVxuICAgICAgXSxcbiAgICB9KSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTZDRThcdTUxOENcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcbiAgICAgICAgSWNvbnNSZXNvbHZlcih7XG4gICAgICAgICAgZW5hYmxlZENvbGxlY3Rpb25zOiBbJ2VwJ10sXG4gICAgICAgIH0pLFxuICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKClcbiAgICAgIF0sXG4gICAgfSksXG4gICAgSWNvbnMoe1xuICAgICAgYXV0b0luc3RhbGw6IHRydWUsXG4gICAgfSksXG4gICAgdml0ZUNvbXByZXNzaW9uKHtcbiAgICAgIHRocmVzaG9sZDogMTAgKiAxMDI0IC8vIFx1NUJGOVx1NTkyN1x1NEU4RSAxbWIgXHU3Njg0XHU2NTg3XHU0RUY2XHU4RkRCXHU4ODRDXHU1MzhCXHU3RjI5IFx1OTcwMFx1ODk4MVx1NjZGNFx1NjUzOVx1NTkyN1x1NUMwRlx1NTNFRlx1NEVFNVx1ODFFQVx1NURGMVx1OEZEQlx1ODg0Q1x1NjM2Mlx1N0I5N1xuICAgIH0pLFxuICAgIGxlZ2FjeSh7XG4gICAgICB0YXJnZXRzOiBbJ2RlZmF1bHRzJywgJ2llID49IDExJywgJ2Nocm9tZSA1MiddLCAgLy9cdTk3MDBcdTg5ODFcdTUxN0NcdTVCQjlcdTc2ODRcdTc2RUVcdTY4MDdcdTUyMTdcdTg4NjhcdUZGMENcdTUzRUZcdTRFRTVcdThCQkVcdTdGNkVcdTU5MUFcdTRFMkFcbiAgICAgIGFkZGl0aW9uYWxMZWdhY3lQb2x5ZmlsbHM6IFsncmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lJ10sXG4gICAgICByZW5kZXJMZWdhY3lDaHVua3M6IHRydWUsXG4gICAgICBtb2Rlcm5Qb2x5ZmlsbHM6IHRydWUsXG4gICAgICAvLyBwb2x5ZmlsbHM6IHRydWUsXG4gICAgICBwb2x5ZmlsbHM6IFtcbiAgICAgICAgJ2VzLnN5bWJvbCcsXG4gICAgICAgICdlcy5hcnJheS5maWx0ZXInLFxuICAgICAgICAnZXMucHJvbWlzZScsXG4gICAgICAgICdlcy5wcm9taXNlLmZpbmFsbHknLFxuICAgICAgICAnZXMvbWFwJyxcbiAgICAgICAgJ2VzL3NldCcsXG4gICAgICAgICdlcy5hcnJheS5mb3ItZWFjaCcsXG4gICAgICAgICdlcy5vYmplY3QuZGVmaW5lLXByb3BlcnRpZXMnLFxuICAgICAgICAnZXMub2JqZWN0LmRlZmluZS1wcm9wZXJ0eScsXG4gICAgICAgICdlcy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJyxcbiAgICAgICAgJ2VzLm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzJyxcbiAgICAgICAgJ2VzLm9iamVjdC5rZXlzJyxcbiAgICAgICAgJ2VzLm9iamVjdC50by1zdHJpbmcnLFxuICAgICAgICAnd2ViLmRvbS1jb2xsZWN0aW9ucy5mb3ItZWFjaCcsXG4gICAgICAgICdlc25leHQuZ2xvYmFsLXRoaXMnLFxuICAgICAgICAnZXNuZXh0LnN0cmluZy5tYXRjaC1hbGwnLFxuICAgICAgICAnZXMvYXJyYXkvdmlydHVhbC9mbGF0LW1hcCdcbiAgICAgIF1cbiAgICB9KSxcbiAgICAvLyBcdThGRDlcdTRFMkFcdTY1M0VcdTY3MDBcdTU0MEVcbiAgICB2aXN1YWxpemVyKCksXG4gIF0sXG4gIGNzczoge1xuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcbiAgICAgIHNjc3M6IHtcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwiLi9zcmMvc3R5bGVzL2luZGV4LnNjc3NcIjtgXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBlc2J1aWxkOiB7XG4gICAgZHJvcDogW1wiY29uc29sZVwiLCBcImRlYnVnZ2VyXCJdLFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ3N0YXRpYy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdzdGF0aWMvanMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiAnc3RhdGljL1tleHRdL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nLFxuICAgICAgICAvLyBcdTYyQzZcdTUzMDVcdTUxNzZcdTVCOUVcdTY3MDlcdTY1RjZcdTUwMTlcdTVFNzZcdTRFMERcdTk3MDBcdTg5ODFcbiAgICAgICAgLy9tYW51YWxDaHVua3MgXHU0RTI0XHU3OUNEXHU0RjdGXHU3NTI4XHU1RjYyXHU1RjBGXG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIGVsZW1lbnRQbHVzOlsnZWxlbWVudC1wbHVzJ10sXG4gICAgICAgICAgZWNoYXJ0czpbJ2VjaGFydHMnXSxcbiAgICAgICAgICBkYXlqczpbJ2RheWpzJ10sXG4gICAgICAgICAgdnVlOlsndnVlJ10sXG4gICAgICAgICAgdnVlUm91dGVyOlsndnVlLXJvdXRlciddXG4gICAgICAgIH1cbiAgICAgICAgLy8gbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgIC8vICAgaWYgKGlkLmluY2x1ZGVzKCdlbGVtZW50LXBsdXMnKSkge1xuICAgICAgICAvLyAgICAgcmV0dXJuICdlbGVtZW50LXBsdXMnO1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9VLE9BQU8sVUFBVTtBQUNyVixTQUFRLGNBQWMsZUFBZTtBQUNyQyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUSwyQkFBMEI7QUFDbEMsU0FBUSxrQkFBaUI7QUFDekIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8scUJBQXFCO0FBQzVCLE9BQU8sWUFBWTtBQVZuQixJQUFNLG1DQUFtQztBQVl6QyxJQUFNLFVBQVUsS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFFL0MsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQzNCLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUMsRUFBRTtBQUN6QyxTQUFPLFFBQVEsR0FBRztBQUNwQjtBQUdBLElBQU0sVUFBVSxDQUFDLFFBQVEsYUFBYztBQUFBLEVBQ3JDLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUs7QUFBQSxNQUNMLFlBQVksQ0FBQyxPQUFPLFFBQVEsUUFBUSxTQUFTLFNBQVMsTUFBTTtBQUFBLElBQzlEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsU0FBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLFdBQVc7QUFBQSxRQUNULG9CQUFvQjtBQUFBO0FBQUEsUUFFcEIsY0FBYztBQUFBLFVBQ1osUUFBUTtBQUFBLFFBQ1YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFdBQVc7QUFBQTtBQUFBLFFBRVQsY0FBYztBQUFBLFVBQ1osb0JBQW9CLENBQUMsSUFBSTtBQUFBLFFBQzNCLENBQUM7QUFBQSxRQUNELG9CQUFvQjtBQUFBLE1BQ3RCO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsTUFDSixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsSUFDRCxnQkFBZ0I7QUFBQSxNQUNkLFdBQVcsS0FBSztBQUFBO0FBQUEsSUFDbEIsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLE1BQ0wsU0FBUyxDQUFDLFlBQVksWUFBWSxXQUFXO0FBQUE7QUFBQSxNQUM3QywyQkFBMkIsQ0FBQyw2QkFBNkI7QUFBQSxNQUN6RCxvQkFBb0I7QUFBQSxNQUNwQixpQkFBaUI7QUFBQTtBQUFBLE1BRWpCLFdBQVc7QUFBQSxRQUNUO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQTtBQUFBLElBRUQsV0FBVztBQUFBLEVBQ2I7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU0sQ0FBQyxXQUFXLFVBQVU7QUFBQSxFQUM5QjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUE7QUFBQTtBQUFBLFFBR2hCLGNBQWM7QUFBQSxVQUNaLGFBQVksQ0FBQyxjQUFjO0FBQUEsVUFDM0IsU0FBUSxDQUFDLFNBQVM7QUFBQSxVQUNsQixPQUFNLENBQUMsT0FBTztBQUFBLFVBQ2QsS0FBSSxDQUFDLEtBQUs7QUFBQSxVQUNWLFdBQVUsQ0FBQyxZQUFZO0FBQUEsUUFDekI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFNRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
