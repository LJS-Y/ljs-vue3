import{_ as t,c as s,o as a,a5 as i}from"./chunks/framework.D2w-0S4J.js";const o=JSON.parse('{"title":"类型区间日期","description":"","frontmatter":{},"headers":[],"relativePath":"ljs-tools/components/DatetypeChooseDateRange/index.md","filePath":"ljs-tools/components/DatetypeChooseDateRange/index.md"}'),e={name:"ljs-tools/components/DatetypeChooseDateRange/index.md"},n=i(`<h1 id="类型区间日期" tabindex="-1">类型区间日期 <a class="header-anchor" href="#类型区间日期" aria-label="Permalink to &quot;类型区间日期&quot;">​</a></h1><h3 id="说明" tabindex="-1">说明 <a class="header-anchor" href="#说明" aria-label="Permalink to &quot;说明&quot;">​</a></h3><p>类型区间日期选择器。</p><h3 id="独立使用" tabindex="-1">独立使用 <a class="header-anchor" href="#独立使用" aria-label="Permalink to &quot;独立使用&quot;">​</a></h3><div class="language-vue vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">vue</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">DatetypeChooseDateRange</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  v-model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">date</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tableSearch.query.date</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  v-model</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dictValue</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">tableSearch.query.dateType</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">datetypeData</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">acquisition_frequency</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">dateSwitchRule</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  :</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">disabledDate</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$LJSfc.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pickerOptions</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">DatetypeChooseDateRange</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;</span></span></code></pre></div><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  data</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">      // 表格搜索条件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      tableSearch: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        query: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          date: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">.$LJSdate.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">initSearchDateQj</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(), </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 日期区间值</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">          dateType: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&#39;3&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 日期类型</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        queryReal: {}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    };</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  },</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">  mounted</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">};</span></span></code></pre></div><h3 id="主参数" tabindex="-1">主参数 <a class="header-anchor" href="#主参数" aria-label="Permalink to &quot;主参数&quot;">​</a></h3><table tabindex="0"><thead><tr><th>参数</th><th style="text-align:center;">类型</th><th style="text-align:center;">必填项</th><th>默认值</th><th>参考值</th><th>说明</th></tr></thead><tbody><tr><td>v-model:date</td><td style="text-align:center;">String</td><td style="text-align:center;">√</td><td></td><td></td><td>日期数据。</td></tr><tr><td>v-model:dictValue</td><td style="text-align:center;">String</td><td style="text-align:center;">√</td><td></td><td></td><td>默认类型，默认值：日。字典value。</td></tr><tr><td>datetypeData</td><td style="text-align:center;">Array</td><td style="text-align:center;">√</td><td></td><td></td><td>日期类型字典数据。</td></tr><tr><td>clearable</td><td style="text-align:center;">Boolean</td><td style="text-align:center;">×</td><td>false</td><td></td><td>清除按钮。</td></tr><tr><td>disabledDate</td><td style="text-align:center;">Function</td><td style="text-align:center;">×</td><td></td><td></td><td>禁用日期。示例（:disabledDate=&quot;$LJSfc.pickerOptions()&quot;）。</td></tr><tr><td>dateTypeKeyValue</td><td style="text-align:center;">Array</td><td style="text-align:center;">×</td><td>[&#39;1&#39;, &#39;2&#39;, &#39;3&#39;]</td><td></td><td>字典key值对应的value值，按照年月日的顺序，默认年为1日为3。</td></tr><tr><td>dateSwitchRule</td><td style="text-align:center;">Number</td><td style="text-align:center;">×</td><td>0</td><td></td><td>日期区间值切换规则：0 - 跟随传入日期；1 - 每次切换取当月、当年。</td></tr><tr><td>formItemLabel</td><td style="text-align:center;">String</td><td style="text-align:center;">×</td><td>日期</td><td></td><td>form-item，label值。</td></tr><tr><td>disabledDateSpan</td><td style="text-align:center;">Number</td><td style="text-align:center;">×</td><td>0</td><td></td><td>禁用日期，默认跨度为0。</td></tr><tr><td>noType</td><td style="text-align:center;">Array</td><td style="text-align:center;">×</td><td>[]</td><td></td><td>日期类型 - 不显示项，根据value处理。</td></tr><tr><td>symbol</td><td style="text-align:center;">String</td><td style="text-align:center;">~</td><td>[]</td><td></td><td>中间符。</td></tr></tbody></table><h3 id="事件" tabindex="-1">事件 <a class="header-anchor" href="#事件" aria-label="Permalink to &quot;事件&quot;">​</a></h3><table tabindex="0"><thead><tr><th>名称</th><th>类型</th><th style="text-align:left;">说明</th></tr></thead></table><h3 id="插槽" tabindex="-1">插槽 <a class="header-anchor" href="#插槽" aria-label="Permalink to &quot;插槽&quot;">​</a></h3><table tabindex="0"><thead><tr><th>插槽名</th><th style="text-align:left;">说明</th></tr></thead></table>`,12),l=[n];function h(d,p,k,r,E,y){return a(),s("div",null,l)}const c=t(e,[["render",h]]);export{o as __pageData,c as default};