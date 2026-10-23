# ljs-waterfall-flow — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 对应版本：1.0.5 ｜ 生成：2026-10-22

## 一句话定位

纯 CSS float 布局的瀑布流组件（零依赖）：按最短列分配数据，支持列数/列间距/追加动画，内容由作用域插槽自定义。

## 何时用 / 何时不用

**用**：图片流、卡片流等多列瀑布布局，数据以「追加」方式增长（如滚动加载）。
**不用**：需要虚拟滚动/海量 DOM（本组件全量渲染）；列高需要精确先算（高度靠 offsetHeight 实测）；需要动态改列数（不支持）。

## 安装与引入

```bash
npm i ljs-waterfall-flow -S   # 无第三方依赖
```
```ts
import 'ljs-waterfall-flow/index.css'; // ⚠️ 必须手动引入
import Wf from 'ljs-waterfall-flow';
app.use(Wf);                              // 全局注册 <LJSWaterfallFlow>
const LJSWaterfallFlow = Wf.LJSWaterfallFlow; // 局部使用（named import 不可靠）
```

## API 语义速查

| 能力 | 用法 |
| --- | --- |
| 数据 | `:data="list"` |
| 列数 | `:column="3"`（默认 2，⚠️ 初始化后不可改） |
| 列间距 | `column-gap-width="'25px'"`（默认 '25px'） |
| 追加动画 | `:animation="true"` |
| 内容渲染 | 默认插槽 `{ row }`，**row 是该列数组** |

## 最小可运行示例

```vue
<template>
  <LJSWaterfallFlow :data="list" :column="2" :animation="true">
    <template #default="{ row }">
      <!-- ⚠️ row 是这一列的数组，不是单条 -->
      <div v-for="item in row" :key="item.id" class="card">
        <img :src="item.imgUrl" />
        <p>{{ item.title }}</p>
      </div>
    </template>
  </LJSWaterfallFlow>
</template>

<script setup>
import 'ljs-waterfall-flow/index.css';
import Wf from 'ljs-waterfall-flow';
const LJSWaterfallFlow = Wf.LJSWaterfallFlow;

const list = ref([{ id: 1, imgUrl: 'a.jpg', title: '一' }]);
// 追加：一次 push 1 条最稳（见错误对照）
const loadMore = () => list.value.push({ id: Date.now(), imgUrl: 'b.jpg', title: '新' });
</script>
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| 插槽里 `{{ row.title }}` 当单条用 | `v-for="item in row"` | row 是**列数组** |
| 一次 `push` 3 条期待全部渲染 | 一次 push 1 条，逐条追加 | 内部每次只向最短列追加 1 条，批量追加会逐 tick 拖延甚至错位 |
| 整体替换 data（先赋新数组） | 先 `list = []` 再赋新数组 | 直接替换会走追加分支，旧数据重复/错位 |
| 运行中改 `column` | 初始化前定好列数 | column 无 watch，改大直接 TypeError |
| 图片还没加载完就连续追加 | 等图片 onload 后再追加/或固定卡片高度 | 列高靠 offsetHeight 实测，图片未就绪会分配失衡 |
| `column-gap-width="20"`（纯数字） | `"'20px'"` | 非长度值静默布局错乱 |
| `import { LJSWaterfallFlow } from '...'` | 从默认导出解构 | 产物 ESM 仅 default 导出 |

## 版本兼容与已知坑

- Vue3，无 element-plus 依赖；样式需手动 import。
- 前 `column` 条数据「一列一条」直接铺开，不参与最短列平衡，第一屏可能不均。
- `animation` 的淡入类**加了不移除**，且是整列容器一起闪，同列后续追加不再触发动画。
