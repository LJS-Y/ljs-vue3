import $ljsPublic from '../uni_modules/ljs-sdk-public/js_sdk/index.js'
import CONFIG from "@/request/config.js";
import store from '@/store/index';
export function logout(obj) {
	uni.showModal({
		title: '系统提示',
		content: '您确定要退出当前账号吗？',
		success: function (res) {
			if (res.confirm) {
				store.commit('RESET_STORE');
				$ljsPublic.run.gp_reLaunch('/pages/login/index');
			}
		}
	});
}

export function initShare(path = '/pages/login/index') {
	uni.showShareMenu({
		title: CONFIG.projectName,
		content: '超赞的小程序，我们LJS社区人都喜欢的小程序。',
		path
	})
}

/**
  *  检查版本 - 小程序可用
	*  @return {Boolean} 是否有新版本更新
  *  @example this.$base.wxCheckForUpdate()
  * */
export function wxCheckForUpdate() {
	return new Promise((resolve, reject) => {
		const updateManager = uni.getUpdateManager();
		
		updateManager.onCheckForUpdate(function (res) {
			// 请求完新版本信息的回调
			resolve(res.hasUpdate);
		});
	});
}

/**
  *  发起版本更新 - 小程序可用
  *  @example this.$base.wxUpdate()
  * */
export function wxUpdate() {
	const updateManager = uni.getUpdateManager();
	
	updateManager.onUpdateReady(function (res) {
		uni.showModal({
			title: '更新提示',
			content: '新版本已经准备好，是否重启应用？',
			success(res) {
				if (res.confirm) {
					// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
					updateManager.applyUpdate();
				}
			}
		});
	});
}

/**
  *  检查app版本 - 安卓
  *  @example this.$base.androidCheckApp()
  * */
export function androidCheckApp() {
	// this.$ljsPublic.base.getAppBaseInfo().appVersion
	const edition = uni.getStorageSync('ljs-app-edition');
	if ($ljsPublic.base.fieldCheck(edition)) {
		uni.setStorageSync('ljs-app-edition', $ljsPublic.base.getAppBaseInfo().appVersion);
	} else {
		// 检查是否需要重启应用的条件
		if (edition !== $ljsPublic.base.getAppBaseInfo().appVersion) {
			// 通过plus对象重启应用
			if (uni.getSystemInfoSync().platform === 'android') {
				uni.removeStorageSync('ljs-app-edition');
				plus.runtime.restart();
			}
		}
	}
}

export default {
  logout,
	initShare,
	wxCheckForUpdate,
	wxUpdate,
	androidCheckApp,
};
