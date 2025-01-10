<script>
	export default {
		onLaunch: function() {
			// console.log('初始化完成时触发（全局只触发一次）')
			// #ifdef APP-PLUS
			// 锁定横屏  
			// plus.screen.lockOrientation("landscape-primary");  
			// 锁定竖屏
			plus.screen.lockOrientation("portrait-primary"); 
			// #endif
		},
		onShow: function() {
			// #ifdef MP-WEIXIN
			// 生产可用
			if (this.$base.wxCheckForUpdate()) {
				this.$base.wxUpdate()
			}
			// #endif
			// #ifdef APP-ANDROID
			this.$base.androidCheckApp()
			// #endif
		},
		onHide: function() {
		},
		onUnhandledRejection: function() {
			// console.log('App onError')
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/assets/css/base.scss"; 
	@import "@/assets/fonts/iconfont.css";
</style>
