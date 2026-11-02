# AGENTS.md — ljs-vue3-rsbuild-module-platform 项目约定（v1，2026-11）

> 本文件是写给 AI 协作者的项目约定包。四层验收：能发现、能理解、能正确调用、能直接接入。
> 怎么读：先看第 0 章；做任务查第 5 章；下笔前过一遍第 6/7 章红线。

## 0 阅读指引

- 本文件只写**稳定原则**（第 1/2/3/6/7 章）。易变细节（工具 API 参数表、组件参数表）一律外置到文档站/AI.md，本文件只给入口链接（第 4/5 章），不复制。
- 改约定的顺序：先改代码/外置文档 → 再同步本文件 → 同步 CLAUDE.md（两文件内容必须完全一致）。
- 本文件与代码不一致时：**先报告、不擅自行动**，以实际代码行为为准做判断依据。

## 1 项目速览

- **定位**：若依 V3.8.5（分离版）深度集成 ljs-tools 的 Vue3 后台管理框架模板，**模块化平台版**——面向「一个平台下挂多个子系统」的场景，比单体中后台多一个**模块导航页**（`views/moduleGuide`，用 ball-swiper 3D 轮播展示各子系统卡片）。**JS 为主，非 TS**。
- **技术栈**：Vue 3.3 + Rsbuild 1.3（Rspack）+ Element Plus 2.8 + Vuex 4 + vue-router 4 + ljs-tools ^1.0.0。
- **命令**：`npm run dev`（开发，端口 **9900**，带 `--open` 自动开浏览器）/ `npm run build`（生产产物）/ `npm run test`（`--env-mode test`，测试环境产物）/ `npm run preview`。
- **环境变量**：Rsbuild 规则——**只有 `PUBLIC_` 前缀会进客户端代码**（与 Vite 模板的 `VITE_` 不同，跨模板移植代码必须逐个换前缀）。四件套 `.env` / `.env.development` / `.env.test` / `.env.production`。
  现有变量：`BASE_URL`（部署子路径）、`PUBLIC_PROJECT_NAME`、`PUBLIC_COMPANY_OWNER`、`PUBLIC_RECORD_NUMBER`、`PUBLIC_NODE_ENV`、`PUBLIC_CURRENTMODE`、`PUBLIC_API_URL`（接口地址）、`PUBLIC_GO_HOME`、`PUBLIC_CAPTCHA_ON_OFF`（验证码开关）、`PUBLIC_SM_CRYPTO`（国密开关 '0'/'1'）、`PUBLIC_SM_API_PREFIX`（国密加解密接口 URL 前缀门，默认 '/api/'）。
  **新增变量三步**：①用 `PUBLIC_` 前缀 ②四件套补齐 ③在本节登记名字和含义。
- **运行时配置**：`public/config.js` 挂 `window.g`，打包后可直接改、不进构建。
- **国密**：`src/api/smExecute.js`（请求加密/响应解密），由 `PUBLIC_SM_CRYPTO` 开关；加解密限「前缀门内 + post/put」，前缀门为入参 `apiPrefix`（默认取 env `PUBLIC_SM_API_PREFIX`，缺省 '/api/'），另有加/解密 URL 白名单可排除个别接口。

## 2 目录约定

```
src/
  index.js            入口装配：router/store/ljs-tools/ElementPlus
  api/                接口层
    axios.js          统一封装：get/post/put/del/upload/download + token 注入 + 响应拦截
    smExecute.js      国密加解密（拦截器内自动调用）
    <域>/<模块>.js     具体接口
  views/              页面
    moduleGuide/      **模块导航页（本模板特有）**：ball-swiper 轮播展示 $store.getters.modules
    systemManage/     系统管理区
      system/         用户/角色/菜单/部门/岗位/字典
      monitor/        缓存/定时任务/日志
    frame/            主框架布局
    login/ 404.vue empty.vue
  components/         通用组件
  router/
    index.js          静态路由 + dynamicRoutes
    callback.js       路由守卫（vue-router 4 的 next() 风格）
  store/
    index.js          状态定义 + modules/module 字段
    getters.js        含 modules / module 取数口
    modules/permission.js   GenerateRoutes：后端菜单 → 动态路由 + 菜单树
  tools/              业务工具（index.js 注册表统一挂载，见 3.2）
    base.js run.js build.js dict/ apiQueryChange.js errorImages.js
    directives/       v-hasPermi / v-hasRole
    ruoyi/            若依工具集
    skin/             主题皮肤对象（modules/default|green|black.js）
  assets/
rsbuild.config.mjs    构建配置（拆包、server.port=9900）
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

- 业务逻辑全在 `index.js`（Options API：data/created/mounted/methods…）。
- **组件 `name` 用 PascalCase，且与菜单配置的路由 `name` 一致**（keep-alive 按 name 缓存，不一致 = 不缓存）。
- 样式全在 `index.scss`（scoped）。

### 3.2 工具库三层分工（勿混用）

| 层 | 来源 | 形态 | 例子 |
|---|---|---|---|
| 能力库 | ljs-tools（入口 app.use） | `$LJS` 前缀 | `$LJSbase.fieldCheck/deepCopy/getTreeParents`、`$LJSmenu.fristOpenMenu/updateTreeOpen`、`$LJSsession.clearVuex` |
| 业务工具 | `src/tools`（注册表挂载） | `$` 单前缀 | `$run`（路由跳转/外链）、`$dict`（getDict）、`$base`、`$apiQC`、`$build`、`$em`（兜底图） |
| 平铺方法 | tools 注册表 other_function | 无前缀全局可用 | `resetForm`、`handleTree`、`addDateRange`、`selectDictLabel(s)`、`checkPermi`、`checkRole`、`download` |

> **平铺方法的调用形态**：它们挂在组件实例上（globalProperties）——**JS 方法体里必须 `this.download(...)` / `this.selectDictLabel(...)`**；模板表达式里可省 `this.`。裸标识符调用（`download(...)`）是 ReferenceError。

### 3.3 接口与响应契约

- 接口函数写在 `src/api/<域>/<模块>.js`，从 `@/api/axios.js` 引 `get/post/put/del/upload/download`。
- 响应契约（**不可改**）：列表 `{code, msg, rows, total}`，详情/操作 `{code, msg, data}`。
  `code === 200` 成功；`401` 由拦截器清会话跳 `/login`；其他 code 拦截器统一弹警告，页面不重复弹。
- 判空一律 `this.$LJSbase.fieldCheck(x)`（**该函数只判 `undefined` / `null` / `''`，不判 `0` 和 `false`**；勿用 `!x`、勿引 lodash）。

### 3.4 查询参数双份制（tableSearch）

- 表单绑定 `tableSearch.query`，实际发出 `tableSearch.queryReal`：
  `this.tableSearch.queryReal = this.$LJSbase.deepCopy(this.tableSearch.query);` 然后 `list(this.tableSearch.queryReal)`。
- **分页参数 `pageNum`/`pageSize` 放在 `tableSearch.queryReal` 内**，随 queryReal 一起发出，不单独平铺。
- **列表分页用 `<pagination>` 组件**：`:total` + `v-model:page`/`v-model:limit` 绑 `tableSearch.queryReal.pageNum/pageSize` + `@pagination="getList"`；**勿直接用 el-pagination**。
- 原因：防止查询期间改动表单污染已发出的参数。新增列表页照此写。

### 3.5 防重复提交三层

1. **按钮级**：提交按钮用 `<ButtonThrottle v-model="form.butLoading">` 包裹（throttle-box，`butLoading` 放进对应 form/data）：

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
- **数组是 AND 语义**：数组内所有权限串都具备才显示（与若依原版"任一命中"不同）。
- JS 内判断用 `checkPermi([...])` / `checkRole([...])`。

### 3.8 动态路由与菜单

- 动态路由由 `store/modules/permission.js` 的 `GenerateRoutes` 生成：`getRouters()` 后端菜单 → 递归转换 → `router.addRoute('frame', r)`。
- 匹配组件用 **`import.meta.webpackContext('@/views', …)`**（Rspack 特有）。**勿写 `import.meta.glob`（那是 Vite API，本模板不生效）**。
- 路由守卫 `router/callback.js` 用 **vue-router 4 的 `next()` 风格**。**勿搬 vue-router 5 的返回值写法**。
- 页面进菜单的条件：组件在 `src/views` 下 + 后端菜单 `component` 字段填 **views 相对路径**（如 `systemManage/system/user/index`，不含 `.vue`）。
- 固定入口（不走后端菜单）加在 `router/index.js` 的 `dynamicRoutes`；`hidden: true` 表示菜单隐藏但路由可用。

### 3.9 模块化导航（本模板特有）

- 首页/入口是 **`views/moduleGuide`**：用 `ball-swiper` 3D 轮播展示各子系统卡片，数据来自 `this.$store.getters.modules`（即 `state.modules`）。
- 新增一个「子系统」的完整流程：
  1. 在 `views/` 下建子系统目录（如 `views/erp/`），其内部页仍按 3.1 三件套写；
  2. 在 store 的 `modules` 里登记该子系统（名称/图标/入口路由/描述）；
  3. 后端菜单的 `component` 路径指向 `erp/xxx/index`；
  4. `moduleGuide` 会自动把它渲染成一张卡片，无需改导航页代码。
- **勿把子系统首页写成新的一级菜单**——模块化平台的入口统一在 moduleGuide。

## 4 ljs-tools 用法入口

- API 文档站（参数表、示例，**以它为准**）：https://ljs-y.github.io/ljs-vue3
- 包内 AI 说明：ljs-tools 的 `AI.md`（npm 包内；llms.txt 有 10 包索引）。
- 本模板最常用：`$LJSbase.fieldCheck / deepCopy / getTreeParents`、`$LJSmenu.fristOpenMenu / updateTreeOpen`、`$LJSsession.clearVuex`。
- 局部引入（不走全局属性时）：`import { LJSbase, LJSdate } from 'ljs-tools'`。
- 本文件不复制 API 参数表（防失同步）；用到没列的成员，去文档站查。

## 5 常见任务操作手册

### 5.1 加页面

1. 建 `views/<模块>/<功能>/` 三件套（按 3.1 桥接；`index.js` 里 `name` 用 PascalCase 并与菜单路由 name 一致）。列表页分页用 `<pagination>`（绑定见 3.4），勿直接用 el-pagination。
2. 需要接口先加 `api/<域>/<模块>.js`（见 5.2）。
3. 后端菜单管理配菜单：`component` 填 `<模块>/<功能>/index`，`name` 与组件 name 一致，权限串 `模块:实体:动作`。
4. 不走后端菜单的固定页才加 `router/index.js` 的 `dynamicRoutes`。
5. 自检：dev 起服务 → 登录 → 菜单进入 → **刷新后页面不丢**（keep-alive name 对）→ 按钮权限按角色显隐。

### 5.2 加接口

1. `src/api/<域>/<模块>.js`：`import { get, post, put, del } from '@/api/axios.js'`，一函数一接口，JSDoc 注明用途。
2. 返回遵循 3.3 契约；调用方 `xxx(params).then(res => { if (res.code === 200) … })`。
3. 列表接口用 `res.rows` / `res.total` 绑表格和分页；查询参数走 3.4 双份制。

### 5.3 加字典

1. 后端字典管理建字典类型+数据（dictType 形如 `sys_xxx_yyy`）。
2. 页面取值：`const list = await this.$dict.getDict('sys_xxx_yyy')`（resolve 出 `data` 数组）。
3. 回显用平铺方法 `selectDictLabel(dicts, value)` / `selectDictLabels`。
4. 需要扩展行为时改 `src/tools/dict/index.js`（挂 `$dict`）。

### 5.4 加权限（按钮级）

1. 后端建权限串 `模块:实体:动作`（如 `system:post:export`），角色赋权。
2. 按钮加 `v-hasPermi="['模块:实体:动作']"`（多串是 AND，见 3.7）。
3. JS 分支逻辑用 `checkPermi([...])`。
4. 验证：无权限用户登录，按钮元素不存在（被移除）。

### 5.5 加子系统（本模板特有）

见 3.9。四步：建目录 → store 的 `modules` 登记 → 后端菜单配 `component` → moduleGuide 自动渲染。

## 6 禁止事项红线

1. **不改响应契约**（code/msg/rows/total 与拦截器行为）；确需变更先报告拍板。
2. **不动 store 持久化语义**：持久化清单内的状态勿随意增删。
3. **不引入 TS**。
4. **新增 env 变量必须 `PUBLIC_` 前缀并补齐 .env 四件套**——漏前缀 = 运行时 undefined。**跨构建器移植代码必须逐处换前缀**（Vite 模板用 `VITE_`）。
5. **易变细节不写进本文件**：组件参数表/API 清单放文档站，本文件只留稳定原则与入口。
6. **改 `rsbuild.config.mjs` 先核对官方 schema 键名**——拼写错误的键会被**静默忽略**（如历史上曾有 `output.splitChunks`、`seroutput.dataUriLimitver` 这类无效键）。配置是否生效看**产物实证**（chunk 文件命名），不看注释自述。
7. **勿绕过 moduleGuide 自建一级入口**：模块化平台的子系统入口统一在导航页，见 3.9。
8. **Element Plus 为「全量引入」，勿擅自切按需**：`src/index.js` 全量 `app.use(ElementPlus)` + 全量图标注册。2026-11-02 已删除 `rsbuild.config.mjs` 里失效的 unplugin 按需解析器（全量引入下 resolver 不会介入，属误导性配置）。**后续改造为按需引入是独立技术债任务，硬性要求：改完后使用者写 `<el-button>` / `<el-icon><Search /></el-icon>` 时无需手动 import，即解析器必须同时覆盖组件与图标。** 详见知识库《技术债-ElementPlus全量转按需》。**动这里之前先报告。**

## 7 不要模仿清单（历史教训）

> 以下问题**曾在本模板（或同源模板）存在，已修复/已规避**。记录在此防止再犯——这些模式一律不要模仿。

1. **死代码**：`api/axios.js` 曾有 `if (method === 'get' && params) { params = {}; … }`——覆盖的是解构出的局部变量，对 `config.params` 无效，净效果为零。
   **教训：改参数必须写回 config/对象本身；"看起来在做事"的无效代码直接删。**

2. **死 getter**：`store/getters.js` 曾有 `menuChoose`——state 无此字段、全工程无消费方。
   **教训：getter/工具方法必须有真实消费方，无主即删。**

3. **死配置块**：`rsbuild.config.mjs` 曾出现拼写错误的键（如 `seroutput.dataUriLimitver`）和 Rsbuild 不认的键（`output.splitChunks`、`mergeDuplicateChunks`），整块从未生效却让人以为做了精细拆包。
   **教训：配置键以官方 schema 为准；配置是否生效看产物实证，不看注释自述。**

4. **他项目残留**：模板内示例注释曾写死具体项目名的路径与权限串。
   **教训：模板内示例必须中性（`/system/xxx/…`、`system:xxx:import`），禁止带具体项目名的路径/权限串。**

5. **国密前缀门硬编码**：曾写死 `apiUrl.startsWith('/api/')`，与本模板业务 API 形态（`/system/*` 等）不匹配——密钥+开关齐备也恒不触发加解密分支。已改为入参 `apiPrefix`（默认取 env `PUBLIC_SM_API_PREFIX`，缺省 '/api/'）。
   **教训：门条件必须与项目 API 约定对齐并可配置；硬编码前缀遇 API 形态变化即静默失效。**

6. **同源模板教训（本模板无此问题但必须警惕）**：
   - **env 前缀错配**：构建器只暴露规则内前缀（Rsbuild=`PUBLIC_`，Vite=`VITE_`）。跨模板搬代码不换前缀 = 运行时 undefined。
   - **隐式全局依赖**：曾调用未 import 的 `LJSmenu`，特定分支直接 ReferenceError。模块符号先 import 再用，勿假设"全局挂过"。

## 附则

- **CLAUDE.md 双写**：本文件与根目录 `CLAUDE.md` 内容必须**完全一致**；改本文件后立即同步（复制即可）。
- **一次写对门禁**：本文件的验收方式 = 4 任务测试——只给 AI 本文件，令其完成「加页面 / 加接口 / 加字典 / 加权限」各一例（模块化平台可加测「加子系统」），产出符合第 3 章约定即通过；不达标补文档、不迁就。
- 版本：v1（2026-11，ljs-vue3-rsbuild-module-platform）。
