# ball-swiper — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 版本以 package.json 为准

## 一句话定位

球面 3D 轮播：卡片沿球面排布、鼠标拖拽旋转、左右箭头翻页，也可退化为平面排布（ball3D=false）；内容由作用域插槽自定义。

## 何时用 / 何时不用

**用**：大屏/展示页的头像墙、商品墙、设备卡片等「有仪式感」的轮播展示。
**不用**：移动端触摸交互（**只支持鼠标拖拽**，无 touch 事件）；需要自动播放（无 autoplay）；数据会频繁变动（无增量更新能力）；SSR 渲染（内部依赖 DOM 测量，见已知坑）。

## 与同类的区别（选型理由）

- **vs swiper / 通用平面轮播**：卡片沿**球面**排布带透视缩放，拖拽旋转、箭头翻页，「视觉焦点」仪式感强；平面轮播只是水平滑动。
- **vs swiper 3D 模式 / vue-carousel-3d**：它们是 coverflow / 卡片堆叠式 3D 轮播；本包专做**球面布局**（卡片沿球面弧线分布、按距中位缩放），展示页头图/展廊的差异化视觉。
- **vs vue-sphere（3D 图片球体）**：图片球是密集图片贴球面、鼠标跟随旋转；本包是**卡片式球面轮播**——内容由插槽自定义、可点选（itemClick）、箭头逐张翻页。
- **决策口诀**：要「球面排布」的视觉焦点轮播（头图/展廊/作品集）→ 本包；要普通水平轮播 → swiper 等；要移动端触摸或自动播放 → 不适用（无 touch / 无 autoplay）；要 SSR 输出 → 不适用（依赖 DOM 测量）。

## 安装与引入

```bash
npm i ball-swiper -S   # 仅依赖 Vue3
```
```ts
import 'ball-swiper/index.css'; // ⚠️ 必须手动引入
import Bs from 'ball-swiper';
app.use(Bs);                        // 全局注册 <BallSwiper>
const BallSwiper = Bs.BallSwiper;   // 局部使用（named import 不可靠）
```

⚠️ **rem 前置**：组件宽度按 `pxToRem(根字号)` 换算，宿主页面必须设置 `html` 的 font-size（demo 用 `document.documentElement.style.fontSize = clientWidth/120 + 'px'`），否则卡片尺寸失真。

## API 语义速查

| 能力 | 用法 |
| --- | --- |
| 数据 | `:data="list"`（必填，不传会崩） |
| 3D/平面 | `:ball3D="true"`（默认 true；false 时 span 生效） |
| 展示数量 | `:showNum="7"`（偶数=半卡偏移，**不会**自动变奇数） |
| 高度 | `height="'300px'"`（默认 '100%'） |
| 背景/箭头图 | `itemBg` / `jtImg`（默认内置图） |
| 点击卡片 | `@itemClick="fn"`（拖动 >50px 不触发） |
| 卡片内容 | 默认插槽 `{ row }` |

## 最小可运行示例

```vue
<template>
  <BallSwiper :data="list" :showNum="7" height="300px" @itemClick="onClick">
    <template #default="{ row }">
      <div class="card">
        <img :src="row.avatar" />
        <p>{{ row.name }}</p>
      </div>
    </template>
  </BallSwiper>
</template>

<script setup>
import 'ball-swiper/index.css';
import Bs from 'ball-swiper';
const BallSwiper = Bs.BallSwiper;

const list = ref([{ id: 1, name: 'A', avatar: 'a.png' }]);
const onClick = (item) => console.log(item);
</script>
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| `:data="[]"` / 不传 data 渲染空屏排查半天 | 至少给数据；不传会直接抛错 | watch 里访问 `data.length` 无判空 |
| 移动端页面用它做触摸轮播 | 换支持 touch 的轮播方案 | 只实现了 mousedown/up |
| `:showNum="6"` 期待自动变 7 | 接受半卡偏移或自己传奇数 | README 说"自动加 1"是错的，代码不改奇偶 |
| 页面没设 html font-size | 按视口宽度设置根字号 | 内部 px→rem 换算依赖根字号 |
| `import { BallSwiper } from '...'` | 从默认导出解构 | 产物 ESM 仅 default 导出 |
| 数据少于 showNum 时期待拖拽 | 数据总数 < showNum 时拖拽与箭头自动禁用 | 设计如此 |

## 版本兼容与已知坑

- Vue3 纯组件；样式需手动 import；背景/箭头默认图已 base64 内联。
- **SSR 不可用**：$nextTick 内访问 `clientWidth` / `document`（DOM 测量），服务端渲染会抛错；仅浏览器端使用。
- 内置默认图（itemBg/jtImg）已内联为字符串进产物，浏览器/Node/任何打包器可直接导入（1.2.0 起）；props 传 URL 可覆盖内置图。
- 首帧布局值为空（宽度/缩放依赖 $nextTick DOM 测量后回填），浏览器端下一帧自动修正。
- 拖动/点击抑制阈值硬编码 50px。
- 深拷贝是自写递归实现，不处理 Date/循环引用。
- 遗留 console.log（每次布局计算打印），生产环境注意。
