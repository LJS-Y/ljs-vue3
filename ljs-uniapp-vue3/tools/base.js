import LJS from '../uni_modules/ljs-sdk/js_sdk/index.js'
import APIcommon from '@/request/common/common';
import CONFIG from "@/request/config.js";
import store from '@/store/index';
import { getMenu } from "@/tools/menu.js"

/**
 *  检查版本 - 小程序可用
 *  @return {Boolean} 是否有新版本更新
 *  @example this.$base.wxCheckForUpdate()
 * */
export function wxCheckForUpdate() {
	return new Promise((resolve, reject) => {
		const updateManager = uni.getUpdateManager();

		updateManager.onCheckForUpdate(function(res) {
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

	updateManager.onUpdateReady(function(res) {
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
	// this.LJS.LJSbase.getAppBaseInfo().appVersion
	const edition = uni.getStorageSync('ljs-app-edition');
	if (LJS.LJSbase.fieldCheck(edition)) {
		uni.setStorageSync('ljs-app-edition', LJS.LJSbase.getAppBaseInfo().appVersion);
	} else {
		// 检查是否需要重启应用的条件
		if (edition !== LJS.LJSbase.getAppBaseInfo().appVersion) {
			// 通过plus对象重启应用
			if (uni.getSystemInfoSync().platform === 'android') {
				uni.removeStorageSync('ljs-app-edition');
				plus.runtime.restart();
			}
		}
	}
}

/**
 *  刷新监听
 *  @example this.$base.listenRefresh()
 * */
export function listenRefresh(_this) {
	// 取vuex
	let token = store.getters.token;
	if (LJS.LJSbase.fieldCheck(token)) {
		// 取缓存
		token = uni.getStorageSync('ljs_uniapp_token');
		if (LJS.LJSbase.fieldCheck(token)) {
			LJS.LJSrun.gp_reLaunch('/pages/login/index');
			return;
		} else {
			store.commit('SET_token', token);
		}
	}

	token = store.getters.token;
	const userinfo = store.getters.userinfo;

	if (
		!LJS.LJSbase.fieldCheck(token) && LJS.LJSbase.fieldCheck(userinfo)
	) {
		getUserInfo();
	}
}

async function getUserInfo() {
	// 获取用户信息
	const res2 = await APIcommon.getInfo();
	if (res2.code === 200) {
		// 处理用户头像
		let avatar = res2.user.avatar;
		const defaultSrc = '/static/images/common/head.png';
		avatar = (avatar == "" || avatar == null) ? defaultSrc : CONFIG.base_url + avatar;
		res2.user.avatar = avatar;
		// 存储用户、模块
		store.commit('SET_userinfo', res2.user);


		const menus = getMenu();
		store.commit('SET_menuList', menus);
		return;
	}
	uni.clearStorageSync();
	store.commit('RESET_STORE');
	$LJSmsg.msg_error('登录失败！');
	setTimeout(() => {
		$LJSmsg.msg('当前用户无权限访问，请联系管理员！');
	}, 2000);
	LJS.LJSrun.gp_reLaunch('/pages/login/index');
	return;
}

export default {
	wxCheckForUpdate,
	wxUpdate,
	androidCheckApp,
	listenRefresh,
};