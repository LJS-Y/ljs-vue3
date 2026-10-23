# throttle-box — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 版本以 package.json 为准 ｜ 生成：2026-10-22

## 一句话定位

按钮级防重复提交「节流盒子」：用 element-plus 的 vLoading 遮罩盖住内容挡住连点，解决快速点击多次发请求、响应慢时重复提交的问题。

## 何时用 / 何时不用

**用**：新增/修改/删除/导出/审核这类重点按钮的防重复提交。
**不用**：纯函数级节流防抖（用 throttle/debounce）；自动管理请求生命周期（本组件不发请求、不自动开关锁）。

## 安装与引入

```bash
npm i throttle-box -S   # 前置：element-plus 的 v-loading 指令必须可用（全量 app.use(ElementPlus) 即可）
```
```ts
import 'throttle-box/index.css'; // ⚠️ 必须手动引入
import ThrottleBoxLib from 'throttle-box';
app.use(ThrottleBoxLib);                            // 全局注册 <ButtonThrottle>
const ButtonThrottle = ThrottleBoxLib.ThrottleBox;  // 局部使用（⚠️ 属性名是 ThrottleBox）
```

## API 语义速查

| 能力 | 用法 |
| --- | --- |
| 节流阀 | `v-model="butLoading"`——**单向只读**，组件只消费不回写 |
| 自定义 loading 图标 | `:svg="svgString"`（element-loading-svg） |
| 包裹内容 | 默认插槽，通常放 `<el-button>` |

## 最小可运行示例（正确的开关锁姿势）

```vue
<template>
  <ButtonThrottle v-model="butLoading">
    <el-button type="primary" @click="submitForm">提交</el-button>
  </ButtonThrottle>
</template>

<script setup>
import 'throttle-box/index.css';
import ThrottleBoxLib from 'throttle-box';
const ButtonThrottle = ThrottleBoxLib.ThrottleBox;

const butLoading = ref(false);
const submitForm = async () => {
  butLoading.value = true;   // ⚠️ 必须手动开锁
  try {
    await api.save(form);
  } finally {
    butLoading.value = false; // ⚠️ 必须手动关锁（成功失败都要关）
  }
};
</script>
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| 期待 `v-model` 自动变 true/false | 手动 `butLoading = true/false`（finally 里关） | update:modelValue 已被注释，v-model 是伪双向 |
| 忘记 finally 关锁 | 无论成败都 `butLoading = false` | 否则遮罩永久停留，按钮废掉 |
| 忘记开锁就发请求 | 提交前 `butLoading = true` | 否则无任何防连点效果 |
| `<ButtonThrottle>` 报未注册 / `import { ButtonThrottle }` 失败 | `const ButtonThrottle = Lib.ThrottleBox` | 默认导出属性名是 ThrottleBox；named import 不可靠 |
| 期待点击事件冒泡到外层 | 知悉根元素 `@click.stop` 会拦截冒泡 | 影响外层委托点击/表单 |
| 按需引入 element-plus 未注册指令 | `app.directive('loading', ElLoadingDirective)` | 否则报 Failed to resolve directive: loading |

## 版本兼容与已知坑

- Vue3 + element-plus（v-loading）；根元素是 `<span class="throttleBox">`（inline-flex），遮罩尺寸由内容撑开——块级大内容需自行保证覆盖。
- `svg` 有内置默认值（element-plus loading 图标整段 SVG），不传即用默认图标。
- 组件内 `throttle()` 方法是空实现（历史遗留），点击只做 `stopPropagation`，无实际逻辑。
