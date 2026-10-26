# AGENTS.md — ljs-vue3-rsbuild2 项目约定（打样 v1，2026-10）

> 本文件是写给 AI 协作者的项目约定包。四层验收：能发现、能理解、能正确调用、能直接接入。
> 怎么读：先看第 0 章；做任务查第 5 章；下笔前过一遍第 6/7 章红线。

## 0 阅读指引

- 本文件只写**稳定原则**（第 1/2/3/6/7 章）。易变细节（工具 API 参数表、组件参数表）一律外置到文档站/AI.md，本文件只给入口链接（第 4/5 章），不复制。
- 改约定的顺序：先改代码/外置文档 → 再同步本文件 → 同步 CLAUDE.md（两文件内容必须完全一致）。
- 本文件与代码不一致时：**先报告、不擅自行动**，以实际代码行为为准做判断依据。

## 1 项目速览

- **定位**：若依 V3.8.5（分离版）深度集成 ljs-tools 的 Vue3 后台管理框架模板（**Rsbuild 2.x 变体**）。**JS 为主，非 TS**。
- **技术栈**：Vue 3.5 + **Rsbuild 2.x**（@rsbuild/core ^2.1，Rspack 2.x）+ Element Plus 2.14（全量引入+全量图标）+ Vuex 4（vuex-persistedstate 持久化到 sessionStorage）+ **vue-router 5** + ljs-tools ^1.0.0 + throttle-box。
- **命令**：`npm run dev`（开发，端口 **9990**）/ `npm run test`（测试环境产物）/ `npm run build`（生产产物）/ `npm run preview`。
- **环境变量**：Rsbuild 规则——**只有 `PUBLIC_` 前缀会进客户端代码**。四件套 `.env` / `.env.development` / `.env.test` / `.env.production`。
  现有变量：`BASE_URL`（部署子路径）、`PUBLIC_PROJECT_NAME`、`PUBLIC_COMPANY_OWNER`、`PUBLIC_RECORD_NUMBER`、`PUBLIC_NODE_ENV`、`PUBLIC_CURRENTMODE`、`PUBLIC_API_URL`（接口地址）、`PUBLIC_GO_HOME`、`PUBLIC_CAPTCHA_ON_OFF`（验证码开关）、`PUBLIC_SM_CRYPTO`（国密开关 '0'/'1'）、`PUBLIC_SM_API_PREFIX`（国密加解密接口 URL 前缀门，默认 '/api/'）。
  **新增变量三步**：①用 PUBLIC_ 前缀 ②四件套补齐 ③在本节登记名字和含义。
- **运行时配置**：`public/config.js` 挂 `window.g`（`API_OUT_TIME` 请求超时、`grayStyle` 灰度），打包后可直接改、不进构建。
- **国密**：`src/api/smExecute.js`（请求加密/响应解密），由 `PUBLIC_SM_CRYPTO` 开关；加解密限「前缀门内 + post/put」，前缀门为入参 `apiPrefix`（默认取 env `PUBLIC_SM_API_PREFIX`，缺省 '/api/'），另有加/解密 URL 白名单可排除个别接口。

## 2 目录约定

```
src/
  index.js            入口装配：svg-sprite 注册/ljs-tools/throttle-box/ElementPlus 全量+图标/@/tools；
                      mount 前先预加载 GenerateRoutes（见 3.8）
  api/                接口层
    axios.js          统一封装：get/post/put/del/upload/download + token 注入 + 响应拦截
    smExecute.js      国密加解密（拦截器内自动调用）
    <域>/<模块>.js     具体接口（域：common/monitor/system，按业务扩）
  views/              页面，一目录一功能，页面三件套（见 3.1）
  components/         通用组件（unplugin-vue-components 自动注册，模板里直接用组件名）
    common/           Pagination / SvgIcon
    WangEditor HTMLBox FilePreview FileUpload Crontab IconSelect ExcelImport ImageUpload Footer frame…
  router/
    index.js          静态路由：constantRoutes（frame/login/404/empty）+ dynamicRoutes（固定入口）
    callback.js       路由守卫：登录校验/用户信息/动态路由生成/404 判定（**返回值风格**，见 3.8）
  store/
    index.js          状态定义 + PERSIST_PATHS 持久化清单
    mutations.js      同步变更（SET_userinfo/SET_permissions/loadingStore/openSubmitDDTag…）
    getters.js        取数口
    modules/permission.js   GenerateRoutes：后端菜单 → 动态路由 + 菜单树（含非超管隐藏 /monitor）
  tools/              业务工具（index.js 注册表统一挂载，见 3.2）
    base.js run.js dict/ apiQueryChange.js modal.js errorImages.js build.js
    skin/             主题皮肤对象（modules/default|green|black.js）
    directives/       v-hasPermi / v-hasRole
    ruoyi/            若依工具集（ruoyi.js/permission.js/modal.js）
  assets/             css/ fonts/ icons/（svg-sprite，入口经 icons/svg/index.js 注册）images/
rsbuild.config.mjs    构建配置（拆包/压缩/全局 define；勿放业务逻辑）
public/config.js      运行时配置 window.g
```

> 组件集差异提示：富文本用 **WangEditor + HTMLBox**（无 quill 系 Editor 组件）；另有 FilePreview / FileUpload / Crontab / IconSelect 等现成组件，加功能前先查 `src/components` 是否已有。

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

- 业务逻辑全在 `index.js`（Options API：data/created/mounted/methods…）。
- **组件 `name` 用 PascalCase，且与菜单配置的路由 `name` 一致**（keep-alive `:include="keepAliveList"` 按 name 缓存，不一致=不缓存）。
- 样式全在 `index.scss`（scoped）。

### 3.2 工具库三层分工（勿混用）

| 层 | 来源 | 形态 | 例子 |
|---|---|---|---|
| 能力库 | ljs-tools（入口 app.use） | `$LJS` 前缀 | `$LJSbase.fieldCheck/deepCopy/getTreeParents`、`$LJSmenu.fristOpenMenu/updateTreeOpen`、`$LJSsession.clearVuex` |
| 业务工具 | `src/tools`（注册表挂载） | `$` 单前缀 | `$run`（路由跳转/外链）、`$dict`（getDict）、`$base`、`$apiQC`、`$modal`、`$em`（兜底图）、`$comB` |
| 平铺方法 | tools 注册表 other_function | 无前缀全局可用 | `resetForm`、`handleTree`、`addDateRange`、`selectDictLabel(s)`、`checkPermi`、`checkRole`、`download` |

> **平铺方法的调用形态**：它们挂在组件实例上（globalProperties）——**JS 方法体里必须 `this.download(...)` / `this.selectDictLabel(...)`**；模板表达式里可省 `this.`。裸标识符调用（`download(...)`）是 ReferenceError（隐式全局依赖类教训，见 7.10）。

### 3.3 接口与响应契约

- 接口函数写在 `src/api/<域>/<模块>.js`，从 `@/api/axios.js` 引 `get/post/put/del/upload/download`。
- 响应契约（**不可改**）：列表 `{code, msg, rows, total}`，详情/操作 `{code, msg, data}`。
  `code === 200` 成功；`401` 由拦截器清会话跳 `/login`；其他 code 拦截器统一弹警告，页面不重复弹。
- 判空一律 `this.$LJSbase.fieldCheck(x)`（勿用 `!x`、勿引 lodash）。**语义：返回 `true` 表示 x 为空**（undefined/null/''），非空返回 false。
- `download` 有两处：api 层 `download(url, params, filename)`（导出接口函数内 import 使用，自带下载 loading）；平铺 `this.download` 是同一能力挂到实例。**页面调导出走 api 层封装的导出函数即可，勿两处叠加调用。**

### 3.4 查询参数双份制（tableSearch）

- 表单绑定 `tableSearch.query`，实际发出 `tableSearch.queryReal`：
  `this.tableSearch.queryReal = this.$LJSbase.deepCopy(this.tableSearch.query);` 然后 `list(this.tableSearch.queryReal)`。
- **分页参数 `pageNum`/`pageSize` 放在 `tableSearch.queryReal` 内**，随 queryReal 一起发出，不单独平铺。
- **列表分页用 `<pagination>` 组件**（`src/components/common/Pagination.vue`，unplugin 自动注册）：`:total` + `v-model:page`/`v-model:limit` 绑 `tableSearch.queryReal.pageNum/pageSize` + `@pagination="getList"`；**勿直接用 el-pagination**。
- 原因：防止查询期间改动表单污染已发出的参数。新增列表页照此写。

### 3.5 防重复提交三层

1. **按钮级**：提交按钮用 `<ButtonThrottle v-model="form.butLoading">` 包裹（throttle-box 组件，入口已全局注册；`butLoading` 放进对应 form/data）：

   ```vue
   <ButtonThrottle v-model="form.butLoading">
     <el-button type="primary" @click="submitForm">确 定</el-button>
   </ButtonThrottle>
   ```

2. **请求级**：`$apiQC.preventShake` 熔断（axios.js 自动对相同 url+参数生效，无需手写）。
3. **全局级**：`submitDDTag` / `loadingStore`（拦截器统一开关）。
- 新增"增/改/删/导出/审核"类按钮必须用第 1 层。

### 3.6 主题与样式

- 主题 = `src/tools/skin/modules/*.js` 皮肤对象（default/green/black）+ CSS 变量；**勿用 scss 变量做主题**。
- 页面 scoped 样式，类名风格照抄现有页面。

### 3.7 权限

- 指令：`v-hasPermi="['system:user:list']"`、`v-hasRole="['admin']"`——无权限时**移除元素**（不是隐藏）。
- 权限串格式 `模块:实体:动作`（如 `system:post:add`）；`*:*:*` 为超管全权限。
- **数组是 AND 语义**：数组内所有权限串都具备才显示（与若依原版"任一命中"不同，写多串时注意）。
- JS 内判断用 `checkPermi([...])` / `checkRole([...])`。

### 3.8 动态路由与菜单

- 动态路由由 `store/modules/permission.js` 的 `GenerateRoutes` 生成：`getRouters()` 后端菜单 → `routerDataChange` 递归 → `router.addRoute('frame', r)`。
- 匹配组件用 **`import.meta.glob('../../views/**/*.vue')`**（Rspack 2.x 原生支持）。**勿写 `import.meta.webpackContext`（那是 Rsbuild 1.x 模板的 API，本模板不生效）**。
  `loadView` 匹配顺序：精确路径 `../../views/<component>.vue` 优先 → 模糊 includes 兜底 → 找不到 `console.error('找不到页面组件:', view)`。
- **路由守卫写返回值（vue-router 5 风格）**：`router.beforeEach(async (to, from) => { … return '/login' / return true })`。**勿写 `next()` 回调**（vue-router 5 弃用路径）。
- **入口预加载**：`src/index.js` 在 `app.mount` 前先 `await store.dispatch('GenerateRoutes')`（有 token+userinfo 时），避免刷新动态路由地址时 vue-router 报 `VUE_ROUTER_R0004` 告警；预加载失败交回路由守卫兜底。**新增入口装配逻辑时勿把这段挪到 mount 之后**。
- 页面进菜单的条件：组件在 `src/views` 下 + 后端菜单 `component` 字段填 **views 相对路径**（如 `system/user/index`，不含 `.vue`）。
- 固定入口（不走后端菜单）加在 `router/index.js` 的 `dynamicRoutes`；`hidden: true` 表示菜单隐藏但路由可用。
- 非超管默认隐藏 `/monitor`（`notAdminMenu`，业务需要可改）。

## 4 ljs-tools 用法入口

- API 文档站（参数表、示例，**以它为准**）：https://ljs-y.github.io/ljs-vue3
- 包内 AI 说明：ljs-tools 的 `AI.md`（npm 包内；llms.txt 有 10 包索引）。
- 本模板最常用：`$LJSbase.fieldCheck / deepCopy / getTreeParents`、`$LJSmenu.fristOpenMenu / updateTreeOpen`、`$LJSsession.clearVuex`。
- 本文件不复制 API 参数表（防失同步）；用到没列的成员，去文档站查。

## 5 常见任务操作手册

### 5.1 加页面

1. 建 `views/<模块>/<功能>/` 三件套（按 3.1 桥接；`index.js` 里 `name` 用 PascalCase 并与菜单路由 name 一致）。列表页分页用 `<pagination>`（绑定见 3.4），勿直接用 el-pagination。
2. 需要接口先加 `api/<域>/<模块>.js`（见 5.2）。
3. 后端菜单管理配菜单：`component` 填 `<模块>/<功能>/index`，`name` 与组件 name 一致，权限串 `模块:实体:动作`。
4. 不走后端菜单的固定页才加 `router/index.js` 的 `dynamicRoutes`。
5. 自检：dev 起服务（端口 9990）→ 登录 → 菜单进入 → **刷新后页面不丢**（keep-alive name 对；刷新直达动态路由地址也不报 VUE_ROUTER_R0004）→ 按钮权限按角色显隐。

### 5.2 加接口

1. `src/api/<域>/<模块>.js`：`import { get, post, put, del } from '@/api/axios.js'`，一函数一接口，JSDoc 注明用途。
2. 返回遵循 3.3 契约；调用方 `xxx(params).then(res => { if (res.code === 200) … })`。
3. 列表接口用 `res.rows` / `res.total` 绑表格和分页；查询参数走 3.4 双份制。

### 5.3 加字典

1. 后端字典管理建字典类型+数据（dictType 形如 `sys_xxx_yyy`）。
2. 页面取值：`const list = await this.$dict.getDict('sys_xxx_yyy')`（resolve 出的即 `data` 数组，字典项字段 `dictLabel`/`dictValue`）。
3. 回显用平铺方法 `selectDictLabel(dicts, value)` / `selectDictLabels`。
4. 需要扩展行为时改 `src/tools/dict/index.js`（挂 `$dict`）。

### 5.4 加权限（按钮级）

1. 后端建权限串 `模块:实体:动作`（如 `system:post:export`），角色赋权。
2. 按钮加 `v-hasPermi="['模块:实体:动作']"`（多串是 AND，见 3.7）。
3. JS 分支逻辑用 `checkPermi([...])`。
4. 验证：无权限用户登录，按钮元素不存在（被移除）。

## 6 禁止事项红线

1. **不改响应契约**（code/msg/rows/total 与拦截器行为）；确需变更先报告拍板。
2. **不动 store 持久化语义**：`PERSIST_PATHS` 内状态（token/userinfo/menu*/frameTheme…）勿随意增删。
3. **不引入 TS**。
4. **新增 env 变量必须 PUBLIC_ 前缀并补齐 .env 四件套**——漏前缀 = 运行时 undefined。
5. **易变细节不写进本文件**：组件参数表/API 清单放文档站，本文件只留稳定原则与入口。
6. **不引第三方 UI 库**：Element Plus 全量+全量图标已装配；自动注册仅对 `src/components`。
7. **改 `rsbuild.config.mjs` 先核对官方 schema 键名（Rsbuild 2.x schema 大改，勿凭 1.x 经验）**——schema 不认识的键会被**静默忽略**（死配置教训见 7.5）。判断配置是否生效看**产物实证**（chunk 文件命名），不看注释自述。

## 7 不要模仿清单（历史教训）

> 记录在此防止再犯——这些模式一律不要模仿。

**本模板已修复 5 处（2026-10-26，用户逐项拍板清理）：**

1. **get 死代码**：`api/axios.js` 请求拦截器曾有 `if (method === 'get' && params) { params = {}; config.url = …tansParams(params)… }`——覆盖的是解构的局部变量，对 `config.params` 无效，净效果为零；已删（2026-10-26）。
   **教训：改参数必须写回 config/对象本身；"看起来在做事"的无效代码直接删。**
2. **死 getter**：`store/getters.js` 曾有 `menuChoose`——state 无此字段、全工程无消费方（真正逻辑在 frame 组件局部 `menu.rightMenu.menuChoose`）；已删（2026-10-26）。
   **教训：getter/工具方法必须有真实消费方，无主即删。**
3. **他项目残留**：`components/ExcelImport/index.vue` 曾写死 `/ywpt/ywptInputData/*` 路径与 `ywpt:*` 权限串、`api/smExecute.js` 白名单注释曾写 `'/api/activity/info'`——已改中性（2026-10-26，`/system/xxx/…`、`system:xxx:import`、注释 `'/system/xxx/list'`）。
   **教训：模板内示例必须中性，禁止带具体项目名的路径/权限串。**
4. **他项目命名残留**：`tools/base.js` JSDoc 示例曾残留 `wine_*` 字典名、`api/smExecute.js` 的 session key 曾叫 `wine_a`/`wine_b`——已改中性（2026-10-26，`sys_normal_disable` 等、`ljs_a`/`ljs_b`）。
   **教训：字典名/存储键名同样不得带具体项目名。**
5. **死配置块（Rsbuild 2.x 键位陷阱）**：`rsbuild.config.mjs` 曾把拆包写在 `output.splitChunks` + `output.mergeDuplicateChunks` + `output.filename.chunkFilename`——**均不在 Rsbuild 2.x schema**，整块从未生效（产物实证：自定义 chunk 名命中 0）。已迁移到**顶层 `splitChunks`** 并删除 deprecated 的 `performance.chunkSplit`（2026-10-26，产物实证 lib-elementPlus/lib-bigLibs/common/vendor 四签名全部命中）。
   **教训：配置键以当前版本官方 d.ts schema 为准（1.x 经验在 2.x 键位全变）；配置是否生效看产物 chunk 命名实证，不看注释自述。**

**补记（2026-10-26 国密复核轮）：** 加/解密前缀门曾硬编码 `apiUrl.startsWith('/api/')`，与本模板业务 API 形态（`/system/*` 等）不匹配——密钥+开关齐备也恒不触发加解密分支。已改为入参 `apiPrefix`（默认取 env `PUBLIC_SM_API_PREFIX`，缺省 '/api/'）。
   **教训：门条件必须与项目 API 约定对齐并可配置；硬编码前缀遇 API 形态变化即静默失效。**

**跨模板差异警示（同源模板的写法在本模板不适用）：**

6. **动态路由 API 不同**：本模板用 `import.meta.glob('../../views/**/*.vue')`；`import.meta.webpackContext` 是 ljs-vue3-rsbuild（Rsbuild 1.x）的写法，在本模板不生效。
7. **路由守卫风格不同**：本模板 vue-router 5，守卫写**返回值**；勿从 vue-router 4 模板搬 `next()` 写法。
8. **压缩插件不同**：本模板用 `rsbuild-plugin-compression`（algorithms: gzip+brotli）；`compression-webpack-plugin` 是 Rsbuild 1.x 模板的写法。

**同源模板（ljs-vue3-vite）的教训，本模板无此问题但必须警惕：**

9. **env 前缀错配**：构建器只暴露规则内前缀（Rsbuild=`PUBLIC_`，Vite=`VITE_`）；在 Vite 模板里引用 `import.meta.env.PUBLIC_*` 共 8 处运行时 undefined（上传/导入地址功能性损坏）。
   **教训：见红线 4；跨构建器移植代码必须逐处换前缀。**
10. **隐式全局依赖**：Vite 模板 `callback.js` 曾调用未 import 的 `LJSmenu`，特定分支（带 token 访问 `/`）直接 ReferenceError。
   **教训：模块符号先 import 再用，勿假设"全局挂过"。**

## 附则

- **CLAUDE.md 双写**：本文件与根目录 `CLAUDE.md` 内容必须**完全一致**；改本文件后立即同步（复制即可，后续可加同步脚本）。
- **一次写对门禁**：本文件的验收方式 = 4 任务测试——只给 AI 本文件，令其完成「加页面 / 加接口 / 加字典 / 加权限」各一例，产出符合第 3 章约定即通过；不达标补文档、不迁就。
- 版本：v1（2026-10，ljs-vue3-rsbuild2 打样版）。
