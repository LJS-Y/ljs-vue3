<template>
	<view class="ljs-dialog-vue3" v-if="modelValue" :style="{
			'background-color': shadeBackground,
			'z-index': zIndex,
		}"
		@click.stop="shadeClose ? close() : () => {}">
		<view @click.stop class="ljs-dialog-vue3-box" :style="{
				width,
				height: tcMaxHeightTag ? box_h : 'auto',
				position: tcMaxHeightTag ? 'absolute' : 'relative',
				top: tcMaxHeightTag ? '50%' : '0',
				transform: tcMaxHeightTag ? 'translate(-50%, -50%)' : 'translate(-50%, 0%)',
				'background': background,
				'border-radius': borderRadius + 'rpx',
			}">
			<view class="ljs-dialog-vue3-title" v-if="headerShow" :style="{
				height: titleHeight + 'rpx',
				'line-height': titleHeight + 'rpx',
				fontSize: titleFontSize + 'rpx'
			}">
				{{ title }}
				<image @click.stop="close" class="ljs-dialog-vue3-close" :src="closeImg" v-if="closeButShow" :style="{
					top: ((titleHeight - 90) / 2) + 'rpx',
				}"></image>
			</view>
			<view class="ljs-dialog-vue3-content" ref="content" :style="{
					height: headerShow ? 'calc(100% - '+titleHeight+'rpx)' : '100%',
				}">
				<slot></slot>
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