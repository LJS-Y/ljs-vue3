import { defineConfig, loadEnv } from '@rsbuild/core';
import path from 'path';

import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginSvgSpriteLoader } from "rsbuild-plugin-svg-sprite-loader";
import AutoImport from 'unplugin-auto-import/rspack';
import AutoComponents from 'unplugin-vue-components/rspack';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig(() => {
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
      distPath: {
        root: 'dist'
      }
    },
    tools: {
      rspack: {
        plugins: [
          AutoImport({
            resolvers: [
              ElementPlusResolver({
                importStyle: 'scss',
              }),
            ],
            dts: false,
            imports: ['vue', 'vue-router'],
            biomelintrc: {
              // 已存在文件设置默认 false，需要更新时再打开，防止每次更新都重新生成
              enabled: false,
              // 生成文件地址和名称
              filepath: './.biomelintrc-auto-import.json', // Default `./.biomelintrc-auto-import.json`
            },
          }),
          AutoComponents({
            // 自动加载组件的目录配置,默认的为 'src/components'
            dirs: ['src/components'],
            // 组件支持的文件后缀名
            extensions: ['vue', 'jsx', 'tsx'],
            dts: false,
            resolvers: [
              ElementPlusResolver({
                importStyle: 'scss',
              }),
            ],
          }),
        ],
      },
    },
    performance: {
      removeConsole: ['log', 'warn'], // 在生产模式构建时，是否自动移除代码中的 console.[methodName]
      removeMomentLocale: true, // 是否移除 moment.js 的语言包文件。
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