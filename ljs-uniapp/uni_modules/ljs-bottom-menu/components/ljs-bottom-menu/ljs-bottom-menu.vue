<template>
	<view class="ljs-bottom-menu" v-show="menuList.length > 0"
		:style="{
			'background-color': useOpts.menuBgColor,
			'box-shadow': '0 0 6rpx 6rpx ' + useOpts.menuShadowColor
		}">
		<template v-for="(item, i) in menuList">
			<!-- 放大凸显的菜单 -->
			<view
				:key="i"
				v-if="item.type === 0"
				class="ljs-bottom-menu-one ljs-bottom-menu-specialButton"
				@click="specialButtonF"
				:style="{
					width: `calc(100% / ${menuList.length})`,
				}">
				<view class="ljs-bottom-menu-specialButton-box"
					:style="{
						'background-color': useOpts.fontActiveColor,
					}">
					<image class="ljs-bottom-menu-specialButton-icon" :src="item.icon"></image>
				</view>
			</view>
			<!-- 常规菜单 -->
			<view
				:key="i"
				v-else
				class="ljs-bottom-menu-one"
				@click="goPage(i, item)"
				:style="{
					width: `calc(100% / ${menuList.length})`,
					color: useOpts.fontColor
				}">
				<image class="ljs-bottom-menu-one-icon" :src="butTag === i ? item.iconActive : item.icon"></image>
				<view class="ljs-bottom-menu-one-text"
					:style="{
						fontSize: useOpts.fontSize,
						color: butTag === i ? useOpts.fontActiveColor : useOpts.fontColor,
					}">{{ item.title }}</view>
				<template v-if="!fieldCheck(item.children) && item.children.length > 0 && item.level2Show">
					<view class="ljs-bottom-menu-oneChildren"
					:style="{
						top: '-'+(item.children.length * 60 + 35)+'rpx',
						color: useOpts.fontColor,
						'box-shadow': '0 0 5rpx 3rpx ' + useOpts.menuShadowColor
					}">
						<view class="ljs-bottom-menu-oneChildren-one"
							v-for="(c, j) in item.children" :key="j"
							@click="goPage(i, item, c)"
						>{{c.title}}</view>
					</view>
				</template>
			</view>
		</template>
	</view>
</template>

<script>
	import index from './index.js'
	export default index
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>
