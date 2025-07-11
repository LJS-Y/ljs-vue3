import $ljsPublic from '../uni_modules/ljs-sdk-public/js_sdk/index.js'
import store from '@/store/index';
import APIcommon from '@/request/common/common';
import CONFIG from "@/request/config.js";
import { getMenu } from "@/tools/menu.js"

uni.$on('routerBeforeEach', (to, from, next) => {
	// 取vuex
	let token = store.getters.token;
	if ($ljsPublic.base.fieldCheck(token)) {
		// 取缓存
		token = uni.getStorageSync('ljs_uniapp_token');
		if ($ljsPublic.base.fieldCheck(token)) {
			// token不存在
			if (to.route !== '/pages/login/index') {
				next('/pages/login/index');
			}
		} else {
			store.commit('SET_token', token);
		}
	}
	
	token = store.getters.token;
	const userinfo = store.getters.userinfo;
	
	if (
		!$ljsPublic.base.fieldCheck(token) && $ljsPublic.base.fieldCheck(userinfo)
	) {
		return getUserInfo(next);
	}
	
	next()
	// #ifdef APP-PLUS || H5
	// #endif
	
	// #ifdef MP-WEIXIN
	// #endif
});

// 无用户信息需获取
async function getUserInfo(next) {
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
		return next();
	}
	uni.clearStorageSync();
	store.commit('RESET_STORE');
	$ljsPublic.msg.msg_error('登录失败！');
	setTimeout(() => {
		$ljsPublic.msg.msg('当前用户无权限访问，请联系管理员！');
	}, 2000);
	return next({
		path:'/pages/login/index',
		NAVTYPE:'push'
	});
}