/** 
 * @module request
 * @description 请求封装
 *  */
 
import store from '@/store/index';
import config from '@/request/config.js'
import BASE from '../base.js'
import MSG from '../msg.js'
import RUN from '../run.js'
// import BASE from '../base.js'

let tokenGq = false; // token是否过期
/**
 * 基础请求方法
 * @param {string} url 接口地址
 * @param {Object} params 参数的对象
 * @param {Object} headerParams headerParams
 * @param {string} methodTag 标记，用来区分不同需要的请求处理；LOGIN：登录请求，需要增加header头内容；
 * @param {Boolean} submitDD 防抖动，是否需要开启
 * @param {Number} timeout 超时时间，默认6秒
 * @param {Boolean} isInternalRequest 是否为内部请求，默认为true。外部请求通常为http://****\/接口名称
 * @param {Boolean} responseInterceptor 是否进入公共response拦截器处理数据，默认为true。
 * */
export function ax({url, params = {}, headerParams = {}, methodTag, submitDD = false, timeout = 60000, isInternalRequest = true, responseInterceptor = true}) {
	
	// 防抖动：开启
	if(submitDD){
		const dd = store.getters.submitDDTag;
		// 防抖动判断
		if(dd){
			// 阻止发起重复的请求。
			return new Promise(function(resolve, reject) {
				resolve({
					code: 9001,
					msg: '来自于系统的阻止：您的操作过于频繁，请稍后再试。'
				});
			});
		}
		store.commit('SET_submitDDTag', true);
	}
	
	const token = store.getters.token; // token验证串
	let header = {
		// 'Content-Type': 'application/x-www-form-urlencoded'
		// 'Content-Type': 'multipart/form-data'
		'Content-Type': 'application/json;charset=UTF-8'
	};
	// methodTag:LOGIN
	if(methodTag !== "LOGIN" && !BASE.fieldCheck(token)){
		header["Authorization"] = token;
	}
	
	// headerParams
	const hp = Object.keys(headerParams);
	if (hp.length > 0) {
		hp.forEach((key) => {
			header[key] = headerParams[key];
		})
	}
	
	if (!BASE.fieldCheck(config.timeout)) {
		timeout = config.timeout;
	}
	return new Promise(function(resolve, reject) {
		uni.request({
			url: isInternalRequest ? config.base_url + url : url,
			data: params,
			method: methodTag === 'LOGIN' ? 'POST' : methodTag,
			header: header,
			timeout: timeout,
			success: (response) => {
				if (response.statusCode === 200) {
					// 内部请求,使用内部解析规则
					if (isInternalRequest && responseInterceptor) {
						if (response.data.code === 200) {
							tokenGq = false;
						} else if (response.data.code === 401) {
							if (!tokenGq) {
								MSG.msg("您的访问权限已过期，请重新登录！", 3000);
								tokenGq = true;
							}
							store.commit('RESET_STORE');
							setTimeout(() => {
								RUN.gp_reLaunch('/pages/login/index');
							}, 3000)
							return false; // 流数据
						} else {
							MSG.msg(response.data.msg, 3000);
						}
					}
				} else {
					MSG.msg("系统异常，请稍后重试！", 3000);
				}
				resolve(response.data);
			},
			fail: (error) => {
				MSG.msg(error.errMsg);
				MSG.loading_close();
			},
			complete: ()=> {
				uni.setStorageSync('ljs_sdk_public_DD', false); // 防抖动 - 关
			}
		});
	});
}

/**
 * GET
 * @param {string} url 接口地址
 * @param {string} params 参数的对象
 * @param {string} timeout 超时时间，默认10秒
 * */
export function get(url, params = {}, timeout, isInternalRequest, responseInterceptor, headerParams) {
	return ax({url, params, headerParams, methodTag: "GET", submitDD: false, timeout, isInternalRequest, responseInterceptor});
}
 
/**
 * POST
 * @param {string} url 接口地址
 * @param {string} params 参数的对象
 * @param {string} submitDD 防抖动，是否需要开启
 * @param {string} timeout 超时时间，默认10秒
 * */
export function post(url, params = {}, submitDD, timeout, isInternalRequest, responseInterceptor) {
	return ax({url, params, methodTag: "POST", submitDD, timeout, isInternalRequest, responseInterceptor});
}

/**
 * PUT
 * @param {string} url 接口地址
 * @param {string} params 参数的对象
 * @param {string} submitDD 防抖动，是否需要开启
 * @param {string} timeout 超时时间，默认10秒
 * */
export function put(url, params = {}, submitDD, timeout, isInternalRequest, responseInterceptor) {
	return ax({url, params, methodTag: "PUT", submitDD, timeout, isInternalRequest, responseInterceptor});
}

/**
 * DEL
 * @param {string} url 接口地址
 * @param {string} params 参数的对象
 * @param {string} submitDD 防抖动，是否需要开启
 * */
export function del(url, params = {}, submitDD, isInternalRequest, responseInterceptor) {
	return ax({url, params, methodTag: "DELETE", submitDD, isInternalRequest, responseInterceptor});
}

/**
 * 单文件上传
 * @param {string} url 接口地址
 * @param {string} name 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
 * @param {string} filePath 要上传文件资源的路径。
 * @param {Number} timeout 超时时间。
 * */
export function uploadFile(url, name, filePath, timeout = 6000) {
	let header = {};
	// methodTag:LOGIN
	const token = store.getters.token; // token验证串
	if (true) {
		header["Authorization"] = token;
	}
	return new Promise(function(resolve, reject) {
		uni.uploadFile({
			url: config.base_url + url,
			filePath: filePath,
			name,
			header: header,
			timeout: timeout,
			success: (response) => {
				resolve(JSON.parse(response.data));
			},
			fail: (error) => {
				MSG.msg(error.errMsg);
				MSG.loading_close();
			},
			complete: ()=> {
				uni.setStorageSync('ljs_sdk_public_DD', false); // 防抖动 - 关
			}
		});
	});
}

/**
 * 多文件+表单内容上传
 * @param {string} url 接口地址
 * @param {string} name 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容，如：file。
 * @param {string} files 要上传文件资源的路径。
 * @param {string} params 其他参数。
 * @param {Number} timeout 超时时间。
 * */
export function uploadFiles(url, name, files, params = {}, timeout = 6000) {
	let formData = new FormData();
	for (const key in params) {
		formData.append(key, params[key]);
	}
		
	let header = {
		// 'Content-Type': 'application/x-www-form-urlencoded'
		// 'Content-Type': 'multipart/form-data'
		// 'Content-Type': 'application/json;charset=UTF-8'
	};
	// methodTag:LOGIN
	const token = store.getters.token; // token验证串
	if (true) {
		header["Authorization"] = token;
	}
	return new Promise(function(resolve, reject) {
		uni.uploadFile({
			url: config.base_url + url,
			files: files,
			name,
			header: header,
			formData: formData, // HTTP 请求中其他额外的 form data
			timeout: timeout,
			success: (response) => {
				resolve(JSON.parse(response.data));
			},
			fail: (error) => {
				MSG.msg(error.errMsg);
				MSG.loading_close();
			},
			complete: ()=> {
				uni.setStorageSync('ljs_sdk_public_DD', false); // 防抖动 - 关
			}
		});
	});
}

/**
 * 独立，只在登录使用，绕过header["Authorization"]
 * @param {string} url 接口地址
 * @param {string} params 参数的对象
 * */
export function login(url, params = {}) {
	return ax({url, params, methodTag: "LOGIN", submitDD: true});
}

export default {
	get,
	post,
	put,
	del,
	uploadFile,
	uploadFiles,
	login,
}