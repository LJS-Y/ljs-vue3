# ljs-tools — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 版本以 package.json 为准
> 面向 AI 编码助手：本文档描述能力边界与正确调用方式，调用前先读 `index.d.ts` 获取精确签名。

## 一句话定位

Vue3 项目的工具库 + 常用组件合集（基于 Element Plus）：日期/数字/表单校验/字典/树处理/加解密（DES、SHA256、MD5、国密 SM2/SM3/SM4）/本地存储/WebSocket/MQTT/水印/脱敏/HTML 转 PDF + 9 个常用组件（Loading、分页、右键菜单、日期系列、字典标签、粒子、文本缩略）。

## 何时用 / 何时不用

**用**：
- 中后台项目需要「判空、日期格式化、金额分位、字典回显、树转换、表单输入限制」这类成体系工具，且项目已用 Element Plus
- 需要国密 SM2/SM3/SM4 加密
- 需要日期类型切换（年/月/日/区间）、水印、脱敏、HTML 导出 PDF

**不用**：
- 纯日期运算/解析（用 dayjs / date-fns）——本库只有格式化与区间偏移
- 非 Vue 项目（组件依赖 Vue3；工具函数虽可独立用，但整体按 Vue 插件设计）
- 需要 SSR / Nuxt（未做 SSR 适配）
- 项目没有 Element Plus 且不愿引入（$LJSEl、Pagination、DatetypeChooseDate 系列依赖它）

## 与同类的区别（选型理由）

- **vs dayjs / date-fns（日期单点库）**：它们只解决日期解析/运算；本库日期面向业务展示（格式化、查询区间、日期类型切换组件），且同包还有判空/字典/树/表单限制/加密等 14 个能力域——中后台一次装齐。
- **vs lodash-es / @vueuse/core（通用工具/组合函数）**：通用底层工具，不含业务语义（字典回显、金额分位、表单输入限制、右键菜单、日期类型组件）；本库是「Element Plus 中后台业务工具全家桶」。
- **vs 自己逐个拼装（sm-crypto + mqtt + html2canvas + 水印…）**：单点库要自己封装成体系；本库 15 方法库 + 9 组件统一 `$LJSxxx` 挂载、开箱即用，且工具间有组合（如 DateRange_spanLimit 配 DateRange）。
- **vs 若依等脚手架内置 utils**：内置在脚手架里拆不出来、无法单独升级；本库是独立 npm 包，任意 Vue3 + Element Plus 项目可装。
- **决策口诀**：中后台、Element Plus、要成体系业务工具（判空/日期/字典/树/表单/加密/水印/PDF/MQTT 一次装齐）→ 本库；只要单点工具（纯日期运算/纯函数）→ dayjs/lodash-es；非 Vue3 / SSR → 不用。

## 安装与引入

```bash
npm i ljs-tools -S
# 使用组件需自行安装 element-plus（本库不打包它）
```

```ts
// 1) 全局安装（推荐，挂载 $LJSxxx 全局属性 + 全局组件）
import 'ljs-tools/index.css';
import LjsTools from 'ljs-tools';
app.use(LjsTools);
// 之后 this.$LJSdate / 模板 <LJSLoading> 可用

// 2) 局部引入
import 'ljs-tools/index.css'; // 只要用到组件就必须引
import LjsTools from 'ljs-tools';
const { LJSdate, LJSLoading } = LjsTools; // ✅ 最保险写法
// import { LJSdate, LJSLoading } from 'ljs-tools'; // ⚠️ 依赖打包器 CJS 互操作，见「典型错误」
```

## API 总览（15 个方法库 + 9 个组件 + 2 个全局对象 + 1 个类）

| 挂载名 | 能力域 | 核心 API |
| --- | --- | --- |
| `$LJSbase` | 判空/树/字典/拷贝 | fieldCheck、handleListTree、handleTreeList、getTreeParents、selectDictLabel、dictDataChange、deepCopy、objectCopy、setRemUnit、getWindowRatio、downloadImage、imageFileToBase64、colorLog、editTreeParentIdCheck |
| `$LJSnum` | 数字 | numberB0、moneySplit、numberCeil、longNumText、numberChangeDecimal、averageNum |
| `$LJSdate` | 日期 | formatTime、customizedDate、dateQjChange、timeRunDistance、initSearchDate、initSearchDateQj |
| `$LJSfc` | 表单输入 | numCheck、numDxsCheck、numBlurCheck、numEnCheck、downloadBlobData、pickerOptions、pickerOptionsDynamic |
| `$LJSecDC` | ECharts | pieChange（饼图数据） |
| `$LJSsession` | 存储 | getSS/setSS/delSS/clearSS、getLS/setLS/delLS/clearLS、clearVuex |
| `$LJScryptoJs` | 常用加密 | setDES/getDES、setSha256、setMD5 |
| `$LJSsm` | 国密 | SM2Util（generateKeyPair/encrypt/decrypt/sign/verify）、SM3Util.digest、SM4Util（generateKey/encrypt/decrypt） |
| `$LJSrgbC` | 颜色 | c16ToRgb、rgbToC16、random16Color |
| `$LJSurl` | 地址/文件 | getUrlAllParameter、getUrlParameter、getFileType、getFileName、isIPValid、isIPV4ValidIP、isIPV6ValidIP、formatParamsByAscii |
| `$LJSlicense` | 鉴权 | licenseDateCheck（依赖 window.g.SRKJ_APP） |
| `$LJSEl` | Element Plus | delMessageBox（删除确认框） |
| `$LJSWatermark` | 水印 | set |
| `$LJSprivacy` | 脱敏 | desensitizationName、desensitizationPhone、desensitizationStr |
| `$LJSmenu` | 菜单 | fristOpenMenu、handPush、menuControl、updateTreeOpen、goExternalUrl |
| `LJSws`（全局属性） | WebSocket | init（另有具名导出 getUrl） |
| `htmlPdf`（全局属性） | 导出 | html 转 PDF（html2canvas/jspdf 需注入） |
| `DateRange_spanLimit` | 日期区间跨度 | pickerOptionsDynamic、visibleChange_start、visibleChange_end |
| `mqttCreateds`（class） | MQTT | ⚠️ API 待补录（见「已知坑」） |

**组件**（全局注册名即组件名，均可局部引入）：

| 组件 | 用途 | 关键 props / slots |
| --- | --- | --- |
| LJSLoading | 全屏 Loading | speed、gaussian、bgOpacity、textColor；默认插槽=提示文本 |
| Pagination | 分页 | total(必填)、page、limit、pageSizes、note；事件 update:page/update:limit/pagination |
| RightMenu | 右键菜单 | modelValue、opts{top,left,width,height}；默认插槽=菜单内容 |
| DatetypeChooseDate | 日期类型+单日期 | date、dictValue、datetypeData、dateTypeKeyValue、noType |
| DatetypeChooseDateRange | 日期类型+区间 | date、dictValue、datetypeData、dateSwitchRule、symbol |
| DateRange | 日期区间 | modelValue、dateType、formItemLabel、disabledDate_start/end |
| DictTag | 字典标签 | options、value（支持多值） |
| Particles | 粒子背景 | 无 props（⚠️ 会设置 body overflow:hidden） |
| TextAbbreviation | 文本缩略 | data、mode(line/last)、max、unit、lineHeight、fontSize |

精确签名（参数类型/默认值）一律以 `index.d.ts` 为准。

## 最小可运行示例

```vue
<template>
  <div>
    <DateRange v-model="dateRange" dateType="date" formItemLabel="查询日期" />
    <Pagination :total="total" v-model:page="page" v-model:limit="limit" @pagination="onPage" />
    <LJSLoading v-if="loading">加载中...</LJSLoading>
  </div>
</template>

<script setup>
import 'ljs-tools/index.css';
import LjsTools from 'ljs-tools';
const { DateRange, Pagination, LJSLoading, LJSdate, LJSbase } = LjsTools;

const dateRange = ref([]);
const loading = ref(false);

// 判空 + 日期格式化
const title = LJSbase.fieldCheck(name) ? '默认标题' : name;
const now = LJSdate.formatTime(Date.now(), '{y}-{m}-{d} {h}:{i}:{s}');
</script>
```

## 常见组合用法

**1. 默认查询区间（近 10 天）**
```js
const range = this.$LJSdate.initSearchDate(10); // ['2026-10-12', '2026-10-22']
```

**2. 国密 SM4 加解密**
```js
const { SM4Util } = this.$LJSsm;
const key = SM4Util.generateKey();
const cipher = SM4Util.encrypt('明文', key);
const plain = SM4Util.decrypt(cipher, key);
```

**3. HTML 导出 PDF（依赖注入）**
```js
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
this.htmlPdf({ html2Canvas: html2canvas, JsPDF: jsPDF }, '报表', this.$refs.reportEl);
```

**4. Blob 下载 Excel**（接口 responseType:'blob'）
```js
this.$LJSfc.downloadBlobData(res.data, '导出结果.xlsx');
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| `import { LJSdate } from 'ljs-tools'`（裸 ESM 环境） | `import LjsTools from 'ljs-tools'; const { LJSdate } = LjsTools;` | 产物 ESM 只有 default 导出；具名导入依赖打包器 CJS 互操作，不保证成立 |
| `this.$LJSnum.checkNum(v)` | 用 `$LJSbase.fieldCheck` 或自行判断 | checkNum 是模块内部函数，不在 `$LJSnum` 对象上 |
| `this.$LJSfc.numEnCheck({ form, key })` | `this.$LJSfc.numEnCheck(form, 'username')` | 该方法是位置参数签名，不是解构参数 |
| `LJSWatermark.set(...)` 调用多次 | 全局只调一次 | 多次调用会叠加多个水印定时器 |
| `SM2Util.sign` 结果当 hex 用 | 当 base64 用（verify 同） | 签名输出/校验输入均为 base64（内容为 r‖s 拼接） |
| 导出 PDF 时 `htmlPdf(title, el)` | `htmlPdf({ html2Canvas, JsPDF }, title, el)` | html2canvas/jspdf 必须由调用方注入，首参是 plugin 对象 |
| 不引 `index.css` 直接用组件 | 先 `import 'ljs-tools/index.css'` | 组件样式在独立 css 产物里 |
| 发版时 `npm run build` 后直接 publish | build 会清空 `ljs-tools/` 目录（emptyOutDir:true），package.json/README.md/AI.md/index.d.ts 需构建后放入 | Vite 库模式构建配置所致 |

## 版本兼容与已知坑

- **环境**：Vue ~3.3.4；组件需 Element Plus（@element-plus/icons-vue 仅 $LJSEl 用）；构建产物 ESM + UMD 双格式，`main` 指向 UMD。
- **`Pagination.pagerCount` 惰性默认**：默认按屏宽取值（<992 → 5，否则 7），1.0.0 起为函数工厂（组件实例化时求值，模块加载不再触碰 document，Node 直导安全）；SSR 下渲染 Pagination 且不传 pagerCount 仍会取 document（本库整体不支持 SSR）。
- **Node 直导安全（1.0.0 起）**：模块加载不再触碰 window/document——除 pagerCount 惰性默认外，Particles 的浏览器全局垫片（requestAnimFrame/particlesJS 等）已加 typeof window 守卫；Node/构建工具可直接 import 本包。
- **`mqttCreateds` API 待补录**：源码（src/tools/mqtt.js）本次提取被安全策略拦截，暂以 any 占位；使用前请人工核对类构造参数与方法。
- **JSDoc 与实现不一致**：`$LJSfc.numDxsCheck` 的 zs/ws 实际默认 10/2（注释写不限位）。
- **`$LJSlicense.licenseDateCheck`** 依赖全局 `window.g.SRKJ_APP` 与硬编码密钥，非通用鉴权方案。
- **`Particles`** 会设置 `document.body.style.overflow='hidden'`，页面级副作用。
- **`$LJSsession.clearVuex`** 约定了一组固定 mutation 名（SET_token 等），非若依 store 结构勿用。
- **`SM2Util.sign/verify` 互操作约定**：按国密标准 SM2 杂凑（ZA‖M，内部 SM3），非裸摘要签名；userId 默认 `'1234567812345678'`（国密默认值），后端验签必须同 userId；签名载体 base64、内容为 r‖s 拼接（各 32 字节），后端若用 DER 编码验签需转换格式。
- 密码学模块仅供业务加解密封装，不构成安全审计结论（国密合规场景需自行评估）。
