import{_ as a,c as n,o as s,aj as e}from"./chunks/framework.CKd5D8ET.js";const m=JSON.parse('{"title":"通用方法","description":"","frontmatter":{},"headers":[],"relativePath":"ljs-vue/frontManual/function.md","filePath":"ljs-vue/frontManual/function.md"}'),p={name:"ljs-vue/frontManual/function.md"},t=e(`<h1 id="通用方法" tabindex="-1">通用方法 <a class="header-anchor" href="#通用方法" aria-label="Permalink to &quot;通用方法&quot;">​</a></h1><h2 id="tab对象" tabindex="-1">$tab对象 <a class="header-anchor" href="#tab对象" aria-label="Permalink to &quot;$tab对象&quot;">​</a></h2><p>废弃！</p><p>我们提供以下方式：</p><h3 id="页面跳转" tabindex="-1">页面跳转： <a class="header-anchor" href="#页面跳转" aria-label="Permalink to &quot;页面跳转：&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// router.push</span></span>
<span class="line"><span>this.$run.push({</span></span>
<span class="line"><span>  path: &#39;/organizationAdd&#39;</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// router.replace</span></span>
<span class="line"><span>this.$run.replace({</span></span>
<span class="line"><span>  path: &#39;/organizationAdd&#39;</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 回退的页数，默认一页</span></span>
<span class="line"><span>this.$run.go()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 跳外部地址</span></span>
<span class="line"><span>this.$run.goExternalUrl(url)</span></span></code></pre></div><h5 id="参考地址" tabindex="-1">参考地址 <a class="header-anchor" href="#参考地址" aria-label="Permalink to &quot;参考地址&quot;">​</a></h5><p>/src/tools/run.js</p><h2 id="modal对象" tabindex="-1">$modal对象 <a class="header-anchor" href="#modal对象" aria-label="Permalink to &quot;$modal对象&quot;">​</a></h2><p>继续沿用！</p><h2 id="auth对象" tabindex="-1">$auth对象 <a class="header-anchor" href="#auth对象" aria-label="Permalink to &quot;$auth对象&quot;">​</a></h2><p>废弃！</p><p>我们提供以下方式：</p><p><a href="/ljs-vue3/ljs-vue/frontManual/power.html">权限</a></p><h2 id="cache对象" tabindex="-1">$cache对象 <a class="header-anchor" href="#cache对象" aria-label="Permalink to &quot;$cache对象&quot;">​</a></h2><p>废弃！</p><p>我们提供以下方式：</p><p><a href="/ljs-vue3/ljs-tools/function/session/">缓存（LJSsession）</a></p><h2 id="download对象" tabindex="-1">$download对象 <a class="header-anchor" href="#download对象" aria-label="Permalink to &quot;$download对象&quot;">​</a></h2><p>废弃！</p><p>我们提供以下方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this.download(&#39;/monitor/jobLog/export&#39;, {</span></span>
<span class="line"><span>  ...this.queryParams</span></span>
<span class="line"><span>}, \`log_\${new Date().getTime()}.xlsx\`)</span></span></code></pre></div>`,22),l=[t];function o(i,r,c,h,d,u){return s(),n("div",null,l)}const _=a(p,[["render",o]]);export{m as __pageData,_ as default};
