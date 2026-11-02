# ljs-vue3

基于若依分离版后端 V3.8.5 的 Vue3 前端框架，7 套开箱即用模板（Vite / Rsbuild / H5 / uni-app），深度集成 ljs-tools。路由、权限、请求封装、字典、国密加解密都已就位，不是空壳模板。

> English: A Vue3 admin frontend framework built on RuoYi-Vue3 (backend v3.8.5). 7 ready-to-use templates covering Vite / Rsbuild / H5 / uni-app, with routing, permission, request wrapper, dictionary and GM crypto already wired in — not an empty scaffold.

---

## 这个仓库是什么

LJS 体系分三层，本仓库是**框架层**：

```
ljs-tools      工具层   npm 包（15 个工具模块 + 9 个组件）
ljs-vue3       框架层   ← 你在这里
你的项目        业务层
```

`ljs-tools` 负责「工具函数和通用组件」，`ljs-vue3` 负责「完整可跑的中后台工程」，两者是**上下层关系，不是谁依赖谁**。

---

## 7 个模板怎么选

> 一句话：**要 Web 中后台选前 4 个，要移动端 H5 选 ljs-h5，要小程序/App 选后 2 个。**

### Web 中后台（CLI 项目）

| 模板 | 构建工具 | Vue 版本 | 适用场景 | 什么时候别选它 |
| --- | --- | --- | --- | --- |
| **ljs-vue3-vite** | Vite | 3.3 | 常规中后台，生态最广、坑最少 | 追求极致构建速度时 |
| **ljs-vue3-rsbuild** | Rsbuild | 3.5 | 想要更快冷启动与热更新 | 团队不熟悉 Rspack 生态 |
| **ljs-vue3-rsbuild2** | Rsbuild | 3.5.41 | rsbuild 新版实践，配置更现代 | 需要与老项目保持一致时 |
| **ljs-vue3-rsbuild-module-platform** | Rsbuild | 3.3 | 模块化平台型项目（多子系统） | 单体型中后台，杀鸡用牛刀 |

**ljs-vue3-vite 和 ljs-vue3-rsbuild 怎么选？**

两者功能一致，区别只在构建工具。Vite 生态成熟、插件多；Rsbuild 冷启动更快。**不确定就选 Vite。**

### 移动端 H5（CLI 项目）

| 模板 | 构建工具 | Vue 版本 | 适用场景 |
| --- | --- | --- | --- |
| **ljs-h5** | Rsbuild | 3.5 | 移动端 H5 页面、微信内嵌页 |

### 小程序 / App（HBuilderX 项目）

| 模板 | 工具链 | Vue 版本 | 适用场景 |
| --- | --- | --- | --- |
| **ljs-uniapp-vue3** | HBuilderX | **Vue 3** | 新项目，小程序 + App 多端 |
| **ljs-uniapp** | HBuilderX | **Vue 2** | 存量 Vue2 项目维护 |

> ⚠️ **uni-app 两个模板是 HBuilderX 项目，不是 CLI 项目。**
> 依赖走 `uni_modules/` 内嵌，**不需要 `npm install`**，用 HBuilderX 直接打开即可运行。
> 新项目请用 `ljs-uniapp-vue3`；`ljs-uniapp` 是 Vue 2 版本，仅供存量项目参考。

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

> 关于「AI 就绪」：`ljs-tools` 已补齐 `AI.md` 与 `index.d.ts`（让 AI 编码助手更容易正确调用），
> 框架层模板的 `AGENTS.md` 约定包**尚未落地**，属于后续计划。

---

## 相关仓库

| 仓库 | 说明 |
| --- | --- |
| [ljs-tools](https://github.com/LJS-Y/LJSTools) | 工具库与组件（本项目的基础依赖） |
| [create-ljs](https://github.com/LJS-Y/create-ljs) | 一条命令生成工程：`npm create ljs@latest` |
| 10 个独立 npm 插件 | [npm @9mountain](https://www.npmjs.com/~9mountain) |

## 文档

- **API 文档**：[ljs-y.github.io/ljs-vue3](https://ljs-y.github.io/ljs-vue3)
- **llms.txt**（给 AI 读的项目索引）：[ljs-y.github.io/ljs-vue3/llms.txt](https://ljs-y.github.io/ljs-vue3/llms.txt)

---

## 系列文章：跟 AI 做朋友

一个写了 10 个 npm 插件的开发者，在 AI 冲击下的重新定位。

- [我的 10 个 npm 插件，差点被 AI 判了死刑](https://juejin.cn/post/7701545216016891947) ｜ [知乎版](https://zhuanlan.zhihu.com/p/2098742967276138829)
- 第二篇：让 AI 用起来：四层验收（待发）

---

## License

MIT
