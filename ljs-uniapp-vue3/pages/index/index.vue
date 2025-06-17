<template>
	<view class="comFrame">
		<ljs-top-vue3 title="首页" backgroundColor="linear-gradient(to right, #0968e3, #084AA1)" titleColor="#FFF"
			:back="{ show: false }">
			<!-- #ifndef MP-WEIXIN -->
			<view @click="$com.logout()" class="logout">
				<text class="iconfont icon-farenzhuxiao"></text>
			</view>
			<!-- #endif -->
		</ljs-top-vue3>

		<!-- 为兼容小程序, 减去top, 减去状态栏 -->
		<view class="comMain" :style="{
			height: 'calc(100% - 80rpx - '+ $ljsPublic.base.getTopStateHeight() +'px)',
		}">
			<view class="comPage">
				<view class="comSearch">
					<view class="inputSearch">
						<view class="inputBox">
							<input class="input" v-model="tableSearch.query.powerhouseName" type="text"
								placeholder="请输入电站名称">
							<view v-if="!$ljsPublic.base.fieldCheck(tableSearch.query.powerhouseName)"
								@click="!$ljsPublic.base.fieldClean(tableSearch.query, 'powerhouseName')"
								class="close iconfont icon-guanbi1"></view>
						</view>
						<view class="submitBut" @click="handleQuery">搜索</view>
					</view>
				</view>

				<view class="list">
					<view class="listBox">
						<view class="item" v-for="(item, i) in 10" :key="i">
							<image class="pic" src="../../static/images/logo.png"></image>
							<view class="info">
								<view class="name">
									<view class="text">测试数据测试数据{{i + 1}}</view>
								</view>
								<view class="dis">
									<view class="one">
										<text>装机容量：</text>
										<text>30 MWp</text>
									</view>
									<view class="one">
										<text>并网电压：</text>
										<text>1000 kV</text>
									</view>
								</view>
							</view>
						</view>

						<view class="operate">
							<view v-if="tableSearch.queryReal.pageNum * tableSearch.queryReal.pageSize < table.total"
								class="but red" @click="getListMore">加载更多....</view>
							<view v-else class="but grey">没有更多数据啦~~</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<ljs-bottom-menu-vue3 :data="menuList">
		</ljs-bottom-menu-vue3>
	</view>
</template>

<script>
	import index from './index.js'
	export default index
</script>

<style lang="scss" scoped>
	@import "./index.scss";
</style>