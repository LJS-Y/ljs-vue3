<template>
	<view class="ljs-dragList">
		<movable-area id="moveBox" class="moveBox"
			:style="'height: '+(Math.ceil((dataList.length + 1)/colCount))*(imgHeight + imgMargin)+'rpx;'">
			<!-- @mousedown="touchstart(item)"
				@mouseup="touchend(item)" -->
			<movable-view class="one" v-for="(item, i) in dataList" :key="i" direction="all" :damping="20" :y="item.y"
				:x="item.x" :disabled="!touchTarg" @change="onChange($event, item)" @touchstart="touchstart(item)"
				@touchend="touchend(item)" :class="{drag: item.moveEnd}" :style="{
					'z-index': item.zIndex, 
					opacity: item.opacity,
					border: imgBorder,
					'border-radius': imgRadius + 'rpx',
					width: 'calc((100% - '+(colCount - 1)*imgMargin+'rpx)/'+colCount+')',
					height: imgHeight + 'rpx'}">
				<image @click.stop="imgC(item)" class="pic" :src="item.url"></image>
				<image @click.stop="dataListDel(i)" class="del" :src="delButtonImage"></image>
			</movable-view>

			<view v-if="dataList.length < count" class="add" @click="uploadImg" :style="{ 
					top: add.y + 'px',
					left: add.x + 'px',
					'border-radius': imgRadius + 'rpx',
					width: 'calc((100% - '+(colCount - 1)*imgMargin+'rpx)/'+colCount+')',
					height: imgHeight + 'rpx' }">
				<image class="icon" :style="{ 
					'border-radius': imgRadius + 'rpx',
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