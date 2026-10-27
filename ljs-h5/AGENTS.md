# AGENTS.md — ljs-h5 项目约定（打样 v1，2026-10）

> 本文件是写给 AI 协作者的项目约定包。四层验收：能发现、能理解、能正确调用、能直接接入。
> 怎么读：先看第 0 章；做任务查第 5 章；下笔前过一遍第 6/7 章红线。

## 0 阅读指引

- 本文件只写**稳定原则**（第 1/2/3/6/7 章）。易变细节（ljs-tools 的 API 参数表、组件参数表）一律外置到文档站 / AI.md，本文件只给入口链接（第 4 章），不复制。
- 改约定的顺序：先改代码 / 外置文档 → 再同步本文件 → 同步 CLAUDE.md（两文件内容必须完全一致）。
- 本文件与代码不一致时：**先报告、不擅自行动**，以实际代码行为为准做判断依据。

## 1 项目速览

- **定位**：移动端 H5 框架模板（Vue3 + Rsbuild 2.x + Vant）。两种使用形态：**微信小程序 web-view 内嵌页**（token 由小程序经 URL 传入）或**独立 H5 应用**（带登录页）。**JS 为主，非 TS**。
- **技术栈**：Vue 3.5 + Rsbuild 2.x（Rspack 2）+ **Vant 4.9**（非 Element Plus！）+ Vuex 4（vuex-persistedstate 持久化到 sessionStorage）+ vue-router **5**（守卫用返回值风格，不是 next()）+ ljs-tools ^1.0.0。
- **命令**：`npm run dev`（开发，端口 **9990**）/ `npm run test`（测试环境产物）/ `npm run build`（生产产物）/ `npm run preview`。
- **环境变量**：Rsbuild 规则——**只有 `PUBLIC_` 前缀会进客户端代码**。四件套 `.env` / `.env.development` / `.env.test` / `.env.production`。
  现有变量：`BASE_URL`（部署子路径）、`PUBLIC_PROJECT_NAME`、`PUBLIC_COMPANY_OWNER`、`PUBLIC_RECORD_NUMBER`、`PUBLIC_NODE_ENV`、`PUBLIC_CURRENTMODE`、`PUBLIC_API_URL`（接口地址）、`PUBLIC_GO_HOME`、`PUBLIC_CAPTCHA_ON_OFF`（验证码开关）。
  **新增变量三步**：①用 PUBLIC_ 前缀 ②四件套补齐 ③在本节登记名字和含义。
- **运行时配置**：`public/config.js` 挂 `window.g`（`API_OUT_TIME` 请求超时、`grayStyle` 灰度），打包后可直接改、不进构建。
- **无国密模块**：本模板**没有** `src/api/smExecute.js`，也没有 `PUBLIC_SM_CRYPTO` / `PUBLIC_SM_API_PREFIX`。若业务需要国密，参照 `ljs-vue3-rsbuild` 模板的 smExecute.js 补齐，并在四件套登记变量。
- **UI 库是 Vant**：移动端组件一律用 `van-*`。**不要引入 Element Plus**——它的组件在移动端不可用，且会显著增大体积。

## 2 目录约定

```
src/
  index.js            入口装配：router/store/ljs-tools/Vant/@/tools
  api/                接口层
    axios.js          统一封装：get/post/put/del/upload/download + token 注入 + 响应拦截
    <域>/<模块>.js     具体接口（域：common/ai，按业务扩）
  views/              页面，一目录一功能，页面三件套（见 3.1）
    frame/            主框架（含底部导航/侧滑菜单）
    login/            登录页（仅 standalone 形态需要）
    index/            首页
    404.vue           兜底页
  components/         通用组件（unplugin-vue-components 自动注册，模板里直接用组件名）
  router/
    index.js          静态路由
    callback.js       路由守卫：token 校验 / 404 判定 / loading 控制
  store/
    index.js          状态定义 + PERSIST_PATHS 持久化清单
    mutations.js      同步变更
    getters.js        取数口
    modules/permission.js   GenerateRoutes：后端菜单 → 动态路由 + 菜单树
  tools/              业务工具（index.js 注册表统一挂载，见 3.2）
    base.js run.js msg.js apiQueryChange.js errorImages.js
    dict/             字典
    skin/             主题皮肤对象
    directives/       v-hasPermi / v-hasRole
    ruoyi/            若依工具集（ruoyi.js/permission.js）
  assets/             css/ fonts/ icons/（svg-sprite）images/
rsbuild.config.mjs    构建配置（勿放业务逻辑）
public/config.js      运行时配置 window.g
```

## 3 核心编码约定

### 3.1 页面三件套（桥接模式）

`views/<模块>/<功能>/` 下固定三件，`index.vue` **只做桥接**，不写业务：

```vue
<template>…</template>
<script>
import index from './index.js';
export default index;
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
```

- `index.js`：`export default { name, components, data, methods, mounted, … }` —— 业务逻辑全在这里
- `index.scss`：该页样式，`scoped` 隔离
- **注意**：Vant 组件在模板里直接用 `van-` 前缀标签（如 `<van-button>`），无需 import；如用 unplugin-vue-components 自动导入，则在 `index.js` 的 `components: {}` 中登记。

### 3.2 工具挂载（`src/tools/index.js` 注册表）

工具以对象数组注册，`type` 决定挂载方式：`function` → `this.$<name>`、`directive` → `v-<name>`、`component` → 全局组件。
新增工具：写模块 → 在 `tools/index.js` 的 `tools` 数组登记 → 按 `type` 自动挂载。

### 3.3 接口层

- 一律走 `src/api/axios.js` 的方法（`get/post/put/del/upload/download`），**不要自己建 axios 实例**
- token 由拦截器自动注入 `Authorization: Bearer <token>`
- 接口按域分文件：`src/api/<域>/<模块>.js`，导出具名函数

### 3.4 状态管理

- Vuex 4，`store/index.js` 定义 state，`mutations.js` 同步变更，`getters.js` 取数
- 需持久化的字段登记在 `PERSIST_PATHS`（默认持久化到 **sessionStorage**）
- 组件内用 `this.$store.state.xxx` / `this.$store.getters.xxx` / `this.$store.commit('xxx')`

### 3.5 UI 与样式

- 移动端用 **Vant 4**（`van-*`），按需引入已在构建配置处理
- 主题：`tools/skin/` 下是 JS 主题对象 + CSS 变量，改色改这里，**不要硬编码色值**
- 样式单位用 `px`（构建时未配 postcss-px-to-viewport；如需 rem/vw 适配请先确认）

### 3.6 环境变量使用

- 读取：`import.meta.env.PUBLIC_API_URL`
- **不要写 `process.env.XXX`**——Rsbuild 下只有 `PUBLIC_` 前缀经 `import.meta.env` 暴露
- `BASE_URL` 由 `rsbuild.config.mjs` 的 `server.base` 决定（开发固定 `/`，生产取 env），用于部署子路径

### 3.7 权限指令

- `v-hasPermi="['system:user:add']"` —— 无权限时移除元素
- `v-hasRole="['admin']"` —— 角色控制

### 3.8 路由与守卫（**本模板与其他模板的差异点**）

- **vue-router 5**：守卫写**返回值**，不是 `next()`：
  ```js
  router.beforeEach(async (to, from) => {
    if (needRedirect) return '/login';   // 对
    return true;                          // 对
  });
  ```
- 动态路由用 `import.meta.glob('../../views/**/*.vue')` 匹配组件
- 守卫里 `COMMON.checkToken(to)` 是**入口判定的核心**，见第 3.9 节

### 3.9 两种入口形态（本模板最特殊的地方，务必理解）

`src/tools/common.js` 的 `checkToken()` 决定 token 从哪来：

| 形态 | token 来源 | 国密密钥来源 | 登录页 |
| --- | --- | --- | --- |
| **小程序 web-view 内嵌** | URL 参数 `?token=xxx` | URL 参数 `smSwitch` / `ljs_a` / `ljs_b` | 不需要，可删 `views/login` |
| **独立 H5 应用** | 登录接口返回，存 store | 登录接口 `encryptKeys.KPAPu` / `KPBPr` | 需要保留 |

- `development` 分支里有一段**注释态的国密密钥注入**，是国密调试专用，**不要删**（已加注释说明）
- 生产分支（else）从小程序 URL 取 `smSwitch`/`ljs_a`/`ljs_b` 并 `setSS`
- 若删掉 `views/login`：路由 `callback.js` 里 `/login` 的跳转分支也要同步处理，否则会跳向不存在的路由

## 4 ljs-tools 用法入口

- 全局挂在 `this.$LJSxxx`：`this.$LJSbase.fieldCheck(v)`、`this.$LJSsession.getSS(k)`、`this.$LJSurl.getUrlParameter(k)`
- 组件可直接用：`<Pagination>`、`<DictTag>`、`<DateRange>`
- 完整 API：https://ljs-y.github.io/ljs-vue3
- 包内 AI 说明书：node_modules/ljs-tools/AI.md
- **判空统一用 `this.$LJSbase.fieldCheck(v)`**，不要自己写 `if (!v)`——本项目的空值约定包含 `0` 与 `''` 的区分

## 5 常见任务操作手册

### 加一个页面

1. 在 `src/views/<模块>/<功能>/` 建三件套（`index.vue` + `index.js` + `index.scss`），`index.vue` 只做桥接
2. 业务逻辑写 `index.js`，样式写 `index.scss`
3. 页面若需动态路由，确认 `store/modules/permission.js` 能匹配到（`import.meta.glob` 覆盖 `views/**/*.vue`）
4. 不需要手动注册路由——动态路由从后端菜单生成

### 加一个接口

1. 在 `src/api/<域>/<模块>.js` 里加具名导出函数：`export function getList(query) { return request({ url: '/xxx/list', method: 'get', params: query }) }`
2. 页面里 `import { getList } from '@/api/<域>/<模块>'`
3. 不要新建 axios 实例，不要自己拼 token

### 加一个字典

1. 在 `src/tools/dict/` 下加字典定义
2. 组件里用 `<DictTag :options="xxxOptions" :value="row.status" />`
3. 或 `this.$LJSdict.getDict('sys_normal_disable')` 取字典项

### 加权限控制

1. 按钮级：`v-hasPermi="['system:user:add']"`
2. 角色级：`v-hasRole="['admin']"`
3. 代码级：`this.$LJScheck.checkPermi(['system:user:add'])`（挂载点见 `tools/ruoyi/permission.js`）

### 切到「小程序内嵌」形态

1. 删除或保留 `src/views/login`（保留不影响，只是不用）
2. 确认 `tools/common.js` 的 `checkToken` 从 URL 取 token 的逻辑可用
3. 确认小程序侧拼 URL 时带上 `token`；如开国密，再带 `smSwitch=1&ljs_a=xxx&ljs_b=xxx`

### 切到「独立 H5」形态

1. 确认 `src/views/login` 存在且路由已注册
2. 登录成功后把 token 写入 store（走 `SET_token` mutation）
3. 检查 `callback.js` 的 `/login` 跳转分支

## 6 禁止事项红线

- ❌ **不要引入 Element Plus**——本模板是 Vant 体系，混用会导致体积暴涨与样式冲突
- ❌ **不要在守卫里写 `next()`**——本模板是 vue-router 5，用返回值
- ❌ **不要写 `process.env.PUBLIC_XXX`**——客户端读不到，必须 `import.meta.env.PUBLIC_XXX`
- ❌ **不要新建 axios 实例**——统一走 `src/api/axios.js`
- ❌ **不要删 `common.js` 里注释态的国密调试代码**——那是调试入口，有明确注释标记
- ❌ **不要在 `index.vue` 里写业务逻辑**——必须走桥接三件套
- ❌ **不要硬编码主题色**——走 `tools/skin/` 的 JS 对象 + CSS 变量
- ❌ **不要改 `rsbuild.config.mjs` 前不查 schema**——配置键要先在 `node_modules/@rsbuild/core/dist/index.d.ts` 里确认存在，改完用产物实证（看 dist 文件名），不要相信注释

## 7 不要模仿清单（历史教训）

以下问题在本模板或同源模板中真实出现过，**写代码时不要照抄这些写法**：

1. **`package.json` 的 name 曾是 `ljs-vue3-rsbuild`**（复制模板未改），已修正为 `ljs-h5`。新增模板时务必改 name，`package-lock.json` 里也有两处。
2. **`.env` 的 `BASE_URL` 曾是 `'/aaa/'`**（测试子路径残留），已修正为 `'/'`。该变量只影响生产构建的 `server.base`（资源前缀），部署到子路径时须改成实际路径（如 `'/app/'`），填错会导致资源 404。
3. **配置死键**：`output.filename.chunkFilename` 在 Rsbuild 1.x 是无效键（已从其他模板清除）。Rsbuild 2.x 用顶层 `splitChunks`，`performance.chunkSplit` 在 2.x 已废弃。
4. **隐式全局依赖**：曾出现 `callback.js` 用了 `LJSmenu` 但没 import（vite 模板），运行即炸。用了什么就 import 什么。
5. **死 getter**：曾出现 `store/getters.js` 定义 `menuChoose` 但 state 中没有该字段。加 getter 前先确认 state 有对应字段。
6. **get 请求死代码**：曾出现 `params = {}` 后又拿 `tansParams(params)` 的写法（vite 模板），逻辑已死。

## 附则

- 改动 AGENTS.md 后立即 `cp AGENTS.md CLAUDE.md` 并 `diff` 校验，两文件必须字节一致。
- 本文件随 create-ljs 分发到新工程；用户工程里改动不影响模板，模板改动需回 `ljs-vue3/ljs-h5/` 同步。
