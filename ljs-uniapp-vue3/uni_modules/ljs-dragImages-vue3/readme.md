# 方便您的同时，请五星、收藏，让好的东西照亮更多深渊中负重前行的代码人。
# 创作不易，在您方便之际，赞赏作者，我们会更有动力继续下去。

# 简介
ljs-dragImages-vue3，可拖动排序的文件上传组件。
支持自定义基础展示样式。

### 使用 uni_modules 安装（推荐）
使用 uni_modules 方式安装组件库，可以直接通过插件市场导入，通过右键菜单快速更新组件，不需要引用、注册，直接在页面中使用 ljs-top组件。

### 主参数

 参数  | 类型| 必填项 | 默认值 | 平台差异 | 说明
 ---- | ----- | ------ | ------  | ------ | ------ 
 v-model | Array | √ |  | | 文件列表数据
 touchTarg | Boolean | × | true | | 是否开启拖拽排序，默认开启。如果关闭，则次插件将是一个普通的文件上传组件
 count | Number | × | 5 | | 文件上传数量限制
 colCount | Number | × | 3 | | 列数量，默认3列
 fileHeight | Number | × | 165 | | 文件框的高度 upx 值
 fileMargin | Number | × | 25 | | 文件间距 upx 值
 fileBorder | String | × | 2rpx solid #1e96d5 | | 文件框的边框
 imgRadius | Number | × | 30 | | 文件框的圆角 upx 值
 delButtonImage | String | × |  | | 删除按钮的文件
 addButtonImage | String | × |  | | 点击上传背景文件
 mediaType | Array | × | ['image'] | 仅微信小程序 | image：只能拍摄图片或从相册选择图片；video：只能拍摄视频或从相册选择视频；mix：可同时选择图片和视频；
 sourceType | Array | × | ['album','camera'] | 仅微信小程序 | album：从相册选择；camera：使用相机拍摄；
 maxDuration | Number | × | 10 | 仅微信小程序 | 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 60s 之间。不限制相册。
 sizeType | Array | × | ['original', 'compressed'] | 仅微信小程序 | 是否压缩所选文件，基础库2.25.0前仅对 mediaType 为 image 时有效，2.25.0及以后对全量 mediaType 有效
 camera | String | × | back | 仅微信小程序 | 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头。back	使用后置摄像头；front	使用前置摄像头
 
微信小程序可参考官方API：wx.chooseMedia
 
### v-model结构

 参数  | 类型| 必填项 | 默认值 | 说明
 ---- | ----- | ------ | ------  | ------ 
 url | String | √ |  | 文件地址
 
### 方法

 参数  | 类型| 解释
 ---- | ----- | ------ 
 @uploadFile | function(files) | 返回文件路径列表。一般用于访问后端的上传接口。
 @imgClick | function(obj) | 返回点击的文件对象
 
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