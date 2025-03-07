import{_ as s,c as a,o as n,a5 as p}from"./chunks/framework.D2w-0S4J.js";const _=JSON.parse('{"title":"ljs-uniapp","description":"","frontmatter":{},"headers":[],"relativePath":"ljs-vue/buildTools/uniapp/index.md","filePath":"ljs-vue/buildTools/uniapp/index.md"}'),e={name:"ljs-vue/buildTools/uniapp/index.md"},l=p(`<h1 id="ljs-uniapp" tabindex="-1">ljs-uniapp <a class="header-anchor" href="#ljs-uniapp" aria-label="Permalink to &quot;ljs-uniapp&quot;">​</a></h1><p>Uniapp+Vue2构建的移动端的框架（可快速开发：安卓，移动端H5，微信小程序）。</p><h2 id="项目结构" tabindex="-1">项目结构 <a class="header-anchor" href="#项目结构" aria-label="Permalink to &quot;项目结构&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── assets                     // 静态资源（样式文件，字体文件等）</span></span>
<span class="line"><span>├── components                 // 自定义公用组件</span></span>
<span class="line"><span>├── node_modules               // 插件</span></span>
<span class="line"><span>├── pages                      // 页面</span></span>
<span class="line"><span>├── request                    // 请求</span></span>
<span class="line"><span>│   ├── config.js              // 请求配置</span></span>
<span class="line"><span>│   └── index.js               // 全局请求，配置在此可通过this.$API.common.getInfo()调用请求</span></span>
<span class="line"><span>├── router                     // 路由守卫</span></span>
<span class="line"><span>├── static                     // 静态资源（图片）</span></span>
<span class="line"><span>├── store                      // vuex</span></span>
<span class="line"><span>│   └── modules               </span></span>
<span class="line"><span>│       └── permission.js      // 可动态处理底部菜单</span></span>
<span class="line"><span>├── tools                      // 工具</span></span>
<span class="line"><span>│   ├── base.js</span></span>
<span class="line"><span>│   ├── menu.js                // 可手动配置菜单</span></span>
<span class="line"><span>│   └── permission.js          // 权限</span></span>
<span class="line"><span>├── uni_modules                // 官方插件</span></span>
<span class="line"><span>├── .gitignore                 // git 忽略项</span></span>
<span class="line"><span>├── App.vue                    // 入口页面</span></span>
<span class="line"><span>├── index.html                 // html模板</span></span>
<span class="line"><span>├── main.js                    // 入口 加载组件 初始化等</span></span>
<span class="line"><span>├── manifest.json              // uniapp配置</span></span>
<span class="line"><span>├── package.json               // package.json</span></span>
<span class="line"><span>├── pages.json                 // pages.json</span></span>
<span class="line"><span>├── uni.scss                   // 全局样式变量</span></span>
<span class="line"><span>└── vue.config.js              // vue.config.js</span></span></code></pre></div><h2 id="技术版本" tabindex="-1">技术版本 <a class="header-anchor" href="#技术版本" aria-label="Permalink to &quot;技术版本&quot;">​</a></h2><p>前端框架版本：uniapp框架+vue2+uni-simple-router2。</p><p>前端核心库版本：ljs-sdk-public@0.2.16。</p><p>基于若依后端服务版本：V~3.8.5。</p><h2 id="去下载" tabindex="-1">去下载 <a class="header-anchor" href="#去下载" aria-label="Permalink to &quot;去下载&quot;">​</a></h2><p><a href="https://github.com/LJS-Y/ljs-vue3/tree/main/ljs-uniapp" target="_blank" rel="noreferrer">github</a></p><h2 id="说明" tabindex="-1">说明 <a class="header-anchor" href="#说明" aria-label="Permalink to &quot;说明&quot;">​</a></h2><p>该版本只修复bug，不维护新的功能。可移步至uniapp-vue3体验新版框架。</p>`,12),i=[l];function t(o,c,r,u,d,h){return n(),a("div",null,i)}const j=s(e,[["render",t]]);export{_ as __pageData,j as default};
