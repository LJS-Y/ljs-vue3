# energy-flow-chart — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 版本以 package.json 为准
> 面向 AI 编码助手：精确签名以 `index.d.ts` 为准，本文档讲语义、边界与坑。

## 一句话定位

Vue3 能源流向图组件：把「总进线 → 支路 → 设备」的树形能源拓扑画成逐级展开的流向图——节点展示两行能耗读数、内置电/水/油/煤/气设备图标、点击展开下级。

## 何时用 / 何时不用

**用**：能耗大屏 / 能源管理系统 / 电力监控——展示「总进线 → 支路 → 设备」的从属关系与节点读数、点击逐级展开的能源流向图。

**不用**：
- 表达流量分配比例（用 ECharts 桑基图，数值映射带宽）
- 需要缩放/拖拽/虚拟滚动（未提供）
- Vue2 项目（仅支持 Vue3）
- 无法设置 html font-size 的页面（组件内部 37 处 rem，布局会错乱）

## 与同类的区别（选型理由）

- **vs ECharts 桑基图（sankey）**：桑基图表达「流量分配」（总量拆分）；本包表达**设备从属拓扑**——节点是真实设备层级、带设备图标与读数、点击逐级展开。要分配比例选桑基图，要设备树 + 读数选本包。
- **vs vue-apexsankey 等 sankey 封装**：它们解决「流量图渲染」，不是设备树拓扑；本包自带层级展开交互与设备图标，传树形数组即出图。
- **vs @ray-js/energy-flow-graph 等同类**：面向特定生态（ray-js 系小程序/物联组件）；本包是纯 Vue3 组件，任意 Vue3 项目 npm 安装即用。
- **vs 手写 ECharts tree / 自定义 div 拼装**：树形布局、流向箭头、展开交互、设备图标都要自己拼；本包传树形数组即出图。
- **决策口诀**：能耗大屏/能源管理、要「设备从属拓扑 + 节点读数 + 逐级展开」→ 本包；要「流量分配比例」→ 桑基图；要缩放/拖拽/虚拟滚动 → 不适用；Vue2 → 不适用。

## 安装与引入

```bash
npm i energy-flow-chart -S
# 前置：Vue 3；⚠️ 宿主页面必须设置 html font-size（组件内部 37 处 rem）
```

```ts
import 'energy-flow-chart/index.css'; // ⚠️ 必须手动引入
import EnergyFlowChartLib from 'energy-flow-chart';
app.use(EnergyFlowChartLib); // 全局注册 <EnergyFlowChart>
// 局部：const { EnergyFlowChart } = EnergyFlowChartLib;（产物 ESM 仅 default 导出，请 default 导入后解构）
```

⚠️ rem 前置（缺一不可）：`document.documentElement.style.fontSize = document.documentElement.clientWidth / 120 + 'px'`（或项目既有的 rem 适配方案）。

## API 语义速查

| 能力 | 用法 |
| --- | --- |
| 数据 | `:data="tree"` 树形数组（必填；缺参报错、空数组不出图——外层 v-if 判空）；任意层级递归渲染 |
| 整体展开/收起 | `v-model="develop"`：true 全部展开、false 全部收起；改值即全体生效 |
| 字段映射 | `:opts="{ id: 'deviceId', label: 'name', children: 'sub', iconUrl: 'energyType', dataVal1: 'eval', dataVal2: 'power' }"`（只写要改的键） |
| 设备图标 | 节点 `iconUrl` 字段存字典值，按 `iconUrlTypes` 数组顺序映射内置图（第 i 位的值 → 第 i+1 张）；节点 `imgUrl` 优先于内置图 |
| 图标字典 | `:iconUrlTypes="['1','2','3','4','5','0']"`（默认 1电 2水 3油 4煤 5气 0其他） |
| 层级换色 | `:lineColor="['#FFCC44', '#014EB5']"` 索引 0 为 1 级箭头色；未设置的层级用默认色 #FFCC44 |
| 背景色 | `bgColor`（默认 '#07364B'） |
| 节点点击 | `@energyClick="fn"` → fn(node)：节点对象深拷贝（剔除 level/open，children 保留） |

## 最小可运行示例

```vue
<template>
  <EnergyFlowChart
    v-if="energyFlowData.length > 0"
    v-model="develop"
    :data="energyFlowData"
    :opts="{ id: 'deviceId', iconUrl: 'energyType', dataVal1: 'eval', dataVal2: 'power' }"
    @energyClick="onNodeClick" />
</template>

<script setup>
import { ref } from 'vue';
import 'energy-flow-chart/index.css';
import EnergyFlowChartLib from 'energy-flow-chart';
const { EnergyFlowChart } = EnergyFlowChartLib;

// ⚠️ rem 前置
document.documentElement.style.fontSize = document.documentElement.clientWidth / 120 + 'px';

const develop = ref(true);
const energyFlowData = ref([{
  deviceId: 1, label: '总进线', energyType: '1', eval: '1000.00kWh', power: '500.00KW',
  children: [
    { deviceId: 2, label: '1#支路', energyType: '1', eval: '600.00kWh', power: '300.00KW' },
    { deviceId: 3, label: '2#支路', energyType: '2', eval: '400.00kWh', power: '200.00KW' },
  ],
}]);

const onNodeClick = (node) => console.log(node);
</script>
```

## 常见组合用法

**v-model 一键展开/收起（大屏工具栏联动）**
```vue
<button @click="develop = !develop">展开/收起</button>
<EnergyFlowChart v-model="develop" :data="tree" ... />
```
⚠️ 组件内点击节点的展开/收起是内部状态，不回写 v-model；之后改 v-model 会全体重新展开或收起。

**自定义字典顺序（如 1水 2电）**
```js
// 数据里 energyType: '1' 表示水、'2' 表示电 → 传对应顺序，第 i 位的值映射第 i+1 张内置图
:iconUrlTypes="['2', '1', '3', '4', '5', '0']"
```

**节点自带图片（优先于内置图）**
```js
{ deviceId: 9, label: '光伏站', imgUrl: 'https://xxx/pv.png', eval: '...', power: '...' }
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| `import { EnergyFlowChart } from 'energy-flow-chart'` | `import Lib from 'energy-flow-chart'` 后解构 | 产物仅 default 导出，具名导入在 Vite 等构建工具下不可靠 |
| 不设 html font-size 直接用 | 加 rem 适配（如 clientWidth/120） | 组件内部 37 处 rem，尺寸依赖根字号 |
| 忘引样式 | `import 'energy-flow-chart/index.css'` | cssCodeSplit 单独产物，不自动注入 |
| 监听 `@update:modelValue` 期待回写 | v-model 只作整体展开/收起信号 | 组件不 emit update:modelValue |
| `data` 缺参或空数组直接挂载 | 外层 `v-if="tree.length > 0"` | data watcher 直接读 length：缺参报错，空数组不出图 |
| 按默认字典传 '0'（其他）期待出「其他」图标 | 把 '0' 排除在 iconUrlTypes 外（如 `['1','2','3','4','5']`） | 默认第 6 位 '0' 映射到索引 6，无图标分支（见已知坑） |
| 期待 @energyClick 回调里 iconUrl 是原始字典值 | 按内置图索引（0..6）理解 | 组件构建数据时已原地改写该字段 |
| lineColor 只给 1 个色、层级很深 | 按最大层级给全颜色 | 未覆盖层级回退默认色 #FFCC44 |

## 版本兼容与已知坑

- **环境**：Vue 3（~3.3.4 开发验证）；仅支持 Vue3。
- **iconUrlTypes 映射规则**：数组第 i 位的值 → 内置图 surface_{i+1}（i+1 = 1..6），模板只渲染 0..5 分支——⚠️ 默认字典第 6 位 '0'（其他）映射到索引 6、**无图标分支（不出图）**；未匹配的值 → 0 → surface_0（「其他」图）。需要「其他」图时把该值排除在数组外（`iconUrlTypes: ['1','2','3','4','5']`）。
- **v-model 语义**：整体展开/收起的控制信号（改值全体生效）；组件内单节点展开/收起只改内部数据、不回写 v-model。
- **@energyClick 载荷**：节点对象深拷贝（剔除 level/open，children 保留）；其中 iconUrl 指向的字段已被改写为内置图索引（0..6）。
- **openToggle**：组件内部展开/收起事件（递归子组件冒泡用），顶层不外抛，用户监听不到，无需处理。
- **SSR 注意**：图宽依赖 maxLevel（mounted 时计算），SSR 首帧 width 为 0rem——纯客户端组件，SSR 场景仅供测试。
- **构建注意**：`npm run build` 输出到 `energy-flow-chart/`（emptyOutDir:true 会清空目录），public/ 的 package.json/README.md/AI.md/index.d.ts 构建时自动同步进发布目录。
