# 方便您的同时，请五星、收藏，让好的东西照亮更多深渊中负重前行的代码人。
# 创作不易，在您方便之际，赞赏作者，我们会更有动力继续下去。

# 简介
ljs-big-image-vue3，图片放大展示器。一个任一场景都可以接入的图片放大功能，没有限制。

### 使用 uni_modules 安装（推荐）
使用 uni_modules 方式安装组件库，可以直接通过插件市场导入，通过右键菜单快速更新组件，不需要引用、注册，直接在页面中使用 ljs-big-image-vue3组件。

### 主参数

 参数  | 类型| 必填项 | 默认值 | 说明
 ---- | ----- | ------ | ------  | ------ 
 v-model | Boolean | √ |  | 是否开启
 path | String | √ |  | 图片地址
 title | Object | × | null | 图片标题。默认为null，不展示标题。
 width | String | × | 730upx | 宽度。
 height | String | × | 70% | 高度。
 borderRadius | String | × | 20upx | 圆角。
 zIndex | Number | × | 200 | z-index值。

 
### 快速应用

###### 场景1
```vue
<view @click="imgClick">查看大图</view>
<ljs-big-image-vue3
	v-model="bigImage.open"
	:path="bigImage.path">
</ljs-big-image-vue3>
```
```js
export default {
	data() {
		return {
			bigImage: {
				// 是否显示弹出层
				open: false,
				// 图片地址
				path: '',
			},
		}
	},
	onLoad() {
	},
	methods: {
		imgClick() {
			this.bigImage = {
				// 是否显示弹出层
				open: true,
				// 图片地址
				path: 'http://********/tmp_763d1baaac437e8988eac108b949039e_20240819091929A014.jpg',
			};
		},
	}
}
```


# 贡献代码
龙九山。有任何问题，请在平台留言，在手头宽裕得情况下，我会尽快修复问题。