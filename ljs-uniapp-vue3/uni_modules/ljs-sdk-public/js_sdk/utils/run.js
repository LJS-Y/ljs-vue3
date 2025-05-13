/** 
 * @module run
 * @description 封装所有页面跳转的方法
 *  */
import BASE from './base.js'

/**
 * 保留当前页面，跳转到应用内的某个页面
 * @param {String} url 地址
 * @param {Object} parms 参数
 * @example 
this.$ljsPublic.run.gp_navigateTo('/pages/ljs-sdk-public/test');
回调:
this.$ljsPublic.run.gp_navigateTo('/pages/ckls/index', {},{
	code: 200,
	msg: '预约成功'
});
// 执行页面的回传数据
ljs_gp_navigateTo_backF(res) {
	console.log(res);
	if (!this.$ljsPublic.base.fieldCheck(res) && res.code === 200) {
		setTimeout(() => {
			this.$ljsPublic.msg.msg_success(res.msg);
		}, 100)
	}
},
 */
export function gp_navigateTo(url, parms, res) {
	// 前置路由守卫 - 开始
	const _pages = getCurrentPages();
	if (_pages.length > 0) {
		const _page = _pages[_pages.length - 1];
		const to = {
			route: _page.route,
			options: _page.options,
		};
		const from = {
			route: url,
			options: parms,
		};
		let beforeEachTag = false;
		uni.$emit('beforeEach', to, from, (nextUrl, nextParameter) => {
			let next_url = null;
			if (nextUrl !== undefined) {
				next_url = getUrl(nextUrl, nextParameter);
			} else {
				next_url = getUrl(url, parms);
			}
			uni.navigateTo({
				url: next_url,
				success:() => {
					if (!BASE.fieldCheck(res)) {
						const pages = getCurrentPages();
						pages[pages.length - 1].$vm.ljs_gp_navigateTo_backF(res) // 给上一页绑定方法gp_navigateBackF,传参数
					}
				}
			});
			beforeEachTag = true;
		})
		if (beforeEachTag) return;
	}
	// 前置路由守卫 - 结束
	uni.navigateTo({
		url: getUrl(url, parms),
		success:() => {
			if (!BASE.fieldCheck(res)) {
				const pages = getCurrentPages();
				pages[pages.length - 1].$vm.ljs_gp_navigateTo_backF(res) // 给上一页绑定方法gp_navigateBackF,传参数
			}
		}
	});
}

/**
 * 关闭当前页面，跳转到应用内的某个页面
 * @param {String} url 地址
 * @param {Object} parms 参数
 * @example 
this.$ljsPublic.run.gp_redirectTo('/pages/ljs-sdk-public/test');
回调:
this.$ljsPublic.run.gp_redirectTo('/pages/ckls/index', {},{
	code: 200,
	msg: '预约成功'
});
// 执行页面的回传数据
ljs_gp_redirectTo_backF(res) {
	console.log(res);
	if (!this.$ljsPublic.base.fieldCheck(res) && res.code === 200) {
		setTimeout(() => {
			this.$ljsPublic.msg.msg_success(res.msg);
		}, 100)
	}
},
 */
export function gp_redirectTo(url, parms, res) {
	// 前置路由守卫 - 开始
	const _pages = getCurrentPages();
	if (_pages.length > 0) {
		const _page = _pages[_pages.length - 1];
		const to = {
			route: _page.route,
			options: _page.options,
		};
		const from = {
			route: url,
			options: parms,
		};
		let beforeEachTag = false;
		uni.$emit('beforeEach', to, from, (nextUrl, nextParameter) => {
			let next_url = null;
			if (nextUrl !== undefined) {
				next_url = getUrl(nextUrl, nextParameter);
			} else {
				next_url = getUrl(url, parms);
			}
			uni.redirectTo({
				url: next_url,
				success:() => {
					if (!BASE.fieldCheck(res)) {
						const pages = getCurrentPages();
						pages[pages.length - 1].$vm.ljs_gp_redirectTo_backF(res) // 给上一页绑定方法gp_navigateBackF,传参数
					}
				}
			});
			beforeEachTag = true;
		})
		if (beforeEachTag) return;
	}
	// 前置路由守卫 - 结束
	uni.redirectTo({
		url: getUrl(url, parms),
		success:() => {
			if (!BASE.fieldCheck(res)) {
				const pages = getCurrentPages();
				pages[pages.length - 1].$vm.ljs_gp_redirectTo_backF(res) // 给上一页绑定方法gp_navigateBackF,传参数
			}
		}
	});
}

/**
 * 关闭所有页面，打开到应用内的某个页面
 * @param {String} url 地址
 * @param {Object} parms 参数
 * @example 
this.$ljsPublic.run.gp_reLaunch('/pages/ljs-sdk-public/test');
回调:
this.$ljsPublic.run.gp_reLaunch('/pages/ckls/index', {},{
	code: 200,
	msg: '预约成功'
});
// 执行页面的回传数据
ljs_gp_reLaunch_backF(res) {
	console.log(res);
	if (!this.$ljsPublic.base.fieldCheck(res) && res.code === 200) {
		setTimeout(() => {
			this.$ljsPublic.msg.msg_success(res.msg);
		}, 100)
	}
},
 */
export function gp_reLaunch(url, parms, res) {
	// 前置路由守卫 - 开始
	const _pages = getCurrentPages();
	if (_pages.length > 0) {
		const _page = _pages[_pages.length - 1];
		const to = {
			route: _page.route,
			options: _page.options,
		};
		const from = {
			route: url,
			options: parms,
		};
		let beforeEachTag = false;
		uni.$emit('beforeEach', to, from, (nextUrl, nextParameter) => {
			let next_url = null;
			if (nextUrl !== undefined) {
				next_url = getUrl(nextUrl, nextParameter);
			} else {
				next_url = getUrl(url, parms);
			}
			uni.reLaunch({
				url: next_url,
				success:() => {
					if (!BASE.fieldCheck(res)) {
						const pages = getCurrentPages();
						pages[0].$vm.ljs_gp_reLaunch_backF(res) // 给上一页绑定方法gp_navigateBackF,传参数
					}
				}
			});
			beforeEachTag = true;
		})
		if (beforeEachTag) return;
	}
	// 前置路由守卫 - 结束
	
	uni.reLaunch({
		url: getUrl(url, parms),
		success:() => {
			if (!BASE.fieldCheck(res)) {
				const pages = getCurrentPages();
				pages[0].$vm.ljs_gp_reLaunch_backF(res) // 给上一页绑定方法gp_navigateBackF,传参数
			}
		}
	});
}

/**
 * 关闭当前页面，返回上一页面或多级页面
 * @param {String} url 地址
 * @param {Object} parms 参数
 * @example 
this.$ljsPublic.run.gp_navigateBack();
回调:
this.$ljsPublic.run.gp_navigateBack(1, {
	code: 200,
	msg: '保存成功'
});
// 执行页面的回传数据
ljs_top_backF(res) {
	if (!this.$ljsPublic.base.fieldCheck(res) && res.code === 200) {
		setTimeout(() => {
			this.$ljsPublic.msg.msg_success(res.msg);
		}, 100)
	}
},
 */
export function gp_navigateBack(num = 1, parms) {
	let pages = null; // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
	let prevPage = null; //上一页页面实例
	if (!BASE.fieldCheck(parms)) {
		pages = getCurrentPages();
		prevPage = pages[pages.length - (num + 1)];
	}
	uni.navigateBack({
		delta: num,
		success:() => {
			if (!BASE.fieldCheck(parms)) {
				prevPage.$vm.ljs_top_backF(parms) // 给上一页绑定方法gp_navigateBackF,传参数
			}
		}
	});
}

/**
 * 解析url参数，加入传入参数
 * @param {String} url 地址
 * @example analysisUrl(url)
 */
export function analysisUrl(url) {
	if(url.indexOf("?") > -1){
		let urls = url.split("?");
		let parms = urls[1].split("&");
		let obj = {};
		parms.forEach((item)=>{
			let p = item.split("=");
			obj[p[0]] = p[1];
		});
		return [urls[0], obj];
	}
	return [url, {}];
}

/**
 * 参数处理 - 解决场景$TOOLS.run.gp_navigateTo('/pages/mine/my-addres-edit?type=edit',item)
 * @param {String} url /pages/mine/my-addres-edit?type=edit
 * @param {Object} parms 一个对象
 * @returns {String} 返回一个真实的地址
 * @example getUrl(url, parms)
 */
export function getUrl(url, parms) {
	// 合并链接的参数到参数体里
	let list = analysisUrl(url);
	
	if(parms === undefined){
		parms = {}
	}
	for(let key in list[1]){
		parms[key] = list[1][key];
	}
	
	let parmsStr = "";
	parmsStr += "?"
	for(let key in parms){
		parmsStr += key + "=" + parms[key] + "&"
	}
	parmsStr = parmsStr.substring(0, parmsStr.length - 1);
	return list[0] + parmsStr;
}

export default {
	gp_navigateTo,
	gp_redirectTo,
	gp_reLaunch,
	gp_navigateBack,
};
