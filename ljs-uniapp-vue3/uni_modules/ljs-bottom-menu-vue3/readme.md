# 方便您的同时，请五星、收藏，让好的东西照亮更多深渊中负重前行的代码人。
# 创作不易，在您方便之际，赞赏作者，我们会更有动力继续下去。

# 简介
ljs-bottom-menu-vue3，通用底部菜单组件。提供传统、通用的功能，特殊的菜单需自行构建。

### 使用 uni_modules 安装（推荐）
使用 uni_modules 方式安装组件库，可以直接通过插件市场导入，通过右键菜单快速更新组件，不需要引用、注册，直接在页面中使用 ljs-bottom-menu-vue3组件。

### 主参数

 参数  | 类型| 必填项 | 默认值 | 说明
 ---- | ----- | ------ | ------  | ------ 
 data | Array | √ |  | 菜单数据
 defaultIndex | Number | × | 0 | 默认选中菜单的索引值。如当前路由非菜单中的路由，传-1。
 opts | Object | × |  | 菜单样式参数
 specialButtonF | Function | × |  | 特殊按钮的处理函数
 
### data 对象数据结构

 参数  | 类型| 必填项 | 示例值 | 默认值 | 说明
 ---- | ----- | ------ | ------  | ------ 
 title | String | √ | 首页 | #333 | 菜单文本。
 url | String | √ | /pages/ljs-bottom-menu-vue3/index | | 菜单跳转地址。children存在时，该参数无效。
 icon | String | √ | import或base64 | | 默认图标。二级菜单无此项。
 iconActive | String | √ | import或base64 | | 选中图标。二级菜单无此项。
 type | String | × | | 0 | 特殊菜单按钮。除0之外都是普通菜单。二级菜单无此项。
 parameter | String | × | parameter: { id: undefined } | | 跳转入参，parameter不可变。
 children | Array | × | 同data 对象 | | 二级菜单，不支持三级菜单。
 
### opts参数

 参数  | 类型| 必填项 | 默认值 | 说明
 ---- | ----- | ------ | ------  | ------ 
 fontColor | String | × | #333 | 字体颜色。
 fontActiveColor | String | × | #5c70fe | 选中字体颜色。
 fontSize | String | × | 20rpx | 字体大小。
 menuBgColor | String | × | #FFF | 菜单背景颜色。
 menuShadowColor | String | × | rgba(0, 0, 0, .2) | 菜单上边沿颜色。

### 插槽

插槽名 | 说明
---- | :------ 
 
### 快速应用

###### 示例1
```vue
<ljs-bottom-menu-vue3
	:data="menus"
	:opts="{
		fontColor: '#666',
		fontActiveColor: '#1296db',
	}"
	:specialButtonF="specialButtonF">
</ljs-bottom-menu-vue3>
```
```js
import index from '/static/images/index.png';
import index_active from '/static/images/index_active.png';
import publish from '/static/images/publish.png';
import publish_active from '/static/images/publish_active.png';
import my from '/static/images/my.png';
import my_active from '/static/images/my_active.png';
import sm from '/static/images/sm.png';
export default {
	data() {
		return {
			menus: [
				{
					title: '首页',
					url: '/pages/ljs-bottom-menu-vue3/index',
					icon: index,
					iconActive: index_active
				},
				{
					title: '新闻',
					icon: publish,
					iconActive: publish_active,
					parameter: {
						id: undefined
					},
					children: [
						{
							title: '最新新闻',
							url: '/pages/my/index',
						},
						{
							title: '历史新闻',
							url: '/pages/publish/index',
						}
					]
				},
				{
					title: '扫码',
					url: '/pages/publish/index',
					icon: sm,
					type: 0,
				},
				{
					title: '发布',
					icon: publish,
					iconActive: publish_active,
					parameter: {
						id: undefined
					},
					children: [
						{
							title: '产品发布',
							url: '/pages/my/index',
						},
						{
							title: '技术发布',
							url: '/pages/my/index',
						}
					]
				},
				{
					title: '我的',
					url: '/pages/my/index',
					icon: my,
					iconActive: my_active
				},
			]
		}
	}
}
```

# 贡献代码
龙九山。有任何问题，请在平台留言，在手头宽裕得情况下，我会尽快修复问题。