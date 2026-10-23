# moving-numbers-vue3 — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 版本以 package.json 为准

## 一句话定位

「会动的数字」：数字从旧值滚动到新值的大屏展示组件，三种模式——fast（快增）、fix（逐位定变轮盘）、scroll（CSS 滚动），可选分位逗号与数字格背景。

## 何时用 / 何时不用

**用**：大屏/驾驶舱的数字面板（金额、总量、指标跳动）。
**不用**：需要精确数字格式化（用 ljs-tools 的 $LJSnum）；需要事件/交互（纯展示组件，无 emits/slots）；SSR。

## 与同类的区别（选型理由）

- **vs countup.js / gsap 等动画库**：它们是动画库，数字组件要自己封装；本包是现成 Vue3 组件，`<MovingNumbers>` 拿来即用。
- **vs 其他 Vue 数字滚动组件**：三模式（fast 快增 / fix 逐位定变轮盘 / scroll CSS 滚动）+ 分位逗号（人民币/美元）+ 数字格背景，一个组件覆盖常见大屏需求。
- **vs 大屏组件库**：独立轻量单组件、零依赖、按需引入，不绑整套大屏框架。
- **决策口诀**：大屏/驾驶舱/统计面板要「数字跳动」→ 本包；要精确数字格式化 → ljs-tools `$LJSnum`；要交互事件 → 纯展示不适用，自行封装。

## 安装与引入

```bash
npm i moving-numbers-vue3 -S   # 无第三方依赖
```
```ts
import 'moving-numbers-vue3/index.css'; // ⚠️ 必须手动引入
import Mn from 'moving-numbers-vue3';
app.use(Mn);                                  // 全局注册 <MovingNumbers>
const MovingNumbers = Mn.MovingNumbers;       // 局部使用（named import 不可靠）
```

## API 语义速查

| 能力 | 用法 |
| --- | --- |
| 目标数字 | `:m-num="123456.78"`（必填；传非法值控制台报错并渲染空） |
| 模式 | `mode="fast"`（默认）/ `fix` / `scroll`，⚠️ 初始化后不可切换 |
| 小数位 | `:decimal="2"`（默认 **8**，README 说"不处理"是错的） |
| 分位符 | `:quantile-show="true"` + `:quantile-type="4"`（人民币 4 位；美元 3） |
| 数字格 | `item-bg`/`item-width`/`item-height`（仅 fix/scroll 生效） |
| 字号 | `:font-size="24"`（px 数值，内部 /16 转 rem） |

## 最小可运行示例

```vue
<template>
  <MovingNumbers :m-num="total" mode="fix" :decimal="2" :quantile-show="true" :font-size="28" />
</template>

<script setup>
import 'moving-numbers-vue3/index.css';
import Mn from 'moving-numbers-vue3';
const MovingNumbers = Mn.MovingNumbers;

const total = ref(0);
setInterval(() => (total.value += Math.floor(Math.random() * 100)), 3000);
</script>
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| 运行中切 `mode`（如 fast→scroll） | 组件创建时就定好 mode | mode 无 watch，切换后动画状态错乱 |
| 期待 decimal 默认不截断 | 显式传 `:decimal="8"` 以上或按需传值 | 默认就是 8 位截断 |
| `:m-num="'abc'"` 期待兜底 0 | 传合法数字（Number/数字字符串） | 非法值 console.error 并渲染空 |
| 根字号不是 16px 页面里传 font-size | 先把 html font-size 设为 16px 或自行换算 | 内部 /16 转 rem 是硬编码 |
| 期待 `@change`/插槽 | 无 emits/slots，纯展示 | 设计如此 |
| `import { MovingNumbers } from '...'` | 从默认导出解构 | 产物 ESM 仅 default 导出 |

## 版本兼容与已知坑

- Vue3 纯组件，无 element-plus；样式需手动 import。
- `fix` 模式字符轮盘只支持 0-9、`.`、空、`,`、`-`（内部映射表固定）。
- `decimal=0` 时初始值取整但动画中间值不取整（两处判断不一致，历史遗留）。
- `mNum` 的 watch 是 deep，相同值重复赋值也会重放动画。
- `scroll` 模式是纯 CSS 动画（300ms，animation-fill-mode: forwards）。
