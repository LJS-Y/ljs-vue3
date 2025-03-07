<template>
	<view class="ljs-big-image-vue3" @click.stop="close" v-if="modelValue" :style="{
			zIndex
		}">
		<view class="ljs-big-image-vue3-box" :style="{
				width,
				height,
				'border-radius': borderRadius,
			}">
			<view class="ljs-big-image-vue3-title" v-if="title !== null">
				{{ title }}
			</view>
			<view class="ljs-big-image-vue3-imgBox" <!-- #ifdef MP-WEIXIN -->
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
				<image class="ljs-big-image-vue3-img" :src="path" :style="{
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