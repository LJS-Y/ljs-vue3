# 方便您的同时，请五星、收藏，让好的东西照亮更多深渊中负重前行的代码人。
# 创作不易，在您方便之际，赞赏作者，我们会更有动力继续下去。

# 简介
ljs-dragImages-vue3，可拖动排序的图片上传组件。
支持自定义基础展示样式。

### 使用 uni_modules 安装（推荐）
使用 uni_modules 方式安装组件库，可以直接通过插件市场导入，通过右键菜单快速更新组件，不需要引用、注册，直接在页面中使用 ljs-top组件。

### 主参数

 参数  | 类型| 必填项 | 默认值 | 说明
 ---- | ----- | ------ | ------  | ------ 
 value | Array | √ |  | 图片列表数据
 touchTarg | Boolean | × | true | 是否开启拖拽排序，默认开启。如果关闭，则次插件将是一个普通的图片上传组件
 count | Number | × | 5 | 图片上传数量限制
 colCount | Number | × | 3 | 列数量，默认3列
 imgHeight | Number | × | 165 | 图片框的高度 upx 值
 imgMargin | Number | × | 25 | 图片间距 upx 值
 imgBorder | String | × | 2rpx solid #1e96d5 | 图片框的边框
 imgRadius | Number | × | 30 | 图片框的圆角 upx 值
 delButtonImage | String | × |  | 删除按钮的图片
 addButtonImage | String | × |  | 点击上传背景图片
 
### v-model结构

 参数  | 类型| 必填项 | 默认值 | 说明
 ---- | ----- | ------ | ------  | ------ 
 url | String | √ |  | 图片地址
 
### 方法

 参数  | 类型| 解释
 ---- | ----- | ------ 
 @uploadFile | function(files) | 返回文件路径列表。一般用于访问后端的上传接口。
 @imgClick | function(obj) | 返回点击的图片对象
 
### 示例

###### 场景1
```vue
<template>
	<view class="main">
		<ljs-dragImages-vue3
			v-model="imgList"
			@uploadFile="upload"
			>
		</ljs-dragImages-vue3>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgList: [{
					url: 'http://192.168.1.100:8087/profile/avatar/2024/08/16/2632b40aaa5d12a60bd6e724807a5561_20240816181530A012.jpeg'
				}]
			}
		},
		methods: {
			// 上传方法
			upload(files) {
				console.log(files)
				// uni.uploadFile({
				// 	.....
				// });
			},
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		padding-top: 200upx;
	}
	.content{
		background-color: rebeccapurple;
		font-size: 28upx;
		color: #FFF;
		line-height: 46upx;
		padding: 40upx;
	}
</style>

```

# 贡献代码
龙九山。有任何问题，请在平台留言，在手头宽裕得情况下，我会尽快修复问题。