# ljs-s-timeline — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 版本以 package.json 为准

## 一句话定位

蛇形（S 形）时间轴：数据按行折返排布，节点圆点 + 曲线连接，节点样式可逐项定制，内容由作用域插槽自定义。

## 何时用 / 何时不用

**用**：流程步骤、里程碑、审批轨迹等「时间轴/步骤条」展示，需要蛇形折返布局节省纵向空间。
**不用**：需要交互（点击节点等，无任何事件）；数据频繁变动的实时场景（每次全量重排）。

## 与同类的区别（选型理由）

- **vs 手写方案（flex / SVG 自绘蛇形）**：蛇形折返、奇数行反转、不满行占位补齐都已处理，现成组件拿来即用。
- **vs 通用时间轴组件（含 element-plus 时间线）**：专做 S 形折返布局（纵向省空间）；节点/连线样式全可配（点色/线色/弯角/末尾线，支持逐项 `LJS_S_point_color`）。
- **vs 其他蛇形时间轴包**：本包是该品类 npm 下载量第一，样式可配面最全 + 完整类型声明。
- **决策口诀**：流程步骤/里程碑/审批轨迹要蛇形折返省纵向空间 → 本包；要点击/交互事件 → 不适用（无 emits）；要普通横向/纵向时间线 → 通用时间轴组件。

## 安装与引入

```bash
npm i ljs-s-timeline -S   # 运行时仅依赖 Vue3（工程依赖里的 ljs-tools 只是 demo 用）
```
```ts
import 'ljs-s-timeline/index.css'; // ⚠️ 必须手动引入
import Ts from 'ljs-s-timeline';
app.use(Ts);                            // 全局注册 <LjsTimelineS>
const LjsTimelineS = Ts.LjsTimelineS;   // 局部使用（named import 不可靠）
```

⚠️ 命名三处不一致：包名 `ljs-s-timeline`、源码目录 `ljs-timeline-s`、**组件注册名 `LjsTimelineS`**——模板里标签必须写 `<LjsTimelineS>`。

## API 语义速查

| 能力 | 用法 |
| --- | --- |
| 数据 | `:data="list"`（必填） |
| 每行项数 | `:rowNum="4"`（数量不是 px） |
| 节点样式 | `:pointHeight="20"` `:pointCenterHeight="12"` `pointRadius` `pointColor`；单项覆盖用数据字段 `LJS_S_point_color` |
| 线样式 | `:lineSize="4"` `lineColor="'#CCC'"` |
| 末尾线 | `:lineEndLastShow="true"` + `lineEnd="'0'|'1'"` |
| 弯角 | `:curveHeight="100"`（最小 30） |
| 内容 | 默认插槽 `{ row }` |

## 最小可运行示例

```vue
<template>
  <LjsTimelineS :data="list" :rowNum="4" :curveHeight="80">
    <template #default="{ row }">
      <!-- ⚠️ 不满行会补 { ljsTempTag: true } 占位对象 -->
      <div v-if="!row.ljsTempTag" class="node">
        <h4>{{ row.title }}</h4>
        <p>{{ row.desc }}</p>
      </div>
    </template>
  </LjsTimelineS>
</template>

<script setup>
import 'ljs-s-timeline/index.css';
import Ts from 'ljs-s-timeline';
const LjsTimelineS = Ts.LjsTimelineS;

const list = ref([
  { title: '立项', desc: '完成立项评审', LJS_S_point_color: '#409EFF' },
  { title: '开发', desc: '进入开发阶段' },
]);
</script>
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| `<LjsTimelineS>` 找不到 / `import { LjsTimelineS }` 失败 | `const LjsTimelineS = Ts.LjsTimelineS` | 注册名与包名不同；named import 不可靠 |
| 插槽里直接取 `row.title` 不判空 | 先 `v-if="!row.ljsTempTag"` | 不满行会补占位对象进插槽 |
| `:rowNum="'4px'"` / 以为是宽度 | `:rowNum="4"`（数字，每行项数） | README 标"单位 px"是错的 |
| `:curveHeight="20"` | ≥30 | 小于 30 布局错乱（代码注释约束） |
| `:lineSize="'4'"` 字符串 | 数字 `4` | 类型是 Number |
| 不传 data | 必传 | watch 访问 `data.length` 无判空 |

## 版本兼容与已知坑

- Vue3 纯组件；样式需手动 import。
- 每行末尾的折返方向自动计算；奇数行内部会 reverse 排布（作用于临时数组，不改调用方数据）。
- 遗留 console.log（数据变化时打印），生产环境注意。
