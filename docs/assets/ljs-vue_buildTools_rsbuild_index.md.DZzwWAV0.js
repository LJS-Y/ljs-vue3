import{_ as s,c as a,o as n,a5 as e}from"./chunks/framework.D2w-0S4J.js";const v=JSON.parse('{"title":"ljs-vue3-rsbuild","description":"","frontmatter":{},"headers":[],"relativePath":"ljs-vue/buildTools/rsbuild/index.md","filePath":"ljs-vue/buildTools/rsbuild/index.md"}'),p={name:"ljs-vue/buildTools/rsbuild/index.md"},l=e(`<h1 id="ljs-vue3-rsbuild" tabindex="-1">ljs-vue3-rsbuild <a class="header-anchor" href="#ljs-vue3-rsbuild" aria-label="Permalink to &quot;ljs-vue3-rsbuild&quot;">​</a></h1><p>Rsbuild+Vue3构建的PC端的管理系统。</p><h2 id="项目结构" tabindex="-1">项目结构 <a class="header-anchor" href="#项目结构" aria-label="Permalink to &quot;项目结构&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── dist                           // 打包文件</span></span>
<span class="line"><span>├── public                         // 公共文件</span></span>
<span class="line"><span>│   └── config.js                  // 公共配置。可在打包后的文件中直接修改</span></span>
<span class="line"><span>├── src                            // 源代码</span></span>
<span class="line"><span>│   ├── api                        // 所有请求</span></span>
<span class="line"><span>│   ├── assets                     // 全局样式、字体、svg、全局业务的js文件等静态资源</span></span>
<span class="line"><span>│   ├── components                 // 全局公用组件</span></span>
<span class="line"><span>│   ├── router                     // 路由</span></span>
<span class="line"><span>│   ├── store                      // 全局 store管理</span></span>
<span class="line"><span>│   ├── tools                      // 全局公用方法，以及若依部分公共方法</span></span>
<span class="line"><span>│   ├── views                      // view</span></span>
<span class="line"><span>│   ├── App.vue                    // 入口页面</span></span>
<span class="line"><span>│   └── index.js                   // 入口 加载组件 初始化等</span></span>
<span class="line"><span>├── .biomelintrc-auto-import.json  // 自动构建自动生成的文件</span></span>
<span class="line"><span>├── .browserslistrc                // 兼容浏览器版本配置</span></span>
<span class="line"><span>├── .env                           // 公共环境配置</span></span>
<span class="line"><span>├── .env.development               // 开发环境配置</span></span>
<span class="line"><span>├── .env.production                // 生产环境配置</span></span>
<span class="line"><span>├── .env.test                      // 测试环境配置</span></span>
<span class="line"><span>├── .gitignore                     // git 忽略项</span></span>
<span class="line"><span>├── index.html                     // html模板</span></span>
<span class="line"><span>├── package.json                   // package.json</span></span>
<span class="line"><span>└── rsbuild.config.mjs             // rsbuild.config.mjs</span></span></code></pre></div><h2 id="技术版本" tabindex="-1">技术版本 <a class="header-anchor" href="#技术版本" aria-label="Permalink to &quot;技术版本&quot;">​</a></h2><p>前端框架版本：@rsbuild/core1+vue3+vue-router4+Element-plus2.8.5。</p><p>前端核心库版本：ljs-tools@0.5.21。</p><p>基于若依后端服务版本：V~3.8.5。</p><h2 id="去下载" tabindex="-1">去下载 <a class="header-anchor" href="#去下载" aria-label="Permalink to &quot;去下载&quot;">​</a></h2><p><a href="https://github.com/LJS-Y/ljs-vue3/tree/main/ljs-vue3-rsbuild" target="_blank" rel="noreferrer">github</a></p>`,10),i=[l];function t(o,r,c,d,u,h){return n(),a("div",null,i)}const _=s(p,[["render",t]]);export{v as __pageData,_ as default};
