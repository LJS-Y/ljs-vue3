import{_ as a,c as s,o as n,aj as e}from"./chunks/framework.CKd5D8ET.js";const m=JSON.parse('{"title":"请求","description":"","frontmatter":{},"headers":[],"relativePath":"ljs-vue/frontManual/request.md","filePath":"ljs-vue/frontManual/request.md"}'),p={name:"ljs-vue/frontManual/request.md"},t=e(`<h1 id="请求" tabindex="-1">请求 <a class="header-anchor" href="#请求" aria-label="Permalink to &quot;请求&quot;">​</a></h1><h2 id="api请求" tabindex="-1">api请求 <a class="header-anchor" href="#api请求" aria-label="Permalink to &quot;api请求&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import { get, put, post, del } from &#39;@/api/axios.js&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>export function getInfo(params) {</span></span>
<span class="line"><span>  return get(&#39;/getInfo&#39;, params);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="api请求应用" tabindex="-1">api请求应用 <a class="header-anchor" href="#api请求应用" aria-label="Permalink to &quot;api请求应用&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import {</span></span>
<span class="line"><span>  getInfo</span></span>
<span class="line"><span>} from &#39;@/api/common/login&#39;;</span></span>
<span class="line"><span>....</span></span>
<span class="line"><span>getInfo().then((res) =&gt; {</span></span>
<span class="line"><span>  if (res.code === 200) {</span></span>
<span class="line"><span>    ....</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>});</span></span></code></pre></div>`,5),i=[t];function l(o,c,r,d,h,u){return n(),s("div",null,i)}const f=a(p,[["render",l]]);export{m as __pageData,f as default};
