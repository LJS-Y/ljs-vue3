# ljs-vue3

基于若依分离版后端 V3.8.5 的 Vue3 前端框架，7 套开箱即用模板（Vite / Rsbuild / H5 / uni-app），深度集成 ljs-tools。路由、权限、请求封装、字典、国密加解密都已就位，不是空壳模板。

> English: A Vue3 admin frontend framework built on RuoYi-Vue3 (backend v3.8.5). 7 ready-to-use templates covering Vite / Rsbuild / H5 / uni-app, with routing, permission, request wrapper, dictionary and GM crypto already wired in — not an empty scaffold.

---

## 这个仓库是什么

LJS 体系分四层，本仓库是 **Web 框架层**：

```
ljs-tools         工具层    npm 包（15 个工具模块 + 9 个组件）
ljs-vue3          Web 框架  ← 你在这里（中后台 5 套 + H5 + uni-app 2 套）
create-ljs        脚手架    一条命令生成 Web 工程
ljs-mini-program  移动端    小程序框架（uni-app Vue3 + TS，7 个 ljs-* 套件）
```

`ljs-tools` 负责「工具函数和通用组件」，`ljs-vue3` 负责「完整可跑的中后台工程」，两者是**上下层关系，不是谁依赖谁**。
要做**微信小程序**，用 [ljs-mini-program](https://github.com/LJS-Y/ljs-mini-program)，不是本仓库的 uni-app 模板。

---

## 7 个模板怎么选

> 一句话：**要 Web 中后台选前 4 个，要移动端 H5 选 ljs-h5，要小程序/App 选后 2 个。**

### 选择决策树

```
你的项目形态？
├─ Web 后台管理
│   ├─ 单体项目 ────┬─ 生态稳、坑少 ───────────── ljs-vue3-vite
│   │                ├─ 想要更快冷启动 ─────────── ljs-vue3-rsbuild
│   │                └─ 想要新版 Rsbuild 实践 ──── ljs-vue3-rsbuild2
│   └─ 多子系统／模块化平台 ───────────────────── ljs-vue3-rsbuild-module-platform
├─ 移动端 H5（微信内嵌页等）────────────────────── ljs-h5
└─ 小程序 / App
    ├─ 新项目（Vue 3）────────────────────────── ljs-uniapp-vue3
    └─ 存量维护（Vue 2）──────────────────────── ljs-uniapp

不确定？→ ljs-vue3-vite
```

### Web 中后台（CLI 项目）

| 模板 | 构建工具 | Vue | ljs-tools | 适用场景 | 什么时候别选它 |
| --- | --- | --- | --- | --- | --- |
| **ljs-vue3-vite** | Vite 5 | 3.3 | ^1.0.0 | 常规中后台，生态最广、坑最少 | 追求极致构建速度时 |
| **ljs-vue3-rsbuild** | Rsbuild 1.x | 3.5 | ^1.0.0 | 想要更快冷启动与热更新 | 团队不熟悉 Rspack 生态 |
| **ljs-vue3-rsbuild2** | Rsbuild 2.x | 3.5.41 | ^1.0.0 | rsbuild 新版实践，配置更现代 | 需要与老项目保持一致时 |
| **ljs-vue3-rsbuild-module-platform** | Rsbuild 1.x | 3.3 | ^1.0.0 | 模块化平台型项目（多子系统） | 单体型中后台，杀鸡用牛刀 |

**ljs-vue3-vite 和 ljs-vue3-rsbuild 怎么选？**

两者功能一致，区别只在构建工具。Vite 生态成熟、插件多；Rsbuild 冷启动更快。**不确定就选 Vite。**

**rsbuild 和 rsbuild2 怎么选？**

`rsbuild2` 用 Rsbuild **2.x**（配置键位与 1.x 有差异，如拆包从 `performance.chunkSplit` 迁到顶层 `splitChunks`）。
新项目优先 `rsbuild2`；需要与已有 1.x 项目保持一致时用 `rsbuild`。

### 移动端 H5（CLI 项目）

| 模板 | 构建工具 | Vue | ljs-tools | 适用场景 |
| --- | --- | --- | --- | --- |
| **ljs-h5** | Rsbuild 2.x | 3.5.41 | ^1.0.0 | 移动端 H5 页面、微信内嵌页 |

### 小程序 / App（HBuilderX 项目）

| 模板 | 工具链 | Vue | 适用场景 |
| --- | --- | --- | --- |
| **ljs-uniapp-vue3** | HBuilderX | **Vue 3** | 新项目，小程序 + App 多端 |
| **ljs-uniapp** | HBuilderX | **Vue 2** | 存量 Vue2 项目维护 |

> ⚠️ **uni-app 两个模板是 HBuilderX 项目，不是 CLI 项目。**
> 依赖走 `uni_modules/` 内嵌，**不需要 `npm install`**，用 HBuilderX 直接打开即可运行。
> 新项目请用 `ljs-uniapp-vue3`；`ljs-uniapp` 是 Vue 2 版本，仅供存量项目参考。
>
> 要做**微信小程序且偏现代工程化（TS + 约定式路由 + pnpm）**，推荐用独立仓库
> [ljs-mini-program](https://github.com/LJS-Y/ljs-mini-program)，而不是这里的 uni-app 模板。

---

## 内置了什么

### Web 中后台模板通用能力

| 能力 | 说明 |
| --- | --- |
| **完整路由体系** | 动态路由 + 路由守卫 + 白名单 |
| **权限控制** | 页面级权限、按钮级权限指令 |
| **请求封装** | axios 拦截器、统一错误处理、token 处理 |
| **字典管理** | 字典获取、回显、缓存 |
| **系统管理** | 用户 / 角色 / 菜单 / 部门 / 岗位 / 字典管理 |
| **系统监控** | 缓存监控 / 定时任务 / 登录日志 / 操作日志 |
| **国密加解密** | SM2 签名验签、SM3 杂凑、SM4 对称加密（前后端对齐） |
| **主题皮肤** | 框架皮肤切换（顶栏/侧栏配色），持久化到本地 |
| **常用组件** | 表格、表单、上传、Excel 导入、文件预览、富文本、图标选择器等 |

### 深度集成的 ljs-tools

框架内已通过 `app.use(LjsTools)` 全局注入，业务代码可直接用 `this.$LJSxxx`（选项式）或 `proxy.$LJSxxx`（组合式）调用，无需 import：

```js
// 判空——判断 undefined / null / ''
this.$LJSbase.fieldCheck(value)

// 日期格式化
this.$LJSdate.formatTime(Date.now(), '{y}-{m}-{d} {h}:{i}:{s}')

// 金额千分位
this.$LJSnum.moneySplit(1234567.89)

// 默认查询区间（近 N 天）
this.$LJSdate.initSearchDate(10)
```

> 完整 API 见文档站：[ljs-y.github.io/ljs-vue3](https://ljs-y.github.io/ljs-vue3/ljs-tools/function/base/)
> 局部引入方式：`import { LJSbase, LJSdate } from 'ljs-tools'`

---

## 快速开始

### Web 中后台 / H5

```bash
# 1. 克隆仓库
git clone https://github.com/LJS-Y/ljs-vue3.git
cd ljs-vue3

# 2. 进入想用的模板（以 vite 版为例）
cd ljs-vue3-vite

# 3. 安装依赖
npm install

# 4. 启动
npm run dev
```

**用哪个模板，就进哪个目录执行。** 每个模板都是独立可运行的工程。

### 小程序 / App

```bash
# 1. 克隆仓库
git clone https://github.com/LJS-Y/ljs-vue3.git

# 2. 用 HBuilderX 打开对应目录
#    ljs-uniapp-vue3/  （Vue 3，推荐）
#    ljs-uniapp/       （Vue 2，存量项目）

# 3. 直接在 HBuilderX 里点「运行」
```

**不需要 `npm install`** —— 依赖在 `uni_modules/` 里。

---

## 和后端怎么对接

本框架对应**若依分离版后端 V3.8.5**。

```bash
# 1. 启动若依后端（默认 8080）
# 2. 修改前端 .env 里的接口地址（如需要）
# 3. 前端 npm run dev
```

默认开发账号：`admin` / `admin123`（与若依后端一致）

---

## 与若依官方前端（ruoyi-ui）有什么不同

| 维度 | 若依官方 ruoyi-ui | ljs-vue3 |
| --- | --- | --- |
| Vue 版本 | Vue 2 | **Vue 3** |
| 构建工具 | Vue CLI（webpack） | **Vite / Rsbuild 可选** |
| 工具函数 | 项目内散落 | **统一封装为 ljs-tools** |
| 国密支持 | 无 | **内置 SM2/SM3/SM4** |
| 多端支持 | 无 | **Web / H5 / 小程序 / App** |
| 模板数量 | 1 套 | **7 套** |
| AI 就绪 | 无 | **ljs-tools 有 AI.md + index.d.ts；5 个模板有 AGENTS.md** |

## 选型对比：什么情况下**不**选本仓库

诚实地讲清边界，帮你少走弯路：

| 你的情况 | 建议 | 原因 |
| --- | --- | --- |
| 后端**不是**若依系，且不打算用若依的权限模型 | 考虑 vue-pure-admin / vben 等通用中后台模板 | 本项目深度绑定若依的菜单/字典/权限接口结构 |
| 只需要几个页面，不要中后台体系 | 直接 `npm create vue@latest` | 本项目的路由、权限、请求层对轻量项目是负担 |
| 要做**微信小程序**为主 | [ljs-mini-program](https://github.com/LJS-Y/ljs-mini-program) | 本仓库的 uni-app 模板是 HBuilderX 工程，工程化程度不如独立小程序框架 |
| 团队强制用 Webpack | 用 `ljs-vue3-vite` 自己改，或另选模板 | 本项目不提供 webpack 方案 |
| 需要 React 生态 | 不适用 | 本项目是 Vue3 |
| 项目要长期维护、不想被单一框架绑定 | 用若依官方 ruoyi-ui 或通用模板 | 本项目含作者个人封装（`$LJS*` 系列），有学习成本 |

**反过来说**，以下情况本项目最合适：

- 后端是**若依分离版**（或同样接口结构），想直接跑起来不改接口层
- 需要**国密 SM2/SM3/SM4**（多数开源模板没有）
- 同一套体系要覆盖 **Web 中后台 + H5 + 小程序**
- 想**少写重复代码**（字典、权限指令、请求封装、表格封装都已就位）

---

## AI 就绪程度

本项目按「AI 是用户」的思路整理过，各层现状：

| 层级 | 现状 |
| --- | --- |
| **ljs-tools**（工具层）| ✅ `AI.md` + `index.d.ts` 齐全，`llms.txt` 有索引 |
| **5 个 Web/H5 模板** | ✅ 各有 `AGENTS.md` + `CLAUDE.md`（技术栈、目录约定、常见任务手册、红线）|
| **uni-app 2 个模板** | ⚠️ 暂无 AGENTS.md（HBuilderX 工程，后续补）|
| **框架级 AI.md** | ⚠️ 暂无（本 README + `llms.txt` 承担该职责）|

`AGENTS.md` 是写给 AI 协作者的项目约定，Claude Code / Cursor / Codex 等工具进项目后会自动读取。

---

## 相关仓库

| 仓库 | 说明 |
| --- | --- |
| [ljs-tools](https://github.com/LJS-Y/LJSTools) | 工具库与组件（本项目的基础依赖） |
| [ljs-mini-program](https://github.com/LJS-Y/ljs-mini-program) | 小程序框架：uni-app Vue3 + TS + UnoCSS |
| [create-ljs](https://github.com/LJS-Y/create-ljs) | 一条命令生成工程：`npm create ljs@latest` |
| 10 个独立 npm 插件 | [npm @9mountain](https://www.npmjs.com/~9mountain) |

## 文档

- **API 文档**：[ljs-y.github.io/ljs-vue3](https://ljs-y.github.io/ljs-vue3)
- **llms.txt**（给 AI 读的项目索引）：[ljs-y.github.io/ljs-vue3/llms.txt](https://ljs-y.github.io/ljs-vue3/llms.txt)
- **模板内约定**：各模板目录下的 `AGENTS.md`（或 `CLAUDE.md`，内容一致）

---

## 系列文章：跟 AI 做朋友

一个写了 10 个 npm 插件的开发者，在 AI 冲击下的重新定位。

- [我的 10 个 npm 插件，差点被 AI 判了死刑](https://juejin.cn/post/7701545216016891947) ｜ [知乎版](https://zhuanlan.zhihu.com/p/2098742967276138829)
- 第二篇：让 AI 用起来：四层验收（待发）

---

## License

MIT
