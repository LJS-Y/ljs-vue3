# trends-table-vue3 — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 版本以 package.json 为准
> 面向 AI 编码助手：精确签名以 `index.d.ts` 为准，本文档讲语义、边界与坑。

## 一句话定位

Element Plus（el-table）的二次封装：用 `header` 数组配置列，开箱支持动态列显隐/排序、左右锁列、动态列宽计算、二级表头、跨页序号、多选、行合并、表头显隐工具栏、导出 Excel。

## 何时用 / 何时不用

**用**：中后台「配置化表格」——列由数据驱动（接口返回 header）、需要锁列/二级表头/表头显隐/导出 Excel 的列表页。

**不用**：
- 需要单元格级自定义渲染（❌ 本组件**没有**按列名的单元格/表头插槽，只能用 `otherColumn` 自己加操作列）
- 需要树形表格、虚拟滚动、编辑单元格（未提供）
- 表格内分页交互（`pageOpts` 只算序号，不含分页组件/事件；分页用 ljs-tools 的 `Pagination` 或 el-pagination 配合）
- 项目没用 Element Plus

## 与同类的区别（选型理由）

- **vs vxe-table（重型全功能表格库）**：vxe-table 是独立表格体系（渲染器/虚拟滚动/树形/编辑），要整体切换；本包是 **el-table 的轻量二次封装**——已在用 Element Plus 的项目零迁移成本，header 数组配置化开箱即用。
- **vs @pureadmin/table 等 el-table 封装**：它们走「配置化渲染器」路线（TSX / cellRenderer 自定义单元格）；本包走**数据驱动动态列**路线——列由接口 header 数组直接驱动、二级表头按分隔符自动拆分、列宽可按内容自动计算，另有表头显隐 + 导出 Excel 工具箱。
- **vs 裸 el-table 手写动态列**：动态列显隐/排序、锁列、二级表头拆分、列宽计算、表头显隐、导出 Excel 都要自己拼；本包一个 header 数组 + tools 配置全搞定。
- **决策口诀**：中后台、列由接口 header 驱动、要锁列/二级表头/表头显隐/导出 Excel → 本包；要单元格级自定义渲染/树形/虚拟滚动/编辑单元格 → 不适用（无按列插槽、未提供）；没用 Element Plus → 不适用。

## 安装与引入

```bash
npm i trends-table-vue3 -S
# 前置：element-plus（含 ElTable/ElTableColumn/v-loading；工具箱另需 ElIcon/ElDropdown/ElCheckbox）
# 导出 Excel 需自行安装：xlsx@0.18.5 xlsx-style-vite@0.0.2 file-saver@2.0.5
```

```ts
import 'trends-table-vue3/index.css'; // ⚠️ 必须手动引入
import TrendsTable from 'trends-table-vue3';
app.use(TrendsTable); // 全局注册 <TrendsTable>
// 局部：const { TrendsTable } = 具名/默认解构（产物 ESM 仅 default 导出，保险写法见 ljs-tools AI.md 同款说明）
```

⚠️ 组件模板直接使用 `<Files />` `<Menu />` 图标组件（@element-plus/icons-vue）——需**全局注册图标**，否则运行告警。

## API 语义速查

| 能力 | 用法 |
| --- | --- |
| 列配置 | `header: [{ name: '姓名', value: 'name', width: 120, sortable: true }]`；键名可由 `headerOpts` 改写（name→label、prop→列 prop） |
| 二级表头 | header 条目的 `name` 含分隔符（默认 `-`）：`'分组-列名'`；子列不支持 sortable/自定义 class |
| 列显隐+排序 | `fieldList: ['name','age']`（按顺序只显示这些列；`[]` = 全部） |
| 锁列 | `fixedAndColumnw: { fixedNum: 2, fixedLastNum: 1 }`（前 2 左锁、后 1 右锁；二级表头子列上聚到父列） |
| 动态列宽 | `fixedAndColumnw: { trendsWidthNum: -1, trendsWidth: 250 }`（按内容估算，80~250 区间；fontSize 参与估算） |
| 手动列宽 | `fixedAndColumnw: { trendsWidthsFixed: [200, null, 150] }`（null=跳过；或 header 的 `width`，绑定为 min-width） |
| 序号列 | `columnType="index"` + `:pageOpts="{ pageNum: 2, pageSize: 10 }"` → 跨页连续序号 |
| 多选列 | `columnType="selection"` + `:selectionChange="fn"` + `:selectable="fn"`（⚠️ 都是 props） |
| 展开列 | `columnType="expand"` + 插槽 `columnTypeExpand`（作用域 `{ row }`） |
| 操作列 | 插槽 `otherColumn`（自行放 el-table-column，落在列尾） |
| 行合并 | `:rowColumnMerge="({row,column,rowIndex,columnIndex}) => ({rowspan, colspan})"` |
| 表头显隐 | `tools: { header: true }`（工具栏下拉多选，仅一级表头） |
| 导出 Excel | `tools: { excel: true, excelFileName: '月报', plugin: { saveAs, write, utils } }` → 工具栏图标或 `ref.excelDownload('月报')` |
| 样式 | `fontSize / headerColor(#909399) / headerBgColor(#f5f7fa) / bodyColor(#606266) / tooltip` |
| 高度 | `maxHeight`：'auto'（默认）或 px 值（容器高 − 30px 给工具栏） |

## 最小可运行示例

```vue
<template>
  <TrendsTable
    :data="tableData"
    :header="tableHeader"
    :fixedAndColumnw="{ fixedNum: 1 }"
    :tools="{ header: true }"
  >
    <template #otherColumn>
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="onEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </template>
  </TrendsTable>
</template>

<script setup>
import { ref } from 'vue';
const tableHeader = ref([
  { name: '姓名', value: 'name', width: 120 },
  { name: '部门', value: 'dept' },
  { name: '状态', value: 'status', sortable: true },
]);
const tableData = ref([{ name: '张三', dept: '研发', status: '在职' }]);
</script>
```

## 常见组合用法

**导出 Excel（必须注入三件套）**
```js
import { saveAs } from 'file-saver';
import { write } from 'xlsx-style-vite';
import * as XLSXUtils from 'xlsx'; // utils.table_to_book

const tools = {
  excel: true,
  excelFileName: '人员清单',
  plugin: { saveAs, write, utils: XLSXUtils },
};
// <TrendsTable :tools="tools" ...>，或 ref.excelDownload('人员清单')
```

**二级表头**
```js
const header = [
  { name: '基本信息-姓名', value: 'name' },
  { name: '基本信息-年龄', value: 'age' },
  { name: '联系方式-手机', value: 'phone' },
];
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| `<TrendsTable @selection-change="fn">` | `:selection-change="fn"` / `:selectionChange="fn"` | 组件没有 emits，selectionChange 是 prop |
| 找 `#cell-name`、`#header-age` 这类按列插槽 | 只有 `#otherColumn`、`#columnTypeExpand` | 组件未实现单元格/表头自定义插槽 |
| `:tools="{ excel: true }"` 不给 plugin | 同时注入 saveAs/write/utils | 否则点击导出 console.warn 并中止 |
| 以为 `pageOpts` 会出分页条 | 分页另配 Pagination 组件 | pageOpts 只用于序号计算 |
| 给二级表头子列设 `sortable` | sortable 只对一级列生效 | 子列不支持 |
| `data` 为空时调试列宽/锁列不生效 | 先塞一条数据 | data 为空跳过列宽/固定列计算 |
| 把 `headerColor` 默认值当 `#606266` | 实际默认 `#909399`（bodyColor 实际默认 `#606266`） | 旧版 README 写错过；1.2.0 起 README 已修准，以代码/index.d.ts 为准 |

## 版本兼容与已知坑

- **环境**：Vue ~3.3.4、element-plus ^2.3.4+；图标组件需全局注册（Files、Menu）。
- **默认值要点**（README 1.2.0 起已与代码一致）：`headerColor` 默认 `#909399`、`bodyColor` 默认 `#606266`；`tools.excelFileName` 默认 `'表格Excel文件'`；`headerOpts` 默认含 `nameTag: '-'`；`header` 条目的 `width` 实际绑定为 `min-width`。
- **导出 Excel 原理**：从 DOM 的 `table_to_book`（优先取 `.el-table__fixed`）生成，导出内容=当前渲染内容，受列显隐影响。
- **遗留 console.log**：`initHeader` 每次处理表头会打印处理后的 header 数组（产物未剔除），生产环境注意。
- **事件缺失**：无翻页、无排序事件、无单元格点击事件；排序 `sortable: 'custom'` 透传 el-table 但拿不到 sort-change 回调——需要后端排序时先用 `otherColumn`/外层 el-table 场景替代评估。
- **构建注意**：`npm run build` 输出到 `trends-table-vue3/`（emptyOutDir:true 会清空目录），package.json/README.md/AI.md/index.d.ts 需构建后放入再发版。
