<template>
	<view class="ljs-big-image" @click.stop="close" v-if="value"
		:style="{
			zIndex
		}">
		<view class="ljs-big-image-box"
			:style="{
				width,
				height,
				'border-radius': borderRadius,
			}">
      <view class="ljs-big-image-title" v-if="title !== null">
				{{ title }}
			</view>
      <view
				class="ljs-big-image-imgBox"
				<!-- #ifdef MP-WEIXIN -->
				@touchstart.self="handleTouchStart"
				@touchmove.self="handleTouchMove"
				@touchend.self="handleTouchEnd"
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				@touchstart.stop="handleTouchStart"
				@touchmove.stop="handleTouchMove"
				@touchend.stop="handleTouchEnd"
				<!-- #endif -->
				:style="{
					height: title !== null ? 'calc(100% - 90rpx)' : '100%'
				}">
				<image class="ljs-big-image-img" :src="path"
					:style="{
						transform: 'scale('+scaleNum+', '+scaleNum+')',
					}"></image>
			</view>
		</view>
	</view>
</template>

<script>
import index from './index.js';
export default index;
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
