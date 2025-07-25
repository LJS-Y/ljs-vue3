/**
 * @module msg
 * @description 消息提示封装
 *  */
import BASE from './base'

/**
 * msg
 * @param {String} val 消息内容
 * @param {Number} time 显示时长，默认2000ms
 * @example 
this.$LJSmsg.msg('默认消息');
 */
export function msg(val = '系统异常，请关闭，稍后重试！', time = 2000) {
  if (BASE.fieldCheck(val)) {
    val = '系统异常'
  }
  val = val.toString()
  uni.showToast({
    title: val,
    duration: time,
    icon: 'none',
  })
}

/**
 * 成功msg
 * @param {String} val 消息内容
 * @param {Number} time 显示时长，默认2000ms
 * @example 
this.$LJSmsg.msg_success('默认消息');
 */
export function msg_success(val = '请求成功！', time = 2000) {
  if (BASE.fieldCheck(val)) {
    val = '系统异常'
  }
  val = val.toString()
  uni.showToast({
    title: val,
    duration: time,
    icon: 'success',
  })
}

/**
 * 失败msg
 * @param {String} val 消息内容
 * @param {Number} time 显示时长，默认2000ms
 * @example 
this.$LJSmsg.msg_error('默认消息');
 */
export function msg_error(val = '加载失败！', time = 2000) {
  if (BASE.fieldCheck(val)) {
    val = '系统异常'
  }
  val = val.toString()
  uni.showToast({
    title: val,
    duration: time,
    icon: 'error',
  })
}

/**
 * 加载中msg
 * @param {String} val 消息内容
 * @example 
this.$LJSmsg.loading();
 */
export function loading(val = '加载中....') {
  if (BASE.fieldCheck(val)) {
    val = '系统异常'
  }
  val = val.toString()
  uni.showLoading({
    title: val,
  })
}

/**
 * 关闭加载中msg
 * @param {String} val 消息内容
 * @example 
this.$LJSmsg.loading_close();
 */
export function loading_close() {
  uni.hideLoading()
}

export default {
  msg,
  msg_success,
  msg_error,
  loading,
  loading_close,
}
