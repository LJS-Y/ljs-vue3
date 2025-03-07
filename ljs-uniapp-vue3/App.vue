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
			this.$base.listenRefresh(this);
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
		}
	}
</script>

<style>
</style>
