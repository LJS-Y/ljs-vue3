/** 
 * @module msg
 * @description 消息提示
 *  */

import { showToast, showSuccessToast, showFailToast, showLoadingToast, closeToast } from 'vant';
/**
 * router.push
 * @param {string} parms 参数
 * @example this.$msg.info()
 *  */
export function info(val = '系统异常，稍后重试！', duration = 2000) {
  showToast({
    message: val,
    duration
  });
}

/**
 * 成功msg
 * @param {String} val 消息内容
 * @param {Number} time 显示时长，默认2000ms
 * @example 
this.$msg.success();
 */
export function success(val = '请求成功！', duration = 2000) {
	showSuccessToast({
		message: val,
		duration,
	});
}

/**
 * 失败msg
 * @param {String} val 消息内容
 * @param {Number} time 显示时长，默认2000ms
 * @example 
this.$msg.error();
 */
export function error(val = '失败！', duration = 2000) {
	showFailToast({
		message: val,
		duration,
	});
}


/**
 * 加载中msg
 * @param {String} val 消息内容
 * @example 
this.$msg.loading();
 */
export function loading(val = '加载中....', duration = 0) {
	showLoadingToast({
    message: val,
    forbidClick: true,
		duration,
  }); 
}

/**
 * 关闭当前展示的提示
 * @param {String} val 消息内容
 * @example 
this.$msg.close();
 */
export function close() {
	closeToast()
}

export default {
  info,
  success,
  error,
  loading,
  close,
};
