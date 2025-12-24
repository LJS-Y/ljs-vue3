# 方便您的同时，请五星、收藏，让好的东西照亮更多深渊中负重前行的代码人。
# 创作不易，在您方便之际，赞赏作者，我们会更有动力继续下去。

# 简介
ljs-dialog-vue3，dialog弹框，灵活好用的弹框。可以设置最大高度，当内容不足最大高度时适应内容高度，当内容超过最大高度时出现滚动条。

### 使用 uni_modules 安装（推荐）
使用 uni_modules 方式安装组件库，可以直接通过插件市场导入，通过右键菜单快速更新组件，不需要引用、注册，直接在页面中使用 ljs-dialog-vue3组件。

### 主参数

参数  | 类型| 必填项 | 默认值 | 说明
---- | ----- | ------ | ------  | ------ 
v-model | Boolean | √ |  | 是否开启
title | String | × |  | 弹窗标题。headerShow为true时有效且必填。
titleFontSize | Number | × | 28 | 弹窗标题：字号。
headerShow | Boolean | × | true | 是否显示头部区域。
setTitleHeight | Number | × | 90 | 弹窗标题栏高度，单位upx。默认90，最小为90。headerShow为true时有效。
width | String | × | 90% | 弹窗宽度。
borderRadius | Number | × | 20 | 裸露圆角值。
background | String | × | #FFF | 弹框背景。
shadeBackground | String | × | rgba(0, 0, 0, .6) | 遮罩背景。
shadeClose | Boolean | × | true | 点击遮罩是否关闭弹窗。
tcMaxHeightTag | Boolean | × | true | 是否限制弹窗最大高度。
tcMaxHeightUseTag | Boolean | × | false | 是否直接按照tcMaxHeightProportion的值设置高度占比。tcMaxHeightTag为true有效。
tcMaxHeightProportion | Number | × | 0.8 | 限制弹窗最大高度占比，建议不大于1。1为100%。tcMaxHeightTag为true有效。
closeButShow | Boolean | × | true | 是否显示关闭按钮。headerShow为true时有效。
closeImg | String | × |  | 关闭按钮图片。
zIndex | Number, String | × | 100 | z-index值。
 
### 方法

参数  | 类型| 解释
---- | ----- | :------ 
@openAfter | 打开弹窗后的回调函数 | 弹窗打开完成的回调。
@closeBefore | 关闭弹窗前的回调函数 | 当点击右上角关闭按钮或者点击遮罩时的回调函数，此函数优先于弹窗关闭。
@closeAfter | 关闭弹窗后的回调函数 | 当点击右上角关闭按钮或者点击遮罩时的回调函数，此函数在弹窗关闭后执行。

 
### 快速应用

###### 场景1
```vue
<view @click="tcOpen">弹窗</view>
<ljs-dialog-vue3 :title="tc.title" v-model="tc.open" class="comTc" :closeButShow="false">
	<view style="height: 100%; overflow-y: auto;">
		展示一些内容。
	</view>
</ljs-dialog-vue3>
```
```js
export default {
	data() {
		return {
			tc: {
				// 弹出层标题
				title: '',
				// 是否显示弹出层
				open: false,
			},
		}
	},
	onLoad() {
	},
	methods: {
		tcOpen() {
			this.tc.title = 'ljs-dialog-vue3'
			this.tc.open = true
		},
	}
}
```

###### 场景2
###### 注意：我们的弹窗只内置头部，不处理内容和底部。如果您想要一个内容区加底部按钮区，你可以自己实现他们，放入插槽内；如果你想要内容区滚动，底部区保持原位，可自行实现。
###### 因此我们这款弹窗组件是一个非常灵活的组件。如果您想要快速实现一个常规的弹框结构，可参考下面的示例。
```vue
<view @click="tcOpen">弹窗</view>
<ljs-dialog-vue3 :title="tc.title" v-model="tc.open" class="comTc">
	<view class="comForm">
		测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>测试内容<br>		测试内容<br>测试内容<br>测试内容<br>
	</view>
	<view class="operate" style="margin-top: 0;">
		<view class="but">确定</view>
		<view class="but grey">取消</view>
	</view>
</ljs-dialog-vue3>
```
```js
export default {
	data() {
		return {
			tc: {
				// 弹出层标题
				title: '',
				// 是否显示弹出层
				open: false,
			},
		}
	},
	onLoad() {
	},
	methods: {
		tcOpen() {
			this.tc.title = 'ljs-dialog-vue3'
			this.tc.open = true
		},
	}
}
```
```scss
.comTc{
	.comForm{
		width: 100%;
		height: calc(100% - 100upx);
		overflow-y: auto;
	}
	.operate{
		height: 100upx;
		padding: 0 30upx;
		margin-top: 20upx;
		display: flex;
		align-items: center;
		.but{
			flex: 1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			border-radius: 10upx;
			border: 2upx solid #084AA1;
			background-color: #084AA1;
			color: #FFF;
			margin-right: 20upx;
			&:last-child{
				margin-right: 0;
			}
			&.grey{
				border: 2upx solid #eee;
				background-color: #FFF;
				color: #666;
			}
		}
	}
}
```


# 贡献代码
龙九山。有任何问题，请在平台留言，在手头宽裕得情况下，我会尽快修复问题。