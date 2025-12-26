import { defineConfig, loadEnv } from '@rsbuild/core';
import path from 'path';

import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginSvgSpriteLoader } from "rsbuild-plugin-svg-sprite-loader";
import AutoImport from 'unplugin-auto-import/rspack';
import AutoComponents from 'unplugin-vue-components/rspack';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { DefinePlugin } from '@rspack/core';
import CompressionPlugin from 'compression-webpack-plugin'; // gzip通用压缩插件
import { getBuildTime } from './src/tools/build';

export default defineConfig(() => {
  const buildTime = getBuildTime();
  return {
    plugins: [
      pluginVue(),
      pluginSass(),
      pluginSvgSpriteLoader({
        path: path.resolve(__dirname, 'src/assets/icons/svg'),
        symbolId: '[name]',
      }),
    ],
    source: {
      define: {
        BUILD_TIME: JSON.stringify(buildTime)
      },
      // Specify the entry file
      entry: {
        index: './src/index.js',
      },
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    html: {
      template: './index.html',
      title: env.PUBLIC_PROJECT_NAME,
      favicon: './src/assets/images/logo.png'
    },
    server: {
      base: env.NODE_ENV === 'development' ? "/" : env.BASE_URL,
      compress: true,
      port: 9900,
    },
    seroutput: {
      dataUriLimitver: {
        svg: 1024 * 10,
        font: 1024 * 10,
        image: 1024 * 10,
        media: 1024 * 10,
      }
    },
    output: {
      distPath: { root: 'dist' },
      dataUriLimit: {
        svg: 1024 * 2, // 缩小 SVG 内联阈值，避免大 SVG 进 JS
        font: 1024 * 10,
        image: 1024 * 10,
        media: 1024 * 10,
      },
      sourceMap: {
        js: false,
        css: false,
      },
      // 核心：调整代码分割规则，确保路由组件独立打包
      splitChunks: {
        cacheGroups: {
          // 新增：单独拆分 Element Plus（优先级最高）
          elementPlus: {
            test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            name: 'lib-elementPlus', // 生成 lib-elementPlus.xxx.js
            priority: 30, // 高于 routes(10)/vendor(-10)
            enforce: true, // 强制拆分，无视其他规则
            chunks: 'all',
          },
          // 新增：拆分其他大体积第三方库（如 echarts/xlsx 等，按需添加）
          bigLibs: {
            test: /[\\/]node_modules[\\/](echarts|xlsx|moment)[\\/]/,
            name: 'lib-bigLibs',
            priority: 20,
            enforce: true,
          },
          // 保留原有 vendor 规则（拆分剩余依赖）
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 5,
            enforce: true,
          },
          // 路由规则（仅保留纯业务代码）
          routes: {
            test: /[\\/]src[\\/]views[\\/]/,
            // 优化：按「一级路由目录」拆分（如 views/goods/ → route-goods.js）
            name: (module) => {
              const fullPath = module.nameForCondition();
              // 匹配 src/views/[一级目录]/xxx.vue → route-[一级目录]
              const match = fullPath.match(/src\/views\/([^\/]+)/);
              const dirName = match ? match[1] : 'unknown';
              return `route-${dirName.toLowerCase()}`;
            },
            priority: 10,
            enforce: true,
            minSize: 0,
            minChunks: 1,
            reuseExistingChunk: false,
          },
          common: false, // 禁用公共代码合并
        },
      },
      // 生成独立的 chunk 文件名（包含路由名称）
      filename: {
        js: '[name].[contenthash:8].js',
        chunkFilename: '[name].[contenthash:8].js', // 异步 chunk 命名规则
      },
      // 禁用 chunk 合并（兜底）
      mergeDuplicateChunks: false,
    },
    tools: {
      rspack: {
        plugins: [
          AutoImport({
            resolvers: [
              ElementPlusResolver({
                importStyle: 'scss',
                // 新增：只导入使用的组件，禁用全量
                exclude: /^ElIcon/, // 若用了 Icon 单独处理
              }),
            ],
            imports: ['vue', 'vue-router'],
            dts: false,
            // 新增：关闭自动导入的冗余功能
            eslintrc: false,
            biomelintrc: { enabled: false },
          }),
          AutoComponents({
            dirs: ['src/components'],
            extensions: ['vue', 'jsx', 'tsx'],
            dts: false,
            resolvers: [
              ElementPlusResolver({
                importStyle: 'scss',
                // 新增：强制按需加载
                resolveIcons: true,
              }),
            ],
          }),
          new DefinePlugin({
            // 格式：'变量名' : JSON.stringify(变量值)
            '__BUILD_TIME__': JSON.stringify(buildTime),
          }),
          // 配置 Gzip 压缩（包含字体文件）
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.(js|css|svg|ttf|woff|woff2|eot|otf)$/, // 匹配字体文件
            threshold: 1024, // 仅压缩大于 1KB 的文件（小文件压缩得不偿失）
            minRatio: 0.8, // 压缩率低于 0.8 才保留（避免压缩后体积更大）
            filename: '[path][base].gz', // 输出格式：xxx.ttf.gz
          }),
        ],
      },
    },
    performance: {
      removeConsole: ['log', 'warn'], // 在生产模式构建时，是否自动移除代码中的 console.[methodName]
      removeMomentLocale: true, // 是否移除 moment.js 的语言包文件。
      printFileSize: {
        // compressed: false,
      },
      chunkSplit: {
        // split-by-experience 根据经验制定的拆分策略，自动将一些常用的 npm 包拆分为体积适中的 chunk。
        // split-by-module 按 npm 包的粒度拆分，每个 npm 包对应一个 chunk。
        // split-by-size 根据模块大小自动进行拆分。
        // all-in-one 将所有代码全部打包到一个 chunk 中。
        // single-vendor 将所有 npm 包的代码打包到一个单独的 chunk 中。
        // custom 自定义拆包配置。
        strategy: 'split-by-module',
        // minSize: 1024 * 10,
        // maxSize: 1024 * 50,
      },
    },
  }
});

// 这个配置 为了在html中使用 环境变量
const env = import.meta.env;
console.log('Node环境: ' + env.npm_config_user_agent);
console.log(
  '当前环境: ' +
    (env.PUBLIC_CURRENTMODE === 'production'
      ? '生产'
      : env.PUBLIC_CURRENTMODE === 'test'
        ? '测试服'
        : '本地开发')
);
console.log('当前环境接口: ' + env.PUBLIC_API_URL);
console.log('base', env.NODE_ENV === 'development' ? '/' : env.BASE_URL);