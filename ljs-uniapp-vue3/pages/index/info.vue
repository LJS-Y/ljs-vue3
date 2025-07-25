<template>
	<view class="comFrame">
		<ljs-top-vue3
			title="首页"
			backgroundColor="linear-gradient(to right, #0968e3, #084AA1)"
			titleColor="#FFF"
			:back="{ show: true }">
		</ljs-top-vue3>
		
		<view @click="$LJSrun.gp_navigateTo('/pages/mine/index')">测试内容页</view>
	</view>
</template>

<script>
	import info from './info.js'
	export default info
</script>

<style lang="scss" scoped>
	@import "./info.scss"; 
</style>
