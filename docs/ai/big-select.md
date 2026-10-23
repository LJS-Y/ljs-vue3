# big-select — AI 使用指南

> 配套类型声明：`index.d.ts` ｜ 对应版本：0.1.12 ｜ 生成：2026-10-22

## 一句话定位

el-select 大数据量二次封装：默认只显示 `max` 条（默认 100）+ 尾部哨兵提示项，回车触发关键字检索，支持多选补位显示。

## 何时用 / 何时不用

**用**：下拉数据几百~几千条、需要「先展示少量 + 输入关键字回车再检索」的表单场景（如选择企业/单位）。
**不用**：数据量小（直接用 el-select）；需要远程分页搜索（本组件是本地数组过滤）；需要自定义下拉项模板（无插槽）。

## 安装与引入

```bash
npm i big-select -S   # 前置：element-plus（el-form-item/el-select/el-option 需可用）
```
```ts
import 'big-select/index.css'; // ⚠️ 必须手动引入，JS 不注入 CSS
import BigSelectLib from 'big-select';
app.use(BigSelectLib);                    // 全局注册 <BigSelect>
const BigSelect = BigSelectLib.BigSelect; // 局部使用（named import 不可靠，见错误对照）
```

## API 语义速查

| 能力 | 用法 |
| --- | --- |
| 选中值 | `v-model="form.enterpriseInfoId"`（multiple 时必须数组） |
| 数据源 | `:data="list"`，元素含 id 与显示字段（默认 `companyName`） |
| 字段映射 | `:opts="{ key: 'companyName', id: 'id' }"`（⚠️ id 不是 'id' 时回显失效） |
| 显示条数 | `:max="100"`（超出截断 + 追加「输入更具体的条件查询更多数据」哨兵项） |
| 多选 | `multiple` + `:multiple-limit="3"` |
| 选中回调 | `@getChooseData="fn"`（单选传对象/undefined，多选传数组） |
| 表单联动 | `label`/`prop`/`size`/`disabled`/`clearable`/`placeholder` 透传 el-form-item/el-select |

## 最小可运行示例

```vue
<template>
  <BigSelect
    v-model="form.enterpriseInfoId"
    :data="companyList"
    :opts="{ key: 'companyName', id: 'id' }"
    label="企业名称"
    prop="enterpriseInfoId"
    @getChooseData="onChoose"
  />
</template>

<script setup>
import 'big-select/index.css';
import BigSelectLib from 'big-select';
const BigSelect = BigSelectLib.BigSelect;

const form = reactive({ enterpriseInfoId: '' });
const companyList = ref([{ id: 1, companyName: '某某公司' }]);
const onChoose = (row) => console.log('选中：', row);
</script>
```

## 典型错误对照（错 → 对）

| ❌ 错误 | ✅ 正确 | 原因 |
| --- | --- | --- |
| `<SelectBigData formItemLabel="企业名称">` | `<BigSelect label="企业名称">` | 组件注册名是 BigSelect；label 透传用 `label`，`formItemLabel` 不存在 |
| `:opts="{ key: 'name', id: 'companyId' }"` 后指望 `@getChooseData` 拿到正确回显 | opts.id 保持 `'id'`，或自行在回调里修正 | 回显/多选补位内部硬编码 `item.id` |
| `@getChooseData` 写成方法调用 prop | 这是**事件**（emit），用 `@` 监听 | README 把它列在"方法"表是错的 |
| 输入关键词后期待自动过滤 | **回车**才触发检索 | 设计如此（placeholder 也提示"回车检索"） |
| 清空输入框期待恢复全量 | 清空后再按一次回车 | 清空不重置旧关键字 |
| `import { BigSelect } from 'big-select'` | 从默认导出解构 | 产物 ESM 仅 default 导出 |
| 不引 css | `import 'big-select/index.css'` | 样式独立产物 |

## 版本兼容与已知坑

- Vue3 + element-plus；`opts` 未传时内部按 `{ key:'companyName', id:'id' }` 兜底。
- **魔法字符串 'getShowId'**：用户输入 `getShowId` 回车会误入回显分支（内部实现遗留），业务关键字避开此词。
- 过滤是 `includes` 子串匹配、区分大小写；`key` 字段非字符串会抛错。
- 被过滤/截断掉的选中项在 `@getChooseData` 里可能为 undefined（多选数组出现空洞）。
- `el-select` 固定 filterable、宽度 100%，不可配置。
