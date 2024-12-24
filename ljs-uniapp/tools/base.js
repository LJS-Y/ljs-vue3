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

export default {
  logout,
	initShare,
};
