/**
 * @module storage
 * @description 缓存处理方法
 *  */

import store from '@/store/index';
import LJSbase from './base'

/**
 * 存 - 缓存
 * @param {String} key vuex和本地缓存的基础key值。请保持一致
 * @param {any} value 被存储的数据
 * @returns {String} 返回指定key的参数值，如不存在返回null。
 * @example this.$LJSstorage.setStorageSync('userinfo', data);
 */
export function setStorageSync(key, value) {
	if (LJSbase.fieldCheck(key)) {
		console.warn('参数：key为必填项，请传入')
		return;
	}
	const storeKey = `SET_${key}`;
	store.commit(storeKey, value);
	const storageKey = `ljs_uniapp_${key}`;
	uni.setStorageSync(storageKey, value);
}

/**
 * 取 - 缓存
 * @param {String} key vuex和本地缓存的基础key值。请保持一致
 * @param {boolean} arrayCheck 是否需要进行空数组校验
 * @returns {String} 返回指定key的参数值，如不存在返回null。
 * @example this.$LJSstorage.getStorageSync('userinfo');
 */
export function getStorageSync(key, arrayCheck = false) {
	if (LJSbase.fieldCheck(key)) {
		console.warn('参数：key为必填项，请传入')
		return;
	}
	let value = LJSbase.deepCopy(store.getters[key]);
	if (!LJSbase.fieldCheck(value) && arrayCheck ? value.length > 0 : true) {
		return value;
	}
	
	const storageKey = `ljs_uniapp_${key}`;
	value = uni.getStorageSync(storageKey)
	if (!LJSbase.fieldCheck(value)) {
		return value;
	}
	return null;
}

export default {
  setStorageSync,
  getStorageSync,
}
