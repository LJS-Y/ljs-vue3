<template>
	<view class="ljs-top-vue3" :style="'height: calc('+statusBarHeight+'px + '+topHeight+'rpx)'">
		<view class="topZw">
			<view class="comStatus" :style="'height: '+statusBarHeight+'px'"></view>
			<view class="topMain" :style="'height: '+topHeight+'rpx'"></view>
		</view>
		
		<view class="top">
			<view class="topBgColor" :style="{
				height: 'calc('+statusBarHeight+'px + '+bgColorOrImage.height+'rpx)',
				'background': backgroundColor,
				opacity: backgroundImageShow ? 1 - backgroundImageOpacity : 1
			}">
				<view class="comStatus" :style="'height: '+statusBarHeight+'px'"></view>
				<view class="topMain" :style="'height: '+topHeight+'rpx'"></view>
			</view>

			<!-- #ifdef MP -->
			<view class="topBgImage" v-if="backgroundImageShow" :style="{
				width: bgColorOrImage.width,
				height: 'calc('+statusBarHeight+'px + '+bgColorOrImage.height+'rpx)',
				'background': !backgroundImageShow ? backgroundColor : ('url('+backgroundImage+') no-repeat;'),
				backgroundSize: '100% 100%',
				opacity: backgroundImageOpacity
			}">
			<!-- #endif -->
			<!-- #ifndef MP -->
			<view class="topBgImage" v-if="backgroundImageShow" :style="{
				width: bgColorOrImage.width,
				height: 'calc('+statusBarHeight+'px + '+bgColorOrImage.height+'rpx)',
				...topStyle
			}">
			<!-- #endif -->
				<view class="comStatus" :style="'height: '+statusBarHeight+'px'"></view>
				<view class="topMain" :style="'height: '+topHeight+'rpx'"></view>
			</view>
			
			<!-- 这里是状态栏 占据高度 -->
			<view class="comStatus" :style="'height: '+statusBarHeight+'px'"></view>
			<view class="topMain" :style="'height: '+topHeight+'rpx'">
				<!-- 返回 -->
				<view @click="backF" class="back" v-if="myback.show" :style="{
					top: (titleHeight - 60) / 2 + 'rpx'
				}">
					<image class="img" :src="myback.imgUrl"></image>
				</view>
				<slot></slot>
				<!-- 标题文字 -->
				<text class="title" :style="{
					'color': titleColor,
					height: titleHeight + 'rpx',
					'line-height': titleHeight + 'rpx',
					'font-weight': titleWeight,
					opacity: titleOpacity,
					'text-align': titleAlign,
					padding: titleAlign === 'left' ? `0 ${jnButtonWidth}px 0 ${myback.show ? 100 : 20}rpx` : `0 ${jnButtonWidth}px`,
				}">{{title}}</text>
			</view>
		</view>
		<!-- <view class="yuanhu"></view> -->
	</view>
</template>

<script>
	import index from './index.js'
	export default index
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>
