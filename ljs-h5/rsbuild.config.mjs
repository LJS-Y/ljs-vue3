import { defineConfig, loadEnv } from '@rsbuild/core';
import path from 'path';

import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginSvgSprite } from 'rspack-plugin-svg-sprite/rsbuild';
import AutoImport from 'unplugin-auto-import/rspack';
import AutoComponents from 'unplugin-vue-components/rspack';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { pluginCompression } from 'rsbuild-plugin-compression';
import { getBuildTime } from './src/tools/build';

export default defineConfig(async ({ mode }) => {
  // loadEnv 返回 { parsed, filePaths, rawPublicVars, publicVars, cleanup }
  // 注意:参数是 cwd 不是 envDir(envDir 是 Vite 的写法,Rsbuild 会忽略)
  const { parsed: env } = loadEnv({
    mode,
    cwd: path.resolve(__dirname),
  });
  const buildTime = getBuildTime();

  console.log('Node环境: ' + process.env.npm_config_user_agent);
  console.log(
    '当前环境: ' +
      (env.PUBLIC_CURRENTMODE === 'production'
        ? '生产'
        : env.PUBLIC_CURRENTMODE === 'test'
        ? '测试服'
        : '本地开发')
  );
  console.log('当前环境接口: ' + env.PUBLIC_API_URL);
  const baseUrl = process.env.NODE_ENV === 'development' ? '/' : env.BASE_URL;
  console.log('base', baseUrl);

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      pluginVue(),
      pluginSass(),
      pluginSvgSprite({
        path: path.resolve(__dirname, 'src/assets/icons/svg'),
        symbolId: '[name]',
      }),
      pluginCompression({
        // 0.1.x 新版 API:algorithms 数组同时输出多种压缩格式,nginx 可协商选择
        algorithms: ['gzip', 'brotli'],
        include: /\.(js|mjs|cjs|css|html|svg|ttf|woff|woff2|eot|otf)$/i,
        threshold: 1024, // 小于 1KB 不压缩,节省构建时间
        concurrency: 4,
      }),
    ],
    source: {
      entry: {
        index: './src/index.js',
      },
      // v2 标准全局变量定义，不再用DefinePlugin
      define: {
        BUILD_TIME: JSON.stringify(buildTime),
        __BUILD_TIME__: JSON.stringify(buildTime),
      },
    },
    html: {
      template: './index.html',
      title: env.PUBLIC_PROJECT_NAME,
      favicon: './src/assets/images/logo.png',
      // html模板可以直接使用环境变量
      templateParameters: {
        ...env,
      },
    },
    server: {
      host: 'localhost',
      port: 9990,
      // server.base 决定 import.meta.env.BASE_URL / process.env.BASE_URL 的值
      // 同时自动作为 dev.assetPrefix 和 output.assetPrefix 的默认值
      base: baseUrl,
    },
    output: {
      // 资源分类目录,有利于浏览器缓存与 nginx 缓存策略
      distPath: {
        root: 'dist',
        js: 'static/js',
        css: 'static/css',
        svg: 'static/svg',
        image: 'static/images',
        font: 'static/fonts',
        media: 'static/media',
      },
      // svg 已通过 svg-sprite 处理,不再 inline;图片/字体 4KB 以下 inline
      dataUriLimit: {
        svg: 0,
        font: 1024 * 4,
        image: 1024 * 4,
        media: 1024 * 4,
      },
      sourceMap: {
        js: false,
        css: false,
      },
      splitChunks: {
        // 全局阈值:模块至少 20KB 才单独成包,避免微小 chunk 增加首屏 HTTP 请求
        minSize: 20 * 1024,
        // maxAsyncSize: 200 * 1024, // 单个异步 chunk 上限,过大时再拆(可选)
        cacheGroups: {
          // Element Plus 单独分包(变更频率低,长期缓存)
          elementPlus: {
            test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            name: 'lib-elementPlus',
            priority: 30,
            enforce: true,
            chunks: 'all',
          },
          // 大库单独分包(echarts/xlsx/moment 体积大,按需加载)
          bigLibs: {
            test: /[\\/]node_modules[\\/](echarts|xlsx|moment)[\\/]/,
            name: 'lib-bigLibs',
            priority: 20,
            enforce: true,
          },
          // 业务公共代码:被 2 个以上 chunk 共享且 ≥20KB 才提取
          common: {
            test: /[\\/]src[\\/]/,
            name: 'common',
            minChunks: 2,
            minSize: 20 * 1024,
            priority: 10,
            enforce: true,
            chunks: 'all',
          },
          // 其他三方依赖
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 5,
            enforce: true,
          },
        },
      },
      filename: {
        // 异步 chunk 命名同样取此模板（rsbuild 内部派生），chunkFilename 非 1.x 生效键
        js: '[name].[contenthash:8].js',
      },
      // 合并重复 chunk,消除冗余代码
      mergeDuplicateChunks: true,
    },
    tools: {
      rspack: {
        // 稳定 moduleIds/chunkIds,长期缓存友好(内容不变则 hash 不变)
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
        plugins: [
          AutoImport({
            resolvers: [
              ElementPlusResolver({
                importStyle: 'scss',
                exclude: /^ElIcon/,
              }),
            ],
            imports: ['vue', 'vue-router'],
            dts: false,
            eslintrc: false,
          }),
          AutoComponents({
            dirs: ['src/components'],
            extensions: ['vue', 'jsx', 'tsx'],
            dts: false,
            resolvers: [
              ElementPlusResolver({
                importStyle: 'scss',
                resolveIcons: true,
              }),
            ],
          }),
        ],
      },
    },
    performance: {
      // 更彻底去除 console,保留 error 用于排查线上问题
      removeConsole: ['log', 'warn', 'info'],
      removeMomentLocale: true,
      printFileSize: {},
      // 关闭内置自动分包,完全使用你自定义 splitChunks
      chunkSplit: {
        strategy: 'custom',
      },
    },
  };
});