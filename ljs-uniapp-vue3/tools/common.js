import LJS from '@/uni_modules/ljs-sdk/js_sdk/index.js'
import APIcommon from '@/request/common/common';
import CONFIG from "@/request/config.js";
import store from '@/store/index';
import {
	getMenu
} from "@/tools/menu.js"

/**
 *  退出登录方法
 *  @example this.$com.logout()
 * */
export function logout() {
	uni.showModal({
		title: '系统提示',
		content: '您确定要退出当前账号吗？',
		success: function(res) {
			if (res.confirm) {
				store.commit('RESET_STORE');
				LJS.LJSrun.gp_reLaunch('/pages/login/index');
			}
		}
	});
}

/**
 * 分享相关业务 
 *  @example this.$com.initShare() 
// 用户点击右上角分享
onShareAppMessage((res) => {
	const path = `/pages/index/index?id=11`
	const shareObj = {
		// 分享标题(长度30)
		title: '好东西分享给您~',
		path,
		// 支持PNG及JPG。转发好友显示图片长宽比是 5:4（500*400像素）;转发朋友圈/收藏显示图片长宽比是 1:1（200*200像素）.
		// imageUrl: '',
		// 支付宝：吱口令文案
		// content: '吱口令文案',
		// 支付宝：自定义分享描述(长度不限，建议16个字内)
		// desc: '自定义分享描述',
	}
	return shareObj
})
// 监听用户点击右上角转发到朋友圈
onShareTimeline(() => {
	// 内容如上
})
// 监听用户点击右上角收藏
onAddToFavorites(() => {
	// 内容如上
})
 */
export function initShare() {
	uni.showShareMenu({
		withShareTicket: true,
		menus: ['shareAppMessage', 'shareTimeline'], // 开启转发好友和转发朋友圈按钮
	})
}

/**
 * 获取文件 - 通过ID获取完成的请求地址
 * @param id 文件ID
 * @returns 返回可获取的文件地址
 * @example this.$com.getFileForId() 
 */
export function getFileForId(id) {
	if (!LJS.LJSbase.fieldCheck(id)) {
		return `${CONFIG.base_url}/file/download/${id}?Authorization=${store.getters.token}`
	}
	return null
}

/**
 * web-view组件地址处理
 * @param options web-view组件onLoad接收的参数
 * @param options.share 是否为可转发、分享的页面，1可转发，0不可转发
 * @param options.url web-view url属性值
 * @param options.queryStr web-view url属性值对应的参数
 * @returns 返回一个url地址
 * @example this.$com.webView(options) 
 */
export function webView(options) {
	let url = null
	if (!LJS.LJSbase.fieldCheck(options.url)) {
		const newUrl = decodeURIComponent(options.url)
		const queryStr = JSON.parse(decodeURIComponent(!LJS.LJSbase.fieldCheck(options.queryStr) ? options.queryStr : JSON.stringify({})))
		queryStr.token = store.getters.token
		const result = LJS.LJSrun.getUrl(newUrl, queryStr)
		url = result
		if (!LJS.LJSbase.fieldCheck(options.share) && options.share === '1') {
			this.initShare('/pages-other/WebView/WebView?url=' + url)
		}
		return url
	} else {
		LJS.LJSrun.gp_navigateBack()
	}
	return null
}

/**
 * 跳转京东小程序
 * @param id source为1，代表sku；source为2，代表shopId；
 * @param source 1 商品； 2 店铺
 * @example this.$com.goJdApp()
/pages/shop/home?shopId=XXXXXX
/pages/item/detail/detail?sku=
 */
export function goJdApp(id, source = 1) {
	let path = ''
	if (source === 1) {
		path = '/pages/item/detail/detail?sku='
	} else if (source === 2) {
		path = '/pages/shop/index/index?shopId='
	}
	uni.navigateToMiniProgram({
		appId: 'wx91d27dbf599dff74',
		path: path + id,
		success(res) {
			// 打开成功
		},
	})
}

/**
 * banner类跳转通用处理
 * @param jumpType 类型:inner:内部跳转,outer:外部跳转
 * @param jumpUrl 地址
 * @returns 返回可获取的文件地址
 * @example this.$com.comBannerClick()
 */
export function comBannerClick({
	jumpType,
	jumpUrl
}) {
	if (LJS.LJSbase.fieldCheck(jumpType) || LJS.LJSbase.fieldCheck(jumpUrl)) {
		return
	}
	// 类型:inner:内部跳转,outer:外部跳转
	if (jumpType === 'inner') {
		LJS.LJSrun.gp_navigateTo(jumpUrl)
	} else if (jumpType === 'outer') {
		const obj = {
			page: '/pages-other/WebView/WebView',
			query: {
				share: '1',
				url: jumpUrl,
				// 暂无参数
				// queryStr: JSON.stringify({
				//   id: 1,
				// }),
			},
		}
		LJS.LJSrun.gp_navigateTo(obj.page, !LJS.LJSbase.fieldCheck(obj.query) ? obj.query : {})
	}
}

/**
 * 时间控制器
 * @param time 需要控制的时间长度，毫秒。
 * @example this.$com.timeControl()
 */
export function timeControl(time = 200) {
	return new Promise(function(resolve, reject) {
		setTimeout(() => {
			resolve(true)
		}, time)
	})
}

export default {
	logout,
	initShare,
	getFileForId,
	webView,
	goJdApp,
	comBannerClick,
	timeControl,
};