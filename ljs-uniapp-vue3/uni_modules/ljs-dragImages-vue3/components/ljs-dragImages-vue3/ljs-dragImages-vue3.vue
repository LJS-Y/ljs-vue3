<template>
	<view class="ljs-dragList">
		<movable-area id="moveBox" class="moveBox"
			:style="'height: '+(Math.ceil((dataList.length + (dataList.length < count ? 1 : 0))/colCount))*(fileHeight + fileMargin)+'rpx;'">
			<!-- @mousedown="touchstart(item)"
				@mouseup="touchend(item)" -->
			<movable-view class="one" v-for="(item, i) in dataList" :key="i" direction="all" :damping="20" :y="item.y"
				:x="item.x" :disabled="!touchTarg" @change="onChange($event, item)" @touchstart="touchstart(item)"
				@touchend="touchend(item)" :class="{drag: item.moveEnd}" :style="{
					'z-index': item.zIndex, 
					opacity: item.opacity,
					border: fileBorder,
					'border-radius': fileRadius + 'rpx',
					width: 'calc((100% - '+(colCount - 1)*fileMargin+'rpx)/'+colCount+')',
					height: fileHeight + 'rpx'}">
				<template v-if="item.fileType === '.png' || item.fileType === '.jpg' || item.fileType === '.jpeg' || item.fileType === '.webp‌'">
					<image @click.stop="imgC(item)" class="pic" :src="item.url"></image>
				</template>
				<template v-else>
					<image @click.stop="imgC(item)" class="pic" src="../static/images/icon_file.png"></image>
				</template>
				<image @click.stop="dataListDel(i)" class="del" :src="delButtonImage"></image>
			</movable-view>

			<view v-if="dataList.length < count" class="add" @click="uploadImg" :style="{ 
					top: add.y + 'px',
					left: add.x + 'px',
					'border-radius': fileRadius + 'rpx',
					width: 'calc((100% - '+(colCount - 1)*fileMargin+'rpx)/'+colCount+')',
					height: fileHeight + 'rpx' }">
				<image class="icon" :style="{ 
					'border-radius': fileRadius + 'rpx',
				}" :src="addButtonImage"></image>
			</view>
		</movable-area>
	</view>
</template>

<script>
	import index from './index.js'
	export default index
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>